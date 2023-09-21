import connectDB from "./utils/db";
import { app } from "./app";
import * as dotenv from "dotenv";

dotenv.config();



// create Server

app.listen(process.env.PORT, () => {
    console.log(`Server is connected with port ${process.env.PORT}`);
    connectDB()
})