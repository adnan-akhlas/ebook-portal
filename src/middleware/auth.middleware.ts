import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status-codes";
import createHttpError from "http-errors";
import { JwtPayload, verify } from "jsonwebtoken";
import env from "../config/env.config";
export async function auth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const token = req.header("Authorization")?.split(" ").pop();
  if (!token) {
    return next(
      createHttpError(
        httpStatus.UNAUTHORIZED,
        "Unauthorized access. Login required.",
      ),
    );
  }
  const decode = verify(token, env.JWT_SECRET) as JwtPayload;
  req.user = decode;
  next();
}
