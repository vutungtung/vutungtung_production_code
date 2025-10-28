import type { Booking } from "../types/booking";
import axios from 'axios'; // Import axios

export const BOOKING_API_URL =
  "http://localhost:4000/vehicle/book/bookingdetails/admin";
// ⬆️ replace with your real backend API later

// ✅ Fetch all bookings
export const fetchBookings = async (): Promise<Booking[]> => {
  const res = await fetch(BOOKING_API_URL);
  if (!res.ok) throw new Error("Failed to fetch bookings");
  const data: Booking[] = await res.json();
  return data;
};

// ✅ Fetch single booking by ID
export const fetchBookingById = async (id: string): Promise<Booking> => {
  const res = await fetch(`${BOOKING_API_URL}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch booking");
  const data: Booking = await res.json();
  return data;
};

// ✅ Update booking
export const updateBooking = async (
  id: string,
  booking: Booking
): Promise<Booking> => {
  const res = await fetch(`${BOOKING_API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(booking),
  });
  if (!res.ok) throw new Error("Failed to update booking");
  const data: Booking = await res.json();
  return data;
};

// ✅ Delete booking
export const deleteBooking = async (id: string): Promise<boolean> => {
  const res = await fetch(`${BOOKING_API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete booking");
  return true;
};

// ✅ Cancel booking (Admin)
export const cancelBookingAdmin = async (bookingId: number) => {
  const res = await axios.post(
    `http://localhost:4000/vehicle/book/cancel-booking/${bookingId}`,
    {},
    { withCredentials: true }
  );
  return res;
};

// ✅ Update payment status (Admin)
export const updateBookingPaymentStatus = async (bookingId: number, status: string) => {
  const res = await axios.post(
    `http://localhost:4000/vehicle/book/updatePayment/${bookingId}`,
    { paymentStatus: status },
    { withCredentials: true }
  );
  return res;
};
