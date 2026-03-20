import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

const generateToken = (userId) => {
  return jwt.sign({ userId }, ENV.JWT_SECRET_KEY, {
    expiresIn: ENV.JWT_EXPIRE,
  });
};

export { generateToken };
