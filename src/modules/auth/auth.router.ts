import express from "express";
import {login, register} from "./auth.controller";
import {registerValidation, loginValidation} from "./auth.dto";

const authRouter = express.Router();

authRouter.route("/register").post(registerValidation, register);
authRouter.route("/login").post(loginValidation, login);

export default authRouter;
