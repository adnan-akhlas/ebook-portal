import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import httpStatus from "http-status-codes";

export function createUser(req: Request, res: Response, next: NextFunction) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    const error = createHttpError(
      httpStatus.BAD_REQUEST,
      "All fields are required.",
    );
    return next(error);
  }

  res.json({ message: "User created successfully." });
}
