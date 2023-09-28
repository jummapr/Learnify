require("dotenv").config();
import notificationModel from "../models/notification.model";
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { catchAsyncError } from "../middleware/catchAsycnErrors";
import { redis } from "../utils/redis";
import { IGetUserAuthInfoRequest } from "../middleware/auth";

// get notification
export const getNotification = catchAsyncError(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    try {
        const notification = await notificationModel.find().sort({createdAt: -1});

        res.status(201).json({
            success: true,
            notification
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// update notification status --- Only admin

export const updateNotificationStatus = catchAsyncError(async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    try {
        const notificationId = req.params.id;
        const notification = await notificationModel.findById(notificationId);

       
            notification?.status ? notification.status = "read": notification.status;

        await notification.save();

        const notifications = await notificationModel.find().sort({createdAt: -1});

        res.status(201).json({
            success: true,
            notifications
        })

    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})