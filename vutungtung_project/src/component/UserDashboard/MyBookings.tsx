import { useEffect, useState } from "react";
import { useAuth } from "../../context/UseContext";
import { getUserBookings } from "../../api/api";
import {
  FiGrid,
  FiRefreshCcw,
  FiCalendar,
  FiMapPin,
  FiCreditCard,
} from "react-icons/fi";
import { FaList } from "react-icons/fa";
import { MdDirectionsCar } from "react-icons/md";

interface Booking {
  vehicleName: string;
  categoryName: string;
  bookingId: number;
  bookingDate: string;
  returnDate: string;
  pickuplocation: string;
  droplocation: string;
  deliverystatus: string;
  paymentMethod: string;
  paymentStatus: string;
  price: string;
  licenseNo: string;
  createdAt: string;
}

const MyBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filtered, setFiltered] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"recent" | "oldest">("recent");
  const [view, setView] = useState<"card" | "list">("card");
  const { user } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getUserBookings();
        console.log("User bookings API response:", res.data);

        const data = (res.data as any).data;
        if (Array.isArray(data)) {
          console.log("Bookings received from backend:", data);
          data.forEach((booking: any, index: number) => {
            console.log(`Booking ${index + 1}:`, {
              paymentStatus: booking.paymentStatus,
              deliveryStatus: booking.deliverystatus,
              paymentMethod: booking.paymentMethod,
              createdAt: booking.createdAt,
            });
          });
          setBookings(data);
          // Don't set filtered here, let applyFiltersAndSort handle it
        } else {
          setError("Invalid data format received from server.");
        }
      } catch (err: any) {
        console.error("Error fetching bookings:", err);
        setError(err.response?.data?.message || "Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  useEffect(() => {
    if (bookings.length > 0) {
      console.log("Applying filters and sort. Current sort order:", sortOrder);
      applyFiltersAndSort();
    }
  }, [filter, sortOrder, bookings]);

  const applyFiltersAndSort = () => {
    let result = [...bookings];

    console.log("Before filter - Total bookings:", result.length);

    // Apply status filter
    if (filter !== "all") {
      result = result.filter(
        (b) => b.deliverystatus.toLowerCase() === filter.toLowerCase()
      );
      console.log(`After filter '${filter}' - Bookings:`, result.length);
    }

    // Apply date sorting
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      const sortResult = sortOrder === "recent" ? dateB - dateA : dateA - dateB;
      return sortResult;
    });

    console.log(
      `After sort '${sortOrder}' - First booking created at:`,
      result[0]?.createdAt
    );
    console.log(
      `After sort '${sortOrder}' - Last booking created at:`,
      result[result.length - 1]?.createdAt
    );

    setFiltered(result);
  };

  const handleFilter = (status: string) => {
    setFilter(status);
  };

  const handleSortToggle = () => {
    setSortOrder(sortOrder === "recent" ? "oldest" : "recent");
  };

  if (loading)
    return (
      <div className="text-center mt-20 flex flex-col items-center text-gray-600">
        <FiRefreshCcw className="animate-spin w-8 h-8 mb-2 text-blue-500" />
        <p>Loading your bookings...</p>
      </div>
    );

  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-2">My Bookings</h2>
        <p className="text-gray-600">Manage and track your vehicle rentals</p>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm">
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-semibold text-gray-700 self-center mr-2">
            Filter:
          </span>
          {["all", "pending", "dilivered", "cancled"].map((status) => (
            <button
              key={status}
              onClick={() => handleFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition duration-200 ${
                filter === status
                  ? "bg-red-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Sort and View Controls */}
        <div className="flex items-center gap-3">
          {/* Sort Button */}
          <button
            onClick={handleSortToggle}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-semibold text-gray-700 transition"
          >
            <FiCalendar size={16} />
            {sortOrder === "recent" ? "Recent First" : "Oldest First"}
          </button>

          {/* View Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setView("card")}
              className={`p-2 rounded-lg transition ${
                view === "card"
                  ? "bg-red-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FiGrid size={18} />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-2 rounded-lg transition ${
                view === "list"
                  ? "bg-red-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaList size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* No Bookings */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <MdDirectionsCar className="mx-auto text-gray-300 text-6xl mb-4" />
          <p className="text-gray-500 text-lg">No bookings found.</p>
        </div>
      ) : view === "card" ? (
        // 🔵 CARD VIEW
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((b, idx) => (
            <div
              key={idx}
              className={`rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 ${
                b.deliverystatus === "dilivered"
                  ? "border-green-200 bg-gradient-to-br from-green-50 to-white"
                  : b.deliverystatus === "cancled"
                  ? "border-red-200 bg-gradient-to-br from-red-50 to-white"
                  : "border-yellow-200 bg-gradient-to-br from-yellow-50 to-white"
              }`}
            >
              {/* Status Badge */}
              <div className="p-4 pb-0">
                <span
                  className={`inline-block px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${
                    b.deliverystatus === "dilivered"
                      ? "bg-green-500 text-white"
                      : b.deliverystatus === "cancled"
                      ? "bg-red-500 text-white"
                      : "bg-yellow-500 text-white"
                  }`}
                >
                  {b.deliverystatus}
                </span>
              </div>

              {/* Booking Content */}
              <div className="p-6">
                {/* Vehicle Info */}
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                    <MdDirectionsCar className="text-gray-600" />
                    {b.vehicleName}
                  </h3>
                  <p className="text-sm text-gray-600 font-medium">
                    {b.categoryName}
                  </p>
                </div>

                {/* Details Grid */}
                <div className="space-y-3 mb-4">
                  {/* Dates */}
                  <div className="flex items-start gap-2 text-sm">
                    <FiCalendar
                      className="text-gray-500 mt-1 flex-shrink-0"
                      size={16}
                    />
                    <div className="flex-1">
                      <p className="text-gray-700">
                        <span className="font-semibold">Pickup:</span>{" "}
                        {new Date(b.bookingDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">Return:</span>{" "}
                        {new Date(b.returnDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-2 text-sm">
                    <FiMapPin
                      className="text-gray-500 mt-1 flex-shrink-0"
                      size={16}
                    />
                    <div className="flex-1">
                      <p className="text-gray-700">
                        {b.pickuplocation}{" "}
                        <span className="text-gray-400">→</span>{" "}
                        {b.droplocation}
                      </p>
                    </div>
                  </div>

                  {/* Payment */}
                  <div className="flex items-start gap-2 text-sm">
                    <FiCreditCard
                      className="text-gray-500 mt-1 flex-shrink-0"
                      size={16}
                    />
                    <div className="flex-1">
                      <p className="text-gray-700">
                        <span className="font-semibold">{b.paymentMethod}</span>
                        <span
                          className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                            b.paymentStatus === "completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {b.paymentStatus === "completed" ? "Paid" : "Pending"}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* License */}
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">License:</span>{" "}
                    {b.licenseNo}
                  </div>
                </div>

                {/* Price */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">
                      Total Amount
                    </span>
                    <span className="text-2xl font-bold text-red-600">
                      Rs. {b.price}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // 🔴 LIST VIEW
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="py-4 px-6 text-left font-semibold text-gray-700">
                    Vehicle
                  </th>
                  <th className="py-4 px-6 text-left font-semibold text-gray-700">
                    Booking Date
                  </th>
                  <th className="py-4 px-6 text-left font-semibold text-gray-700">
                    Return Date
                  </th>
                  <th className="py-4 px-6 text-left font-semibold text-gray-700">
                    Route
                  </th>
                  <th className="py-4 px-6 text-left font-semibold text-gray-700">
                    Payment
                  </th>
                  <th className="py-4 px-6 text-left font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="py-4 px-6 text-right font-semibold text-gray-700">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((b, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50 transition duration-150"
                  >
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {b.vehicleName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {b.categoryName}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-700">
                      {new Date(b.bookingDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-4 px-6 text-gray-700">
                      {new Date(b.returnDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-4 px-6 text-gray-700 text-sm">
                      {b.pickuplocation} → {b.droplocation}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-gray-700 font-medium text-xs">
                          {b.paymentMethod}
                        </span>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-semibold w-fit ${
                            b.paymentStatus === "completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {b.paymentStatus === "completed" ? "Paid" : "Pending"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                          b.deliverystatus === "dilivered"
                            ? "bg-green-100 text-green-700"
                            : b.deliverystatus === "cancled"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {b.deliverystatus}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-bold text-gray-900">
                      Rs. {b.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
