import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import noteRoutes from "./routes/noteRoutes";
import userRoutes from "./routes/userRoutes";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors"; // For handling types of error
import session from "express-session";
// import env from "./utils/validateEnv";
import MongoStore from "connect-mongo";
import { requiresAuth } from "./middleware/auth";

const app = express();

app.use(morgan("dev")); // to have info log when there is any request. For example, "GET /api/notes/64c8518b37a4aed48d2c4a5f 200 18.032 ms - 73"
app.use(express.json());

// session() needs to be after express.json() but before routes
app.use(
    session({
        secret: process.env.SESSION_SECRET as string,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 60 * 60 * 1000, // <-- mins * seconds * milliseconds
        },
        rolling: true, // <--- means that cookie will not expire if user is in the session before expirration time
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URL as string,
        }),
    })
);

/* ROUTES */
app.use("/api/users", userRoutes);
app.use("/api/notes", requiresAuth, noteRoutes);
// app.use("/api/notes", noteRoutes);

// ! ROUTE ERROR HANDLER -- put this just before ERROR HANDLER block
app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found"));
});

// ! ERROR HANDLER -- put this block at the end -- need to give specific type
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    let errorMsg = "An error occurred";
    let statusCode = 500;
    if (isHttpError(error)) {
        statusCode = error.status;
        errorMsg = error.message;
    }
    res.status(statusCode).json({ error: errorMsg });
});

export default app;
