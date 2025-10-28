import { prisma } from "../db";
import { Role } from "@prisma/client";
import bcrypt from "bcrypt";

// temp user-data
async function pendingUserModal(data: {
  username: string;
  email: string;
  password: string;
  role?: Role;
}) {
  try {
    return {
      username: data.username,
      email: data.email,
      password: data.password,
      role: data.role,
    };
  } catch (error) {
    // console.log("pending user error:", error);
    return null;
  }
}

// create user
async function createUser(data: {
  username: string;
  email: string;
  password: string;
  role?: Role;
}) {
  try {
    // const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: data.password,
        role: data.role,
        verified: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Error in userService.createUser:", error);
    return null;
  }
}
//get user

async function getALlUserMdoal() {
  const getusers = await prisma.user.findMany();
  // console.log("get all users datas:", getusers);
  return getusers;
}
async function updateUserModal(data: {
  email: string;
  name: string;
  password: string;
}) {
  const update = await prisma.user.updateMany({
    where: {
      email: data.email,
      password: data.password,
    },
    data: {
      username: data.name,
    },
  });
  return update;
}

// delete user

async function deleteUserModal(email: string) {
  const deleteUser = await prisma.user.delete({
    where: {
      email: email,
    },
  });
  return deleteUser;
}
// get user from email
async function getUserByEmail(email: string) {
  const findUser = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
  return findUser;
}
async function getUserByUsername(username: string) {
  const data = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  return data;
}
// get user by id
async function getUserByIdModal(userId: number) {
  const getUser = await prisma.user.findUnique({
    where: {
      userId: userId,
    },
    select: {
      username: true,
      role: true,
      email: true,
    },
  });
  return getUser;
}
// exprt function
export {
  createUser,
  getALlUserMdoal,
  updateUserModal,
  deleteUserModal,
  getUserByEmail,
  pendingUserModal,
  getUserByUsername,
  getUserByIdModal,
};
