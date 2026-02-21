import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import httpStatus from "http-status-codes";
import { UserModel } from "./users.model";
import bcrypt from "bcryptjs";
import env from "../../config/env.config";
import { sign } from "jsonwebtoken";

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    const error = createHttpError(
      httpStatus.BAD_REQUEST,
      "All fields are required.",
    );
    return next(error);
  }

  const isUserExist = await UserModel.findOne({ email });

  if (isUserExist) {
    const error = createHttpError(
      httpStatus.BAD_REQUEST,
      "User already exists with this email.",
    );
  }

  const hashPassword = await bcrypt.hash(password, Number(env.BCRYPT_SALT));

  const newUser = await UserModel.create({
    name,
    email,
    password: hashPassword,
  });

  const token = sign({ sub: newUser.id }, env.JWT_SECRET, { expiresIn: "7d" });

  res.json({ message: "User created successfully.", accessToken: token });
}
