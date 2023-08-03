import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/userModel";
import bcrypt from "bcrypt";

interface SignUpBody {
    username?: string;
    email?: string;
    password?: string;
}

export const signUp: RequestHandler<
    unknown,
    unknown,
    SignUpBody,
    unknown
> = async (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const passwordRaw = req.body.password;

    try {
        // Check is there is any missing field
        if (!username || !email || !passwordRaw) {
            throw createHttpError(400, "Parameter(s) missing");
        }

        // Check if username already used
        const existingUsername = await UserModel.findOne({
            username: username,
        }).exec();
        if (existingUsername) {
            throw createHttpError(
                409,
                "This username has been used, please try another one or login"
            );
        }

        // Check if email already used
        const existingEmail = await UserModel.findOne({ email: email }).exec();
        if (existingEmail) {
            throw createHttpError(
                409,
                "This email has been in database, please try login or use another email"
            );
        }

        // Hashing password
        const passwordHased = await bcrypt.hash(passwordRaw, 10);

        // assign values
        const newUser = await UserModel.create({
            username: username,
            email: email,
            password: passwordHased,
        });

        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
};
