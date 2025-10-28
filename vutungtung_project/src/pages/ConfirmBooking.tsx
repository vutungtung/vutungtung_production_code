// import { useState, useEffect } from "react";
// import {
//   useNavigate,
//   useParams,
//   useSearchParams,
//   useLocation,
// } from "react-router-dom";
// import { IoLocationOutline } from "react-icons/io5";
// import {
//   MdCalendarToday,
//   MdErrorOutline,
//   MdKeyboardArrowLeft,
//   MdLockOutline,
//   MdNavigateNext,
// } from "react-icons/md";
// import { FiMail, FiPhone, FiUser } from "react-icons/fi";
// import BackButton from "../component/navigate";
// import ESewaForm from "../esewa/ESewaForm";
// import { fetchVehicleById } from "../api/vehicleApi";
// import axios from "axios";
// import type { VehicleFront } from "../types/vehicle";

// const ConfirmBooking = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [searchParams] = useSearchParams();
//   const location = useLocation();

//   const [step, setStep] = useState(1);
//   const [completedSteps, setCompletedSteps] = useState<number[]>([]);
//   const [vehicle, setVehicle] = useState<VehicleFront | null>(
//     location.state?.vehicle || null
//   );
//   const [loading, setLoading] = useState(!vehicle);
//   const [error, setError] = useState("");

//   const [contactInfo, setContactInfo] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     emergencyName: "",
//     emergencyPhone: "",
//   });
//   const [paymentInfo, setPaymentInfo] = useState({
//     method: "card",
//     cardNumber: "",
//     expiry: "",
//     cvv: "",
//     cardholder: "",
//     agreed: false,
//   });

//   // ✅ Function to convert image filename to full URL
//   const getImageUrl = (img: string | undefined) => {
//     if (!img) return "/fallback-image.jpg";

//     // If it's already a full URL, return as is
//     if (
//       img.startsWith("http://") ||
//       img.startsWith("https://") ||
//       img.startsWith("blob:")
//     ) {
//       return img;
//     }

//     // If it's a filename, convert to full backend URL
//     return `http://localhost:4000/uploads/vehicles/${img}`;
//   };

//   // ✅ Get vehicle images with proper URLs
//   const getVehicleImages = (vehicle: VehicleFront | null) => {
//     if (!vehicle || !vehicle.image) return ["/fallback-image.jpg"];

//     // Handle both array and single image cases
//     const images = Array.isArray(vehicle.image)
//       ? vehicle.image
//       : [vehicle.image];

//     const filteredImages = images.filter((img) => img && img !== "");
//     if (filteredImages.length === 0) return ["/fallback-image.jpg"];

//     return filteredImages.map(getImageUrl);
//   };

//   // Extract query params
//   const licenseNumber = searchParams.get("licenseNumber") || "";
//   const pickupLocation = searchParams.get("pickupLocation") || "";
//   const returnLocation = searchParams.get("returnLocation") || "";
//   const pickupDate = searchParams.get("pickupDate") || "";
//   const returnDate = searchParams.get("returnDate") || "";
//   const totalPrice = parseFloat(searchParams.get("totalPrice") || "0");

//   // ✅ Get images for the current vehicle
//   const vehicleImages = getVehicleImages(vehicle);

//   // Fetch vehicle if state not present
//   useEffect(() => {
//     if (!vehicle && id) {
//       const loadVehicle = async () => {
//         try {
//           const data = await fetchVehicleById(id);
//           setVehicle(data);
//         } catch {
//           setError("Vehicle not found.");
//         } finally {
//           setLoading(false);
//         }
//       };
//       loadVehicle();
//     }
//   }, [id, vehicle]);

//   if (loading)
//     return (
//       <p className="text-center py-20 text-gray-500 text-lg">Loading...</p>
//     );
//   if (error || !vehicle)
//     return (
//       <div className="text-center py-20">
//         <p className="text-red-500 text-lg">{error || "Vehicle not found"}</p>
//         <button
//           className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
//           onClick={() => navigate("/")}
//         >
//           Go Back
//         </button>
//       </div>
//     );

//   if (
//     !licenseNumber ||
//     !pickupLocation ||
//     !returnLocation ||
//     !pickupDate ||
//     !returnDate
//   ) {
//     return (
//       <div className="text-center py-20">
//         <p className="text-red-500 text-lg">Incomplete booking information.</p>
//         <button
//           className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
//           onClick={() => navigate(`/vehicle/${id}`)}
//         >
//           Go Back
//         </button>
//       </div>
//     );
//   }

