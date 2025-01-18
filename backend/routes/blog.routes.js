import express from "express";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  makeComment,
  makeLike,
} from "../controllers/blog.controller.js";
// import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create", createBlog);
router.get("/", getAllBlogs);
router.post("/like", makeLike);
router.post("/comment", makeComment);
router.delete("/delete", deleteBlog);
export default router;
