// import axios from "axios";

// // ✅ Create Axios instance
// const API = axios.create({
//   baseURL: "http://localhost:4000",
//   withCredentials: true, // send cookies for sessions
// });

// // --------------------
// // User Endpoints
// // --------------------
// export const registerUser = (data: {
//   name: string;
//   email: string;
//   password: string;
// }) => API.post("/user/register", data);

// export const getAllUsers = () => API.get("/user");

// export const updateUsername = (id: number, data: { name: string }) =>
//   API.put(`/user/${id}`, data);

// export const deleteUser = (data: { userId: number }) =>
//   API.post("/user/delete", data);

// export const otpRegister = (data: { email: string; otp: string }) =>
//   API.post("/user/verify-otp", data);

// export const resendOtpRegister = (data: { email: string }) =>
//   API.post("/user/ressend-otp", data);

// export const sendOtpPasswordUpdate = (data: { email: string }) =>
//   API.post("/user/update-password/send-otp", data);

// export const verifyOtpPasswordUpdate = (data: { email: string; otp: string }) =>
//   API.post("/user/update-password/verify-otp", data);

// export const newPasswordUpdate = (data: {
//   email: string;
//   newPassword: string;
// }) => API.post("/user/update-password/newpassowrd", data);

// export const resendOtpPasswordUpdate = (data: { email: string }) =>
//   API.post("/user/update-password/resend-otp", data);

// // --------------------
// // Login/Logout Endpoints
// // --------------------
// export const loginUser = (data: { email: string; password: string }) =>
//   API.post("/userlogin/", data);

// export const logoutUser = () => API.get("/userlogout/");

// export const sendOtpResetPassword = (data: { email: string }) =>
//   API.post("/userlogin/reset-password/send-otp", data);

// export const verifyOtpResetPassword = (data: { email: string; otp: string }) =>
//   API.post("/userlogin/reset-password/verify-otp", data);

// export const newPasswordReset = (data: {
//   email: string;
//   newPassword: string;
// }) => API.post("/userlogin/reset-password/", data);

// // --------------------
// // Booking Endpoints
// // --------------------
// export const createBooking = (data: any) =>
//   API.post("/vehicle/book/booking", data);

// export const getAllBookingsAdmin = () =>
//   API.post("/vehicle/book/bookingdetails/admin");

// export const getUserBookings = () => API.get("/vehicle/book/user-booking");

// export const getBookingById = (id: number) =>
//   API.get(`/vehicle/book/user-booking/${id}`);

// export const cancelBooking = (id: number) =>
//   API.post(`/vehicle/book/cancel-booking/${id}`);

// export default API;

import axios from "axios";
import type { Booking } from "../types/booking";

// ✅ Create Axios instance
const API = axios.create({
  baseURL: "",
  withCredentials: true,
});

interface BookingsResponse {
  message: string;
  data: Booking[];
}

// ✅ Automatically attach token if available
API.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const user = JSON.parse(storedUser);
    const token = user?.token;

    if (!config.headers) {
      config.headers = {}; // Ensure headers exist
    }

    // Backend expects raw refresh token (no "Bearer " prefix)
    if (token) {
      (config.headers as any).Authorization = token as string;
    }
  }

  return config;
});

// --------------------
// User Endpoints
// --------------------
export const registerUser = (data: {
  name: string;
  email: string;
  password: string;
}) => API.post("/user/register", data);

export const getAllUsers = () => API.get("/user");

export const updateUsername = (id: number, data: { name: string }) =>
  API.put(`/user/${id}`, data);

export const deleteUser = (data: { userId: number }) =>
  API.post("/user/delete", data);

export const otpRegister = (data: { email: string; otp: string }) =>
  API.post("/user/verify-otp", data);

export const resendOtpRegister = (data: { email: string }) =>
  API.post("/user/ressend-otp", data);

export const sendOtpPasswordUpdate = (data: { email: string }) =>
  API.post("/user/update-password/send-otp", data);

export const verifyOtpPasswordUpdate = (data: { email: string; otp: string }) =>
  API.post("/user/update-password/verify-otp", data);

export const newPasswordUpdate = (data: {
  email: string;
  newPassword: string;
}) => API.post("/user/update-password/newpassowrd", data);

export const resendOtpPasswordUpdate = (data: { email: string }) =>
  API.post("/user/update-password/resend-otp", data);

// --------------------
// Login/Logout Endpoints
// --------------------
export const loginUser = (data: { email: string; password: string }) =>
  API.post("/userlogin/", data);

export const logoutUser = () => API.get("/userlogout/");

export const sendOtpResetPassword = (data: { email: string }) =>
  API.post("/userlogin/reset-password/send-otp", data);

export const verifyOtpResetPassword = (data: { email: string; otp: string }) =>
  API.post("/userlogin/reset-password/verify-otp", data);

export const newPasswordReset = (data: {
  email: string;
  newPassword: string;
}) => API.post("/userlogin/reset-password/", data);

// --------------------
// Booking Endpoints
// --------------------
export const createBooking = (data: any) =>
  API.post("/vehicle/book/booking", data);

export const getAllBookingsAdmin = () =>
  API.get<Booking[]>("/vehicle/book/bookingdetails/admin");

export const getBookingById = (id: number) =>
  API.get(`/vehicle/book/user-booking/${id}`);

export const cancelBooking = (id: number) =>
  API.post(`/vehicle/book/cancel-booking/${id}`);

export default API;

export const getUserBookings = () =>
  API.get<BookingsResponse>("/vehicle/book/user-booking");
