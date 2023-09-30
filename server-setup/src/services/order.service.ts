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

// Get All orders 
export const getAllOrdersServices = async (res:Response) => {
  const orders = await orderModel.find().sort({createdAt: -1});

  res.status(200).json({
    success: true,
    orders
  })
}
