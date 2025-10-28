// import { PrismaClient } from "./generated/prisma";
import { Role } from "@prisma/client";
import { prisma } from "../../db";
import { promises } from "dns";

// store login details

async function careeteLoginModal(data: {
  adminId: number | null;
  userId: number | null;
  refreshToken: string;
  email: string;
  password: string;
  role: Role;
}) {
  // console.log("data in the model:", data.adminId, data.email);
  const create = prisma.login.createMany({
    data: {
      userId: data.userId,
      adminId: data.adminId,
      refreshToken: data.refreshToken,
      email: data.email,
      password: data.password,
      role: data.role,
    },
  });
  // console.log("data to be stored in the database:", create);
  return create;
}

// check already login or not

async function checkAlreadyLoggedIn(email: string) {
  const findUser = await prisma.login.findFirst({
    where: {
      email: email,
    },
  });
  return findUser;
}
// check user register already or not
async function checkExistingUser(email: string) {
  const findUser = await prisma.user.findFirst({
    where: {
      email: email,
    },
    select: {
      password: true,
      userId: true,
      email: true,
    },
  });

  // console.log(findUser);
  return findUser;
}
async function checkExistingAdmin(email: string): Promise<any> {
  const findAdmin = await prisma.admin.findFirst({
    where: {
      email: email,
    },
    select: {
      adminId: true,
      passowrd: true,
      email: true,
    },
  });

  // console.log(findUser)
  return findAdmin;
}
async function checkformRefreshToken(refreshToken: string) {
  const findemail = await prisma.login.findFirst({
    where: {
      refreshToken: refreshToken,
    },
  });
  return findemail;
}

export {
  careeteLoginModal,
  checkAlreadyLoggedIn,
  checkExistingUser,
  checkExistingAdmin,
  checkformRefreshToken,
};
