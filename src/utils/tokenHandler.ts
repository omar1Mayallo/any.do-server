import {Response} from "express";
import jwt from "jsonwebtoken";
import User from "../modules/user/user.model";
import env from "../config/env";

//_SIGN_TOKEN_//
function signToken(payload: string) {
  return jwt.sign({userId: payload}, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRE_IN,
  });
}

//_VERIFY_TOKEN_//
function verifyToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET);
}

//_GENERATE_AND_SEND_TOKEN_TO_RESPONSE_//
function generateSendToken(res: Response, user: User, statusCode: number) {
  const token = signToken(user.id);

  // Delete password field from output
  user.password = undefined as any;

  res.status(statusCode).json({
    token,
    user,
  });
}

export {generateSendToken, signToken, verifyToken};
