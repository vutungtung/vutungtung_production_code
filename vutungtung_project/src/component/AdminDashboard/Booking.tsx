"use client";

import { useState, useEffect } from "react";
import { FaCheck, FaEye } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import SearchFilter from "./SearchFilter";

import type { Booking } from "../../types/booking";
import { getAllBookingsAdmin } from "../../api/api";
import { cancelBookingAdmin, updateBookingPaymentStatus } from "../../api/bookingApi";

const Booking = () => {
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch bookings from admin API
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllBookingsAdmin();

        // Now TypeScript knows response.data.data exists
        const bookingsArray = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        setAllBookings(bookingsArray);
      } catch (err: any) {
        console.error("Error fetching bookings:", err);
        setError(err?.message || "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const refreshBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllBookingsAdmin();
      const bookingsArray = Array.isArray(response.data.data)
        ? response.data.data
        : [];
      setAllBookings(bookingsArray);
    } catch (err: any) {
      console.error("Error fetching bookings:", err);
      setError(err?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: number, bookingCreatedAt: string) => {
    const bookingTime = new Date(bookingCreatedAt).getTime();
    const currentTime = new Date().getTime();
    const fiveHoursInMillis = 5 * 60 * 60 * 1000;

    if (currentTime - bookingTime > fiveHoursInMillis) {
      alert("Booking can only be cancelled within 5 hours of creation.");
      return;
    }

    const confirmed = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirmed) return;

    try {
      setLoading(true);
      setError(null);
      const response = await cancelBookingAdmin(bookingId);
      if (response.status === 200) {
        alert("Booking cancelled successfully!");
        refreshBookings(); // Refresh the list of bookings
      } else {
        setError(response.data?.message || "Failed to cancel booking.");
      }
    } catch (err: any) {
      console.error("Error canceling booking:", err);
      setError(err.response?.data?.message || "Failed to cancel booking.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async (bookingId: number) => {
    const confirmed = window.confirm("Are you sure you want to confirm this payment as verified?");
    if (!confirmed) return;

    try {
      setLoading(true);
      setError(null);
      const response = await updateBookingPaymentStatus(bookingId, "Paid");
      if (response.status === 200) {
        alert("Payment confirmed successfully!");
        refreshBookings(); // Refresh the list of bookings
      } else {
        setError(response.data?.message || "Failed to confirm payment.");
      }
    } catch (err: any) {
      console.error("Error confirming payment:", err);
      setError(err.response?.data?.message || "Failed to confirm payment.");
    } finally {
      setLoading(false);
    }
  };

  // Format date safely
  const formatDate = (date?: string) => {
    if (!date) return "N/A";
    try {
      return new Date(date).toISOString().split("T")[0];
    } catch {
      return "N/A";
    }
  };

  // Calculate days
  const calcDays = (start?: string, end?: string) => {
    if (!start || !end) return 0;
    try {
      const s = new Date(start);
      const e = new Date(end);
      return Math.max(
        1,
        Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24))
      );
    } catch {
      return 0;
    }
  };

  // Search + filter safely
  const bookings = (Array.isArray(allBookings) ? allBookings : []).filter(
    (b) => {
      const matchesSearch =
        (b.username?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (b.useremail?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (b.vehicleName?.toLowerCase() || "").includes(search.toLowerCase());

      const matchesFilter = filter === "All" || b.categoryName === filter;
      return matchesSearch && matchesFilter;
    }
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Booking Management</h1>
        <p className="text-gray-600 text-sm md:text-base">
          Track and manage all reservations
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2  md:grid-cols-4 gap-4">
        {["Total Bookings", "Active", "Pending", "Revenue"].map(
          (label, idx) => {
            const value =
              label === "Total Bookings"
                ? allBookings.length
                : label === "Active"
                ? allBookings.filter((b) => b.deliverystatus === "active")
                    .length
                : label === "Pending"
                ? allBookings.filter((b) => b.deliverystatus === "pending")
                    .length
                : `$${allBookings
                    .reduce((acc, b) => acc + Number(b.price || 0), 0)
                    .toLocaleString()}`;

            const textColor =
              label === "Active"
                ? "text-green-600"
                : label === "Pending"
                ? "text-yellow-500"
                : label === "Revenue"
                ? "text-red-500"
                : "text-red-600";

            return (
              <div
                key={idx}
                className="p-3 rounded-lg bg-white border border-red-200 flex flex-col justify-between"
              >
                <p className="text-sm text-gray-500">{label}</p>
                <p className={`text-xl font-bold ${textColor}`}>{value}</p>
              </div>
            );
          }
        )}
      </div>

      {/* Search + Filter */}
      <SearchFilter
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
        placeholder="Search by username, email, or vehicle..."
      />

      {/* Bookings List */}
      <div>
        {loading ? (
          <p className="text-gray-500">Loading bookings...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-500">No bookings found.</p>
        ) : (
          <>
            {/* Desktop Header */}
            <div className="hidden md:grid grid-cols-6 bg-gray-200 border border-gray-200 px-4 py-2 rounded-t-md font-semibold text-red-700">
              <span>User</span>
              <span>Vehicle / Days</span>
              <span>Date Range</span>
              <span>Pickup / Drop Location</span>
              <span className="text-center">Status / Price</span>
              <span className="text-right">Actions</span>
            </div>

            {/* Booking Items */}
            {bookings.map((b) => (
              <div
                key={b.bookingId}
                className=" border-t-0 border  px-4 py-4 border-gray-200 transition-shadow duration-200"
              >
                {/* ✅ Desktop Layout */}
                <div className="hidden md:grid grid-cols-6 items-center">
                  {/* User */}
                  <div>
                    <p className="font-semibold text-red-600">
                      {b.username || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">{b.useremail}</p>
                  </div>

                  {/* Vehicle / Days */}
                  <div>
                    <p className="font-semibold text-red-500">
                      {b.vehicleName || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {calcDays(b.bookingDate, b.returnDate)} days
                    </p>
                  </div>

                  {/* Date Range */}
                  <div>
                    <p className="text-sm text-gray-600">
                      {formatDate(b.bookingDate)} - {formatDate(b.returnDate)}
                    </p>
                  </div>

                  {/* Pickup / Drop */}
                  <div>
                    <p className="text-sm text-gray-600">
                      {b.pickuplocation} → {b.droplocation}
                    </p>
                  </div>

                  {/* Status / Price */}
                  <div className="flex justify-center items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        b.deliverystatus === "active"
                          ? "bg-green-100 text-green-700"
                          : b.deliverystatus === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {b.deliverystatus}
                    </span>
                    <p className="font-bold text-red-500">${b.price}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-2">
                    {b.deliverystatus === "pending" ? (
                      <>
                        <button 
                          onClick={() => handleCancelBooking(b.bookingId, b.createdAt)}
                          disabled={loading}
                          className="p-2 rounded hover:bg-red-50 text-red-600"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                        {b.paymentMethod === "CashOnDelivery" && b.paymentStatus === "Pending" && (
                          <button
                            onClick={() => handleConfirmPayment(b.bookingId)}
                            disabled={loading}
                            className="p-2 rounded hover:bg-green-100 text-green-600"
                          >
                            <FaCheck className="w-4 h-4" />
                          </button>
                        )}
                      </>
                    ) : (
                      <button className="p-2 rounded hover:bg-red-50 text-red-600">
                        <FaEye className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* ✅ Mobile Layout */}
                <div className="flex flex-col gap-2 md:hidden">
                  <div className="flex justify-between">
                    <p className="font-semibold text-red-600">{b.username}</p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        b.deliverystatus === "active"
                          ? "bg-green-100 text-green-700"
                          : b.deliverystatus === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {b.deliverystatus}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600">{b.useremail}</p>

                  <div>
                    <p className="font-semibold text-red-500">
                      {b.vehicleName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {calcDays(b.bookingDate, b.returnDate)} days
                    </p>
                  </div>

                  <p className="text-sm text-gray-600">
                    {formatDate(b.bookingDate)} - {formatDate(b.returnDate)}
                  </p>

                  <p className="text-sm text-gray-600">
                    {b.pickuplocation} → {b.droplocation}
                  </p>

                  <div className="flex justify-between items-center">
                    <p className="font-bold text-red-500">${b.price}</p>
                    <div className="flex gap-2">
                      {b.deliverystatus === "pending" ? (
                        <>
                          <button
                            onClick={() => handleCancelBooking(b.bookingId, b.createdAt)}
                            disabled={loading}
                            className="p-2 rounded hover:bg-red-50 text-red-600"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                          {b.paymentMethod === "CashOnDelivery" && b.paymentStatus === "Pending" && (
                            <button
                              onClick={() => handleConfirmPayment(b.bookingId)}
                              disabled={loading}
                              className="p-2 rounded hover:bg-green-100 text-green-600"
                            >
                              <FaCheck className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      ) : (
                        <button className="p-2 rounded hover:bg-red-50 text-red-600">
                          <FaEye className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Booking;
