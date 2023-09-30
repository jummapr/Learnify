import { Response } from "express";
import courseModel from "../models/course.model";
import { catchAsyncError } from "../middleware/catchAsycnErrors";

// create course 
export const createCourse = catchAsyncError(
    async (data: any,res: Response) => {
        const course = await courseModel.create(data);

        res.status(201).json({
            success: true,
            course
        })
    }
)
// Get All course
export const getAllCourseServices = async (res:Response) => {
    const course = await courseModel.find().sort({createdAt: -1});
  
    res.status(200).json({
      success: true,
      course
    })
  }