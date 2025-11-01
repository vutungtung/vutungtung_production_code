import { useState } from "react";
import { LuFuel, LuUsers } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

interface VehicleCardProps {
  id: string;
  title: string;
  image: string[]; // This could be filenames or full URLs
  seatingCapacity: number;
  transmission: string;
  fuelType: string;
  description: string;
  pricePerDay: number;
  isAvailable?: boolean; // Add this prop
  isFavorited?: boolean; // Add this prop
  // onFavoriteToggle: (vehicleId: string) => void; // Add this prop
}

const VehicleCard: React.FC<VehicleCardProps> = ({
  id,
  title,
  image,
  seatingCapacity,
  transmission,
  fuelType,
  description,
  pricePerDay,
  isAvailable = true, // Default to true if not provided
}) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  // ✅ Convert image filenames to full URLs
  const getImageUrl = (img: string) => {
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
    return `https://vutungtungrental-backend.onrender.com/uploads/vehicles/${img}`;
  };

  // ✅ Get all valid images
  const validImages =
    image
      ?.filter((img) => img && img !== "") // Remove empty images
      ?.map(getImageUrl) || []; // Convert to full URLs

  const nextImage = () => {
    if (validImages.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % validImages.length);
    }
  };

  const prevImage = () => {
    if (validImages.length > 1) {
      setCurrentIndex(
        (prev) => (prev - 1 + validImages.length) % validImages.length
      );
    }
  };

  // ✅ If no images, use fallback
  if (validImages.length === 0) {
    validImages.push("/fallback-image.jpg");
  }

  return (
    <div className="relative md:h-[25rem] border-gray-200 border rounded-2xl hover:shadow-lg hover:-translate-y-5 duration-300 shadow-accent/30 overflow-hidden">
      {/* Image Slider */}
      <div className="relative">
        <img
          src={validImages[currentIndex]}
          alt={title}
          className="h-48 w-full  object-cover"
          onError={(e) => {
            e.currentTarget.src = "/fallback-image.jpg";
          }}
        />
        {validImages.length > 1 && (
          <>
            {/* Prev Button */}
            <button
              onClick={prevImage}
              className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
            >
              <IoChevronBack size={18} />
            </button>
            {/* Next Button */}
            <button
              onClick={nextImage}
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
            >
              <IoChevronForward size={18} />
            </button>
          </>
        )}
        {/* Availability Indicator */}
        {isAvailable ? (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
            Available
          </span>
        ) : (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
            Unavailable
          </span>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2 p-5">
        <h1 className="text-2xl line-clamp-1 font-semibold">{title}</h1>
        <div className="text-sm text-gray-600 flex flex-wrap gap-x-3 items-center">
          <p className="inline-flex justify-center items-center text-base gap-1">
            <LuUsers size={15} />
            {seatingCapacity} Seats
          </p>
          <p className="inline-flex items-center text-base gap-1">
            <IoSettingsOutline size={15} />
            {transmission}
          </p>
          <p className="inline-flex justify-center items-center text-base gap-1">
            <LuFuel size={15} />
            {fuelType}
          </p>
        </div>
        <p className="text-gray-600 line-clamp-1">{description}</p>
        <div className="md:absolute bottom-5 right-5 left-5 flex justify-between items-center">
          <p className="text-red font-heading text-xl font-semibold">
            Rs.{pricePerDay}
            <span className="text-sm text-gray-600 font-normal">/day</span>
          </p>
          <button
            onClick={() => navigate(`/vehicles/${id}`)}
            className="bg-red hover:bg-gradient-red text-white font-medium p-2 rounded-lg"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
