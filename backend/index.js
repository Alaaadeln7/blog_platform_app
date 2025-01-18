import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connection_DB from "./config/db.js";
import path from "path";
const app = express();
const port = process.env.PORT || 8080;
const __dirname = path.resolve();
config();
const frontend = "http://localhost:5173";
app.use(
  cors({
    origin: frontend,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
connection_DB();

import authRoutes from "./routes/auth.routes.js";
import blogsRoutes from "./routes/blog.routes.js";
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogsRoutes);
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}
app.listen(port, () => {
  console.log(`app running in port http://localhost:${port}`);
});
