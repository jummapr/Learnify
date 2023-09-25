require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import cloudinary from "cloudinary";
import courseModal, {ICourse} from "../models/course.model";
import ErrorHandler from "../utils/ErrorHandler";
import { catchAsyncError } from "../middleware/catchAsycnErrors";
import { redis } from "../utils/redis";
import { IGetUserAuthInfoRequest } from "../middleware/auth";
import { createCourse } from "../services/course.service";

// upload course
export const uploadCourse = catchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body;
            const thumbnail = data.thumbnail;

            if(thumbnail) {
                const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                    folder: "courses",
                });

                data.thumbnail = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                }
            }

            await createCourse(data, res,next);

        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);


// edit course

export const editCourse = catchAsyncError(
    async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
        try {
             const data = req.body;
             const thumbnail = data.thumbnail;
             if(thumbnail) {
                await cloudinary.v2.uploader.destroy(thumbnail.public_id);
                 const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                     folder: "courses",
                 });

                 data.thumbnail = {
                     public_id: myCloud.public_id,
                     url: myCloud.secure_url,
                 }
             }

             const courseId = req.params.id;
             const course = await courseModal.findByIdAndUpdate(courseId, {
                $set: data,
                new: true
             });

             res.status(201).json({
                success: true,
                course
             })

        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
)
