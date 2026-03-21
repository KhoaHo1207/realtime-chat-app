import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import {
  getAllUsers,
  getMessages,
  sendMessage,
} from "../controllers/message.controller.js";
const router = express.Router();

router.use(isAuthenticated);
router.get("/all-users", getAllUsers);
router.get("/:id", getMessages);
router.post("/send/:id", sendMessage);
export default router;
