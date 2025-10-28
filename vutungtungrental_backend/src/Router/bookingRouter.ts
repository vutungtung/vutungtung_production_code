import { Router } from "express";
import { authenMiddleware } from "../loginMiddleware/authMiddleware";
import {
  cancelBookingController,
  createBookingController,
  findAllBookingController,
  getBookingDetailsById,
  getUserBookingDetailsController,
  updateBookingPayment,
} from "../Controller/bookingController";
import { upload } from "../middleware/bookingMulterMiddleware";

const bookingRouter = Router();

// http://localhost:4000/vehicle/book/booking/categoryId/vehicleId
bookingRouter.post(
  "/booking/:categoryId/:vehicleId",
  authenMiddleware,
  upload.single("licenseImg"),
  createBookingController
);
// for admin:
bookingRouter.get(
  "/bookingdetails/admin",
  authenMiddleware,
  findAllBookingController
);
// for users:
bookingRouter.get(
  "/user-booking",
  authenMiddleware,
  getUserBookingDetailsController
);
bookingRouter.get(
  "/user-booking/:bookingId",
  authenMiddleware,
  getBookingDetailsById
);
//localhost:4000/vehicle/book/cancel-booking/bookingid
http: bookingRouter.post(
  "/cancel-booking/:bookingId",
  authenMiddleware,
  cancelBookingController
);
bookingRouter.put(
  "/bookingdetails/updatepayment/:bookingId",

  updateBookingPayment
);
export { bookingRouter };
