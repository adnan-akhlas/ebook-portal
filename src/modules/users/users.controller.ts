import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import httpStatus from "http-status-codes";
import { UserModel } from "./users.model";
import bcrypt from "bcryptjs";
import env from "../../config/env.config";
import { sign } from "jsonwebtoken";

export async function registerUser(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    const error = createHttpError(
      httpStatus.BAD_REQUEST,
      "All fields are required.",
    );
    return next(error);
  }

  try {
    const isUserExist = await UserModel.findOne({ email });

    if (isUserExist) {
      const error = createHttpError(
        httpStatus.BAD_REQUEST,
        "User already exists with this email.",
      );
      return next(error);
    }
    const hashPassword = await bcrypt.hash(password, Number(env.BCRYPT_SALT));

    const newUser = await UserModel.create({
      name,
      email,
      password: hashPassword,
    });

    const token = sign({ sub: newUser.id }, env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res
      .status(httpStatus.CREATED)
      .json({ message: "User created successfully.", accessToken: token });
  } catch (error: unknown) {
    return next(error);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { email, password } = req.body;

  if (!email || !password) {
    next(createHttpError(httpStatus.BAD_REQUEST, "All fields are required."));
  }
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return next(createHttpError(httpStatus.NOT_FOUND, "User not found."));
    }

    const isPasswordOK = await bcrypt.compare(password, user.password);
    if (!isPasswordOK) {
      return next(
        createHttpError(httpStatus.UNAUTHORIZED, "Invalid user credentials"),
      );
    }

    const accessToken = sign({ sub: user.id }, env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({
      message: "Login successfully.",
      accessToken,
    });
  } catch (error: unknown) {
    return next(error);
  }
}