//   const pickup = new Date(pickupDate);
//   const ret = new Date(returnDate);
//   const days = Math.max(
//     1,
//     Math.ceil((ret.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24))
//   );
//   const finalTotalPrice = totalPrice || vehicle.pricePerDay * days;

//   const validateStep = () => {
//     if (step === 1) return true;
//     if (step === 2)
//       return (
//         contactInfo.firstName &&
//         contactInfo.lastName &&
//         contactInfo.email &&
//         contactInfo.phone
//       );
//     if (step === 3) return paymentInfo.agreed;
//     return false;
//   };

//   const nextStep = () => {
//     if (validateStep()) {
//       setCompletedSteps((prev) =>
//         prev.includes(step) ? prev : [...prev, step]
//       );
//       setStep((prev) => Math.min(prev + 1, 3));
//     } else alert("Please fill all required fields before continuing.");
//   };
//   const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

//   // Handle booking after payment success
//   const handleCompleteBooking = async () => {
//     if (!validateStep()) {
//       alert("Please complete all required fields first.");
//       return;
//     }

//     try {
//       const bookingPayload = {
//         bookingDate: new Date(),
//         returnDate: ret,
//         username: contactInfo.firstName + " " + contactInfo.lastName,
//         useremail: contactInfo.email,
//         vehicleId: Number(vehicle.id),
//         vehicleName: vehicle.title,
//         categoryName: "", // optional
//         categoryId: 0, // optional
//         price: finalTotalPrice,
//         pickuplocation: pickupLocation,
//         droplocation: returnLocation,
//         licenseNo: licenseNumber,
//         licenseImg: "", // optional if uploading separately
//         paymentMethod: paymentInfo.method,
//         paymentStatus: "completed",
//         deliverystatus: "pending",
//       };

//       await axios.post(
//         "http://localhost:4000/vehicle/book/booking",
//         bookingPayload
//       );

//       navigate("/booking-success", { state: bookingPayload });
//     } catch (err) {
//       console.error(err);
//       alert("Booking failed. Please try again.");
//     }
//   };

//   return (
//     <div className="bg-light-gray">
//       <div className="max-w-7xl mx-auto py-10 px-5">
//         <BackButton />
//         <div className="flex lg:flex-row flex-col gap-6">
//           {/* Left Section */}
//           <div className="flex-1">
//             {/* Step Indicators */}
//             <div className="flex bg-white p-6 rounded-2xl justify-around mb-6">
//               {["Review Booking", "Contact Info", "Payment"].map(
//                 (label, index) => {
//                   const stepNumber = index + 1;
//                   const isActive = step === stepNumber;
//                   const isCompleted = completedSteps.includes(stepNumber);
//                   return (
//                     <div
//                       key={index}
//                       className={`flex flex-col items-center ${
//                         isActive
//                           ? "text-red"
//                           : isCompleted
//                           ? "text-gray-400"
//                           : ""
//                       }`}
//                     >
//                       <div
//                         className={`w-10 h-10 font-bold flex items-center justify-center rounded-full border-2 ${
//                           isActive || isCompleted
//                             ? "border-red bg-red text-white"
//                             : "border-light-gray bg-light-gray"
//                         }`}
//                       >
//                         {isCompleted ? "✓" : stepNumber}
//                       </div>
//                       <p className="text-sm mt-2 text-center">{label}</p>
//                     </div>
//                   );
//                 }
//               )}
//             </div>

