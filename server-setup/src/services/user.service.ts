

// get user by id

import { Response } from "express";
import userModal from "../models/user.model"

 
export const getUserById = async (id: string,res:Response) => {
    const user  = await userModal.findById(id);

    res.status(200).json({
        success: true,
        user
    })
}