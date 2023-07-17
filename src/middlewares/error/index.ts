import {env} from "process";
import APIError from "../../utils/ApiError";
import {Request, Response, NextFunction} from "express";
import {INTERNAL_SERVER_ERROR} from "http-status";

const errToDev = (err: APIError, res: Response) => {
  return res.status(err.statusCode).json({
    error: err,
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
};

const errToProd = (err: APIError, res: Response) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("🔴_ERROR_🔴", err);
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
    errToProd(err, res);
  }
}

export default globalErrorMiddleware;
