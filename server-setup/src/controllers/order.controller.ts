require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import orderModal, { IOrder } from "../models/order.model";
import userModal from "../models/user.model";
import courseModel from "../models/course.model";
import notificationModel from "../models/notification.model";
import ErrorHandler from "../utils/ErrorHandler";
import { catchAsyncError } from "../middleware/catchAsycnErrors";
import { redis } from "../utils/redis";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMail";
import { IGetUserAuthInfoRequest } from "../middleware/auth";
import { newOrderServices } from "../services/order.service";

// create order

export const createOrder = catchAsyncError(
  async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    try {
      const { courseId, payment_info }: IOrder = req.body;
      const userId = req?.user._id;
      const user = await userModal.findById(userId);

      const courseExistInUser = user.courses.some(
        (course: any) => course._id.toString() === courseId
      );

      if (courseExistInUser) {
        return next(new ErrorHandler("You already purchased this course", 400));
      }

      const course = await courseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("Course not found", 400));
      }

      const data: any = {
        courseId: course._id,
        userId: user?._id,
        payment_info,
      };

      const mailData: any = {
        order: {
          _id: course._id.toString().slice(0, 6),
          name: course.name,
          price: course.price,
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
      };

      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/order-confirmation.ejs"),
        { order: mailData }
      );

      try {
        if (user) {
          await sendMail({
            email: user.email,
            subject: "Order Confirmation",
            template: "order-confirmation.ejs",
            data: mailData,
          });
        }
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }

      user?.courses.push(course?._id);

      await user.save();

      await notificationModel.create({
        user: user?._id,
        title: "New Order",
        message: `You have a new order from ${course?.name}`,
      });

      if (course && course.purchased !== undefined) {
        course.purchased += 1;
        // Now 'course.purchased' has been incremented in-memory
      } else {
        console.error("Course not found or purchased field is missing.");
      }

      await course.save();

      await newOrderServices(data, res, next);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
