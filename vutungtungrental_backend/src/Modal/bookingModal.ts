import { DeliveryStatus, PaymentMethod, Payment } from "@prisma/client";
import { prisma } from "../db";

async function createBooking(data: {
  bookingDate: Date;
  returnDate: Date;
  useremail: string;
  vechId: number;
  vehicleName: string;
  categoryName: string;
  categId: number;
  price: number;
  pickuplocation: string;
  droplocation: string;
  paymentMethod: PaymentMethod;
  licenseNo: string;
  licenseImg?: string | null;
  username: string;
  paymentStatus?: Payment;
}) {
  // console.log("data to be store:", data);
  const book = await prisma.bookingInfo.create({
    data: {
      bookingDate: data.bookingDate,
      returnDate: data.returnDate,
      useremail: data.useremail,
      username: data.username,
      paymentMethod: data.paymentMethod,
      vehicleId: data.vechId,
      vehicleName: data.vehicleName,
      categoryName: data.categoryName,
      categoryId: data.categId,
      licenseImg: data.licenseImg,
      price: data.price,
      pickuplocation: data.pickuplocation,
      droplocation: data.droplocation,
      licenseNo: data.licenseNo,
      paymentStatus: data.paymentStatus as Payment,
    },
  });
  const updateVehiclStatus = await prisma.vehicle.update({
    where: {
      v_id: data.vechId,
    },
    data: {
      status: "RENTED",
    },
  });
  return book;
}
async function getAllBookingModal() {
  const getBooking = await prisma.bookingInfo.findMany();
  return getBooking;
}
// async function getSpecificBookingModal(data: {
//   useremail?: string;
//   username?: string;
//   vehicleId?: number;
// }) {
//   const findBooking = await prisma.bookingInfo.findMany({
//     where: {
//       useremail: data.useremail,
//       username: data.username,
//       vehicleId: data.vehicleId,
//     },
//     select: {
//       vehicle: {
//         select: {
//           name: true,
//           categoryName: true,
//         },
//       },
//       User: {
//         select: {
//           username: true,
//           email: true,
//         },
//       },
//     },
//   });
//   return findBooking;
// }
async function getUserBookingModal(email: string) {
  try {
    const searchUserBooking = await prisma.bookingInfo.findMany({
      where: {
        useremail: email,
      },
      select: {
        vehicleName: true,
        categoryName: true,
        pickuplocation: true,
        droplocation: true,
        bookingDate: true,
        returnDate: true,
        deliverystatus: true,
        paymentMethod: true,
        paymentStatus: true,
        price: true,
        licenseNo: true,
      },
    });
    return searchUserBooking;
  } catch (err) {
    // console.log("User booking details error:", err);
  }
}
// cancel booking
async function cancelBookingModal(bookingID: number, vehicleId: number) {
  const cancel = await prisma.bookingInfo.update({
    where: {
      bookingId: bookingID,
    },
    data: {
      deliverystatus: "cancled",
    },
  });
  const updateVehicleStatus = await prisma.vehicle.update({
    where: {
      v_id: vehicleId,
    },
    data: {
      status: "AVAILABLE",
    },
  });
  return;
}
// getBooking details by booking id
async function getBookingDetailByIdModal(bookingId: number) {
  const bookingDetailById = await prisma.bookingInfo.findUnique({
    where: {
      bookingId: bookingId,
    },
    select: {
      bookingDate: true,
      username: true,
      vehicleId: true,
      vehicleName: true,
      categoryName: true,
      price: true,
      pickuplocation: true,
      droplocation: true,
      licenseNo: true,
      paymentMethod: true,
      paymentStatus: true,
      deliverystatus: true,
    },
  });
  return bookingDetailById;
}
async function getVehicleForBooking(vehicleId: number) {
  const data = await prisma.vehicle.findUnique({
    where: {
      v_id: vehicleId,
    },
    select: {
      name: true,
      status: true,
    },
  });
  return data;
}
async function updateBookingPaymentModal(id: number) {
  return await prisma.bookingInfo.update({
    where: {
      bookingId: id,
      paymentMethod: "cashOnDelivery",
    },
    data: {
      deliverystatus: "dilivered",
      paymentStatus: "completed",
    },
  });
}
export {
  createBooking,
  getAllBookingModal,
  getUserBookingModal,
  cancelBookingModal,
  getBookingDetailByIdModal,
  getVehicleForBooking,
  updateBookingPaymentModal,
};
