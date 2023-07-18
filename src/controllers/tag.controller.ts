import expressAsyncHandler from "express-async-handler";
import {RequestHandler} from "express";
import {OK} from "http-status";
import {Tag} from "../models/tag.model";
export const getTags: RequestHandler = expressAsyncHandler(
  async (req, res, next) => {
    const data: Tag[] = await Tag.findAll();
    res.status(OK).json({data});
  }
);
