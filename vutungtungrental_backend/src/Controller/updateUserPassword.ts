import { Request, Response } from "express";
import { checkformRefreshToken } from "../Modal/Login-Logout/loginModal";
import { resetPasswordController } from "./Login-Logout/resetPassword";
import { resetPasswordService } from "../Modal/Login-Logout/resetPasswordModal";
import { otpService } from "../userRegisterOtpVerify/otpService";
import { verify } from "crypto";
import { hashPassword } from "../Utils/passwordHashing";

export const updateUserPasswordController = {
  async sendOtp(req: Request, res: Response) {
    try {
      const login = req.cookies["refresh_token"];
      const data = await checkformRefreshToken(login);
      const email = String(data?.email);
      const result = await resetPasswordService.sendOtp(email, req.session);

      res.status(200).json({
        message: "Otp is send ",
        isSuccess: true,
      });
    } catch (err) {
      res.status(500).json({
        message: "Unexpected error: Failed to send the otp",
      });
    }
  },
  async resendOtp(req: Request, res: Response) {
    try {
      const result = await resetPasswordService.resendOtp(req.session);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
  async verifyOtp(req: Request, res: Response) {
    try {
      const { otp } = req.body;
      const result = await resetPasswordService.verifyOtp(otp, req.session);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
  async resetPassword(req: Request, res: Response) {
    try {
      const { newPassword, confirmPassword } = req.body;

      // Check if passwords match
      if (newPassword !== confirmPassword) {
        res.status(400).json({
          message: "New Password and Confirm Password didn't match",
        });
        return;
      }

      if (!req.session) {
        res.status(400).json({ message: "Session not found" });
        return;
      }
      const hashedPassword = await hashPassword(newPassword);
      console.log("this is hashed passowrd:", hashedPassword);
      // Call the reset password service
      const result = await resetPasswordService.resetPassword(
        hashedPassword,
        req.session
      );

      res.status(200).json(result);
      return;
    } catch (err: any) {
      res.status(400).json({ error: err.message });
      return;
    }
  },
};
