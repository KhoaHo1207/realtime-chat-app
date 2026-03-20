import express from "express";
import { signin, signout, signup } from "../controllers/user.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
const router = express.Router();
//public routes
router.post("/sign-up", signup);
router.post("/sign-in", signin);
//middleware
router.use(isAuthenticated);

//private routes
router.post("/sign-out", signout);
export default router;
