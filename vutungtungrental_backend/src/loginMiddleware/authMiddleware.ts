import { Request, Response, NextFunction } from "express";
import { generateAccessToken, verifyRefreshToken } from "./jwtToken";
import { EXPIRE_ACCESS_TOKEN } from "./expireTime";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      userId:number |string;
      role:'user'| 'admin'
    };
  }
}

async function authenMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authenHeader =
      req.headers.authorization || req.cookies["refresh_token"];
    if (!authenHeader) {
      res.status(401).json({
        message: "Token are not found in header",
      });
      return;
    }
    if (typeof authenHeader !== "string") {
      res.status(401).json({
        message: "Token is not in string",
      });
    }
    const refreshToekn = authenHeader;
    // check the token
    const payload = verifyRefreshToken(refreshToekn);
    const checkRefreshToken=await ({
        refreshToekn:authenHeader
    })
    if(!checkRefreshToken){
        res.status(401).json({
            message:"Cannot find the token"
        })
        return
    }
    const newAccessToken=generateAccessToken({userId:payload.userId ,role:payload.role})
        //  const EXPIRE_ACCESS_TOKEN = 150;
    res.cookie("access_token",newAccessToken,{
        path:'/',
        httpOnly:true,
        secure:true,
        expires:new Date(Date.now() + EXPIRE_ACCESS_TOKEN * 1000)
    })
    req.user={
      userId:payload.userId,
      role:payload.role
    }
    next()
  } catch(error) {
      console.error(error);
    if ((error as any).name === "TokenExpiredError") {
      next({
        status: 400,
        message: "Token expired",
      });
      return;
    }
    if ((error as any).name === "JsonWebTokenError") {
      next({
        status: 400,
        message: "Invalid token",
      });
      return;
    }

    next({ message: "Internal server error", status: 500 });

  }
}
export {authenMiddleware}