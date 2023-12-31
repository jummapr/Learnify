import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { addAnswer, addQuestion, addReplayToReview, addReview, deleteCourse, editCourse, getAllCourse, getAllCourses, getCourseContent, getSingleCourse, uploadCourse } from "../controllers/course.controller";
import express from "express";



const courseRouter = express.Router();

courseRouter.post("/create-course",isAuthenticated,authorizeRoles("admin"), uploadCourse);
courseRouter.patch("/edit-course/:id",isAuthenticated,authorizeRoles("admin"), editCourse);
courseRouter.get("/get-course/:id", getSingleCourse);
courseRouter.get("/get-courses", getAllCourse);

courseRouter.get("/get-course-content/:id", isAuthenticated, getCourseContent);
courseRouter.patch("/add-question", isAuthenticated, addQuestion);
courseRouter.patch("/add-answer", isAuthenticated, addAnswer);
courseRouter.patch("/add-review/:id", isAuthenticated, addReview);
courseRouter.patch("/add-replay", isAuthenticated, authorizeRoles("admin"), addReplayToReview);
courseRouter.get("/get-course", isAuthenticated, authorizeRoles("admin"), getAllCourses);
courseRouter.delete("/delete-course/:id", isAuthenticated, authorizeRoles("admin"), deleteCourse);



export default courseRouter;
