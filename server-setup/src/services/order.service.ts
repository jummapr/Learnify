import { Request, Response, NextFunction } from "express";
import { catchAsyncError } from "../middleware/catchAsycnErrors";
import orderModel from "../models/order.model";

// create new Order

export const newOrderServices = catchAsyncError(
  async (
    data: any,
    res: Response,
    next: NextFunction,
  ) => {
    const order = await orderModel.create(data)
    res.status(200).json({
      success: true,
      order,
  })
  }
);
