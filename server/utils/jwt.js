import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

const generateToken = async (userId) => {
  return await jwt.sign({ userId }, ENV.JWT_SECRET_KEY, {
    expiresIn: ENV.JWT_EXPIRE,
  });
};

export { generateToken };
