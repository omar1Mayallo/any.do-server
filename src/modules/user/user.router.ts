import express from "express";
import {getAllUsers} from "./user.controller";

const userRouter = express.Router();

userRouter.route("/").get(getAllUsers);

export default userRouter;
