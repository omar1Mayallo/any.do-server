import {RequestHandler} from "express";
import asyncHandler from "express-async-handler";
import {CREATED, OK} from "http-status";
import APIError from "../../utils/ApiError";
import {generateSendToken} from "../../utils/tokenHandler";
import User from "../user/user.model";
import {LoginDto, RegisterDto} from "./auth.dto";

// ---------------------------------
// @desc    Register
// @route   POST  /auth/register
// @access  Public
// ---------------------------------
export const register: RequestHandler<unknown, unknown, RegisterDto> =
  asyncHandler(async (req, res, next) => {
    const {username, email, password, confirmPassword} = req.body;
    //_A) CHECK _//
    // 1) If all data entered
    if (!username || !email || !password || !confirmPassword) {
      return next(APIError.badRequest("Please fill all fields"));
    }
    if (password !== confirmPassword) {
      return next(APIError.badRequest("Passwords do not match"));
    }
    // 2) If email is already exist
    const user = await User.findOne({where: {email}});
    if (user) {
      return next(
        APIError.badRequest("Email is already exist , please enter new email")
      );
    }

    //_B) CREATE_NEW_USER_//
    const newUser = await User.create({
      username,
      email,
      password,
    });

    //_C) GENERATE_AND_SEND_TOKEN_TO_RESPONSE_//
    generateSendToken(res, newUser, CREATED);
  });

// ---------------------------------
// @desc    login
// @route   POST  /auth/login
// @access  Public
// ---------------------------------
export const login: RequestHandler<unknown, unknown, LoginDto> = asyncHandler(
  async (req, res, next) => {
    const {email, password} = req.body;
    //_A) CHECK_//
    // 1) If all data entered
    if (!email || !password) {
      return next(APIError.badRequest("Please fill all fields"));
    }
    // 2) If user exists and password is true
    const user = await User.findOne({where: {email}});
    if (!user || !(await user.isCorrectPassword(password))) {
      return next(APIError.badRequest("Invalid Credentials"));
    }

    //_B) GENERATE_AND_SEND_TOKEN_TO_RESPONSE_//
    generateSendToken(res, user, OK);
  }
);
