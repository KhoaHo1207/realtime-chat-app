import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { getUser, updateProfile } from "../controllers/user.controller.js";

const router = express.Router();

router.use(isAuthenticated);
router.get("/me", getUser);
router.put("/update-profile", updateProfile);

export default router;
