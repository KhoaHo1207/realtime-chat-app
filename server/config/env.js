import dotnev from "dotenv";
dotnev.config();

export const ENV = {
  MONGO_URI: process.env.MONGO_URI,
  PORT: process.env.PORT,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  JWT_EXPIRE: process.env.JWT_EXPIRE,
  COOKIE_EXPIRE: process.env.COOKIE_EXPIRE,
  NODE_ENV: process.env.NODE_ENV,
  FRONTEND_URL: process.env.FRONTEND_URL,
};
