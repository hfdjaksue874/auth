import mongoose, { mongo } from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();

const dbUrl = process.env.DATABASE_URL;

const connectDb = async ()=>{
    try {
        await mongoose.connect(dbUrl)
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(error)
        
    }
}

export default connectDb;
