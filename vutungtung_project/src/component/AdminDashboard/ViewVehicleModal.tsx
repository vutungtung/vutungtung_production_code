import { useState } from "react";
import type { Vehicle } from "../../types/vehicle";

type Props = {
  vehicle: Vehicle;
  onClose: () => void;
};

const ViewVehicleModal = ({ vehicle, onClose }: Props) => {
  // ✅ Combine main + additional images
  const allImages = [vehicle.image, vehicle.image1, vehicle.image2].filter(
    (img): img is string => img !== undefined && img !== "" && img !== null
  );

  // ✅ State to store the currently selected main image
  const [mainImage, setMainImage] = useState(allImages[0]);

  // ✅ Features to array
  const featuresArray = Array.isArray(vehicle.features)
    ? vehicle.features
    : typeof vehicle.features === "string"
    ? vehicle.features.split(",").map((f) => f.trim())
    : [];

  // ✅ Get category name safely
  const categoryName =
    typeof vehicle.category === "object" && vehicle.category !== null
      ? vehicle.category.name
      : String(vehicle.category);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
        {/* Title */}
        <h2 className="text-2xl font-bold mb-2 text-gray-800">
          {vehicle.name || vehicle.title}
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          {vehicle.brand} • {vehicle.model}
        </p>

        {/* ✅ Main Image (clickable from gallery below) */}
        {mainImage && (
          <img
            src={`http://localhost:4000/uploads/vehicles/${mainImage}`}
            alt={vehicle.name || vehicle.title}
            className="w-full h-56 object-cover rounded-xl mb-6 transition-all duration-300"
            onError={(e) => {
              e.currentTarget.src = "/fallback-image.jpg";
            }}
          />
        )}

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-700">
          <p>
            <span className="font-semibold">Category:</span> {categoryName}
          </p>
          <p>
            <span className="font-semibold">Transmission:</span>{" "}
            {vehicle.transmission}
          </p>
          <p>
            <span className="font-semibold">Fuel:</span> {vehicle.fuelType}
          </p>
          <p>
            <span className="font-semibold">Seats:</span>{" "}
            {vehicle.seatingCapacity}
          </p>
          <p>
            <span className="font-semibold">Mileage:</span> {vehicle.mileage}
          </p>
          <p>
            <span className="font-semibold">License Plate:</span>{" "}
            {vehicle.licensePlate}
          </p>
          <p>
            <span className="font-semibold">VIN:</span> {vehicle.vin}
          </p>
          <p>
            <span className="font-semibold">Status:</span>{" "}
            <span
              className={`px-2 py-1 rounded text-xs ${
                vehicle.status === "AVAILABLE"
                  ? "bg-green-100 text-green-800"
                  : vehicle.status === "RENTED"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {vehicle.status}
            </span>
          </p>
          <p className="text-red font-semibold text-base col-span-2">
            Rs. {vehicle.dailyRate || vehicle.pricePerDay} / day
          </p>
        </div>

        {/* Features */}
        {featuresArray.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">
              Features
            </h3>
            <div className="flex flex-wrap gap-2">
              {featuresArray.map((f: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 text-xs bg-gray-100 rounded-full border"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {vehicle.description && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">
              Description
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {vehicle.description}
            </p>
          </div>
        )}

        {/* ✅ Gallery Section (click to change main image) */}
        {allImages.length > 1 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">
              Gallery ({allImages.length - 1} additional images)
            </h3>
            <div className="grid grid-cols-3 gap-5">
              {allImages.map((img: string, index: number) => (
                <img
                  key={index}
                  src={`http://localhost:4000/uploads/vehicles/${img}`}
                  alt={`${vehicle.name || vehicle.title} ${index + 1}`}
                  className={`h-24 w-full object-cover rounded-lg border cursor-pointer transition-transform duration-300 ${
                    mainImage === img
                      ? "ring-2 ring-blue-500 scale-105"
                      : "hover:scale-105"
                  }`}
                  onClick={() => setMainImage(img)} // ✅ Switch main image
                  onError={(e) => {
                    e.currentTarget.src = "/fallback-image.jpg";
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Close Button */}
        <div className="flex justify-end mt-8">
          <button
            className="px-4 py-2 bg-red text-white rounded-lg hover:bg-red/90 transition"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewVehicleModal;
