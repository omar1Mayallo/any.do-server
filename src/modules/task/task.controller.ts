import {RequestHandler} from "express";
import expressAsyncHandler from "express-async-handler";
import {CreateTaskDto} from "./task.dto";
import {AuthRequest} from "../../@types";
import {CREATED, NO_CONTENT, OK} from "http-status";
import User from "../user/user.model";
import APIError from "../../utils/ApiError";
import Task from "./task.model";
import {TaskStatus} from "../../constants";
import {Op, WhereOptions} from "sequelize";

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

    res.status(CREATED).json(task);
  }
);

// ---------------------------------
// @desc    GET User Tasks
// @route   GET  /tasks
// @access  Protected
// ---------------------------------
const getTasks: RequestHandler = expressAsyncHandler(async (req, res, next) => {
  const userId = (req as AuthRequest).user.id;

  // 1) CHECK User Exists
  const user = await User.findByPk(userId);
  if (!user) {
    return next(APIError.notFound("User not found"));
  }

  // 2) GET User Tasks
  const tasks = await Task.findAll({where: {userId}});

  res.status(OK).json(tasks);
});

// ---------------------------------
// @desc    UPDATE (Toggle) Task Status
// @route   PATCH /tasks/:id/status
// @access  Protected
// ---------------------------------
const toggleTaskStatus: RequestHandler = expressAsyncHandler(
  async (req, res, next) => {
    const taskId = req.params.id;
    const userId = (req as AuthRequest).user.id;

    // 1) Find the Task
    const task = await Task.findOne({where: {id: taskId, userId}});
    if (!task) {
      return next(APIError.notFound("Task not found"));
    }

    // 2) Toggle the task status (IN_PROGRESS or DONE)
    task.status =
      task.status === TaskStatus.IN_PROGRESS
        ? TaskStatus.DONE
        : TaskStatus.IN_PROGRESS;

    await task.save();

    res.status(OK).json(task);
  }
);

// ---------------------------------
// @desc    Delete Task (Soft Delete)
// @route   DELETE /tasks/:id
// @access  Protected
// ---------------------------------
const archivedTask: RequestHandler = expressAsyncHandler(
  async (req, res, next) => {
    const taskId = req.params.id;
    const userId = (req as AuthRequest).user.id;

    // 1) Find the Task
    const task = await Task.findOne({where: {id: taskId, userId}});
    if (!task) {
      return next(APIError.notFound("Task not found"));
    }

    // 2) Soft delete the task (I built in frontend Archive that contains all soft deleted tasks)
    await task.destroy();

    res.status(NO_CONTENT).json(task);
  }
);

// ---------------------------------
// @desc    GET Archived Tasks
// @route   GET /tasks/archived
// @access  Protected
// ---------------------------------
// Function to group tasks by day of deletedAt
function groupTasksByDay(tasks: Task[]) {
  const groupedTasks: any = {};
  for (const task of tasks) {
    const deletedDate = task.deletedAt.toISOString().split("T")[0]; // Get the date part (YYYY-MM-DD)
    if (!groupedTasks[deletedDate]) {
      groupedTasks[deletedDate] = [];
    }
    groupedTasks[deletedDate].push(task);
  }
  return groupedTasks;
}
const getArchivedTasks: RequestHandler = expressAsyncHandler(
  async (req, res, next) => {
    const userId = (req as AuthRequest).user.id;
    const searchQuery = req.query.search;

    // 1) Build A WhereFilterObject
    // default filterObject
    const filterObject: WhereOptions = {
      deletedAt: {[Op.ne]: null},
      userId,
    };
    // filterObject With searchQuery
    if (searchQuery) {
      filterObject["title"] = {
        [Op.iLike]: `%${searchQuery}%`, // iLike >> Case-insensitive string match (only available in PostgreSQL)
      };
    }

    // 2) Find all soft-deleted tasks for the logged-in user
    const archivedTasks = await Task.findAll({
      where: filterObject,
      attributes: ["id", "title", "deletedAt" /*, "list"*/],
      order: [["deletedAt", "DESC"]],

      paranoid: false,
    });

    // 3) ReFormat Response - Group the archivedTasks by the day of deletion (deletedAt)
    const groupedArchivedTasks = groupTasksByDay(archivedTasks);
    const formattedArchivedTasks = Object.keys(groupedArchivedTasks).map(
      (day) => ({
        day,
        archivedTasks: groupedArchivedTasks[day],
      })
    );

    res.status(OK).json(formattedArchivedTasks);
  }
);

// ---------------------------------
// @desc    DELETE All Archived Tasks
// @route   DELETE /tasks/archived
// @access  Protected
// ---------------------------------
const deleteAllArchivedTasks: RequestHandler = expressAsyncHandler(
  async (req, res) => {
    const userId = (req as AuthRequest).user.id;

    // Find all soft-deleted tasks for the logged-in user that are archived
    const archivedTasks = await Task.findAll({
      where: {
        deletedAt: {[Op.ne]: null},
        userId,
      },
      paranoid: false, // Include soft-deleted tasks in the result
    });

    // Permanently delete the archived tasks from the database
    for (const task of archivedTasks) {
      await task.destroy({force: true});
    }

    res
      .status(NO_CONTENT)
      .json({message: "Archived tasks deleted successfully."});
  }
);

// ---------------------------------
// @desc    UPDATE Archived Tasks To Regular Task (deleteAt turn into null)
// @route   PATCH /tasks/archived/:id
// @access  Protected
// ---------------------------------
const updateArchivedTaskToRegular: RequestHandler = expressAsyncHandler(
  async (req, res, next) => {
    const userId = (req as AuthRequest).user.id;
    const taskId = req.params.id;

    // 1) Find the Archived Task(deleteAt NOT NULL)
    const archivedTask = await Task.findOne({
      where: {
        id: taskId,
        userId,
        deletedAt: {[Op.ne]: null},
      },
      paranoid: false, // Include soft-deleted tasks in the result
    });

    if (!archivedTask) {
      return next(APIError.notFound("This Task Not Found In Your Archive"));
    }

    // The restore method allows you to undo the soft delete and bring back the record by setting the deletedAt field to null
    const task = await archivedTask.restore();

    res.status(OK).json(task);
  }
);

export {
  createTask,
  getTasks,
  toggleTaskStatus,
  archivedTask,
  getArchivedTasks,
  deleteAllArchivedTasks,
  updateArchivedTaskToRegular,
};
