require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { catchAsyncError } from "../middleware/catchAsycnErrors";
import { generateLast12MonthsData } from "../utils/analytics.generotor";
import userModal from "../models/user.model";
import CourseModel from "../models/course.model";
import orderModel from "../models/order.model";


// get users analytics -- Only for admin

export const getAnalytics = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const users = await generateLast12MonthsData(userModal);
            res.status(200).json({
                success: true,
                users
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// get course analytics -- Only for admin

export const getCourseAnalytics = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const course = await generateLast12MonthsData(CourseModel);
            res.status(200).json({
                success: true,
                course
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
)


// get order analytics -- Only for admin

export const getOrderAnalytics = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const order = await generateLast12MonthsData(orderModel);
            res.status(200).json({
                success: true,
                order
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
)