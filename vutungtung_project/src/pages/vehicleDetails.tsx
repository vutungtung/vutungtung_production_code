import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  FaCheckCircle,
  FaHeart,
  FaRegClock,
  FaRegHeart,
  FaShieldAlt,
} from "react-icons/fa";
import { LuCloudUpload } from "react-icons/lu";
import { LuFuel, LuUsers } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import { AuthContext } from "../context/AuthContext";

interface VehicleType {
  v_id: number;
  name: string;
  brand?: string;
  model?: string;
  description?: string;
  dailyRate: string | number;
  image?: string;
  image1?: string;
  image2?: string;
  features?: string[];
  transmission?: string;
  fuelType?: string;
  seatingCapacity?: number;
  categoryId?: number;
  status?: string;
}

const VehicleDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useContext(AuthContext);

  const [vehicle, setVehicle] = useState<VehicleType | null>(
    location.state?.vehicle || null
  );
  const [loading, setLoading] = useState(!vehicle);
  const [error, setError] = useState("");
  const [currentImage, setCurrentImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [pickupLocation, setPickupLocation] = useState("");
  const [returnLocation, setReturnLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const SERVICE_FEE = 20;
  const INSURANCE_PER_DAY = 15;

  useEffect(() => {
    if (!vehicle && id) {
      fetchVehicle();
    } else if (vehicle) {
      checkWishlistStatus();
    }
  }, [id, vehicle]);

  const fetchVehicle = async () => {
    try {
      setLoading(true);
      const res = await fetch(`https://vutungtungrental-backend.onrender.com/api/vehicles/id/${id}`);
      if (!res.ok) throw new Error("Vehicle not found");
      const data = await res.json();
      setVehicle(data);
      checkWishlistStatus();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const checkWishlistStatus = () => {
    if (!vehicle) return;
    const userId = auth?.user?.id || "guest";
    const wishlistKey = `wishlist_${userId}`;
    const wishlist = JSON.parse(localStorage.getItem(wishlistKey) || "[]");
    setIsWishlisted(
      wishlist.some(
        (it: any) => it.id === vehicle.v_id || it.v_id === vehicle.v_id
      )
    );
  };

  const getImageUrl = (img: string | undefined) => {
    if (!img) return "/fallback-image.jpg";
    if (
      img.startsWith("http://") ||
      img.startsWith("https://") ||
      img.startsWith("blob:")
    ) {
      return img;
    }
    return `https://vutungtungrental-backend.onrender.com/uploads/vehicles/${img}`;
  };

  const getVehicleImages = (vehicle: VehicleType | null) => {
    if (!vehicle) return ["/fallback-image.jpg"];
    const images = [vehicle.image, vehicle.image1, vehicle.image2]
      .filter((img) => img && img !== "")
      .map(getImageUrl);
    return images.length > 0 ? images : ["/fallback-image.jpg"];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setLicenseFile(e.target.files[0]);
    } else {
      setLicenseFile(null);
    }
  };

  const handleWishlist = () => {
    if (!vehicle) return;

    const userId = auth?.user?.id || "guest";
    const wishlistKey = `wishlist_${userId}`;
    let wishlist = JSON.parse(localStorage.getItem(wishlistKey) || "[]");

    const exists = wishlist.some(
      (item: any) => item.id === vehicle.v_id || item.v_id === vehicle.v_id
    );

    if (exists) {
      wishlist = wishlist.filter(
        (item: any) => item.id !== vehicle.v_id && item.v_id !== vehicle.v_id
      );
      setIsWishlisted(false);
    } else {
      wishlist.push({
        id: vehicle.v_id,
        title: vehicle.name,
        image: [getImageUrl(vehicle.image)],
        pricePerDay: Number(vehicle.dailyRate),
        description: vehicle.description || "",
      });
      setIsWishlisted(true);
    }

    localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
  };

  const handleBookNow = () => {
    if (
      !licenseNumber ||
      !licenseFile ||
      !pickupLocation ||
      !returnLocation ||
      !pickupDate ||
      !returnDate
    ) {
      alert("Please fill all required fields before booking.");
      return;
    }

    if (!auth?.user) {
      alert("Please login to book a vehicle.");
      navigate("/login");
      return;
    }

    const pickupDateObj = new Date(pickupDate);
    const returnDateObj = new Date(returnDate);
    const days = Math.max(
      1,
      Math.ceil(
        (returnDateObj.getTime() - pickupDateObj.getTime()) /
          (1000 * 60 * 60 * 24)
      )
    );

    const pricePerDay = Number(vehicle!.dailyRate);
    const totalPrice =
      pricePerDay * days + SERVICE_FEE + INSURANCE_PER_DAY * days;

    // Convert license image to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const licenseImageBase64 = reader.result as string;

      const bookingData = {
        vehicleId: vehicle!.v_id,
        categoryId: vehicle!.categoryId || 0,
        vehicleName: vehicle!.name,
        bookingDate: new Date().toISOString(),
        returnDate: returnDateObj.toISOString(),
        price: totalPrice,
        pickuplocation: pickupLocation,
        droplocation: returnLocation,
        licenseNo: licenseNumber,
        licenseImgBase64: licenseImageBase64,
        paymentMethod: "esewa",
        days: days,
        pricePerDay: pricePerDay,
        serviceFee: SERVICE_FEE,
        insuranceFee: INSURANCE_PER_DAY * days,
      };

      // Store booking data for payment page
      sessionStorage.setItem("bookingData", JSON.stringify(bookingData));
      navigate("/payment", { state: { bookingData } });
    };

    reader.readAsDataURL(licenseFile);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">
            {error || "Vehicle not found"}
          </p>
          <button
            onClick={() => navigate("/available-vehicles")}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Back to Vehicles
          </button>
        </div>
      </div>
    );
  }

  const images = getVehicleImages(vehicle);
  const pricePerDay = Number(vehicle.dailyRate);

  const nextImage = () =>
    setCurrentImage((prev) => (images.length ? (prev + 1) % images.length : 0));
  const prevImage = () =>
    setCurrentImage((prev) =>
      images.length ? (prev - 1 + images.length) % images.length : 0
    );

  const calculateTotal = () => {
    if (!pickupDate || !returnDate) return 0;
    const days = Math.max(
      1,
      Math.ceil(
        (new Date(returnDate).getTime() - new Date(pickupDate).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    );
    return days * pricePerDay + SERVICE_FEE + INSURANCE_PER_DAY * days;
  };

  // Get today's date
  const today = new Date();

  // Set minimum pickup date to tomorrow
  const minPickupDate = new Date(today);
  minPickupDate.setDate(today.getDate() + 1);

  // Format to YYYY-MM-DD (for input[type="date"])
  const formattedMinPickupDate = minPickupDate.toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate("/vehicles")}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-800"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Vehicles
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Vehicle Info */}
          <div className="flex-1 space-y-6">
            <div className="relative w-full h-96 rounded-xl overflow-hidden shadow-lg">
              <img
                src={images[currentImage]}
                alt={vehicle.name}
                className="w-full h-full object-cover transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src = "/fallback-image.jpg";
                }}
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/30 text-white p-3 rounded-full hover:bg-black/50 transition"
                  >
                    {"<"}
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/30 text-white p-3 rounded-full hover:bg-black/50 transition"
                  >
                    {">"}
                  </button>
                </>
              )}
            </div>

            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {vehicle.name}
                </h1>
                <p className="text-gray-500 mt-1">
                  {vehicle.brand
                    ? `${vehicle.brand} • ${vehicle.model || ""}`
                    : "Vehicle"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-red-600">
                  Rs. {pricePerDay}
                </p>
                <span className="text-gray-500 text-sm">per day</span>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-semibold border-t pt-5">
                About Vehicle
              </h2>
              <p className="text-gray-600 text-justify">
                {vehicle.description}
              </p>
            </div>

            {/* Vehicle Specs */}
            <div className="space-y-3">
              <h2 className="text-xl font-semibold">Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 p-3 bg-white rounded-lg shadow">
                  <LuUsers className="text-red-500" size={20} />
                  <div>
                    <p className="font-semibold">{vehicle.seatingCapacity}</p>
                    <p className="text-sm text-gray-500">Seats</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-white rounded-lg shadow">
                  <IoSettingsOutline className="text-red-500" size={20} />
                  <div>
                    <p className="font-semibold">{vehicle.transmission}</p>
                    <p className="text-sm text-gray-500">Transmission</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-white rounded-lg shadow">
                  <LuFuel className="text-red-500" size={20} />
                  <div>
                    <p className="font-semibold">{vehicle.fuelType}</p>
                    <p className="text-sm text-gray-500">Fuel Type</p>
                  </div>
                </div>
              </div>
            </div>

            {vehicle.features && vehicle.features.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-xl font-semibold">What's Included</h2>
                <div className="grid grid-cols-2 gap-3">
                  {vehicle.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-green-600 font-medium"
                    >
                      <FaCheckCircle />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking Card */}
          <div className="lg:w-[400px] w-full bg-white p-6 rounded-xl shadow-lg sticky top-20 space-y-5">
            <h2 className="text-2xl font-bold text-gray-900">
              Book This Vehicle
            </h2>

            {/* Location and Date Selection */}
            <div className="space-y-4">
              {/* Pickup Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pickup Location *
                </label>
                <select
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  required
                >
                  <option value="" disabled>
                    Select Pickup City
                  </option>
                  <option value="Kathmandu">Kathmandu</option>
                  <option value="Pokhara">Pokhara</option>
                  <option value="Lalitpur">Lalitpur</option>
                  <option value="Biratnagar">Biratnagar</option>
                  <option value="Birgunj">Birgunj</option>
                  <option value="Dharan">Dharan</option>
                  <option value="Bharatpur">Bharatpur</option>
                  <option value="Hetauda">Hetauda</option>
                  <option value="Butwal">Butwal</option>
                  <option value="Nepalgunj">Nepalgunj</option>
                </select>
              </div>

              {/* Return Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Return Location *
                </label>
                <select
                  value={returnLocation}
                  onChange={(e) => setReturnLocation(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  required
                >
                  <option value="">Select Return City</option>
                  <option value="Kathmandu">Kathmandu</option>
                  <option value="Pokhara">Pokhara</option>
                  <option value="Lalitpur">Lalitpur</option>
                  <option value="Biratnagar">Biratnagar</option>
                  <option value="Birgunj">Birgunj</option>
                  <option value="Dharan">Dharan</option>
                  <option value="Bharatpur">Bharatpur</option>
                  <option value="Hetauda">Hetauda</option>
                  <option value="Butwal">Butwal</option>
                  <option value="Nepalgunj">Nepalgunj</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pickup Date *
                  </label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                    required
                    min={formattedMinPickupDate}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Return Date *
                  </label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    min={pickupDate || new Date().toISOString().split("T")[0]}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* License Verification */}
            <div className="border border-gray-200 bg-gray-50 p-4 rounded-lg space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900">
                  License Verification
                </h3>
                <p className="text-xs text-red-500">Required*</p>
              </div>

              <input
                type="text"
                placeholder="Enter License Number"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
              />

              <div className="border-2 border-dashed border-gray-300 hover:border-red-500 transition-all p-4 rounded-lg text-center cursor-pointer">
                <label
                  htmlFor="licenseUpload"
                  className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
                >
                  <LuCloudUpload className="w-8 h-8 text-red-500 mb-2" />
                  <p className="font-medium text-gray-700">
                    {licenseFile
                      ? licenseFile.name
                      : "Upload your license image"}
                  </p>
                  {!licenseFile && (
                    <p className="text-xs text-gray-400 mt-1">
                      JPG or PNG, up to 5MB
                    </p>
                  )}
                </label>
                <input
                  id="licenseUpload"
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleFileChange}
                  className="hidden"
                  required
                />
              </div>

              {!licenseFile && (
                <p className="text-xs text-red-500 text-center">
                  Please upload your license image*
                </p>
              )}
            </div>

            {/* Price Breakdown */}
            {pickupDate && returnDate && (
              <div className="border-t pt-4 space-y-2 text-gray-700">
                <h3 className="text-lg font-semibold">Price Breakdown</h3>
                <div className="flex justify-between">
                  <span>Daily Rate</span>
                  <span>Rs. {pricePerDay}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration</span>
                  <span>
                    {Math.max(
                      1,
                      Math.ceil(
                        (new Date(returnDate).getTime() -
                          new Date(pickupDate).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )
                    )}{" "}
                    days × Rs. {pricePerDay}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Service Fee</span>
                  <span>Rs. {SERVICE_FEE}</span>
                </div>
                <div className="flex justify-between">
                  <span>Insurance (self-drive)</span>
                  <span>
                    Rs.{" "}
                    {INSURANCE_PER_DAY *
                      Math.max(
                        1,
                        Math.ceil(
                          (new Date(returnDate).getTime() -
                            new Date(pickupDate).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )
                      )}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>Rs. {calculateTotal()}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleBookNow}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg py-3 transition"
              >
                Proceed to Payment
              </button>

              <button
                onClick={handleWishlist}
                className={`w-full border rounded-lg py-3 flex items-center justify-center gap-2 font-semibold transition ${
                  isWishlisted
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "border-red-600 text-red-600 hover:bg-red-50"
                }`}
              >
                {isWishlisted ? <FaHeart /> : <FaRegHeart />}
                {isWishlisted ? "Added to Wishlist" : "Add to Wishlist"}
              </button>
            </div>

            <div className="text-center text-gray-500 text-sm space-y-1">
              <p className="flex items-center justify-center gap-2">
                <FaRegClock /> Instant confirmation
              </p>
              <p className="flex items-center justify-center gap-2">
                <FaShieldAlt /> Free cancellation up to 24h
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
