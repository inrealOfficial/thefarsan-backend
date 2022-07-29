import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import Reset from "../Templates/reset.js";

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isEmailVerified: user.isEmailVerified,
      isPhoneNumberVerified: user.isPhoneNumberVerified,
      phoneNumber: user.phoneNumber,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or password");
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    isGuest,
    phoneNumber,
    isPhoneNumberVerified,
    isEmailVerified,
  } = req.body;
  if (isGuest) {
    const user = await User.create({
      name,
      email,
    });
    if (user) {
      res.status(201);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isEmailVerified: user.isEmailVerified,
        isPhoneNumberVerified: user.isPhoneNumberVerified,
        phoneNumber: user.phoneNumber,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid User data");
    }
  } else {
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User Already Exixts");
    }
    const user = await User.create({
      name,
      email,
      password,
      isGuest,
      isEmailVerified,
      phoneNumber,
      isPhoneNumberVerified,
    });

    if (user) {
      res.status(201);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        phoneNumber: user.phoneNumber,
        isEmailVerified: user.isEmailVerified,
        isPhoneNumberVerified: user.isPhoneNumberVerified,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid User data");
    }
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      isGuest: user.isGuest,
      isEmailVerified: user.isEmailVerified,
      isPhoneNumberVerified: user.isPhoneNumberVerified,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("No User Found");
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    (user.name = req.body.name || user.name),
      (user.email = req.body.email || user.email);
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      phoneNumber: user.phoneNumber,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("No User Found");
  }
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.json(users);
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.remove();
    res.json({ message: "User deleted sucessfully" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const getUserByID = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const resetUpdatePassword = asyncHandler(async (req, res) => {
  const { id, token, password } = req.body;
  const user = await User.findById(id);
  if (user) {
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user.password = password;
        const updatedUser = await user.save();
        res.status(200);
        res.json({ message: "Password Updated Sucessfully" });
      } catch (error) {
        res.status(401);
        throw new Error("Not authorized, token failed");
      }
    }
    if (!token) {
      res.status(401);
      throw new Error("Not Authorized, No Token Found");
    }
  } else {
    res.status(400);
    throw new Error("Not Valid");
  }
});

const resetUserPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    let transporter = nodemailer.createTransport({
      host: "smtpout.secureserver.net",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "info@thefarsan.in", // generated ethereal user
        pass: "Thefarsan@info", // generated ethereal password
      },
    });

    let info = await transporter.sendMail(
      {
        from: '"The Farsan" <info@thefarsan.in>', // sender address
        to: `${email}`, // list of receivers
        subject: "Reset Password Link", // Subject line
        text: "Hello", // plain text body
        html: `${Reset(
          `https://thefarsan.in/reset/${userExists._id}/${generateToken(
            userExists._id
          )}`
        )}`,
      },
      (err, info) => {
        if (err) {
          return console.log(err);
        } else {
          console.log("Message sent: %s", info.messageId);
        }
      }
    );
    res.status(200);
    res.json({ message: "Reset Email Has been sent sucessfulyy" });
  } else {
    res.status(400);
    throw new Error("No user found with that email");
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    (user.name = req.body.name || user.name),
      (user.email = req.body.email || user.email);
    user.isAdmin = req.body.isAdmin;
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("No User Found");
  }
});

export {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserByID,
  updateUser,
  resetUserPassword,
  resetUpdatePassword,
};
