import {env} from "process";
import APIError from "../../utils/ApiError";
import {Request, Response, NextFunction} from "express";
import {INTERNAL_SERVER_ERROR} from "http-status";
import {
  handleDuplicationError,
  handleJwtExpiredError,
  handleJwtInvalidError,
  handleValidationError,
} from "./errors";

const errToDev = (err: APIError, res: Response) => {
  return res.status(err.statusCode).json({
    error: err,
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
};

const errToProd = (err: APIError, res: Response) => {
  console.log("__Error__", err);
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    return res.status(INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

function globalErrorMiddleware(
  err: APIError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  err.statusCode = err.statusCode || INTERNAL_SERVER_ERROR;
  err.status = err.status || "error";

  if (env.NODE_ENV === "development") {
    errToDev(err, res);
  } else {
    let error = {...err, name: err.name, message: err.message};
    if (error.name === "JsonWebTokenError") error = handleJwtInvalidError();
    if (error.name === "TokenExpiredError") error = handleJwtExpiredError();
    if (error.name === "SequelizeUniqueConstraintError")
      error = handleDuplicationError(error);
    if (error.name === "SequelizeValidationError")
      error = handleValidationError(error);
    errToProd(error, res);
  }
}

export default globalErrorMiddleware;
