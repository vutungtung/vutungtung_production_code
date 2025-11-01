import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdCheckCircle } from "react-icons/md";

const BookingSuccessful = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const txn = queryParams.get("txn");

  useEffect(() => {
    // Booking is created before payment. On success just clear temp data.
    localStorage.removeItem("bookingData");
    sessionStorage.removeItem("pendingBooking");
  }, [txn]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 text-center max-w-md w-full">
        <MdCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Successful!
        </h2>
        <p className="text-gray-600 mb-6">
          Your booking has been confirmed and payment processed successfully.
        </p>
        <button
          onClick={() => navigate("/my-bookings")}
          className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow"
        >
          View My Bookings
        </button>
      </div>
    </div>
  );
};

export default BookingSuccessful;
