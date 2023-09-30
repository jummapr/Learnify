// get user by id

import { Response } from "express";
import userModal from "../models/user.model";
import { redis } from "../utils/redis";

export const getUserById = async (id: string, res: Response) => {
  try {
    const userJson = await redis.get(id);

    if (userJson) {
      const user = JSON.parse(userJson);
      res.status(200).json({
        success: true,
        user,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    console.error("Error fetching user from Redis:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get All Users

export const getAllUsersServices = async (res:Response) => {
  const users = await userModal.find().sort({createdAt: -1});

  res.status(200).json({
    success: true,
    users
  })
}

// user update the role -- only for admin
export const updateUserRoleServices = async (res:Response, id: string , role: string) => {
  const user = await userModal.findByIdAndUpdate(id, {role},{new: true});

  res.status(200).json({
    success: true,
    user
  })
}