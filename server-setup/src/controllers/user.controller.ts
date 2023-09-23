require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import userModal, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { catchAsyncError } from "../middleware/catchAsycnErrors";
import jwt, { JwtPayload } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import { accessTokenOptions, refreshTokenOptions, sendToken } from "../utils/jwt";
import { redis } from "../utils/redis";
import { IGetUserAuthInfoRequest } from "../middleware/auth";
import { getUserById } from "../services/user.service";

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

// login users

interface ILoginRequest {
  email: string;
  password: string;
}

export const loginUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password }: ILoginRequest = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400));
      }

      const user = await userModal.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }

      const isPasswordMatch = await user.comparePassword(password);

      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }

      sendToken(user, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// logout user
export const logoutUser = catchAsyncError(async (req:IGetUserAuthInfoRequest,res:Response,next:NextFunction) => {
    try {
      res.cookie("access_token","",{
        maxAge: 1
      });
      res.cookie("refresh_token","",{
        maxAge: 1
      });
      const userId= req.user._id
      // console.log("UserId",userId)
     await redis.del(userId)

      res.status(200).json({
        success: true,
        message: "User logged out"
      })
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
});


// update access token
export const updateAccessToken = catchAsyncError(async (req:IGetUserAuthInfoRequest,res:Response,next:NextFunction) => {
  try {
    const refresh_token = req.cookies.refresh_token as string;
    const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN as string) as JwtPayload;

    const message = `could not refresh token`;
    if(!decoded) {
      return next(new ErrorHandler(message, 400));
    }

    const session = await redis.get(decoded.id as string);

    if(!session) {
      return next(new ErrorHandler(message, 400));
    }

    const user = JSON.parse(session);

    const accessToken = jwt.sign({id:user._id},process.env.ACCESS_TOKEN as string, {
      expiresIn: "5m"
    });

    const refreshToken = jwt.sign({id:user._id},process.env.REFRESH_TOKEN as string, {
      expiresIn: "7d"
    });

    res.cookie("access_token",accessToken,accessTokenOptions);
    res.cookie("refresh_token",refreshToken,refreshTokenOptions);

    res.status(200).json({
      status: "success",
      accessToken
    })

  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
    
  }
});


// get user info

export const getUserInfo = catchAsyncError(async (req:IGetUserAuthInfoRequest,res:Response,next:NextFunction) => {
  try {
    const userId = req.user._id;
    await getUserById(userId,res)
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});


// social auth

interface ISocialLogin {
  email: string;
  name: string;
  avatar: string;
}

export const socialAuth = catchAsyncError(async (req:IGetUserAuthInfoRequest,res:Response,next:NextFunction) => {
  try {
    const {email,name,avatar}:ISocialLogin = req.body;

    const user = await userModal.findOne({email});

    if(!user) {
      const newUser = await userModal.create({
        email,
        name,
        avatar
      });
      sendToken(newUser,200,res)
    } else {
      sendToken(user,200,res)
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
    
  }
})
