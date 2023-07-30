import {RequestHandler} from "express";
import expressAsyncHandler from "express-async-handler";
import {CreateTaskDto} from "./task.dto";
import {AuthRequest} from "../../@types";
import {CREATED, OK} from "http-status";
import User from "../user/user.model";
import APIError from "../../utils/ApiError";
import Task from "./task.model";

// ---------------------------------
// @desc    CREATE Task
// @route   POST  /tasks
// @access  Protected
// ---------------------------------
const createTask: RequestHandler<any, any, CreateTaskDto> = expressAsyncHandler(
  async (req, res, next) => {
    const userId = (req as AuthRequest).user.id;
    const {title} = req.body;

    // 1) CHECK title entered
    if (!title) {
      return next(APIError.badRequest("Please enter a title of task"));
    }

    // 2) CHECK User Exists
    const user = await User.findByPk(userId);
    if (!user) {
      return next(APIError.notFound("User not found"));
    }

    // 3) Create Task
    const task = await Task.create({
      title,
      userId, // Associate the task with the user using the userId field
    });

    res.status(CREATED).json({message: "Task successfully created", task});
  }
);

// ---------------------------------
// @desc    GET User Tasks
// @route   GET  /tasks
// @access  Protected
// ---------------------------------
const getTasks: RequestHandler = expressAsyncHandler(async (req, res, next) => {
  const userId = (req as AuthRequest).user.id;

  console.log(userId);

  // 1) CHECK User Exists
  const user = await User.findByPk(userId);
  if (!user) {
    return next(APIError.notFound("User not found"));
  }

  // 2) GET User Tasks
  const tasks = await Task.findAll({where: {userId}});

  res.status(OK).json(tasks);
});

export {createTask, getTasks};