//             {/* Step Content */}
//             <div className="bg-white p-6 rounded-2xl">
//               {/* STEP 1 */}
//               {step === 1 && (
//                 <div>
//                   <h2 className="text-2xl font-bold mb-4">
//                     Review Your Booking
//                   </h2>
//                   <div className="flex flex-wrap items-center mb-5 gap-5 p-5 border rounded-2xl border-gray-300">
//                     <img
//                       src={vehicleImages[0]} // ✅ Use converted URL
//                       alt={vehicle.title}
//                       className="h-20 object-cover"
//                       onError={(e) => {
//                         e.currentTarget.src = "/fallback-image.jpg";
//                       }}
//                     />
//                     <div>
//                       <p className="text-xl font-semibold">{vehicle.title}</p>
//                       <p className="text-xl font-semibold text-red">
//                         Rs. {vehicle.pricePerDay}/day
//                       </p>
//                     </div>
//                   </div>
//                   <div className="grid sm:grid-cols-2 space-y-5">
//                     <div className="space-y-5">
//                       <p className="flex items-center gap-2">
//                         <MdCalendarToday className="text-red" />
//                         <span>
//                           <p className="font-medium">Pickup</p>
//                           {pickupDate}
//                         </span>
//                       </p>
//                       <p className="flex items-center gap-2">
//                         <MdCalendarToday className="text-red" />
//                         <span>
//                           <p className="font-medium">Return</p>
//                           {returnDate}
//                         </span>
//                       </p>
//                     </div>
//                     <div className="space-y-5">
//                       <p className="flex items-center gap-2">
//                         <IoLocationOutline className="text-red" />
//                         <span>
//                           <p className="font-medium">Pickup Location</p>
//                           {pickupLocation}
//                         </span>
//                       </p>
//                       <p className="flex items-center gap-2">
//                         <IoLocationOutline className="text-red" />
//                         <span>
//                           <p className="font-medium">Return Location</p>
//                           {returnLocation}
//                         </span>
//                       </p>
//                     </div>
//                   </div>
//                   <p className="mt-5">
//                     <strong>License Number:</strong> {licenseNumber}
//                   </p>
//                   <div className="w-full flex items-center justify-between mt-5 bg-gray-100 p-5 rounded-2xl ">
//                     <div>
//                       <p className="text-lg font-semibold">Self Drive</p>
//                       <p>You will drive the vehicle yourself</p>
//                     </div>
//                     <p className="text-lg font-semibold">Included</p>
//                   </div>
//                 </div>
//               )}

//               {/* STEP 2 */}
//               {step === 2 && (
//                 <div>
//                   <h2 className="text-xl font-semibold mb-4">
//                     Contact Information
//                   </h2>
//                   <form className="grid gap-4 mb-5">
//                     {/* All your contact fields here, exactly as before */}
//                     <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
//                       {/* First Name */}
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           First Name *
//                         </label>
//                         <div className="relative">
//                           <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                           <input
//                             type="text"
//                             placeholder="Pyarjan"
//                             value={contactInfo.firstName}
//                             onChange={(e) =>
//                               setContactInfo({
//                                 ...contactInfo,
//                                 firstName: e.target.value,
//                               })
//                             }
//                             className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-skillprompt-primary"
//                             required
//                           />
//                         </div>
//                       </div>

//                       {/* Last Name */}
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Last Name *
//                         </label>
//                         <div className="relative">
//                           <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                           <input
//                             type="text"
//                             placeholder="Thapa"
//                             value={contactInfo.lastName}
//                             onChange={(e) =>
//                               setContactInfo({
//                                 ...contactInfo,
//                                 lastName: e.target.value,
//                               })
//                             }
//                             className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-skillprompt-primary"
//                             required
//                           />
//                         </div>
//                       </div>

//                       {/* Email */}
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Email Address *
//                         </label>
//                         <div className="relative">
//                           <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                           <input
//                             type="email"
//                             placeholder="pyarjan@example.com"
//                             value={contactInfo.email}
//                             onChange={(e) =>
//                               setContactInfo({
//                                 ...contactInfo,
//                                 email: e.target.value,
//                               })
//                             }
//                             className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-skillprompt-primary"
//                             required
//                           />
//                         </div>
//                       </div>

//                       {/* Phone Number */}
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Phone Number *
//                         </label>
//                         <div className="relative">
//                           <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                           <input
//                             type="text"
//                             placeholder="+977-9800000000"
//                             value={contactInfo.phone}
//                             onChange={(e) =>
//                               setContactInfo({
//                                 ...contactInfo,
//                                 phone: e.target.value,
//                               })
//                             }
//                             className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-skillprompt-primary"
//                             required
//                           />
//                         </div>
//                       </div>

//                       {/* Emergency Contact Name */}
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Emergency Contact Name
//                         </label>
//                         <div className="relative">
//                           <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                           <input
//                             type="text"
//                             placeholder="Suman Thapa"
//                             value={contactInfo.emergencyName}
//                             onChange={(e) =>
//                               setContactInfo({
//                                 ...contactInfo,
//                                 emergencyName: e.target.value,
//                               })
//                             }
//                             className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-skillprompt-primary"
//                           />
//                         </div>
//                       </div>

