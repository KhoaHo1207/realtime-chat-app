import express from "express";
import { ENV } from "./config/env.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import cors from "cors";
import connectDB from "./database/db.js";
import initRoute from "./routes/index.route.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: [ENV.FRONTEND_URL, "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./temp/",
  })
);

connectDB();
initRoute(app);

app.get("/", (req, res) => {
  return res.send(`Fucking bitch, ${ENV.PORT}!`);
});

app.listen(ENV.PORT, () => {
  console.log(`Server is running on port: ${ENV.PORT}`);
});
