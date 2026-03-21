import authRoutes from "./auth.route.js";
import userRoutes from "./user.route.js";
import messageRoutes from "./message.route.js";

const initRoute = (app) => {
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/user", userRoutes);
  app.use("/api/v1/message", messageRoutes);
};

export default initRoute;
