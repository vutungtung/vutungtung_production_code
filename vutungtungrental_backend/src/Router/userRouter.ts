import { Router } from "express";
import {
  createUserController,
  deleteUserController,
  getAllUserController,
  getUserByIdController,
  updateUserController,
} from "../Controller/userController";
import { getAllAdmin } from "../Modal/adminModal";
import {
  findAdminByEmail,
  getAdminController,
} from "../Controller/adminController";
import {
  resendOtpController,
  verifyOtpController,
} from "../userRegisterOtpVerify/otpConotroller";
import { authenMiddleware } from "../loginMiddleware/authMiddleware";
import { updateUserPasswordController } from "../Controller/updateUserPassword";

const userRouter = Router();

userRouter.post("/register", createUserController);
userRouter.post("/verify-otp", verifyOtpController);
userRouter.post("/ressend-otp", resendOtpController);

userRouter.get("/", authenMiddleware, getAllUserController);
userRouter.get("/:id", getUserByIdController);

userRouter.put("/update", authenMiddleware, updateUserController);
userRouter.post(
  "/update-password/send-otp",
  authenMiddleware,
  updateUserPasswordController.sendOtp
);
userRouter.post(
  "/update-password/verify-otp",
  authenMiddleware,
  updateUserPasswordController.verifyOtp
);
userRouter.post(
  "/update-password/resend-otp",
  authenMiddleware,
  updateUserPasswordController.resendOtp
);
userRouter.post(
  "/update-password/newpassword",
  authenMiddleware,
  updateUserPasswordController.resetPassword
);

userRouter.post("/delete", deleteUserController);
userRouter.get("/admin", getAdminController);
userRouter.get("/admin/find", findAdminByEmail);

export { userRouter };
