import { Request, Response } from "express";
import { checkAlreadyLoggedIn } from "../../Modal/Login-Logout/loginModal";
import {
  checkRefreshToken,
  logoutUserModal,
} from "../../Modal/Login-Logout/logoutModal";
import { error } from "console";

async function logoutUserController(req: Request, res: Response) {
  try {
    const getrefreshToken = req.cookies["refresh_token"];
    // console.log("logout refresh token:", getrefreshToken);
    if (!getrefreshToken) {
      res.status(404).json({
        message: "Login first",
        isSuccess: false,
      });
      return;
    }
    const deldata = await checkRefreshToken(getrefreshToken);
    // console.log("data to be deleted", deldata);

    if (deldata !== null) {
      await logoutUserModal(deldata.refreshToken);
      res.clearCookie("refresh_token");
      res.clearCookie("access_token");
      res.status(200).json({
        message: "Logout Successfuly",
      });
      return;
    }
    res.status(404).json({
      message: "Cannot Logout",
    });
    return;
  } catch (error) {
    // console.log("Logout error:", error);
    res.status(500).json({
      message: "Server Error: Unable to logout",
    });
    return;
  }
}

export { logoutUserController };
