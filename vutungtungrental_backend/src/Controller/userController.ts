import { error } from "console";
import {
  createUser,
  deleteUserModal,
  getALlUserMdoal,
  getUserByEmail,
  getUserByIdModal,
  getUserByUsername,
  pendingUserModal,
  updateUserModal,
} from "../Modal/userModal";
import { Request, Response } from "express";

// Extend express-session types to include 'email' and 'pendingUserData' in SessionData
declare module "express-session" {
  interface SessionData {
    email?: string;
    pendingUserData?: any;
  }
}
import {
  createOwner,
  getSpecificAdmin,
  updateAdmin,
} from "../Modal/adminModal";
import { createAdmin } from "./adminController";
import dotenv from "dotenv";
import transporter from "../userRegisterOtpVerify/nodeMailer";
import { prisma } from "../db";
import { otpService } from "../userRegisterOtpVerify/otpService";
import { comparePassword, hashPassword } from "../Utils/passwordHashing";
import { checkRefreshToken } from "../Modal/Login-Logout/logoutModal";

dotenv.config();

const createUserController = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body;
    const userNameExist = await getUserByUsername(username);
    if (userNameExist) {
      res.status(400).json({
        message: "Username Already exist",
        isSuccess: false,
      });
      return;
    }
    const hashedPassword = await hashPassword(password);

    const pendingUserData = await pendingUserModal({
      username,
      email,
      password: hashedPassword,
      role,
    });

    if (!pendingUserData) {
      res
        .status(500)
        .json({ success: false, message: "Pending user creation failed" });
      return;
    }

    req.session.pendingUserData = pendingUserData;
    req.session.email = email;

    const otpResult = await otpService.sendOtp(email, req.session);
    if (!otpResult.success) {
      res.status(500).json({ success: false, message: otpResult.message });
      return;
    }

    res.status(201).json({
      isSuccess: true,
      message: "OTP sent to your email. Please verify to create your account.",
    });
    return;
  } catch (error) {
    console.error("Error in createUserController:", error);
    res.status(500).json({ success: false, message: "Server error" });
    return;
  }
};

// get all user
const getAllUserController = async (req: Request, res: Response) => {
  try {
    const getData = await getALlUserMdoal();
    // console.log("get all user data controler:", getData);
    if (!getData) {
      res.status(400).json({ message: "cannot get the data" });
    }
    res.status(200).json(getData);
    return;
  } catch (err) {
    // console.log("catch block error:", err);
    res.status(500).json({
      message: "No data found",
    });
  }

  return;
};

// update User from email

const updateUserController = async (req: Request, res: Response) => {
  try {
    const login = req.cookies["refresh_token"];
    const data = await checkRefreshToken(login);
    const email = String(data?.email);
    const password = String(data?.password);
    const { name } = req.body;

    if (data?.role === "user") {
      const update = await updateUserModal({ email, password, name });
      // console.log(update);
      res.status(200).json({
        message: "User Updated:",
        data: update,
        isSuccess: true,
      });
    } else if (data?.role === "admin") {
      const update = await updateAdmin(email, password, name);
      res.status(200).json({
        message: "Admin Updated",
        data: update,
        isSuccess: true,
      });
      return;
    }
    res.status(400).json({
      message: "Unable to update ",
      isSuccess: false,
    });
  } catch (err) {
    // console.log(err);
    res.status(500).json({
      message: "unable to update",
    });
  }
};

// delete user from email and password

const deleteUserController = async (req: Request, res: Response) => {
  try {
    const login = req.cookies["refresh_token"];
    const data = await checkRefreshToken(login);
    if (!data) {
      res.status(400).json({
        message: "Token Missing:Failed to delete the user",
      });
    }
    const email = String(data?.email);
    const { password } = req.body;
    // finding the email in user table
    const findUser = await getUserByEmail(email);
    if (!findUser) {
      res.status(404).json({
        message: "No user found",
      });
    }
    const isValid = await comparePassword(password, String(findUser?.password));
    if (!isValid) {
      res.status(400).json({
        message: "Passoword didn't match",
      });
    }

    // check user and passeword and delete
    const deleteUser = await deleteUserModal(email);
    // console.log("delet data of user:", deleteUser);
    if (!deleteUser) {
      res.status(404).json({
        message: "Unable to delete the user",
      });
    }
    res.status(200).json({
      message: "User deleted",
    });
  } catch (err) {
    // console.log("data delete error:", err);
    res.status(500).json({
      message: "unable to delete the user",
    });
  }
};
// get user by id
const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = Number(id);
    const getUser = await getUserByIdModal(userId);
    if (!getUser) {
      res.status(400).json({
        message: "Failed to get the user:",
        isSuccess: false,
      });
      return;
    }
    res.status(200).json({
      message: "User data",
      data: getUser,
    });
    return;
  } catch (err) {
    res.status(500).json({
      message: "Failed to get the user",
    });
    return;
  }
};
export {
  createUserController,
  getAllUserController,
  updateUserController,
  deleteUserController,
  getUserByIdController,
};
