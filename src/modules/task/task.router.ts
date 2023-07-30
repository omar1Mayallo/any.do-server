import express from "express";
import {isAuth} from "../../middlewares/auth";
import {createTaskValidation} from "./task.dto";
import {createTask} from "./task.controller";

const taskRouter = express.Router();

taskRouter.use(isAuth);

taskRouter.route("/").post(createTaskValidation, createTask);

export default taskRouter;
