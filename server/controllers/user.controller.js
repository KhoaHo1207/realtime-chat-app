import { catchAsyncError } from "../middleware/catchAsyncError.middleware.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { emailRegex } from "../utils/helpers.js";
import { generateToken } from "../utils/jwt.js";
import { ENV } from "../config/env.js";
import cloudinary from "../lib/cloudinary.js";
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

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(400).json({
      success: false,
      message: "Invalid password",
    });
  }

  const token = await generateToken(user._id);

  return res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      secure: ENV.NODE_ENV === "production",
      maxAge: ENV.COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    })
    .json({
      success: true,
      message: "Signed in successfully",
    });
});

export const signout = catchAsyncError(async (req, res, next) => {
  return res
    .status(200)
    .cookie("token", "", {
      httpOnly: true,
      secure: ENV.NODE_ENV === "production",
      maxAge: 0,
      sameSite: "strict",
    })
    .json({
      success: true,
      message: "Signed out successfully",
    });
});

export const getUser = catchAsyncError(async (req, res, next) => {
  const user = req.user;

  return res.status(200).json({
    success: true,
    message: "User fetched successfully",
    results: {
      user,
    },
  });
});

export const updateProfile = catchAsyncError(async (req, res, next) => {
  const { fullName, email } = req.body;

  if (fullName.trim().length === 0 || email.trim().length === 0) {
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
  const avatar = req?.files?.avatar;
  let cloudinaryResponse = {};

  if (avatar) {
    try {
      const oldAvatarPublicId = req.user?.avatar?.public_id;
      if (oldAvatarPublicId && oldAvatarPublicId.length > 0) {
        await cloudinary.uploader.destroy(oldAvatarPublicId);
      }
      cloudinaryResponse = await cloudinary.uploader.upload(
        avatar.tempFilePath,
        {
          folder: "realtime-chat-app/avatars",
          transformation: [
            {
              width: 300,
              height: 300,
              crop: "limit",
            },
            {
              quality: "auto",
            },
            {
              fetch_format: "auto",
            },
          ],
        }
      );
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Error uploading avatar",
        error: error.message || "Failed to upload avatar",
      });
    }
  }

  let data = {
    fullName,
    email,
  };

  if (avatar && cloudinaryResponse?.public_id && cloudinaryResponse?.url) {
    data.avatar = {
      public_id: cloudinaryResponse?.public_id,
      url: cloudinaryResponse?.url,
    };
  }

  let user = await User.findByIdAndUpdate(req.user._id, data, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    results: {
      user,
    },
  });
});
