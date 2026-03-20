import authRoutes from "./auth.route.js";

const initRoute = (app) => {
  app.use("/api/v1/auth", authRoutes);
};

export default initRoute;
