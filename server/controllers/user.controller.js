import { catchAsyncError } from "../middleware/catchAsyncError.middleware.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { emailRegex } from "../utils/helpers.js";

export const signup = catchAsyncError(async (req, res, next) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide all fields",
    });
  }
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email address",
    });
  }

  if (fullName.length < 3 || fullName.length > 30) {
    return res.status(400).json({
      success: false,
      message: "Fullname must be between 3 and 30 characters",
    });
  }

  if (password.length < 8 || password.length > 32) {
    return res.status(400).json({
      success: false,
      message: "Password must be between 8 and 32 characters",
    });
  }

  const isEmailExist = await User.findOne({ email });

  if (isEmailExist) {
    return res.status(409).json({
      success: false,
      message: "Email already existed",
    });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassowrd = await bcrypt.hash(password, salt);

  const user = await User.create({
    fullName,
    email,
    password: hashedPassowrd,
    avatar: {
      public_id: "",
      url: "",
    },
  });

  return res.status(201).json({
    success: true,
    message: "User created successfully",
  });
});

export const signin = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "PLease provide all fields",
    });
  }

  
});
