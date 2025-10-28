// import { useState, useEffect } from "react";
// import { FaCheckCircle, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

// // Dummy Data
// const dummyBookingData = {
//   vehicle: {
//     id: 1,
//     title: "Toyota Corolla",
//     image: ["/placeholder-vehicle.jpg"],
//     pricePerDay: 50,
//     description: "A reliable compact car",
//   },
//   licenseNumber: "AB123CD",
//   contactInfo: {
//     firstName: "John",
//     lastName: "Doe",
//     email: "john.doe@example.com",
//     phone: "+1234567890",
//   },
//   locationData: {
//     pickupLocation: "Kathmandu",
//     returnLocation: "Pokhara",
//     pickupDate: "2025-09-10",
//     returnDate: "2025-09-15",
//   },
//   paymentInfo: {
//     method: "eSewa",
//     agreed: true,
//   },
//   totalPrice: 250,
// };

// const dummyEsewaData = {
//   transaction_code: "ES123456789",
//   status: "Success",
//   total_amount: "250",
//   transaction_uuid: "abc-1234567890",
//   product_code: "PROD001",
//   signed_field_names: "",
//   signature: "",
// };

// const BookingSuccessful = () => {
//   const [booking] = useState(dummyBookingData);
//   const [esewaData] = useState(dummyEsewaData);
//   const [loading, setLoading] = useState(true);
//   const [apiStatus, setApiStatus] = useState<
//     "idle" | "loading" | "success" | "error"
//   >("idle");

//   const bookingId = esewaData.transaction_uuid
//     ? esewaData.transaction_uuid.split("-")[1]
//     : `VT${Math.floor(Math.random() * 10000000)}`;

//   // Send booking data to mock API
//   useEffect(() => {
//     const saveBookingToAPI = async () => {
//       setApiStatus("loading");
//       try {
//         const response = await fetch(
//           "https://mockapi.io/your-endpoint/bookings",
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               ...booking,
//               paymentStatus: esewaData.status,
//               transactionId: esewaData.transaction_uuid,
//               bookingId,
//               bookingDate: new Date().toISOString(),
//               returnDate: booking.locationData.returnDate,
//               deliverystatus: "pending",
//               createdAt: new Date().toISOString(),
//               updateAt: new Date().toISOString(),
//             }),
//           }
//         );

//         if (!response.ok) throw new Error("Failed to save booking");

//         setApiStatus("success");
//         console.log("Booking saved successfully");
//       } catch (error) {
//         console.error("Error saving booking:", error);
//         setApiStatus("error");
//       } finally {
//         setLoading(false);
//       }
//     };

//     saveBookingToAPI();
//   }, [booking, esewaData, bookingId]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-10">
//           <div className="flex items-center justify-center mb-4">
//             <div className="bg-red-100 text-red-600 rounded-full p-4">
//               <FaCheckCircle size={40} />
//             </div>
//           </div>
//           <h1 className="text-3xl font-bold mb-2 text-gray-900">
//             Booking Confirmed!
//           </h1>
//           <p className="text-gray-600">
//             Your vehicle rental has been successfully booked
//           </p>
//           {apiStatus === "loading" && (
//             <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-lg">
//               <p>Saving your booking details...</p>
//             </div>
//           )}
//           {apiStatus === "success" && (
//             <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg">
//               <p>Booking details saved successfully!</p>
//             </div>
//           )}
//           {apiStatus === "error" && (
//             <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">
//               <p>Failed to save booking details. Please try again.</p>
//             </div>
//           )}
//         </div>

