import { Router } from "express";
import { resetPasswordController } from "../Controller/Login-Logout/resetPassword";

const resetPasswordRouter = Router();

resetPasswordRouter.post("/", resetPasswordController.resetPassword);
resetPasswordRouter.post("/send-otp", resetPasswordController.sendOtp);
resetPasswordRouter.post("/verify-otp", resetPasswordController.verifyOtp);
resetPasswordRouter.post("/resend-otp", resetPasswordController.resendOtp);

export default resetPasswordRouter;
