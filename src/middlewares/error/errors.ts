import {RequestHandler} from "express";
import {server} from "../..";
import APIError from "../../utils/ApiError";

// @ERROR_TYPE 404_ROUTES
const routeNotFoundError: RequestHandler = (req, _, next) => {
  next(APIError.notFound(`Can't find ${req.originalUrl} on this server!`));
};

// @ERROR_TYPE  UNHANDLED_EXCEPTIONS
function uncaughtException(err: APIError): void {
  console.log(err.name, err.message);
  console.log("UNCAUGHT_EXCEPTIONS! Server Shutting down...");
  process.exit(1);
}

// @ERROR_TYPE  UNHANDLED_REJECTION
function unhandledRejection(err: APIError): void {
  console.error(err.name, err.message);
  server.close(() => {
    console.log("UNHANDLED_REJECTIONS! Server Shutting down...");
    process.exit(1);
  });
}

// @ERROR_TYPE  INVALID_TOKEN_ERROR
const handleJwtInvalidError = () =>
  APIError.unauthorized(`Invalid token, please login again`);

// @ERROR_TYPE EXPIRED_TOKEN_ERROR
const handleJwtExpiredError = () =>
  APIError.unauthorized(`Expired token, please login again`);

// @ERROR_TYPE SEQUELIZE_UNIQUE_ERROR
const handleDuplicationError = (err: APIError) => {
  const errorMessage = (err as any).errors[0]?.message || `Duplication error`;
  return APIError.badRequest(errorMessage);
};
// @ERROR_TYPE SEQUELIZE_VALIDATION_ERROR
const handleValidationError = (err: APIError) => {
  const errorMessage = (err as any).errors[0]?.message || `Validation error`;
  return APIError.badRequest(errorMessage);
};

export {
  handleDuplicationError,
  handleJwtExpiredError,
  handleJwtInvalidError,
  routeNotFoundError,
  uncaughtException,
  unhandledRejection,
  handleValidationError,
};
