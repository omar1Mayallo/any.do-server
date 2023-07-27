import {RequestHandler} from "express";
import expressAsyncHandler from "express-async-handler";
import User from "./user.model";
import {OK} from "http-status";
import {FindAttributeOptions, Op} from "sequelize";

// ---------------------------------
// @desc    GET All Users
// @route   GET  /users
// @access  Private("ADMIN")
// ---------------------------------
const getAllUsers: RequestHandler = expressAsyncHandler(
  async (req, res, next) => {
    const {page: reqPage, limit: reqLimit, sort, fields} = req.query as any;

    // EXCLUDE Some query parameters (to use them in filtering, sorting, pagination, limitFields)
    const queryObject = {...req.query};
    const excludesFields = ["sort", "page", "limit", "fields"];
    excludesFields.forEach((field) => delete queryObject[field]);
    const qryStr = JSON.stringify(queryObject);

    // 1) Filter
    const filterQuery = JSON.parse(qryStr);

    // 2) Limit Fields
    let limitFields: FindAttributeOptions | undefined;
    if (fields) {
      // Convert the fields string to an array of attributes
      limitFields = (fields as string).split(",");
      // console.log(limitFields);
    }

    // 3) Sorting
    // i need to reach to [["age", "DESC"], ["username", "ASC"] ... etc]
    let sortArr: [string, string][] = [];
    if (sort) {
      const sortFields = (sort as string).split(",");
      sortFields.forEach((sortField: string) => {
        const direction = sortField.startsWith("-") ? "DESC" : "ASC";
        const field = sortField.substring(1);
        sortArr.push([field, direction]);
      });
    }
    // console.log(sortArr);

    // 4) Pagination
    const page = reqPage * 1 || 1;
    const limit = reqLimit * 1 || 10;
    const offset = (page - 1) * limit;

    const totalNumOfDocs = await User.count({
      paranoid: false,
      where: filterQuery,
    });
    interface Pagination {
      currentPage?: number;
      numOfItemsPerPage?: number;
      numOfPages?: number;
      nextPage?: number;
      previousPage?: number;
      totalNumOfDocs?: number;
    }
    let paginationStatus: Pagination = {};
    paginationStatus.currentPage = page;
    paginationStatus.numOfItemsPerPage = limit;
    paginationStatus.totalNumOfDocs = totalNumOfDocs;
    paginationStatus.numOfPages = Math.ceil(totalNumOfDocs / limit);

    const lastItemIdxInPage = page * limit;
    // Q: when nextPage is exist?
    if (lastItemIdxInPage < totalNumOfDocs) {
      paginationStatus.nextPage = page + 1;
    }
    // Q: when previousPage is exist?
    if (offset > 0) {
      paginationStatus.previousPage = page - 1;
    }

    const users = await User.findAll({
      paranoid: false,
      where: filterQuery,
      attributes: limitFields,
      order: sortArr,
      limit: limit as number,
      offset,
    });
    res.status(OK).json({paginationStatus, users});
  }
);

export {getAllUsers};
