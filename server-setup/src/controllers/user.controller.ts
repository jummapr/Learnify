require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import userModal, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { catchAsyncError } from "../middleware/catchAsycnErrors";
import jwt from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";

// register users

interface IRegistrationBody {
  name: string;
  email: string;
  password: string;

  avatar?: string;
}

interface IActivationToken {
  token: string;
  activationCode: string;
}

export const registrationUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;

      const isEmailExist = await userModal.findOne({ email });

      if (isEmailExist) {
        return next(new ErrorHandler("Email already exist", 400));
      }

      const user: IRegistrationBody = {
        name,
        email,
        password,
      };

      const activationToken = createActivationToken(user);

      const activationCode = activationToken.activationCode;

      const data = {
        user: {
          name: user.name,
        },
        activationCode,
      };

      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/activation.mail.ejs"),
        data
      );

      try {
        await sendMail({
          email: user.email,
          subject: "Activate your account",
          template: "activation.mail.ejs",
          data,
        });

        res.status(201).json({
          success: true,
          message: `Please check your email: ${user.email} to activate your account`,
          activationToken: activationToken.token,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const createActivationToken = (user: any): IActivationToken => {
  function generateOTP() {
    const digits = "0123456789";

    const otpLength = 6;

    let otp = "";

    for (let i = 1; i <= otpLength; i++) {
      const index = Math.floor(Math.random() * digits.length);

      otp = otp + digits[index];
    }

    return otp;
  }
  const activationCode = generateOTP();

  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    process.env.ACTIVATION_SECRET,
    {
      expiresIn: "5m",
    }
  );

  return { token, activationCode };
};

// Activation user

interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

export const activateUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code }: IActivationRequest =
        req.body;

      const newUser: { user: IUser; activationCode: string } = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string
      ) as { user: IUser; activationCode: string };

      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid activation code", 400));
      }

      const { name, email, password } = newUser.user;

      const existUser = await userModal.findOne({ email });

      if (existUser) {
        return next(new ErrorHandler("User already exist", 400));
      }

      const user = await userModal.create({
        name,
        email,
        password,
      });

      res.status(201).json({
        success: true,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
