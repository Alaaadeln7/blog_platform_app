import cloudinary from "../config/cloudinary.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../middlewares/generateToken.js";
import {
  signUpvalidationSchema,
  loginValidationSchema,
} from "../config/validationAuth.js";
import { ERROR, FAILED, SUCCESS } from "../config/statusText.js";

export const register = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ status: ERROR, message: "No data provided" });
  }
  const { fullName, email, password } = req.body;
  try {
    const validData = await signUpvalidationSchema.validate(req.body, {
      abortEarly: false,
    });
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ status: FAILED, message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ fullName, email, password: hashPassword });
    if (newUser) {
      await newUser.save();
      const user = await User.findById(newUser._id).select("-__v");
      generateToken(user._id, res);
      return res.status(201).json({ status: SUCCESS, data: user });
    } else {
      return res
        .status(400)
        .json({ status: ERROR, message: "Invalid User Data" });
    }
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ status: ERROR, message: error.errors });
    } else {
      console.error(error.message);
      return res
        .status(500)
        .json({ status: ERROR, message: "Internal Server Error" });
    }
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const validData = await loginValidationSchema.validate(req.body, {
      abortEarly: false,
    });

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: FAILED,
        message: "User not found, please sign up first",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        status: FAILED,
        message: "Incorrect email or password",
      });
    }
    generateToken(user._id, res);
    return res.status(200).json({ status: SUCCESS, data: { user } });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ status: ERROR, message: "Internal Server Error" });
  }
};
export const update = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ status: ERROR, message: "No data provided" });
  }
  const { fullName, email } = req.body;
  try {
    const userExists = User.find({ email });
    if (!userExists) {
      return res
        .status(400)
        .json({ status: FAILED, message: "User has already been exist" });
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { fullName, email },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ status: ERROR, message: "User not found" });
    }
    return res.status(200).json({ status: SUCCESS, data: user });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ status: ERROR, message: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    return res
      .status(200)
      .json({ status: SUCCESS, message: "Logged out Successfully" });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ status: ERROR, message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { avatar } = req.body;
    const userId = req.user._id;
    if (!avatar) {
      return res
        .status(400)
        .json({ status: ERROR, message: "Profile avatar is required" });
    }
    const uploadResponse = await cloudinary.uploader.upload(avatar);
    const updateUser = await User.findByIdAndUpdate(
      userId,
      {
        avatar: uploadResponse.secure_url,
      },
      { new: true }
    );
    return res.status(200).json({ status: SUCCESS, data: { updateUser } });
  } catch (error) {
    console.error("Error in update avatar", error.message);
    return res
      .status(500)
      .json({ status: ERROR, message: "Internal Server Error" });
  }
};
export const checkAuth = (req, res) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ status: ERROR, message: "Internal Server Error" });
  }
};
