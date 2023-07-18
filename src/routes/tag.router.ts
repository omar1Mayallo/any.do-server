import express from "express";
import {getTags} from "../controllers/tag.controller";

const tagRouter = express.Router();

tagRouter.route("/").get(getTags);

export default tagRouter;
