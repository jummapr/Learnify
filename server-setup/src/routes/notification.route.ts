import { getNotification, updateNotificationStatus } from "../controllers/notification.controller";
import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
const notification = express.Router();

notification.get("/get-all-notification",isAuthenticated, authorizeRoles("admin"),getNotification)
notification.patch("/update-notification/:id",isAuthenticated, authorizeRoles("admin"),updateNotificationStatus)

export default notification;