//                       {/* Emergency Contact Phone */}
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Emergency Contact Phone
//                         </label>
//                         <div className="relative">
//                           <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                           <input
//                             type="text"
//                             placeholder="+977-9811111111"
//                             value={contactInfo.emergencyPhone}
//                             onChange={(e) =>
//                               setContactInfo({
//                                 ...contactInfo,
//                                 emergencyPhone: e.target.value,
//                               })
//                             }
//                             className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-skillprompt-primary"
//                           />
//                         </div>
//                       </div>
//                     </form>
//                   </form>
//                   <div className="w-full flex gap-2 text-red bg-red/20 p-5 rounded-2xl border">
//                     <MdErrorOutline size={24} />
//                     <div>
//                       <p>Important Information</p>
//                       <p>
//                         Please ensure all contact information is accurate. We'll
//                         use this information to contact you regarding your
//                         rental and for emergency purposes.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* STEP 3 */}
//               {step === 3 && (
//                 <div>
//                   <h2 className="text-xl font-semibold mb-4">
//                     Payment Information
//                   </h2>

//                   {/* Payment Options */}
//                   <div className="flex gap-4 mb-6">
//                     {["esewa", "khalti"].map((method) => (
//                       <button
//                         key={method}
//                         type="button"
//                         disabled={!paymentInfo.agreed} // disable until agreed
//                         className={`border rounded-lg p-3 w-1/2 transition ${
//                           paymentInfo.method === method
//                             ? "bg-green-500 text-white border-green-500"
//                             : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
//                         } ${
//                           !paymentInfo.agreed
//                             ? "opacity-50 cursor-not-allowed"
//                             : "cursor-pointer"
//                         }`}
//                         onClick={() => {
//                           if (!paymentInfo.agreed) {
//                             alert(
//                               "Please agree to Terms and Conditions first."
//                             );
//                             return;
//                           }
//                           setPaymentInfo({ ...paymentInfo, method });

//                         }}
//                       >
//                         {method === "esewa" ? "eSewa" : "Khalti"}
//                       </button>
//                     ))}
//                   </div>

//                   {/* eSewa Payment */}
//                   {paymentInfo.method === "esewa" && paymentInfo.agreed && (
//                     <ESewaForm amount={finalTotalPrice} bookingId={id!} />
//                   )}

//                   {/* Khalti Coming Soon */}
//                   {paymentInfo.method === "khalti" && (
//                     <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
//                       <p className="mb-4 text-gray-700">
//                         <span className="font-semibold text-purple-700">
//                           Khalti
//                         </span>{" "}
//                         payment option is{" "}
//                         <span className="font-semibold">coming soon!</span> 🚧
//                       </p>
//                       <button
//                         disabled
//                         className="bg-purple-400 text-white px-6 py-2 rounded-lg shadow opacity-60 cursor-not-allowed"
//                       >
//                         Pay with Khalti
//                       </button>
//                     </div>
//                   )}

//                   {/* Terms and Conditions */}
//                   <label className="flex items-center gap-2 mt-6 text-sm text-gray-600">
//                     <input
//                       type="checkbox"
//                       checked={paymentInfo.agreed}
//                       onChange={(e) =>
//                         setPaymentInfo({
//                           ...paymentInfo,
//                           agreed: e.target.checked,
//                         })
//                       }
//                     />
//                     I agree to Terms and Conditions
//                   </label>

