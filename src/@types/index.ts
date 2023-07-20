import {Request} from "express";
import User from "../modules/user/user.model";

export interface AuthRequest extends Request {
  user: User;
}
