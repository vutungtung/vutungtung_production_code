import { useState, useEffect } from "react";
import axios from "axios";
import { MdOutlineFilterAltOff } from "react-icons/md";
import VehicleCard from "../component/VehicleCard";
import Pagination from "../component/pagination";

interface VehicleType {
  v_id: string | number;
  name: string;
  image: string;
  image1?: string;
  image2?: string;
  seatingCapacity: number;
  transmission: string;
  fuelType: string;
  description: string;
  dailyRate: string | number;
  category: {
    name: string;
  };
  status?: string; // EXPECTED: 'AVAILABLE' | 'BOOKED' | etc.
  isFavorited?: boolean; // Add this prop
}

const Vehicle = () => {
  const [vehiclesData, setVehiclesData] = useState<VehicleType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favoritedVehicles, ] = useState<string[]>([]);

  const [filters, setFilters] = useState({
    category: "",
    transmission: "",
    pricePerDay: "",
    fuelType: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const response = await axios.get<VehicleType[]>(
          "https://vutungtungrental-backend.onrender.com/api/vehicles/"
        );
        setVehiclesData(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch vehicles.");
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const handleFilterChanger = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Handle favorite toggle
  // const handleFavoriteToggle = (vehicleId: string) => {
  //   setFavoritedVehicles((prevFavorites) => {
  //     if (prevFavorites.includes(vehicleId)) {
  //       return prevFavorites.filter((id) => id !== vehicleId);
  //     } else {
  //       return [...prevFavorites, vehicleId];
  //     }
  //   });
  // };

  // Filter vehicles dynamically
  const filteredVehicles = vehiclesData.filter((vehicle) => {
    const matchCategory =
      filters.category === "" || vehicle.category.name === filters.category;
    const matchTransmission =
      filters.transmission === "" ||
      vehicle.transmission.toUpperCase() === filters.transmission.toUpperCase();
    const matchFuel =
      filters.fuelType === "" ||
      vehicle.fuelType.toUpperCase() === filters.fuelType.toUpperCase();
    const matchPrice =
      filters.pricePerDay === "" ||
      (() => {
        const [minStr, maxStr] = filters.pricePerDay
          .replace(/Rs\./g, "")
          .split("-")
          .map((s) => s.trim());
        const min = parseInt(minStr);
        const max = parseInt(maxStr);
        return (
          parseInt(vehicle.dailyRate.toString()) >= min &&
          parseInt(vehicle.dailyRate.toString()) <= max
        );
      })();
    const isAvailable = (vehicle.status || "").toUpperCase() === "AVAILABLE";

    return (
      isAvailable &&
      matchCategory &&
      matchTransmission &&
      matchPrice &&
      matchFuel
    );
  });

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedVehicles = filteredVehicles.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500 text-xl">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-500 text-xl">{error}</div>
    );
  }

  return (
    <div className="w-full max-w-[1290px] px-5 xl:px-0 py-10 mx-auto h-auto">
      <div className="space-y-5">
        <h1 className="text-4xl font-bold text-foreground">
          Our Vehicle Fleet
        </h1>
        <p className="text-xl text-gray-500">
          Browse our extensive collection of premium vehicles
        </p>

        {/* Filters */}
        <div className="border border-gray-200 gap-5 rounded-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 py-8 px-5 w-full mx-auto">
          {/* Category Filter */}
          <div className="w-full flex flex-col">
            <label className="mb-2 text-md text-gray-500 font-semibold">
              Category
            </label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChanger}
              className="border border-gray-200 focus:outline-0 rounded-xl px-2 py-2 w-full"
            >
              <option value="">All Categories</option>
              <option value="SUV">SUV</option>
              <option value="Car">Car</option>
              <option value="Truck">Truck</option>
              <option value="Rickshaw">Rickshaw</option>
              <option value="2-Wheeler">2-Wheeler</option>
            </select>
          </div>

          {/* Price Filter */}
          <div className="w-full flex flex-col">
            <label className="mb-2 text-md text-gray-500 font-semibold">
              Price Range
            </label>
            <select
              name="pricePerDay"
              value={filters.pricePerDay}
              onChange={handleFilterChanger}
              className="border border-gray-200 focus:outline-0 rounded-xl px-2 py-2 w-full"
            >
              <option value="">Any Price</option>
              <option value="Rs.1000 - Rs.3000">Rs.1000 - Rs.3000</option>
              <option value="Rs.4000 - Rs.6000">Rs.4000 - Rs.6000</option>
              <option value="Rs.7000 - Rs.10000">Rs.7000 - Rs.10000</option>
              <option value="Rs.11000 - Rs.20000">Rs.11000 - Rs.20000</option>
            </select>
          </div>

          {/* Transmission Filter */}
          <div className="w-full flex flex-col">
            <label className="mb-2 text-md text-gray-500 font-semibold">
              Transmission
            </label>
            <select
              name="transmission"
              value={filters.transmission}
              onChange={handleFilterChanger}
              className="border border-gray-200 focus:outline-0 rounded-xl px-2 py-2 w-full"
            >
              <option value="">Any</option>
              <option value="MANUAL">Manual</option>
              <option value="AUTOMATIC">Automatic</option>
            </select>
          </div>

          {/* Fuel Filter */}
          <div className="w-full flex flex-col">
            <label className="mb-2 text-md text-gray-500 font-semibold">
              Fuel Type
            </label>
            <select
              name="fuelType"
              value={filters.fuelType}
              onChange={handleFilterChanger}
              className="border border-gray-200 focus:outline-0 rounded-xl px-2 py-2 w-full"
            >
              <option value="">All</option>
              <option value="PETROL">Petrol</option>
              <option value="DIESEL">Diesel</option>
              <option value="ELECTRIC">Electric</option>
              <option value="HYBRID">Hybrid</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={() =>
                setFilters({
                  category: "",
                  pricePerDay: "",
                  transmission: "",
                  fuelType: "",
                })
              }
              className="border bg-red h-fit hover:bg-gradient-red duration-300 inline-flex justify-center items-center text-white font-medium border-border rounded-xl px-3 py-2 w-full"
            >
              <MdOutlineFilterAltOff size={25} /> Clear Filter
            </button>
          </div>
        </div>
      </div>

      {/* Vehicles */}
      <div className="text-base text-gray-500 mt-8">
        Showing {paginatedVehicles.length} of {filteredVehicles.length} vehicles
      </div>
      <div className="grid sm:grid-cols-2 w-full lg:grid-cols-3 gap-8 py-8">
        {paginatedVehicles.length === 0 ? (
          <div className="col-span-full flex justify-center items-center min-h-[200px]">
            <p className="text-gray-500 text-lg text-center">
              No vehicles found.
            </p>
          </div>
        ) : (
          paginatedVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.v_id}
              id={vehicle.v_id.toString()}
              title={vehicle.name}
              image={[vehicle.image, vehicle.image1, vehicle.image2].filter(
                (img): img is string => !!img
              )}
              seatingCapacity={vehicle.seatingCapacity}
              transmission={vehicle.transmission}
              fuelType={vehicle.fuelType}
              description={vehicle.description}
              pricePerDay={parseInt(vehicle.dailyRate.toString())}
              isAvailable={(vehicle.status || "").toUpperCase() === "AVAILABLE"}
              isFavorited={favoritedVehicles.includes(vehicle.v_id.toString())}
              // onFavoriteToggle={handleFavoriteToggle}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalItems={filteredVehicles.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Vehicle;
