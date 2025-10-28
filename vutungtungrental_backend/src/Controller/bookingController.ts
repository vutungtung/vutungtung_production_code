import { Request, Response } from "express";
import {
  cancelBookingModal,
  createBooking,
  getAllBookingModal,
  getBookingDetailByIdModal,
  getUserBookingModal,
  getVehicleForBooking,
  updateBookingPaymentModal,
} from "../Modal/bookingModal";
import { checkformRefreshToken } from "../Modal/Login-Logout/loginModal";
import { getUserByEmail } from "../Modal/userModal";
import { getVehicleById } from "../Modal/vehicleModal";
import { getCategoryById } from "../Modal/categoryModal";
import { sendMail } from "../userRegisterOtpVerify/nodeMailer";

const createBookingController = async (req: Request, res: Response) => {
  try {
    const { categoryId, vehicleId } = req.params;
    const {
      licenseNo,
      bookingDate,
      returnDate,
      price,
      pickuplocation,
      droplocation,
      paymentMethod,
      paymentStatus,
    } = req.body;

    const licenseImg = req.file
      ? `/uploads/bookingLicense/${req.file.filename}`
      : null;
    if (licenseImg === null) {
      res.status(400).json({
        message: "License required to rent",
        success: false,
      });
      return;
    }
    // check if user logged in or not
    const loginData = await req.cookies["refresh_token"];
    if (!loginData) {
      res.status(401).json({
        message: "Login first to rent the vehicle",
      });
      return;
    }
    // get the logged in user data from the login table
    const getUser = await checkformRefreshToken(loginData);
    const useremail = String(getUser?.email);

    const vechId = Number(vehicleId);
    const vech = await getVehicleForBooking(vechId);
    if (vech?.status !== "AVAILABLE") {
      res.status(400).json({
        message: "Not available for booking ",
      });
    }
    const vehicleName = String(vech?.name);
    // console.log("This is the vehicle name ", vehicleName);
    const categId = Number(categoryId);
    const catName = await getCategoryById(categId);
    const categoryName = String(catName?.name);
    // getting user name
    const findUserName = await getUserByEmail(useremail);
    const username = String(findUserName?.username);
    const initiate = await createBooking({
      useremail,
      licenseImg,
      licenseNo,
      vechId,
      bookingDate,
      returnDate,
      categId,
      price,
      pickuplocation,
      droplocation,
      paymentMethod,
      username,
      vehicleName,
      categoryName,
      paymentStatus,
    });
    res.status(200).json({
      message: "Rented vehicle Success",
    });
    await sendMail(
      useremail,
      "Renting details",
      `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Rent Confirmation</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .header {
                text-align: center;
                padding: 10px 0;
                border-bottom: 3px solid #4a90e2;
            }
            .logo {
                font-size: 24px;
                font-weight: bold;
                color: #4a90e2;
            }
            .content {
                padding: 20px;
                background-color: #f9f9f9;
                border-radius: 5px;
                margin-top: 20px;
            }
            .details-container {
                background-color: #ffffff;
                border-radius: 5px;
                padding: 20px;
                margin: 20px 0;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            .detail-row {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px solid #eeeeee;
            }
            .detail-label {
                font-weight: bold;
                color: #555555;
            }
            .detail-value {
                text-align: right;
            }
            .price {
                font-size: 24px;
                font-weight: bold;
                color: #4a90e2;
                text-align: center;
                margin: 20px 0;
            }
            .footer {
                text-align: center;
                padding: 20px;
                font-size: 12px;
                color: #999999;
            }
            .button {
                display: block;
                width: 200px;
                margin: 20px auto;
                padding: 12px;
                background-color: #4a90e2;
                color: white;
                text-align: center;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
            }
            .icon {
                width: 20px;
                height: 20px;
                margin-right: 10px;
                vertical-align: middle;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="logo">VutungTung</div>
        </div>

        <div class="content">
            <h2>Your Rental is Confirmed!</h2>
            <p>Dear ${username},</p>
            <p>Thank you for choosing our vutungtung. Your booking has been confirmed. Below are the details of your reservation:</p>

            <div class="details-container">
                <div class="detail-row">
                    <span class="detail-label">Vehicle:</span>
                    <span class="detail-value">${vehicleName}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Booking Date:</span>
                    <span class="detail-value">${bookingDate}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Return Date:</span>
                    <span class="detail-value">${returnDate}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Pick-up Location:</span>
                    <span class="detail-value">${pickuplocation}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Drop-off Location:</span>
                    <span class="detail-value">${droplocation}</span>
                </div>
            </div>

            <div class="price">Total: ${price}</div>

            <a href="#" class="button">View Booking Details</a>

            <p>Please bring your driver's license, proof of insurance, and a credit card in your name when you pick up the vehicle.</p>
            <p>If you have any questions or need to modify your reservation, please contact us at support@vutungtung .</p>

            <p>We look forward to serving you!</p>
            <p>The VutungTung Team</p>
        </div>

        <div class="footer">
            <p>© 2023 VutungTung. All rights reserved.</p>
            <p>Butwal-3,Goalpark,Nepal</p>
            <p>You're receiving this email because you made a booking with VutungTung.</p>
        </div>
    </body>
    </html>`
    );
    return;
  } catch (err) {
    // console.log("Rent the vehicle error:", err);
    res.status(500).json({
      message: "Failed to rent the vehicle",
      success: false,
    });
    return;
  }
};
// get all booking controller user must be logged in and role must be admin
const findAllBookingController = async (req: Request, res: Response) => {
  try {
    const loginData = req.cookies["refresh_token"];
    if (!loginData) {
      res.status(401).json({
        message: "Login first ",
      });
      return;
    }
    const getUser = await checkformRefreshToken(loginData);
    if (getUser?.role !== "admin") {
      res.status(401).json({
        message: "You are not admin",
      });
      return;
    }
    const getBooking = await getAllBookingModal();
    if (!getBooking) {
      res.status(400).json({
        message: "No booking founds",
      });
      return;
    }
    res.status(200).json({
      message: "All bookings:",
      data: getBooking,
    });
    return;
  } catch (err) {
    // console.log("get all bookings error:", err);
    res.status(404).json({
      message: "Failed to get the bookings",
    });
    return;
  }
};
// get booking details to specific user
const getUserBookingDetailsController = async (req: Request, res: Response) => {
  try {
    const loginData = await req.cookies["refresh_token"];
    if (!loginData) {
      res.status(401).json({
        message: "Login first ",
      });
      return;
    }
    const getUser = await checkformRefreshToken(loginData);
    const email = String(getUser?.email);
    const getUserBooking = await getUserBookingModal(email);
    if (!getUserBooking) {
      res.status(400).json({ message: "No bookings found" });
    }
    res.status(200).json({
      message: "Your Bookings",
      data: getUserBooking,
    });
    return;
  } catch (err) {
    res.status(500).json({
      message: "Failed to get booking",
    });
    return;
  }
};

