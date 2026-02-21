import { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import { env } from "../config/env.config";

export function globalError(
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction,
): Response {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong.";

  return res.status(statusCode).json({
    message: message,
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  });
}
