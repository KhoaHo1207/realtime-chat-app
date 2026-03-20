import authRoutes from "./auth.route.js";
import userRoutes from "./user.route.js";

const initRoute = (app) => {
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/user", userRoutes);
};

export default initRoute;
