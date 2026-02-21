import { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import env from "../config/env.config";
import httpStatus from "http-status-codes";

export default function globalError(
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction,
): Response {
  let statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  let message = err.message || "Internal server error";

  return res.status(statusCode).json({
    message: message,
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  });
}
