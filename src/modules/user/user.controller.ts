import {NextFunction, Request, Response} from "express";
import expressAsyncHandler from "express-async-handler";
import {OK} from "http-status";
import {AuthRequest} from "../../@types";
import APIError from "../../utils/ApiError";
import User from "./user.model";

// ---------------------------------
// @desc    GET User Profile
// @route   GET  /users/my-profile
// @access  Protected
// ---------------------------------
const getUserProfile = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
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

export {getUserProfile};
