import { createOrder } from "../controllers/order.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import express from "express";

const orderRouter = express.Router();

orderRouter.post("/create-order",isAuthenticated, createOrder);

export default orderRouter;
