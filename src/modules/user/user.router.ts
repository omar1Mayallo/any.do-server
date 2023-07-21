import express from "express";
import {isAuth} from "../../middlewares/auth";
import {
  getUserProfile,
  updateUserPassword,
  updateUserInfo,
} from "./user.controller";
import {
  updateUserInfoValidation,
  updateUserPasswordValidation,
} from "./user.dto";

const userRouter = express.Router();

userRouter.use(isAuth);

userRouter
  .route("/profile")
  .get(getUserProfile)
  .patch(updateUserInfoValidation, updateUserInfo);

userRouter
  .route("/profile/password")
  .patch(updateUserPasswordValidation, updateUserPassword);

export default userRouter;
