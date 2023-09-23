import { Request, Response, NextFunction } from "express";
import { catchAsyncError } from "./catchAsycnErrors";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../utils/redis";
import { IUser } from "models/user.model";

export interface IGetUserAuthInfoRequest extends Request {
  user: IUser;
}

// authenticated middleware
export const isAuthenticated = catchAsyncError(
  async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token as string;

    if (!access_token) {
      return next(
        new ErrorHandler("Please login to access this resource", 401)
      );
    }

    const decoded = jwt.verify(
      access_token,
      process.env.ACCESS_TOKEN as string
    ) as JwtPayload;

    if (!decoded) {
      return next(new ErrorHandler("access token is not valid", 401));
    }
    // console.log("FROM MIDDLERWERE userId ", decoded);

    const user = await redis.get(decoded.id);
    // console.log("FROM MIDDLERWERE to DATE COME FROM REDIS DB", user);

    if (!user) {
      return next(new ErrorHandler("User not found", 401));
    }

    req.user = JSON.parse(user);

    next();
  }
);

// validate user role
export const authorizeRoles = (...roles: string[]) => {
  return (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