const getBookingDetailsById = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const bookId = Number(bookingId);
    const getBookingDetail = await getBookingDetailByIdModal(bookId);
    if (!getBookingDetail) {
      res.status(400).json({
        message: "No booking details found",
      });
    }
    res.status(200).json({
      message: "Booking details:",
      data: getBookingDetail,
    });
    return;
  } catch (err) {
    // console.log("getBooking details by booking id error:", err);
    res.status(500).json({
      message: "Failed to View the details",
      data: err,
    });
    return;
  }
};

const cancelBookingController = async (req: Request, res: Response) => {
  try {
    // check login
    const loginData = req.cookies["refresh_token"];
    if (!loginData) {
      res.status(401).json({
        message: "Login first to cancel booking",
      });
      return;
    }

    // verify user
    const getUser = await checkformRefreshToken(loginData);
    const useremail = String(getUser?.email);

    // get vehicleId from link
    const { bookingId } = req.params;
    if (!bookingId) {
      res.status(400).json({ message: "Booking id is required" });
      return;
    }

    const bookingID = Number(bookingId);

    const getBookingDetailsById = await getBookingDetailByIdModal(bookingID);
    const vehicleId = Number(getBookingDetailsById?.vehicleId);
    // call modal
    const cancelResult = await cancelBookingModal(bookingID, vehicleId);

    res.status(200).json({
      message: "Booking cancelled successfully",
    });
    await sendMail(
      useremail,
      "Booking Cancellation",
      `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Cancellation Confirmation</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background-color: #f5f7fa;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
        }
        
        .email-container {
            max-width: 650px;
            width: 100%;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }
        
        .email-header {
            background: linear-gradient(135deg, #2c3e50, #4a6580);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        
        .email-body {
            padding: 35px;
        }
        
        .email-footer {
            background: #f1f5f9;
            padding: 25px;
            text-align: center;
            font-size: 14px;
            color: #64748b;
        }
        
        h1 {
            font-size: 28px;
            margin-bottom: 10px;
        }
        
        h2 {
            font-size: 20px;
            color: #2c3e50;
            margin-bottom: 20px;
        }
        
        p {
            line-height: 1.6;
            color: #475569;
            margin-bottom: 15px;
        }
        
        .booking-details {
            background: #f8fafc;
            border-left: 4px solid #3b82f6;
            padding: 20px;
            margin: 25px 0;
            border-radius: 4px;
        }
        
        .detail-row {
            display: flex;
            margin-bottom: 10px;
        }
        
        .detail-label {
            font-weight: 600;
            color: #334155;
            width: 140px;
        }
        
        .detail-value {
            color: #475569;
            flex: 1;
        }
        
        .refund-info {
            background: #f0f9ff;
            border: 1px solid #bae6fd;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
        }
        
        .button {
            display: inline-block;
            background: #3b82f6;
            color: white;
            text-decoration: none;
            padding: 14px 30px;
            border-radius: 6px;
            font-weight: 600;
            margin: 15px 5px;
        }
        
        .button.outline {
            background: transparent;
            border: 1px solid #3b82f6;
            color: #3b82f6;
        }
        
        .text-center {
            text-align: center;
        }
        
        .divider {
            height: 1px;
            background: #e2e8f0;
            margin: 30px 0;
        }
        
        .contact-info {
            text-align: center;
            margin-top: 25px;
        }
        
        .logo {
            font-size: 26px;
            font-weight: 700;
            letter-spacing: 1px;
            margin-bottom: 10px;
        }
        
        .cancellation-icon {
            font-size: 60px;
            color: #ef4444;
            margin-bottom: 20px;
        }
        
        @media (max-width: 650px) {
            .email-body {
                padding: 25px;
            }
            
            .detail-row {
                flex-direction: column;
                margin-bottom: 12px;
            }
            
            .detail-label {
                width: 100%;
                margin-bottom: 5px;
            }
            
            .button {
                display: block;
                margin: 10px 0;
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <div class="logo">VutunTung Rental</div>
            <h1>Booking Cancellation Confirmation</h1>
        </div>
        
        <div class="email-body">
            <div class="text-center">
                <div class="cancellation-icon">✖</div>
            </div>
            
            <h2>Dear ${getBookingDetailsById?.username} ,</h2>
            
            <p>We have processed your request and your booking has been successfully cancelled.</p>
            
            <div class="booking-details">
                <h3>Cancellation Details:</h3>
              
                <div class="detail-row">
                    <span class="detail-label">Vehicle:${
                      getBookingDetailsById?.vehicleName
                    }</span>
             
                </div>
                <div class="detail-row">
                    <span class="detail-label">Booked for:</span>
                    <span class="detail-value">${
                      getBookingDetailsById?.bookingDate
                    }</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Cancellation Date:</span>
                    <span class="detail-value">${new Date()}</span>
                </div>
            </div>
            
            <div class="refund-info">
                <h3>Refund Information</h3>
                <p>Based on our cancellation policy, a refund of <strong>${
                  getBookingDetailsById?.price
                }</strong> will be processed to your original payment method.</p>
                <p>Please allow 7-10 business days for the refund to appear in your account.</p>
            </div>
            
            <p>We're sorry to see you go. If there was anything we could have done to improve your experience, we'd appreciate your feedback.</p>
            
            <div class="contact-info">
                <p>If you have any questions or need further assistance, please contact our support team:</p>
                <p>Email: <a href="mailto:support@vutungtung.com">support@vutungtung.com</a></p>
            </div>
        </div>
        
        <div class="email-footer">
           <p>© 2023 VutungTung. All rights reserved.</p>
             <p>Butwal-3,Goalpark,Nepal</p>
            <p><a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a> | <a href="#">Cancellation Policy</a></p>
        </div>
    </div>
</body>
</html>`
    );
    return;
  } catch (error) {
    console.error("catch error cancel booking:", error);
    res.status(500).json({ message: "Failed to cancel booking" });
    return;
  }
};
const updateBookingPayment = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    if (!bookingId) {
      res.status(400).json({ message: "Booking id is required" });
      return;
    }
    const id = Number(bookingId);
    const logindata = req.cookies["refresh_token"];
    const findUser = await checkformRefreshToken(logindata);
    if (findUser?.role === "user") {
      res.status(400).json({
        isSuccess: false,
        message: "user cannot update the payment status",
      });
      return;
    }
    const bookingExist = await getBookingDetailByIdModal(id);
    if (!bookingExist) {
      res.status(400).json({
        isSuccess: false,
        message: "No booking found",
      });
      return;
    }
    const updatePaymentStatus = await updateBookingPaymentModal(id);
    if (!updatePaymentStatus) {
      res.status(400).json({
        isSuccess: false,
        message: "Failed to update the payment status",
      });
      return;
    }
    res.status(200).json({
      isSuccess: true,
      message: "The payemnt in updated to complete",
    });
    return;
  } catch (err) {
    res.status(500).json({
      isSuccess: false,
      message: "Unexpected Error:Failed to Updated",
    });
    return;
  }
};
export {
  createBookingController,
  findAllBookingController,
  getUserBookingDetailsController,
  cancelBookingController,
  getBookingDetailsById,
  updateBookingPayment,
};
