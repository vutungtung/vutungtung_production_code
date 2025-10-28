import { Request, Response } from "express";
import { otpService } from "./otpService";
import { createUser } from "../Modal/userModal";
import { createOwner } from "../Modal/adminModal";

export const verifyOtpController = async (req: Request, res: Response) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      res.status(400).json({ success: false, message: "OTP is required" });
      return;
    }
    if (!req.session.pendingUserData) {
      res.status(400).json({ success: false, message: "No pending user data" });
      return;
    }

    const result = await otpService.verifyOtp(otp, req.session);
    if (!result.success) {
      res.status(400).json(result);
      return;
    }
    const data = await req.session.pendingUserData;
    if (data.role === "admin") {
      const newAdmin = await createOwner(req.session.pendingUserData);
    }
    // console.log("data to be store in table", data);

    const newUser = await createUser(req.session.pendingUserData);

    if (!newUser) {
      res
        .status(500)
        .json({ success: false, message: "Failed to create user" });
      return;
    }

    // Clear session after user created
    req.session.pendingUserData = null;
    req.session.email = undefined;

    await new Promise<void>((resolve, reject) =>
      req.session.save((err) => (err ? reject(err) : resolve()))
    );

    res.json({
      success: true,
      message: "User registered successfully",
      user: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("verifyOtpController error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const resendOtpController = async (req: Request, res: Response) => {
  try {
    if (!req.session.pendingUserData) {
      res.status(400).json({ success: false, message: "No pending user data" });
      return;
    }

    const result = await otpService.resendOtp(req.session);
    if (!result.success) {
      res.status(500).json(result);
      return;
    }

    res.json({ success: true, message: "OTP resent successfully" });
  } catch (err) {
    console.error("resendOtpController error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
