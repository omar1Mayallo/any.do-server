import express from "express";
import {isAuth} from "../../middlewares/auth";
import {createTaskValidation} from "./task.dto";
import {
  createTask,
  archivedTask,
  getTasks,
  toggleTaskStatus,
  getArchivedTasks,
  deleteAllArchivedTasks,
  updateArchivedTaskToRegular,
  updateTaskNotes,
  updateTaskTag,
  createSubTaskForTask,
} from "./task.controller";

const taskRouter = express.Router();

taskRouter.use(isAuth);

taskRouter.route("/").get(getTasks).post(createTaskValidation, createTask);

taskRouter
  .route("/archived")
  .get(getArchivedTasks)
  .delete(deleteAllArchivedTasks);

taskRouter.route("/archived/:id").patch(updateArchivedTaskToRegular);

taskRouter.route("/:id/status").patch(toggleTaskStatus);
taskRouter.route("/:id/notes").patch(updateTaskNotes);
taskRouter.route("/:id/tag").patch(updateTaskTag);
taskRouter.route("/:id/subtasks").post(createSubTaskForTask);

taskRouter.route("/:id").delete(archivedTask);

export default taskRouter;