//                   {/* Secure Payment Info */}
//                   <div className="mt-4 p-4 border border-green-200 bg-green-50 rounded-lg flex items-center gap-2 text-green-700 text-sm">
//                     <MdLockOutline size={24} />
//                     <div>
//                       <p className="font-semibold">Secure Payment</p>
//                       <p>
//                         Your payment information is encrypted and secure. We
//                         never store your card details.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Navigation Buttons */}
//             <div className="flex justify-between bg-white p-5 rounded-2xl mt-6">
//               {step > 1 && (
//                 <button
//                   onClick={prevStep}
//                   className="px-4 py-2 flex items-center rounded bg-gray-200 hover:bg-gray-300"
//                 >
//                   <MdKeyboardArrowLeft size={24} /> Previous
//                 </button>
//               )}
//               {step < 3 ? (
//                 <button
//                   onClick={nextStep}
//                   className="ml-auto px-4 flex items-center py-2 rounded bg-red text-white hover:bg-gradient-red"
//                 >
//                   Next <MdNavigateNext size={24} />
//                 </button>
//               ) : (
//                 <button
//                   onClick={handleCompleteBooking}
//                   className="ml-auto px-4 py-2 rounded bg-red text-white hover:bg-gradient-red"
//                 >
//                   Complete Booking
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Right Section: Booking Summary */}
//           <div className="lg:w-[25rem] bg-white rounded-2xl shadow-sm p-6 border h-fit sticky top-20 border-gray-100">
//             <h2 className="text-xl font-semibold mb-6 text-gray-800">
//               Booking Summary
//             </h2>
//             <div className="overflow-hidden rounded-xl mb-4">
//               <img
//                 src={vehicleImages[0]} // ✅ Use converted URL
//                 alt={vehicle.title}
//                 className="w-full h-40 object-cover transition-transform hover:scale-105"
//                 onError={(e) => {
//                   e.currentTarget.src = "/fallback-image.jpg";
//                 }}
//               />
//             </div>
//             <div className="flex justify-between items-center mb-6">
//               <p className="text-lg font-medium text-gray-800">
//                 {vehicle.title}
//               </p>
//               <p className="text-lg font-semibold text-red-500">
//                 Rs. {vehicle.pricePerDay}
//               </p>
//             </div>
//             <div className="space-y-3 text-sm text-gray-700">
//               <p className="flex justify-between">
//                 <span className="text-gray-500">Pickup Date</span>
//                 <span>{pickupDate}</span>
//               </p>
//               <p className="flex justify-between">
//                 <span className="text-gray-500">Return Date</span>
//                 <span>{returnDate}</span>
//               </p>
//               <p className="flex justify-between">
//                 <span className="text-gray-500">Pickup Location</span>
//                 <span className="text-right">{pickupLocation}</span>
//               </p>
//               <p className="flex justify-between">
//                 <span className="text-gray-500">Return Location</span>
//                 <span className="text-right">{returnLocation}</span>
//               </p>
//               <p className="flex justify-between">
//                 <span className="text-gray-500">Rental Type</span>
//                 <span>Self Drive</span>
//               </p>
//             </div>
//             <hr className="my-4" />
//             <div className="flex justify-between items-center mb-4">
//               <span className="text-gray-600 font-medium">Total</span>
//               <span className="text-xl font-semibold text-gray-900">
//                 Rs. {finalTotalPrice}
//               </span>
//             </div>
//             <div className="mt-6 space-y-2 text-sm text-gray-600">
//               <p className="flex items-center gap-2">
//                 ✔ Secure payment processing
//               </p>
//               <p className="flex items-center gap-2">
//                 ✔ Free cancellation up to 24h
//               </p>
//               <p className="flex items-center gap-2">✔ Instant confirmation</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ConfirmBooking;

