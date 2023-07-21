import {RequestHandler} from "express";
import expressAsyncHandler from "express-async-handler";
import {OK} from "http-status";
import {AuthRequest} from "../../@types";
import APIError from "../../utils/ApiError";
import User from "./user.model";
import {UpdateUserInfoDto, UpdateUserPasswordDto} from "./user.dto";
import {generateSendToken} from "../../utils/tokenHandler";

// ---------------------------------
// @desc    GET User Profile
// @route   GET  /users/profile
// @access  Protected
// ---------------------------------
const getUserProfile: RequestHandler = expressAsyncHandler(
  async (req, res, next) => {
    const id = (req as AuthRequest).user.id;

    const user = await User.findByPk(id);
    if (!user) {
      return next(
        APIError.notFound(`There is no user match with this id : ${id}`)
      );
    }

    res.status(OK).json(user);
  }
);

// ---------------------------------
// @desc    UPDATE User Password
// @route   PATCH  /users/profile/password
// @access  Protected
// ---------------------------------
const updateUserPassword: RequestHandler<
  unknown,
  unknown,
  UpdateUserPasswordDto
> = expressAsyncHandler(async (req, res, next) => {
  const {currentPassword, newPassword, confirmNewPassword} = req.body;

  // 1) Check if newPassword match with confirmNewPassword
  if (newPassword !== confirmNewPassword) {
    return next(
      APIError.badRequest(`New password don't match with confirm new password`)
    );
  }

  // 2) Find The Logged In User
  const user = await User.findOne({
    where: {id: (req as AuthRequest).user.id},
    attributes: {include: ["password"]},
  });
  if (!user) {
    return next(APIError.notFound(`User not found`));
  }

  // 3) Check if the current password entered match with the logged user's password
  if (!(await user.isCorrectPassword(currentPassword))) {
    return next(APIError.badRequest(`Current password is wrong!`));
  }

  // 4) If All Things OK, then update password
  user.password = newPassword;
  await user.save({validate: false});

  // 5) After PasswordChanged >> generate a new token
  generateSendToken(res, user, OK);
});

// ---------------------------------
// @desc    UPDATE User Info
// @route   PATCH  /users/profile
// @access  Protected
// ---------------------------------
const updateUserInfo: RequestHandler<unknown, unknown, UpdateUserInfoDto> =
  expressAsyncHandler(async (req, res, next) => {
    const {username, email} = req.body;

    // 1) Find The Logged In User
    const user = await User.findByPk((req as AuthRequest).user.id);
    if (!user) {
      return next(APIError.notFound(`User not found`));
    }

    // 2) Update user info
    if (email) {
      user.email = email;
    }
    if (username) {
      user.username = username;
    }
    const updatedUser = await user.save();

    res.status(OK).json(updatedUser);
  });

export {getUserProfile, updateUserPassword, updateUserInfo};
