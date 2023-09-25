import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { editCourse, uploadCourse } from "../controllers/course.controller";
import express from "express";



const courseRouter = express.Router();

courseRouter.post("/create-course",isAuthenticated,authorizeRoles("admin"), uploadCourse);
courseRouter.patch("/edit-course/:id",isAuthenticated,authorizeRoles("admin"), editCourse);

export default courseRouter;
