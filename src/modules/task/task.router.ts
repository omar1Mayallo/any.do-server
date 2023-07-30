import express from "express";
import {isAuth} from "../../middlewares/auth";
import {createTaskValidation} from "./task.dto";
import {createTask, getTasks} from "./task.controller";

const taskRouter = express.Router();

taskRouter.use(isAuth);

taskRouter.route("/").get(getTasks).post(createTaskValidation, createTask);

export default taskRouter;
