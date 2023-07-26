import {RequestHandler} from "express";
import {default as asyncHandler} from "express-async-handler";
import {CREATED, FORBIDDEN, NO_CONTENT, OK} from "http-status";
import {AuthRequest} from "../../@types";
import APIError from "../../utils/ApiError";
import {generateSendToken} from "../../utils/tokenHandler";
import User from "../user/user.model";
import {
  LoginDto,
  RegisterDto,
  UpdateUserInfoDto,
  UpdateUserPasswordDto,
} from "./auth.dto";

// ---------------------------------
// @desc    Register
// @route   POST  /auth/register
// @access  Public
// ---------------------------------
const register: RequestHandler<unknown, unknown, RegisterDto> = asyncHandler(
  async (req, res, next) => {
    const {username, email, password, confirmPassword} = req.body;
    //_A) CHECK _//
    // 1) If all data entered
    if (!username || !email || !password || !confirmPassword) {
      return next(APIError.badRequest("Please fill all fields"));
    }
    if (password !== confirmPassword) {
      return next(APIError.badRequest("Passwords do not match"));
    }

    const user = await User.findOne({
      where: {email},
      paranoid: false,
    });

    // 2) If user with this email exist and is not active
    if (user && !user.active) {
      return next(
        APIError.conflict(
          "Your account already exists, but it is not activated. Please login again to activate"
        )
      );
    }

    // 3) If email is already exist
    if (user) {
      return next(APIError.badRequest("Email already exists"));
    }

    //_B) CREATE_NEW_USER_//
    const newUser = await User.create({
      username,
      email,
      password,
    });

    //_C) GENERATE_AND_SEND_TOKEN_TO_RESPONSE_//
    generateSendToken(res, newUser, CREATED);
  }
);

// ---------------------------------
// @desc    login
// @route   POST  /auth/login
// @access  Public
// ---------------------------------
const login: RequestHandler<unknown, unknown, LoginDto> = asyncHandler(
  async (req, res, next) => {
    const {email, password} = req.body;
    //_A) CHECK_//
    // 1) If all data entered
    if (!email || !password) {
      return next(APIError.badRequest("Please fill all fields"));
    }
    // 2) If user exists and password is true
    const user = await User.findOne({
      where: {email},
      attributes: {include: ["password"]},
      paranoid: false,
    });
    if (!user || !(await user.isCorrectPassword(password))) {
      return next(APIError.badRequest("Invalid Credentials"));
    }

    if (!user.active) {
      res.status(FORBIDDEN).json({
        message: "Your account is not active, Do you want to activate it?",
      });
    }

    //_B) GENERATE_AND_SEND_TOKEN_TO_RESPONSE_//
    generateSendToken(res, user, OK);
  }
);

// ---------------------------------
// @desc    GET User Profile
// @route   GET /auth/profile
// @access  Protected
// ---------------------------------
const getUserProfile: RequestHandler = asyncHandler(async (req, res, next) => {
  const id = (req as AuthRequest).user.id;

  const user = await User.findByPk(id);
  if (!user) {
    return next(
      APIError.notFound(`There is no user match with this id : ${id}`)
    );
  }

  res.status(OK).json(user);
});

// ---------------------------------
// @desc    UPDATE User Password
// @route   PATCH  /auth/profile/password
// @access  Protected
// ---------------------------------
const updateUserPassword: RequestHandler<
  unknown,
  unknown,
  UpdateUserPasswordDto
> = asyncHandler(async (req, res, next) => {
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
// @route   PATCH  /auth/profile
// @access  Protected
// ---------------------------------
const updateUserInfo: RequestHandler<unknown, unknown, UpdateUserInfoDto> =
  asyncHandler(async (req, res, next) => {
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

// ---------------------------------
// @desc    DELETE User Permanently
// @route   GET  /auth/profile
// @access  Protected
// ---------------------------------
const deleteUser: RequestHandler = asyncHandler(async (req, res, next) => {
  const user = await User.destroy({
    where: {id: (req as AuthRequest).user.id},
    force: true,
  });

  res.status(NO_CONTENT).json(user);
});

// ---------------------------------
// @desc    Deactivate User Account
// @route   PATCH  /auth/profile/deactivate
// @access  Protected
// ---------------------------------
const deactivateTheAccount: RequestHandler = asyncHandler(
  async (req, res, next) => {
    // 1) Find Logged User
    const user = await User.findByPk((req as AuthRequest).user.id);
    if (!user) {
      return next(APIError.notFound(`User not found`));
    }

    // 2) Change User active status ro false
    user.active = false;
    const inactiveUser = await user.save();

    // 3) Soft Delete User(populate deletedAt value to the current time)
    await inactiveUser.destroy();

    res.status(OK).json({message: "User account deactivated"});
  }
);

// ---------------------------------
// @desc    Activate User Account
// @route   PATCH  /auth/profile/activate
// @access  Protected
// ---------------------------------
const activateTheAccount: RequestHandler<unknown, unknown, LoginDto> =
  asyncHandler(async (req, res, next) => {
    const {email, password} = req.body;
    //_A) CHECK_//
    // 1) If all data entered
    if (!email || !password) {
      return next(APIError.badRequest("Please fill all fields"));
    }
    // 2) If user exists and password is true
    const user = await User.findOne({
      where: {email},
      attributes: {include: ["password"]},
      paranoid: false,
    });
    if (!user || !(await user.isCorrectPassword(password))) {
      return next(APIError.badRequest("Invalid Credentials"));
    }

    // 3) If user is already active
    if (user.active) {
      return next(APIError.forbidden("User already active, Just login again"));
    }

    // 4) Activate User
    user.active = true;
    // Use the restore method to reactivate the user and set deletedAt to null
    await user.restore();

    //_B) GENERATE_AND_SEND_TOKEN_TO_RESPONSE_//
    generateSendToken(res, user, OK);
  });

export {
  register,
  login,
  deactivateTheAccount,
  activateTheAccount,
  deleteUser,
  getUserProfile,
  updateUserInfo,
  updateUserPassword,
};
