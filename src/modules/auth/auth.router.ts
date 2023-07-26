import express from "express";
import {
  register,
  login,
  deactivateTheAccount,
  deleteUser,
  getUserProfile,
  updateUserInfo,
  updateUserPassword,
  activateTheAccount,
} from "./auth.controller";
import {
  registerValidation,
  loginValidation,
  updateUserInfoValidation,
  updateUserPasswordValidation,
} from "./auth.dto";
import {isAuth} from "../../middlewares/auth";

const authRouter = express.Router();

authRouter.route("/register").post(registerValidation, register);
authRouter.route("/login").post(loginValidation, login);

authRouter.route("/profile/activate").patch(activateTheAccount);

authRouter.use(isAuth);

authRouter
  .route("/profile")
  .get(getUserProfile)
  .patch(updateUserInfoValidation, updateUserInfo)
  .delete(deleteUser);

authRouter.route("/profile/deactivate").patch(deactivateTheAccount);

authRouter
  .route("/profile/password")
  .patch(updateUserPasswordValidation, updateUserPassword);

export default authRouter;
