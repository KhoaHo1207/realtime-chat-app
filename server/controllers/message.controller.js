import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { catchAsyncError } from "../middleware/catchAsyncError.middleware.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllUsers = catchAsyncError(async (req, res, next) => {
  const user = req.user;

  const filterUsers = await User.find({ _id: { $ne: user._id } }).select(
    "fullName email avatar"
  );

  return res.status(200).json({
    success: true,
    message: "All users fetched successfully",
    results: {
      users: filterUsers,
    },
  });
});

export const getMessages = catchAsyncError(async (req, res, next) => {
  const receiverId = req.params.id;
  const myId = req.user._id;
  const receiver = await User.findById(receiverId).select(
    "fullName email avatar"
  );

  if (!receiver) {
    return res.status(404).json({
      success: false,
      message: "Reciever not found",
    });
  }

  const messages = await Message.find({
    $or: [
      { senderId: myId, receiverId: receiverId },
      { senderId: receiverId, receiverId: myId },
    ],
  });

  return res
    .status(200)
    .json({
      success: true,
      message: "Messages fetched successfully",
      results: {
        messages,
      },
    })
    .sort({ createdAt: 1 });
});

export const sendMessage = catchAsyncError(async (req, res, next) => {
  const { text } = req.body;
  const media = req?.files?.media;
  const { id: receiverId } = req.params;
  const myId = req.user._id;
  const receiver = await User.findById(receiverId).select(
    "fullName email avatar"
  );

  if (!receiver) {
    return res.status(404).json({
      success: false,
      message: "Receiver not found",
    });
  }

  const sanitizedText = text?.trim() || "";

  if (!sanitizedText && !media) {
    return res.status(400).json({
      success: false,
      message: "Please provide either text or media",
    });
  }

  let mediaUrl = "";

  if (media) {
    try {
      const cloudinaryResponse = await cloudinary.uploader.upload(
        media.tempFilePath,
        {
          folder: "realtime-chat-app/media",
          transformation: [
            {
              width: 1080,
              height: 1080,
              crop: "limit",
            },
            {
              quality: "auto",
            },
            {
              fetch_format: "auto",
            },
          ],
          resource_type: "auto", //auto-detecy image/video
        }
      );
      mediaUrl = cloudinaryResponse?.secure_url;
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Error uploading media",
        error: error.message || "Failed to upload media",
      });
    }
  }

  const message = await Message.create({
    senderId: myId,
    receiverId: receiverId,
    text: sanitizedText,
    media: mediaUrl,
  });

  return res.status(201).json({
    success: true,
    message: "Message sent successfully",
  });
});
