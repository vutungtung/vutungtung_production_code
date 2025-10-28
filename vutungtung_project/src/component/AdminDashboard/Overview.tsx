import { FaCar } from "react-icons/fa";
import { IoTrendingUpOutline } from "react-icons/io5";
import { MdOutlineCalendarToday } from "react-icons/md";
import { TbCurrencyDollar, TbUsers } from "react-icons/tb";
import { useEffect, useState } from "react";

interface Booking {
  id: number;
  vehicleName: string;
  categoryName: string;
  userName: string;
  bookingDate: string;
  returnDate: string;
  price: string;
  deliverystatus: string;
  paymentStatus: string;
  paymentMethod: string;
  pickuplocation: string;
  droplocation: string;
}

interface Vehicle {
  id: number;
  name: string;
  pricePerDay: number;
  status?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface Stats {
  totalRevenue: number;
  activeBookings: number;
  fleetVehicles: number;
  totalUsers: number;
  availableVehicles: number;
  rentedVehicles: number;
  maintenanceVehicles: number;
}

const Overview = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    activeBookings: 0,
    fleetVehicles: 0,
    totalUsers: 0,
    availableVehicles: 0,
    rentedVehicles: 0,
    maintenanceVehicles: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [bookingsRes, vehiclesRes, usersRes] = await Promise.all([
        fetch("http://localhost:4000/vehicle/book/bookingdetails/admin", {
          credentials: "include",
        }),
        fetch("http://localhost:4000/api/vehicles/", {
          credentials: "include",
        }),
        fetch("http://localhost:4000/user", {
          credentials: "include",
        }),
      ]);

      // Check responses
      if (!bookingsRes.ok || !vehiclesRes.ok || !usersRes.ok) {
        throw new Error("Failed to fetch data");
      }

      // Parse data
      const bookingsData = await bookingsRes.json();
      const vehiclesData = await vehiclesRes.json();
      const usersData = await usersRes.json();

      console.log("Bookings Data:", bookingsData);
      console.log("Vehicles Data:", vehiclesData);
      console.log("Users Data:", usersData);

      // Extract actual arrays from response
      const bookingsList = Array.isArray(bookingsData)
        ? bookingsData
        : bookingsData.data || [];
      const vehiclesList = Array.isArray(vehiclesData)
        ? vehiclesData
        : vehiclesData.data || vehiclesData.vehicles || [];
      const usersList = Array.isArray(usersData)
        ? usersData
        : usersData.data || usersData.users || [];

      setBookings(bookingsList);
      setVehicles(vehiclesList);
      setUsers(usersList);

      // Calculate statistics
      calculateStats(bookingsList, vehiclesList, usersList);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (
    bookingsList: Booking[],
    vehiclesList: Vehicle[],
    usersList: User[]
  ) => {
    // Calculate total revenue from completed payments
    const totalRevenue = bookingsList
      .filter((b) => b.paymentStatus === "completed")
      .reduce((sum, b) => sum + parseFloat(b.price || "0"), 0);

    // Calculate active bookings (pending delivery)
    const activeBookings = bookingsList.filter(
      (b) => b.deliverystatus === "pending"
    ).length;

    // Get rented vehicles count (active bookings)
    const rentedVehicles = activeBookings;

    // Calculate available vehicles (total - rented)
    const availableVehicles = Math.max(0, vehiclesList.length - rentedVehicles);

    // For now, maintenance is 0 (can be calculated if you have status field)
    const maintenanceVehicles = 0;

    setStats({
      totalRevenue,
      activeBookings,
      fleetVehicles: vehiclesList.length,
      totalUsers: usersList.length,
      availableVehicles,
      rentedVehicles,
      maintenanceVehicles,
    });
  };

  const OverviewData = [
    {
      id: 1,
      title: "Total Revenue",
      total: `Rs. ${stats.totalRevenue.toLocaleString()}`,
      growth: "22",
      icon: <TbCurrencyDollar size={20} />,
    },
    {
      id: 2,
      title: "Active Booking",
      total: stats.activeBookings.toString(),
      growth: "2",
      icon: <MdOutlineCalendarToday size={16} />,
    },
    {
      id: 3,
      title: "Fleet Vehicles",
      total: stats.fleetVehicles.toString(),
      growth: "12",
      icon: <FaCar size={20} />,
    },
    {
      id: 4,
      title: "Total Users",
      total: stats.totalUsers.toString(),
      growth: "52",
      icon: <TbUsers size={20} />,
    },
  ];

  // Get recent bookings (last 3)
  const recentBookings = bookings
    .sort(
      (a, b) =>
        new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()
    )
    .slice(0, 3);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-gray-600">Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">
          <p className="text-xl font-bold mb-2">Error loading dashboard</p>
          <p>{error}</p>
          <button
            onClick={fetchAllData}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl py-5 font-bold">Analytics</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
        {OverviewData.map((data, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-xl border border-gray-300"
          >
            <div className="text-gray-600 mb-2 flex justify-between items-center text-sm font-medium">
              <p>{data.title}</p>
              <p className="text-red">{data.icon}</p>
            </div>
            <p className="text-2xl font-bold">{data.total}</p>
            <p className="flex text-green-500 text-xs justify-start items-center">
              <IoTrendingUpOutline />+{data.growth}%
            </p>
          </div>
        ))}
      </div>

      <div className="md:flex gap-5">
        <div className="border border-gray-300 w-full rounded-xl bg-white p-5 mt-5">
          {/* Recent Bookings */}
          <div className="flex justify-start gap-2 items-center">
            <MdOutlineCalendarToday size={16} className="text-red" />
            <h1 className="text-xl font-bold">Recent Bookings</h1>
          </div>
          <div className="mt-5">
            {recentBookings.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No bookings yet</p>
            ) : (
              recentBookings.map((booking, index) => (
                <div key={index} className="bg-light-gray mt-5 rounded-2xl p-5">
                  <div className="flex justify-between">
                    <p className="font-medium">{booking.userName}</p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        booking.deliverystatus === "dilivered"
                          ? "bg-green-100 text-green-700"
                          : booking.deliverystatus === "cancled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {booking.deliverystatus}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <p className="text-gray-500 text-sm">
                      {booking.vehicleName}
                    </p>
                    <p className="font-semibold">Rs. {booking.price}</p>
                  </div>
                  <div className="flex justify-between mt-1">
                    <p className="text-gray-400 text-xs">
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {booking.paymentMethod}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Fleet Status */}
        <div className="border border-gray-300 w-full rounded-xl bg-white p-5 mt-5">
          <div className="flex justify-start gap-2 items-center">
            <FaCar size={20} className="text-red" />
            <h1 className="text-xl font-bold">Fleet Status</h1>
          </div>
          <div className="space-y-5">
            <div className="flex justify-between items mt-5">
              <p>Available</p>
              <div className="text-green-400 font-medium">
                {stats.availableVehicles} Vehicles
              </div>
            </div>
            <div className="flex justify-between items">
              <p>Rented</p>
              <div className="text-red font-medium">
                {stats.rentedVehicles} Vehicles
              </div>
            </div>
            <div className="flex justify-between items">
              <p>Maintenance</p>
              <div className="text-yellow-300 font-medium">
                {stats.maintenanceVehicles} Vehicles
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