import { useState, useEffect, useContext } from "react";
import {
  useNavigate,
  useParams,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import { IoLocationOutline } from "react-icons/io5";
import {
  MdCalendarToday,
  MdErrorOutline,
  MdKeyboardArrowLeft,
  MdLockOutline,
  MdNavigateNext,
} from "react-icons/md";
import { FiMail, FiUser } from "react-icons/fi";
import BackButton from "../component/navigate";
import ESewaForm from "../esewa/ESewaForm";
import { fetchVehicleById } from "../api/vehicleApi";
import API from "../api/api";
import type { VehicleFront } from "../types/vehicle";
import { AuthContext } from "../context/AuthContext";

const ConfirmBooking = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const auth = useContext(AuthContext);

  const [step, setStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [vehicle, setVehicle] = useState<VehicleFront | null>(
    location.state?.vehicle || null
  );
  const [loading, setLoading] = useState(!vehicle);
  const [error, setError] = useState("");

 
  const [paymentInfo, setPaymentInfo] = useState({
    method: "esewa",
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardholder: "",
    agreed: false,
  });
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [pending, setPending] = useState<any | null>(null);

  // ✅ Function to convert image filename to full URL
  const getImageUrl = (img: string | undefined) => {
    if (!img) return "/fallback-image.jpg";

    // If it's already a full URL, return as is
    if (
      img.startsWith("http://") ||
      img.startsWith("https://") ||
      img.startsWith("blob:")
    ) {
      return img;
    }

    // If it's a filename, convert to full backend URL
    return `http://localhost:4000/uploads/vehicles/${img}`;
  };

  // ✅ Get vehicle images with proper URLs
  const getVehicleImages = (vehicle: VehicleFront | null) => {
    if (!vehicle || !vehicle.image) return ["/fallback-image.jpg"];

    // Handle both array and single image cases
    const images = Array.isArray(vehicle.image)
      ? vehicle.image
      : [vehicle.image];

    const filteredImages = images.filter((img) => img && img !== "");
    if (filteredImages.length === 0) return ["/fallback-image.jpg"];

    return filteredImages.map(getImageUrl);
  };

  // Read from session pending booking (set on vehicle details)
  const pendingBookingRaw = sessionStorage.getItem("pendingBooking");
  const pendingBooking = pendingBookingRaw ? JSON.parse(pendingBookingRaw) : null;
  const licenseNumber = pendingBooking?.licenseNo || "";
  const pickupLocation = pendingBooking?.pickuplocation || "";
  const returnLocation = pendingBooking?.droplocation || "";
  const pickupDate = pendingBooking?.bookingDate || "";
  const returnDate = pendingBooking?.returnDate || "";
  const totalPrice = Number(pendingBooking?.price || 0);

  // ✅ Get images for the current vehicle
  const vehicleImages = getVehicleImages(vehicle);

  // Fetch vehicle if state not present
  useEffect(() => {
    if (!vehicle && id) {
      const loadVehicle = async () => {
        try {
          const data = await fetchVehicleById(id);
          setVehicle(data);
        } catch {
          setError("Vehicle not found.");
        } finally {
          setLoading(false);
        }
      };
      loadVehicle();
    }
    setPending(pendingBooking);
  }, [id, vehicle]);

  if (loading)
    return (
      <p className="text-center py-20 text-gray-500 text-lg">Loading...</p>
    );
  if (error || !vehicle)
    return (
      <div className="text-center py-20">
        <p className="text-red-500 text-lg">{error || "Vehicle not found"}</p>
        <button
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
          onClick={() => navigate("/")}
        >
          Go Back
        </button>
      </div>
    );

  if (
    !licenseNumber ||
    !pickupLocation ||
    !returnLocation ||
    !pickupDate ||
    !returnDate
  ) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 text-lg">Incomplete booking information.</p>
        <button
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
          onClick={() => navigate(`/vehicle/${id}`)}
        >
          Go Back
        </button>
      </div>
    );
  }

  if (vehicle?.status && vehicle.status !== "AVAILABLE") {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 text-lg">This vehicle is not available for booking right now.</p>
        <button
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
          onClick={() => navigate(`/vehicle/${id}`)}
        >
          Choose another vehicle
        </button>
      </div>
    );
  }

  const pickup = new Date(pickupDate);
  const ret = new Date(returnDate);
  const days = Math.max(
    1,
    Math.ceil((ret.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24))
  );
  const finalTotalPrice = totalPrice || vehicle.pricePerDay * days;

  // Build a reusable booking payload for eSewa success-page storage
  const bookingPayload = {
    bookingDate: new Date().toISOString(),
    returnDate: returnDate,
    username: auth?.user?.name || "Guest User",
    useremail: auth?.user?.email || "unknown@example.com",
    vehicleId: Number(vehicle.id),
    vehicleName: vehicle.title,
    categoryId: vehicle.categoryId || 0,
    price: finalTotalPrice,
    pickuplocation: pickupLocation,
    droplocation: returnLocation,
    licenseNo: licenseNumber,
    paymentMethod: paymentInfo.method,
    paymentStatus: "pending",
    deliverystatus: "pending",
    // include base64 license if available from pending
    licenseImgBase64: pending?.licenseImgBase64 || undefined,
  };

  const validateStep = () => {
    if (step === 1) return true;
    if (step === 2) return auth?.user?.email && auth?.user?.name && (licenseFile || pending?.licenseImgBase64);

    if (step === 3) return paymentInfo.agreed;
    return false;
  };

  const nextStep = () => {
    if (validateStep()) {
      setCompletedSteps((prev) =>
        prev.includes(step) ? prev : [...prev, step]
      );
      setStep((prev) => Math.min(prev + 1, 3));
    } else alert("Please fill all required fields before continuing.");
  };
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // Booking creation is handled in the eSewa onBeforeSubmit hook in Step 3.

  return (
    <div className="bg-light-gray">
      <div className="max-w-7xl mx-auto py-10 px-5">
        <BackButton />
        <div className="flex lg:flex-row flex-col gap-6">
          {/* Left Section */}
          <div className="flex-1">
            {/* Step Indicators */}
            <div className="flex bg-white p-6 rounded-2xl justify-around mb-6">
              {["Review Booking", "Contact Info", "Payment"].map(
                (label, index) => {
                  const stepNumber = index + 1;
                  const isActive = step === stepNumber;
                  const isCompleted = completedSteps.includes(stepNumber);
                  return (
                    <div
                      key={index}
                      className={`flex flex-col items-center ${
                        isActive
                          ? "text-red"
                          : isCompleted
                          ? "text-gray-400"
                          : ""
                      }`}
                    >
                      <div
                        className={`w-10 h-10 font-bold flex items-center justify-center rounded-full border-2 ${
                          isActive || isCompleted
                            ? "border-red bg-red text-white"
                            : "border-light-gray bg-light-gray"
                        }`}
                      >
                        {isCompleted ? "✓" : stepNumber}
                      </div>
                      <p className="text-sm mt-2 text-center">{label}</p>
                    </div>
                  );
                }
              )}
            </div>

            {/* Step Content */}
            <div className="bg-white p-6 rounded-2xl">
              {/* STEP 1 */}
              {step === 1 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    Review Your Booking
                  </h2>
                  <div className="flex flex-wrap items-center mb-5 gap-5 p-5 border rounded-2xl border-gray-300">
                    <img
                      src={vehicleImages[0]} // ✅ Use converted URL
                      alt={vehicle.title}
                      className="h-20 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/fallback-image.jpg";
                      }}
                    />
                    <div>
                      <p className="text-xl font-semibold">{vehicle.title}</p>
                      <p className="text-xl font-semibold text-red">
                        Rs. {vehicle.pricePerDay}/day
                      </p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 space-y-5">
                    <div className="space-y-5">
                      <p className="flex items-center gap-2">
                        <MdCalendarToday className="text-red" />
                        <span>
                          <p className="font-medium">Pickup</p>
                          {pickupDate}
                        </span>
                      </p>
                      <p className="flex items-center gap-2">
                        <MdCalendarToday className="text-red" />
                        <span>
                          <p className="font-medium">Return</p>
                          {returnDate}
                        </span>
                      </p>
                    </div>
                    <div className="space-y-5">
                      <p className="flex items-center gap-2">
                        <IoLocationOutline className="text-red" />
                        <span>
                          <p className="font-medium">Pickup Location</p>
                          {pickupLocation}
                        </span>
                      </p>
                      <p className="flex items-center gap-2">
                        <IoLocationOutline className="text-red" />
                        <span>
                          <p className="font-medium">Return Location</p>
                          {returnLocation}
                        </span>
                      </p>
                    </div>
                  </div>
                  <p className="mt-5">
                    <strong>License Number:</strong> {licenseNumber}
                  </p>
                  <div className="w-full flex items-center justify-between mt-5 bg-gray-100 p-5 rounded-2xl ">
                    <div>
                      <p className="text-lg font-semibold">Self Drive</p>
                      <p>You will drive the vehicle yourself</p>
                    </div>
                    <p className="text-lg font-semibold">Included</p>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    Contact Information
                  </h2>

                  <form className="grid gap-4 mb-5">
                    {/* Username (auto-filled) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                      </label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={auth?.user?.name || "Guest User"}
                          readOnly
                          className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 bg-gray-100 text-gray-700"
                        />
                      </div>
                    </div>

                    {/* Email (auto-filled) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          value={auth?.user?.email || "No email"}
                          readOnly
                          className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 bg-gray-100 text-gray-700"
                        />
                      </div>
                    </div>

                    {/* License Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        License Image (required)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setLicenseFile(e.target.files?.[0] || null)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        required
                      />
                    </div>
                  </form>

                  <div className="w-full flex gap-2 text-red bg-red/20 p-5 rounded-2xl border">
                    <MdErrorOutline size={24} />
                    <div>
                      <p>Important Information</p>
                      <p>
                        Please ensure your account details are correct. We’ll
                        use your registered email and username for this booking.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    Payment Information
                  </h2>

                  {/* Payment Options - eSewa only */}
                  <div className="flex gap-4 mb-6">
                    <button
                      type="button"
                      disabled={!paymentInfo.agreed}
                      className={`border rounded-lg p-3 w-full transition ${
                        paymentInfo.method === "esewa"
                          ? "bg-green-500 text-white border-green-500"
                          : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                      } ${
                        !paymentInfo.agreed
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                      onClick={() => {
                        if (!paymentInfo.agreed) {
                          alert("Please agree to Terms and Conditions first.");
                          return;
                        }
                        setPaymentInfo({ ...paymentInfo, method: "esewa" });
                      }}
                    >
                      eSewa
                    </button>
                  </div>

                  {/* eSewa Payment */}
                  {paymentInfo.method === "esewa" && paymentInfo.agreed && (
                    <ESewaForm
                      amount={finalTotalPrice}
                      bookingId={id!}
                      bookingPayload={bookingPayload}
                      onBeforeSubmit={async () => {
                        if (!vehicle?.categoryId) return false;
                        if (!licenseFile && !pending?.licenseImgBase64) return false;
                        try {
                          const formData = new FormData();
                          formData.append("licenseNo", licenseNumber);
                          formData.append("bookingDate", new Date().toISOString());
                          formData.append("returnDate", new Date(returnDate).toISOString());
                          formData.append("price", String(finalTotalPrice));
                          formData.append("pickuplocation", pickupLocation);
                          formData.append("droplocation", returnLocation);
                          formData.append("paymentMethod", paymentInfo.method);
                          if (licenseFile) {
                            formData.append("licenseImg", licenseFile);
                          } else if (pending?.licenseImgBase64) {
                            const res = await fetch(pending.licenseImgBase64);
                            const blob = await res.blob();
                            formData.append("licenseImg", blob, "license.jpg");
                          }

                          const url = `http://localhost:4000/vehicle/book/booking/${vehicle.categoryId}/${vehicle.id}`;
                          await API.post(url, formData, {
                            headers: { "Content-Type": "multipart/form-data" },
                            withCredentials: true,
                          });
                          return true;
                        } catch (err: any) {
                          const resp = err?.response;
                          const msg = resp?.data?.message || resp?.data?.error || err?.message || "Unknown error";
                          console.error("Booking create failed:", msg, resp?.status, resp?.data);
                          alert(msg || "Booking failed. Please try again.");
                          return false;
                        }
                      }}
                    />
                  )}

                  {/* Khalti Coming Soon */}
                  {paymentInfo.method === "khalti" && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                      <p className="mb-4 text-gray-700">
                        <span className="font-semibold text-purple-700">
                          Khalti
                        </span>{" "}
                        payment option is{" "}
                        <span className="font-semibold">coming soon!</span> 🚧
                      </p>
                      <button
                        disabled
                        className="bg-purple-400 text-white px-6 py-2 rounded-lg shadow opacity-60 cursor-not-allowed"
                      >
                        Pay with Khalti
                      </button>
                    </div>
                  )}

                  {/* Terms and Conditions */}
                  <label className="flex items-center gap-2 mt-6 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={paymentInfo.agreed}
                      onChange={(e) =>
                        setPaymentInfo({
                          ...paymentInfo,
                          agreed: e.target.checked,
                        })
                      }
                    />
                    I agree to Terms and Conditions
                  </label>

                  {/* Secure Payment Info */}
                  <div className="mt-4 p-4 border border-green-200 bg-green-50 rounded-lg flex items-center gap-2 text-green-700 text-sm">
                    <MdLockOutline size={24} />
                    <div>
                      <p className="font-semibold">Secure Payment</p>
                      <p>
                        Your payment information is encrypted and secure. We
                        never store your card details.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between bg-white p-5 rounded-2xl mt-6">
              {step > 1 && (
                <button
                  onClick={prevStep}
                  className="px-4 py-2 flex items-center rounded bg-gray-200 hover:bg-gray-300"
                >
                  <MdKeyboardArrowLeft size={24} /> Previous
                </button>
              )}
              {step < 3 ? (
                <button
                  onClick={nextStep}
                  className="ml-auto px-4 flex items-center py-2 rounded bg-red text-white hover:bg-gradient-red"
                >
                  Next <MdNavigateNext size={24} />
                </button>
              ) : null}
            </div>
          </div>

          {/* Right Section: Booking Summary */}
          <div className="lg:w-[25rem] bg-white rounded-2xl shadow-sm p-6 border h-fit sticky top-20 border-gray-100">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              Booking Summary
            </h2>
            <div className="overflow-hidden rounded-xl mb-4">
              <img
                src={vehicleImages[0]} // ✅ Use converted URL
                alt={vehicle.title}
                className="w-full h-40 object-cover transition-transform hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = "/fallback-image.jpg";
                }}
              />
            </div>
            <div className="flex justify-between items-center mb-6">
              <p className="text-lg font-medium text-gray-800">
                {vehicle.title}
              </p>
              <p className="text-lg font-semibold text-red-500">
                Rs. {vehicle.pricePerDay}
              </p>
            </div>
            <div className="space-y-3 text-sm text-gray-700">
              <p className="flex justify-between">
                <span className="text-gray-500">Pickup Date</span>
                <span>{pickupDate}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500">Return Date</span>
                <span>{returnDate}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500">Pickup Location</span>
                <span className="text-right">{pickupLocation}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500">Return Location</span>
                <span className="text-right">{returnLocation}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500">Rental Type</span>
                <span>Self Drive</span>
              </p>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600 font-medium">Total</span>
              <span className="text-xl font-semibold text-gray-900">
                Rs. {finalTotalPrice}
              </span>
            </div>
            <div className="mt-6 space-y-2 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                ✔ Secure payment processing
              </p>
              <p className="flex items-center gap-2">
                ✔ Free cancellation up to 24h
              </p>
              <p className="flex items-center gap-2">✔ Instant confirmation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmBooking;
