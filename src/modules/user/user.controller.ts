import {RequestHandler} from "express";
import expressAsyncHandler from "express-async-handler";
import APIError from "../../utils/ApiError";
import CRUDController from "../../utils/CRUDController";
import {UpdateUserRoleDto} from "./user.dto";
import User from "./user.model";
import {OK} from "http-status";

// CRUD_CONTROLLER
const CRUDUsers = new CRUDController(User);

// ---------------------------------
// @desc    GET All Users
// @route   GET  /users
// @access  Private("ADMIN")
// ---------------------------------
const getAllUsers = CRUDUsers.getAll;

// ---------------------------------
// @desc    DELETE(force) User
// @route   DELETE  /users/:id?force=true
// @access  Private("ADMIN")
// ---------------------------------
const deleteUser = CRUDUsers.deleteOne;

// ---------------------------------
// @desc    UPDATE User Role
// @route   PATCH  /users/:id/role
// @access  Private("ADMIN")
// ---------------------------------
const updateUserRole: RequestHandler<any, any, UpdateUserRoleDto> =
  expressAsyncHandler(async (req, res, next) => {
    const {id} = req.params;
    const {role} = req.body;
    // 1) Check User Exist
    const user = await User.findOne({where: {id}, paranoid: false});
    if (!user) {
      return next(APIError.notFound(`No user with this id : ${id}`));
    }

    // 2) Update User Role
    user.role = role;
    await user.save();

    res.status(OK).json(user);
  });

export {deleteUser, getAllUsers, updateUserRole};
