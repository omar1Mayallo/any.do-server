import express from "express";
import {deleteUser, getAllUsers, updateUserRole} from "./user.controller";
import {allowedTo, isAuth} from "../../middlewares/auth";
import {UserRoles} from "../../constants";
import {updateUserRoleValidation} from "./user.dto";

const userRouter = express.Router();

userRouter.use(isAuth, allowedTo(UserRoles.ADMIN));

userRouter.route("/").get(getAllUsers);

userRouter.route("/:id").delete(deleteUser);

userRouter.route("/:id/role").patch(updateUserRoleValidation, updateUserRole);

export default userRouter;
