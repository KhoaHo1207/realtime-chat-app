import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import User from "../models/user.model.js";
import { catchAsyncError } from "./catchAsyncError.middleware.js";
export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthenticated",
    });
  }

  const decoded = jwt.verify(token, ENV.JWT_SECRET_KEY);

  if (!decoded) {
    return res.status(500).json({
      success: false,
      message: "Invalid token",
    });
  }

  const user = await User.findById(decoded.userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  req.user = user;

  next();
});
