import express from "express";
import * as UserController from "../controllers/userControllers";

const router = express.Router();

router.post("/signup", UserController.signUp);

export default router;
