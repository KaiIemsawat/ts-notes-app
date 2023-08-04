import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/userModel";
import bcrypt from "bcrypt";

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;

    try {
        if (!authenticatedUserId) {
            throw createHttpError(401, "User ont authenticated");
        }
        const user = await UserModel.findById(authenticatedUserId)
            .select("+email")
            .exec();
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

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

        // log user in once thy register
        // need  npm i express-session, npm i -D @types/express-session, npm i connect-mongo
        // need @types directory along with session.d.ts
        // need config in tsconfig.json ---> typeRoots, ts-node
        req.session.userId = newUser._id;

        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
};

interface LoginBody {
    username?: string;
    password?: string;
}

export const login: RequestHandler<
    unknown,
    unknown,
    LoginBody,
    unknown
> = async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        if (!username || !password) {
            throw createHttpError(400, "Missing parameter(s)");
        }
        const user = await UserModel.findOne({ username: username })
            .select("+password +email")
            .exec();

        if (!user) {
            throw createHttpError(401, "Invalid credentials");
        }

        // compare input password and password in database
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            throw createHttpError(401, "Invalid credentials");
        }

        req.session.userId = user._id;
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
};

export const logout: RequestHandler = (req, res, next) => {
    req.session.destroy((error) => {
        // .destroy() < -- to detroy the session
        if (error) {
            next(error);
        } else {
            res.sendStatus(200); // <-- use sendStatus instead of .json() since we don't have json body
        }
    });
};
