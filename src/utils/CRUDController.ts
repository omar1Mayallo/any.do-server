import expressAsyncHandler from "express-async-handler";
import APIFeatures from "./ApiFeatures";
import {RequestHandler} from "express";
import {CREATED, NO_CONTENT, OK} from "http-status";
import {DestroyOptions} from "sequelize";
import APIError from "./ApiError";

export default class CRUDController<UpdateDtoT, CreateDtoT> {
  constructor(private Model: any) {}

  // GET_ALL
  getAll: RequestHandler = expressAsyncHandler(async (req, res, next) => {
    const apiFeatures = new APIFeatures(req.query);

    // 1) Implement Filtration, Sorting, LimitFields, Pagination And PaginationStatus
    const filter = apiFeatures.filter();
    const sort = apiFeatures.sort();
    const limitFields = apiFeatures.limitFields();

    const totalNumOfDocs = await this.Model.count({
      paranoid: false,
      where: filter,
    });
    const {offset, limit} = apiFeatures.paginate(totalNumOfDocs);
    const paginationStatus = apiFeatures.paginationStatus;

    // 2) Execute Query
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
  getOne: RequestHandler = expressAsyncHandler(async (req, res, next) => {
    const {id} = req.params;

    const doc = await this.Model.findOne({where: {id}, paranoid: false});
    if (!doc) {
      return next(APIError.notFound(`No doc with this id : ${id}`));
    }

    res.status(OK).json(doc);
  });

  // UPDATE_ONE
  updateOne: RequestHandler<any, any, UpdateDtoT> = expressAsyncHandler(
    async (req, res, next) => {
      const {id} = req.params;

      // 1) Check if the doc exists
      const doc = await this.Model.findOne({where: {id}, paranoid: false});
      if (!doc) {
        return next(APIError.notFound(`No doc with this id: ${id}`));
      }

      // 2) Update the doc
      const updatedDoc = await doc.update(req.body, {
        where: {id},
        paranoid: false,
      });

      res.status(OK).json(updatedDoc);
    }
  );

  // DELETE_ONE(Force or Soft)
  deleteOne: RequestHandler = expressAsyncHandler(async (req, res, next) => {
    // 1) Check Doc Exist
    const {id} = req.params;
    const doc = await this.Model.findOne({where: {id}, paranoid: false});
    if (!doc) {
      return next(APIError.notFound(`No doc with this id : ${id}`));
    }

    // 2) Check The Type Of Delete (Force / Soft)
    const forceDelete = req.query.force === "true";
    let options: DestroyOptions = {};
    if (forceDelete) {
      options.force = true;
    }

    // 3) Destroy the Doc
    await doc.destroy(options);

    res.status(NO_CONTENT).json({status: "success"});
  });

  // CREATE_ONE
  createOne: RequestHandler<any, any, CreateDtoT> = expressAsyncHandler(
    async (req, res, next) => {
      const doc = await this.Model.create(req.body);

      res.status(CREATED).json(doc);
    }
  );
}
