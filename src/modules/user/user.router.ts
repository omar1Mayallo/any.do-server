import express from "express";
import {isAuth} from "../../middlewares/auth";
import {getUserProfile, updateUserPassword} from "./user.controller";
import {updateUserPasswordValidation} from "./user.dto";

const userRouter = express.Router();

userRouter.use(isAuth);

userRouter.route("/profile").get(getUserProfile);

userRouter
  .route("/profile/password")
  .patch(updateUserPasswordValidation, updateUserPassword);

export default userRouter;
