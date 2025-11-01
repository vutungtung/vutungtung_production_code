import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MdCheckCircle, MdError } from "react-icons/md";
// import { AuthContext } from "../context/AuthContext";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // const auth = useContext(AuthContext);
  const [verificationStatus, setVerificationStatus] = useState<
    "verifying" | "success" | "failed"
  >("verifying");
  const [error, setError] = useState("");
  const [createdBookingId, setCreatedBookingId] = useState<number | null>(null);

  // Use useRef to track if booking has been processed
  const bookingProcessedRef = useRef(false);
  const processingRef = useRef(false);

  const vehicleId = searchParams.get("vehicleId");
  // const categoryId = searchParams.get("categoryId");
  // const txn = searchParams.get("txn");
  const refId = searchParams.get("refId");
  const amt = searchParams.get("amt");

  useEffect(() => {
    // Check if already processed or currently processing
    if (bookingProcessedRef.current || processingRef.current) {
      console.log("Booking already processed or processing, skipping...");
      return;
    }

    // Mark as processing immediately
    processingRef.current = true;

    const processPaymentAsync = async () => {
      try {
        await processPayment();
        bookingProcessedRef.current = true;
      } catch (err) {
        console.error("Payment processing error:", err);
        processingRef.current = false; // Reset on error to allow retry if needed
      }
    };

    processPaymentAsync();

    // Cleanup function
    return () => {
      // This ensures no duplicate calls even in strict mode
    };
  }, []); // Empty dependency array - only run once

  const createBooking = async () => {
    try {
      // Get booking data from sessionStorage
      const bookingData = sessionStorage.getItem("bookingData");
      if (!bookingData) {
        throw new Error("No booking data found");
      }

      const parsedBookingData = JSON.parse(bookingData);
      console.log("Booking data from sessionStorage:", parsedBookingData);

      const formData = new FormData();
      formData.append("licenseNo", parsedBookingData.licenseNo);
      formData.append(
        "bookingDate",
        new Date(parsedBookingData.bookingDate).toISOString()
      );
      formData.append(
        "returnDate",
        new Date(parsedBookingData.returnDate).toISOString()
      );
      formData.append("price", String(parsedBookingData.price));
      formData.append("pickuplocation", parsedBookingData.pickuplocation);
      formData.append("droplocation", parsedBookingData.droplocation);
      formData.append("paymentMethod", "eSewa");
      formData.append("paymentStatus", "completed");
      formData.append("deliveryStatus", "pending");

      // Convert base64 to blob and append to formData
      const imgResponse = await fetch(parsedBookingData.licenseImgBase64);
      const blob = await imgResponse.blob();
      formData.append("licenseImg", blob, "license.jpg");

      const url = `https://vutungtungrental-backend.onrender.com/vehicle/book/booking/${parsedBookingData.categoryId}/${parsedBookingData.vehicleId}`;
      console.log("Creating booking with URL:", url);

      const response = await fetch(url, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend error response:", errorData);

        if (
          response.status === 401 ||
          errorData.message?.includes("Login first") ||
          errorData.message?.includes("Token")
        ) {
          setError("Please login to complete your booking");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
          return null;
        }

        throw new Error(errorData.message || "Booking creation failed");
      }

      const successData = await response.json();
      console.log("Booking created successfully:", successData);
      console.log(
        "Full response data structure:",
        JSON.stringify(successData, null, 2)
      );

      // Store the actual booking ID from response - check multiple possible structures
      let bookingId = null;

      if (successData.booking && successData.booking.id) {
        bookingId = successData.booking.id;
      } else if (successData.data && successData.data.id) {
        bookingId = successData.data.id;
      } else if (successData.id) {
        bookingId = successData.id;
      } else if (successData.bookingId) {
        bookingId = successData.bookingId;
      }

      console.log("Extracted booking ID:", bookingId);

      // Return true if booking was created successfully, even if we don't have the ID
      return bookingId || true;
    } catch (err: any) {
      console.error("Booking creation error:", err);
      throw err;
    }
  };

  const processPayment = async () => {
    try {
      console.log("Payment successful, creating booking...");

      const bookingData = sessionStorage.getItem("bookingData");
      console.log("Booking data from sessionStorage:", bookingData);

      if (!bookingData) {
        console.error("No booking data found in sessionStorage");
        setError("No booking data found. Please try booking again.");
        setVerificationStatus("failed");
        return;
      }

      console.log("Attempting to create booking...");
      const bookingId = await createBooking();

      if (bookingId) {
        setCreatedBookingId(bookingId);
        setVerificationStatus("success");

        // Clear booking data from sessionStorage ONLY after success
        sessionStorage.removeItem("bookingData");

        // Auto redirect to bookings page after 5 seconds
        setTimeout(() => {
          navigate("/user-dashboard");
        }, 5000);
      } else {
        setVerificationStatus("failed");
        setError("Failed to create booking");
      }
    } catch (err: any) {
      console.error("Booking creation error:", err);
      setError(err.message || "Failed to create booking");
      setVerificationStatus("failed");
    }
  };

  if (verificationStatus === "verifying") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="bg-white shadow-lg rounded-2xl p-8 text-center max-w-md w-full">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Creating Booking...
          </h2>
          <p className="text-gray-600 mb-4">
            Please wait while we create your booking.
          </p>
        </div>
      </div>
    );
  }

  if (verificationStatus === "failed") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="bg-white shadow-lg rounded-2xl p-8 text-center max-w-md w-full">
          <MdError className="text-red-500 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Payment Processing Failed
          </h2>
          <p className="text-gray-600 mb-4">
            {error ||
              "We couldn't process your booking. Please contact support."}
          </p>

          <div className="space-y-3">
            <button
              onClick={() => navigate("/vehicles")}
              className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate("/user-dashboard")}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Check My Bookings
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 text-center max-w-md w-full">
        <MdCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Successful!
        </h2>
        <p className="text-gray-600 mb-4">
          Your booking has been confirmed and payment processed successfully.
        </p>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          {createdBookingId && (
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Booking ID:</span>{" "}
              {createdBookingId}
            </p>
          )}
          {vehicleId && (
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Vehicle ID:</span> {vehicleId}
            </p>
          )}
          {refId && (
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Transaction ID:</span> {refId}
            </p>
          )}
          {amt && (
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Amount Paid:</span> Rs. {amt}
            </p>
          )}
          <p className="text-sm text-green-600 font-semibold mt-2">
            Payment Status: Completed | Delivery Status: Pending
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate("/user-dashboard")}
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            View My Bookings
          </button>
          <button
            onClick={() => navigate("/vehicles")}
            className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Book Another Vehicle
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          You will be redirected to your bookings page in 5 seconds...
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
