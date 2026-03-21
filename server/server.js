import express from "express";
import { ENV } from "./config/env.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import cors from "cors";
import connectDB from "./database/db.js";
import initRoute from "./routes/index.route.js";
import http from "http";
import { initSocket } from "./utils/socket.js";

const expressApp = express();
const server = http.createServer(expressApp);

initSocket(server);

expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));
expressApp.use(cookieParser());
expressApp.use(
  cors({
    origin: [ENV.FRONTEND_URL, "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

expressApp.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./temp/",
  })
);

connectDB();
initRoute(expressApp);

expressApp.get("/", (req, res) => {
  return res.send(`Fucking bitch, ${server.address().port}!`);
});

server.listen(ENV.PORT, () => {
  console.log(`Server is running on port: ${server.address().port}`);
});
