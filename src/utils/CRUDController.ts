import expressAsyncHandler from "express-async-handler";
import APIFeatures from "./ApiFeatures";
import {RequestHandler} from "express";
import {OK} from "http-status";

export default class CRUDController {
  constructor(private Model: any) {}

  // GET_ALL
  getAll: RequestHandler = expressAsyncHandler(async (req, res, next) => {
    const apiFeatures = new APIFeatures(req.query);

    const filter = apiFeatures.filter();
    const sort = apiFeatures.sort();
    const limitFields = apiFeatures.limitFields();

    const totalNumOfDocs = await this.Model.count({
      paranoid: false,
      where: filter,
    });
    const {offset, limit} = apiFeatures.paginate(totalNumOfDocs);
    const paginationStatus = apiFeatures.paginationStatus;

    const docs = await this.Model.findAll({
      paranoid: false,
      where: filter,
      attributes: limitFields,
      order: sort,
      limit,
      offset,
    });
    res.status(OK).json({totalNumOfDocs, paginationStatus, docs});
  });

  // GET_ONE

  // UPDATE_ONE

  // DELETE_ONE(force)

  // DELETE_ALL
}
