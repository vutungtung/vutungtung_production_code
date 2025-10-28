import { Request, Response } from "express";
import {
  createOwner,
  getAllAdmin,
  getSpecificAdmin,
} from "../Modal/adminModal";
import { Role } from "@prisma/client";

const createAdmin = async (
  username: string,
  email: string,
  password: string,

  res: Response
) => {
  try {
    // console.log("data entered:", username, email, password);
    if ((username || email || password) === null) {
      res.status(401).json({
        message: "Enter all data to register",
      });
    }

    const registerAdmin = await createOwner({
      username,
      email,
      password,
    });
    if (!registerAdmin) {
      res.status(404).json({
        message: "Unable to create admin",
        isSuccess: false,
      });
    }
    res.status(200).json({
      message: "user has been registered as admin",
      isSuccess: true,
    });
  } catch (err) {
    // console.log("This is the error", err);
    res.status(500).json({
      message: "Server Error: Unable to create the admin",
      isSuccess: false,
    });
  }
};
const getAdminController = async (req: Request, res: Response) => {
  try {
    const getData = await getAllAdmin();
    if (!getData) {
      res.status(404).json({
        message: "No admin found",
        isSuccess: false,
      });
      return;
    }
    res.status(200).json({
      message: "All Admin Listed Below:",
      data: getData,
      isSuccess: true,
    });
    return;
  } catch {
    res.status(500).json({
      message: "Server Error:",
    });
    return;
  }
};
const findAdminByEmail = async (req: Request, res: Response) => {
  try {
    const { email, ownername } = req.body;
    const getData = await getSpecificAdmin(email, ownername);
    if (!getData) {
      res.status(400).json({
        message: "Cannot find the admin",
        isSuccess: false,
      });
    }
    res.status(200).json({
      message: "The requested data:",
      data: getData,
      isSuccess: false,
    });
  } catch {
    res.status(500).json({
      message: "Server Error:Unable to get the admin ",
      isSuccess: false,
    });
  }
};

export { createAdmin, getAdminController, findAdminByEmail };
