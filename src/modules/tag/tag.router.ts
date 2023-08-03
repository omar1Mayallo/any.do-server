import express from "express";
import {isAuth} from "../../middlewares/auth";
import {
  deleteTag,
  getTags,
  getTag,
  updateTag,
  createTag,
} from "./tag.controller";
import {createTagValidation, updateTagValidation} from "./tag.dto";

const tagRouter = express.Router();

tagRouter.use(isAuth);

tagRouter.route("/").get(getTags).post(createTagValidation, createTag);

tagRouter
  .route("/:id")
  .get(getTag)
  .put(updateTagValidation, updateTag)
  .delete(deleteTag);

export default tagRouter;