//         {/* Booking Details */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="bg-white shadow rounded-lg p-6 md:col-span-2 space-y-6">
//             <div className="flex justify-between items-center">
//               <h2 className="text-lg font-semibold text-gray-900">
//                 Booking Details
//               </h2>
//               <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
//                 Confirmed
//               </span>
//             </div>
//             <div className="space-y-2">
//               <p>
//                 <span className="font-semibold">Booking ID:</span>{" "}
//                 <span className="text-red-600">{bookingId}</span>
//               </p>
//               <p>
//                 <span className="font-semibold">Customer:</span>{" "}
//                 {booking.contactInfo.firstName} {booking.contactInfo.lastName}
//               </p>
//               <p>Email: {booking.contactInfo.email}</p>
//               <p>Phone: {booking.contactInfo.phone}</p>
//               <p>
//                 <span className="font-semibold">License Number:</span>{" "}
//                 {booking.licenseNumber}
//               </p>
//               <p>
//                 <span className="font-semibold">Payment Method:</span>{" "}
//                 {booking.paymentInfo.method}
//               </p>
//             </div>

//             {/* Vehicle Info */}
//             <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
//               <img
//                 src={booking.vehicle.image[0]}
//                 alt={booking.vehicle.title}
//                 className="w-24 h-16 object-cover rounded"
//               />
//               <div>
//                 <h3 className="font-semibold text-gray-900">
//                   {booking.vehicle.title}
//                 </h3>
//                 <p className="text-gray-500">
//                   <FaMapMarkerAlt className="inline mr-1" />{" "}
//                   {booking.locationData.pickupLocation}
//                 </p>
//                 <p className="text-red-600 font-bold">
//                   ${booking.totalPrice}{" "}
//                   <span className="text-gray-500 font-normal">total</span>
//                 </p>
//                 <span className="text-sm text-gray-500">Self Drive</span>
//               </div>
//             </div>

//             {/* Rental Schedule */}
//             <div className="grid grid-cols-2 gap-4">
//               <div className="flex items-center space-x-2">
//                 <FaCalendarAlt className="text-red-600" />
//                 <div>
//                   <p className="text-gray-500 text-sm">Pickup</p>
//                   <p className="text-gray-900 font-semibold">
//                     {booking.locationData.pickupDate}
//                   </p>
//                   <p className="text-gray-500 text-sm">10:00 AM</p>
//                   <p className="text-gray-500 text-sm">
//                     {booking.locationData.pickupLocation}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <FaCalendarAlt className="text-red-600" />
//                 <div>
//                   <p className="text-gray-500 text-sm">Return</p>
//                   <p className="text-gray-900 font-semibold">
//                     {booking.locationData.returnDate}
//                   </p>
//                   <p className="text-gray-500 text-sm">10:00 AM</p>
//                   <p className="text-gray-500 text-sm">
//                     {booking.locationData.returnLocation}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-6">
//             <div className="bg-white shadow rounded-lg p-4 space-y-2">
//               <h3 className="font-semibold text-gray-900 mb-2">
//                 Quick Actions
//               </h3>
//               <button className="w-full bg-red-600 text-white py-2 rounded-lg">
//                 Download Confirmation
//               </button>
//               <button className="w-full border border-red-600 text-red-600 py-2 rounded-lg">
//                 Add to Calendar
//               </button>
//               <button className="w-full border border-red-600 text-red-600 py-2 rounded-lg">
//                 Share Booking
//               </button>
//               <button
//                 className="w-full bg-red-600 text-white py-2 rounded-lg"
//                 onClick={() => alert("Redirect to home")}
//               >
//                 Book Another Vehicle
//               </button>
//             </div>

//             <div className="bg-white shadow rounded-lg p-4 space-y-2">
//               <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
//               <p>Call Us: +1 (555) 123-4567</p>
//               <p>Email Support: support@vutungtung.com</p>
//               <p>24/7 Support - We're here to help anytime</p>
//             </div>

//             <div className="bg-white shadow rounded-lg p-4 space-y-2">
//               <h3 className="font-semibold text-gray-900 mb-2">
//                 Payment Summary
//               </h3>
//               <p>Total Paid: ${booking.totalPrice}</p>
//               <p className="text-green-600 text-sm">
//                 Payment processed successfully
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="mt-10 bg-red-50 p-6 rounded-lg text-center text-red-700">
//           <p className="font-semibold">Thank You for Choosing VuTungTung!</p>
//           <p>
//             We're excited to be part of your journey. Have a safe and enjoyable
//             trip!
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookingSuccessful;



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
