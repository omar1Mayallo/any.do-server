import express from "express";
import {login, register} from "./auth.controller";
// import {loginValidation, registerValidation} from "./auth.dto";

const authRouter = express.Router();

// router.route("/register").post(registerValidation, register);
// router.route("/login").post(loginValidation, login);

authRouter.route("/register").post(register);

authRouter.route("/login").post(login);

export default authRouter;
