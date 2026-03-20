import mongoose from "mongoose";
import { ENV } from "../config/env.js";
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(ENV.MONGO_URI);
    console.log(`Connected to MongoDB: ${conn.connection.host}`);
  } catch (error) {
    console.log("Connection to MongoDB failed");
    process.exit(1);
  }
};

export default connectDB;
