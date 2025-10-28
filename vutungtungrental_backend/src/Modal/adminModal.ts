import { Role } from "@prisma/client";
import { prisma } from "../db";

async function createOwner(data: {
  username: string;
  email: string;
  password: string;
}) {
  console.log("data in modal:", data.email, data.username, data.password);
  const newOwner = await prisma.admin.create({
    data: {
      ownername: data.username,
      email: data.email,
      passowrd: data.password,
    },
  });
  return newOwner;
}
async function getAllAdmin() {
  const getdata = await prisma.admin.findMany();
  return getdata;
}
async function getSpecificAdmin(email?: string, ownername?: string) {
  const findAdmin = await prisma.admin.findFirst({
    where: {
      email: email,
      ownername: ownername,
    },
  });
  return findAdmin;
}
async function updateAdmin(
  ownername: string,
  email: string,
  passowrd: string,
  role?: Role
) {
  const update = await prisma.admin.update({
    where: {
      email: email,
      passowrd: passowrd,
    },
    data: {
      ownername: ownername,
      role: role,
    },
  });
  return update;
}
async function getAdminByID(adminId: number) {
  const getAdmin = await prisma.admin.findUnique({
    where: {
      adminId: adminId,
    },
  });
  return getAdmin;
}

export {
  createOwner,
  getAllAdmin,
  getSpecificAdmin,
  updateAdmin,
  getAdminByID,
};
