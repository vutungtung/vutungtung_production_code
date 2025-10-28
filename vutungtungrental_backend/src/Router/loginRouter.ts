import { Router } from "express";
import { loginUser } from "../Controller/Login-Logout/loginController";
import { logoutUserController } from "../Controller/Login-Logout/logoutController";

const loginRouter = Router();
const logoutRouter = Router();
// user login
loginRouter.post("/", loginUser);
// logout

logoutRouter.post("/", logoutUserController);

export { loginRouter, logoutRouter };
