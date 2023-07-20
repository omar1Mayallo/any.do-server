import {getUserProfile} from "./user.controller";
import express from "express";
import {allowedTo, isAuth} from "../../middlewares/auth";
import {UserRoles} from "../../constants";

const userRouter = express.Router();

userRouter.use(isAuth);
userRouter.use(allowedTo(UserRoles.ADMIN));

userRouter.route("/my-profile").get(getUserProfile);

export default userRouter;
