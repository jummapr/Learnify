require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import cloudinary from "cloudinary";
import courseModal, { ICourse } from "../models/course.model";
import ErrorHandler from "../utils/ErrorHandler";
import { catchAsyncError } from "../middleware/catchAsycnErrors";
import { redis } from "../utils/redis";
import { IGetUserAuthInfoRequest } from "../middleware/auth";
import { createCourse } from "../services/course.service";
import mongoose from "mongoose";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMail";
import notificationModel from "../models/notification.model";

// upload course
export const uploadCourse = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;

      if (thumbnail) {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      await createCourse(data, res, next);
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
      if (thumbnail) {
        await cloudinary.v2.uploader.destroy(thumbnail.public_id);
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "courses",
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      const courseId = req.params.id;
      const course = await courseModal.findByIdAndUpdate(courseId, {
        $set: data,
        new: true,
      });

      res.status(201).json({
        success: true,
        course,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get single course -- without purchasing

export const getSingleCourse = catchAsyncError(
  async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;

      const isCachedExist = await redis.get(courseId);

      //   console.log("Hitting redis")
      if (isCachedExist) {
        const course = JSON.parse(isCachedExist);

        res.status(200).json({
          success: true,
          course,
        });
      } else {
        const course = await courseModal
          .findById(req.params.id)
          .select(
            "-courseData.videoUrl -courseData.suggestion -courseData.question -courseData.links"
          );

        //   console.log("Hitting Mongodb")

        await redis.set(courseId, JSON.stringify(course));

        res.status(201).json({
          success: true,
          course,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get all course
export const getAllCourse = catchAsyncError(
  async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    try {
      const isCachedExist = await redis.get("allCourses");
      console.log("Hitting redis");
      if (isCachedExist) {
        const course = JSON.parse(isCachedExist);
        res.status(200).json({
          success: true,
          course,
        });
      } else {
        const course = await courseModal
          .find()
          .select(
            "-courseData.videoUrl -courseData.suggestion -courseData.question -courseData.links"
          );

        console.log("Hitting Mongodb");
        await redis.set("allCourses", JSON.stringify(course));

        res.status(200).json({
          success: true,
          course,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get course content ---only for valid users

export const getCourseContent = catchAsyncError(
  async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req?.user?.courses;
      const courseId = req.params.id;

      const courseExist = userCourseList?.find(
        (course: any) => course._id === courseId
      );

      if (!courseExist) {
        return next(
          new ErrorHandler("Your are not eligible to access this course", 404)
        );
      }

      const course = await courseModal.findById(courseId);

      const content = await course?.courseData;

      res.status(200).json({
        success: true,
        content,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// add question in course
interface IAddQuestionData {
  question: string;
  courseId: string;
  contentId: string;
}

export const addQuestion = catchAsyncError(
  async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    try {
      const { question, courseId, contentId }: IAddQuestionData = req.body;
      const course = await courseModal.findById(courseId);

      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid content id", 404));
      }

      const courseContent = course?.courseData?.find((item: any) =>
        item._id.equals(contentId)
      );

      if (!courseContent) {
        return next(new ErrorHandler("Invalid content id", 404));
      }

      //   create a new questions object
      const newQuestions: any = {
        user: req.user,
        question,
        questionReplies: [],
      };

      // add this question to our course content
      courseContent.questions.push(newQuestions);

      await notificationModel.create({
        user:req.user?._id,
        title: "New Question Received",
        message: `You have a new question in ${courseContent?.title}`,
      });

      // save the update course

      await course.save();

      res.status(201).json({
        success: true,
        course,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// add answer in course

interface IAddAnswerData {
  answer: string;
  courseId: string;
  contentId: string;
  questionId: string;
}

export const addAnswer = catchAsyncError(
  async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    try {
      const { answer, courseId, contentId, questionId }: IAddAnswerData =
        req.body;

      const course = await courseModal.findById(courseId);

      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid content id", 404));
      }

      const courseContent = course?.courseData?.find((item: any) =>
        item._id.equals(contentId)
      );

      if (!courseContent) {
        return next(new ErrorHandler("Invalid content id", 404));
      }

      const question = courseContent?.questions?.find((item: any) =>
        item._id.equals(questionId)
      );

      if (!question) {
        return next(new ErrorHandler("Invalid question id", 404));
      }

      //   create new answer object
      const newAnswer: any = {
        user: req.user,
        answer,
      };

      // add this answer to course course content
      question.questionReplies.push(newAnswer);

      // save the update course
      await course.save();

      if (req.user?._id === question.user?._id) {
        // create notification
        await notificationModel.create({
          user:req.user?._id,
          title: "New Question replay Received",
          message: `You have a new question replay in ${courseContent?.title}`,
        });
      } else {
        const data = {
          name: question.user.name,
          title: courseContent.title,
        };

        const html = await ejs.renderFile(
          path.join(__dirname, "../mails/question-replay.ejs"),
          data
        );

        try {
          await sendMail({
            email: question.user.email,
            subject: "Question replay",
            template: "question-replay.ejs",
            data,
          });
        } catch (error: any) {
          return next(new ErrorHandler(error.message, 500));
        }
      }
      res.status(201).json({
        success: true,
        course,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// add review in course

interface IAddReviewData {
  review: string;
  courseId: string;
  rating: number;
  userId: string;
}

export const addReview = catchAsyncError(
  async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user.courses;

      const courseId = req.params.id;

      // if check courseId is already exist in userCourseList based on _id

      const courseExist = userCourseList?.some(
        (course: any) => course._id.toString() === courseId.toString()
      );

      if (!courseExist) {
        return next(
          new ErrorHandler("You are not eligible to access this course", 404)
        );
      }

      const course = await courseModal.findById(courseId);

      const { review, rating } = req.body as IAddReviewData;

      const reviewData: any = {
        user: req.user,
        comment: review,
        rating,
      };

      course.reviews.push(reviewData);

      let avg = 0;

      course.reviews.forEach((rev: any) => {
        avg += rev.rating;
      });

      if (course) {
        course.ratings = avg / course?.reviews.length;
      }

      await course.save();

      const notification = {
        title: "New Review Received.",
        message: `${req.user?.name} has given in ${course?.name}`,
      };

      // create notification

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// add replay on review --- only Admin can replay
interface IAddReviewReplayData {
  comment: string;
  courseId: string;
  reviewId: string;
}
export const addReplayToReview = catchAsyncError(
  async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    try {
      const { comment, courseId, reviewId }: IAddReviewReplayData = req.body;

      const course = await courseModal.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("Invalid course id", 404));
      }

      const review = course?.reviews?.find(
        (rev: any) => rev._id.toString() === reviewId
      );

      if(!review) {
        return next(new ErrorHandler("Review Not found", 404));
      };

      const replayData: any ={
        user: req.user,
        comment
      };

      if(!review.commentReplies) {
        review.commentReplies = [];
      }

      review.commentReplies.push(replayData);

      await course?.save();

      res.status(200).json({
        success: true,
        course
      })


    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
