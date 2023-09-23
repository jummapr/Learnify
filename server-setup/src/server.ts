import connectDB from "./utils/db";
import cloudinary from "cloudinary";
import { app } from "./app";
import * as dotenv from "dotenv";

dotenv.config();

// cloudinary config
cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY
})

// create Server

app.listen(process.env.PORT, () => {
    console.log(`Server is connected with port ${process.env.PORT}`);
    connectDB()
})