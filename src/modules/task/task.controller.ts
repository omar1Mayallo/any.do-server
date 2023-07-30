import {RequestHandler} from "express";
import expressAsyncHandler from "express-async-handler";
import {CreateTaskDto} from "./task.dto";
import {AuthRequest} from "../../@types";
import {CREATED} from "http-status";
import User from "../user/user.model";
import APIError from "../../utils/ApiError";
import Task from "./task.model";

const createTask: RequestHandler<any, any, CreateTaskDto> = expressAsyncHandler(
  async (req, res, next) => {
    const userId = (req as AuthRequest).user.id;
    const {title} = req.body;

    // 1) CHECK User Exists
    const user = await User.findByPk(userId);
    if (!user) {
      return next(APIError.notFound("User not found"));
    }

    // 2) Create Task
    const task = await Task.create({
      title,
      userId, // Associate the task with the user using the userId field
    });

    res.status(CREATED).json({message: "Task successfully created", task});
  }
);
export {createTask};
