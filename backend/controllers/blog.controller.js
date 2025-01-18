import { ERROR, SUCCESS } from "../config/statusText.js";
import Blog from "../models/blog.model.js";
import User from "../models/user.model.js";
import cloudinary from "cloudinary";

const isEmpty = (obj) => !obj || Object.keys(obj).length === 0;

export const createBlog = async (req, res) => {
  try {
    const { title, description, userId, image } = req.body;

    if (!title || !description || !userId) {
      return res.status(400).json({
        status: "ERROR",
        message: "Please provide all required fields.",
      });
    }

    const user = await User.findById(userId).select("-password -email");
    if (!user) {
      return res
        .status(404)
        .json({ status: "ERROR", message: "User not found." });
    }

    let imageUrl = null;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: "blogs",
      });
      imageUrl = uploadResponse.secure_url;
    }

    const newBlog = await Blog.create({
      title,
      description,
      creator: userId,
      image: imageUrl,
    });

    res.status(201).json({ status: "SUCCESS", data: newBlog });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ status: "ERROR", message: "Server Error" });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("creator", "fullName avatar _id")
      .populate({
        path: "comments.creator",
        select: "fullName avatar",
      })
      .sort({ createdAt: -1 });
    res.status(200).json({ status: SUCCESS, data: blogs });
  } catch (error) {
    res.status(500).json({ status: ERROR, message: error.message });
  }
};
export const deleteBlog = async (req, res) => {
  const { blogId } = req.body;
  if (!blogId) {
    return res
      .status(400)
      .json({ status: ERROR, message: "Blog ID is required." });
  }
  try {
    const deletedBlog = await Blog.findByIdAndDelete(blogId);
    if (!deletedBlog) {
      return res
        .status(404)
        .json({ status: ERROR, message: "Blog not found." });
    }
    res
      .status(200)
      .json({ status: SUCCESS, message: "Blog deleted successfully." });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ status: ERROR, message: "Server Error" });
  }
};

export const makeLike = async (req, res) => {
  if (isEmpty(req.body)) {
    return res.status(400).json({ status: ERROR, message: "No data provided" });
  }
  const { userId, blogId } = req.body;
  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ status: ERROR, message: "Blog not found" });
    }
    if (blog.likes.includes(userId)) {
      blog.likes.pull(userId);
      await blog.save();
      return res.status(200).json({ status: SUCCESS, message: "Blog unliked" });
    } else {
      blog.likes.push(userId);
      await blog.save();
      return res.status(200).json({ status: SUCCESS, message: "Blog liked" });
    }
  } catch (error) {
    return res.status(500).json({ status: ERROR, message: error.message });
  }
};

export const makeComment = async (req, res) => {
  if (isEmpty(req.body)) {
    return res.status(400).json({ status: ERROR, message: "No data provided" });
  }
  const { userId, comment, blogId } = req.body;
  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ status: ERROR, message: "Blog not found" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: ERROR, message: "User not found" });
    }
    blog.comments.push({ creator: userId, comment });
    await blog.save();

    res.status(200).json({ status: SUCCESS, message: "Comment added" });
  } catch (error) {
    res.status(500).json({ status: ERROR, message: error.message });
  }
};
