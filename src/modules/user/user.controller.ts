import {RequestHandler} from "express";
import expressAsyncHandler from "express-async-handler";
import User from "./user.model";
import {OK} from "http-status";
import APIFeatures from "../../utils/ApiFeatures";

// ---------------------------------
// @desc    GET All Users
// @route   GET  /users
// @access  Private("ADMIN")
// ---------------------------------
const getAllUsers: RequestHandler = expressAsyncHandler(
  async (req, res, next) => {
    const apiFeatures = new APIFeatures(req.query);

    const filter = apiFeatures.filter();
    const sort = apiFeatures.sort();
    const limitFields = apiFeatures.limitFields();

    const totalNumOfDocs = await User.count({
      paranoid: false,
      where: filter,
    });
    const {offset, limit} = apiFeatures.paginate(totalNumOfDocs);
    const paginationStatus = apiFeatures.paginationStatus;

    const users = await User.findAll({
      paranoid: false,
      where: filter,
      attributes: limitFields,
      order: sort,
      limit,
      offset,
    });
    res.status(OK).json({totalNumOfDocs, paginationStatus, users});
  }
);

export {getAllUsers};
