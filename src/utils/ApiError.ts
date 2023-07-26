import {
  NOT_FOUND,
  BAD_REQUEST,
  UNAUTHORIZED,
  CONFLICT,
  FORBIDDEN,
} from "http-status";

export default class APIError extends Error {
  status: string;
  isOperational: boolean;

  constructor(public message: string, public statusCode: number) {
    super(message);
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
  }

  static notFound(message: string): APIError {
    return new APIError(message, NOT_FOUND);
  }

  static badRequest(message: string): APIError {
    return new APIError(message, BAD_REQUEST);
  }

  static unauthorized(message: string): APIError {
    return new APIError(message, UNAUTHORIZED);
  }

  static conflict(message: string): APIError {
    return new APIError(message, CONFLICT);
  }

  static forbidden(message: string): APIError {
    return new APIError(message, FORBIDDEN);
  }
}
