import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdCloseCircle } from "react-icons/io";
import { AuthContext } from "../../context/AuthContext";

interface Vehicle {
  id: string | number;
  v_id: string | number;
  title: string;
  image: string[];
  pricePerDay: number;
  description: string;
  features?: string[];
}

const Wishlist = () => {
  const [wishlist, setWishlist] = useState<Vehicle[]>([]);
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  useEffect(() => {
    // Get user-specific wishlist key
    const userId = auth?.user?.id || "guest";
    const wishlistKey = `wishlist_${userId}`;
    const storedWishlist = JSON.parse(localStorage.getItem(wishlistKey) || "[]");
    setWishlist(storedWishlist);
  }, [auth?.user?.id]);

  const removeFromWishlist = (id: string | number) => {
    const userId = auth?.user?.id || "guest";
    const wishlistKey = `wishlist_${userId}`;
    const updated = wishlist.filter(
      (item) => item.id !== id && item.v_id !== id
    );
    setWishlist(updated);
    localStorage.setItem(wishlistKey, JSON.stringify(updated));
  };

  const handleBookNow = (id: string | number) => {
    navigate(`/vehicles/${id}`);
  };

  return (
    <div className="max-w-7xl mx-auto  py-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">My Wishlist</h2>

      {wishlist.length === 0 ? (
        <p className="text-gray-500 text-center py-10">
          No vehicles in your wishlist yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlist.map((car) => (
            <div
              key={car.id}
              onClick={() => handleBookNow(car.id)}
              className="relative group rounded-2xl overflow-hidden backdrop-blur-xl border border-white/20 shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl cursor-pointer"
            >
              {/* Remove Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // prevent redirect when removing
                  removeFromWishlist(car.id);
                }}
                className="absolute top-3 right-3 z-20 text-white rounded-full p-1 hover:text-red-500 transition"
              >
                <IoMdCloseCircle size={24} />
              </button>

              {/* 🖼️ Vehicle Image */}
              <div className="h-56 w-full overflow-hidden">
                <img
                  src={car.image?.[0] || "/fallback-image.jpg"}
                  alt={car.title}
                  className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* 🧊 Glass Overlay */}
              <div
                className="
                  absolute inset-0 bg-black/50 backdrop-blur-md
                  opacity-100 lg:opacity-0 lg:group-hover:opacity-100
                  transition-opacity duration-500 flex flex-col justify-end p-5
                "
              >
                <h3 className="text-xl font-semibold text-white mb-2">
                  {car.title}
                </h3>

                <p className="text-sm text-gray-200 line-clamp-2 mb-4">
                  {car.description || "No description available."}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-red-400">
                    Rs. {car.pricePerDay}/day
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // prevent double navigation
                      handleBookNow(car.id);
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
