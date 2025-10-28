import { prisma } from "../../db";

async function logoutUserModal(token: string) {
  const logout = await prisma.login.delete({
    where: {
      refreshToken: token,
    },
  });
  return logout;
}
async function checkRefreshToken(refreshToken: string) {
  const checkRefresh = await prisma.login.findFirst({
    where: {
      refreshToken: refreshToken,
    },
    select: {
      email: true,
      password: true,
      role: true,
      refreshToken: true,
    },
  });
  console.log("modal refresh token data:", checkRefresh);
  // if (checkRefresh !== null) {
  //     const deleteLogin = await prisma.login.deleteMany({
  //         where: {
  //             refreshToken: refreshToken,
  //         },
  //     });
  //     return deleteLogin;
  // }
  return checkRefresh;
}

export { logoutUserModal, checkRefreshToken };
