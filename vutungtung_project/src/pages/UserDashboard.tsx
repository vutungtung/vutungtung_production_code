import { useState, useContext, useEffect } from "react";
import MyBookings from "../component/UserDashboard/MyBookings";
import UserSetting from "../component/UserDashboard/UserSetting";
import Profile from "../component/UserDashboard/Profile";
import Wishlist from "../component/UserDashboard/Wishlist";
import { AuthContext } from "../context/AuthContext";
import { getAvatar } from "../lib/avatar";
import { getUserBookings } from "../api/api";

interface BookingStats {
  totalBookings: number;
  totalSpent: number;
}

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("bookings");
  const [bookingStats, setBookingStats] = useState<BookingStats>({
    totalBookings: 0,
    totalSpent: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchBookingStats = async () => {
      try {
        setStatsLoading(true);
        const res = await getUserBookings();
        const data = (res.data as any).data;

        if (Array.isArray(data)) {
          // Calculate total bookings (exclude cancelled ones for accurate count)
          const activeBookings = data.filter(
            (booking: any) => booking.deliverystatus !== "cancled"
          );

          // Calculate total spent (only from completed payments)
          const totalSpent = data
            .filter(
              (booking: any) =>
                booking.paymentStatus === "completed" &&
                booking.deliverystatus !== "cancled"
            )
            .reduce(
              (sum: number, booking: any) =>
                sum + parseFloat(booking.price || 0),
              0
            );

          setBookingStats({
            totalBookings: activeBookings.length,
            totalSpent: totalSpent,
          });
        }
      } catch (err) {
        console.error("Error fetching booking stats:", err);
      } finally {
        setStatsLoading(false);
      }
    };

    if (auth?.user) {
      fetchBookingStats();
    }
  }, [auth?.user]);

  if (auth?.loading) {
    return <p className="text-center py-10">Loading user data...</p>;
  }

  if (!auth?.user) {
    return (
      <div className="text-center py-10">
        <p>User not found. Please log in again.</p>
        <button
          onClick={() => (window.location.href = "/login")}
          className="mt-4 bg-red text-white px-4 py-2 rounded-lg"
        >
          Go to Login
        </button>
      </div>
    );
  }

  // Get user data - prioritize actual name from database
  const userData = {
    name: auth.user.name || auth.user.username || "User",
    email: auth.user.email || "No email provided",
    avatar: auth.user.avatar || getAvatar(auth.user.email || "user"),
  };

  return (
    <div>
      {/* Header Section */}
      <div className="bg-gradient-to-l from-red to-gradient-red">
        <div className="max-w-7xl text-white mx-auto p-5 md:py-10 flex items-center gap-5">
          {/* Profile Avatar */}
          <div className="h-24 w-24 rounded-full overflow-hidden border-4 bg-gray-200 border-white flex-shrink-0">
            <img
              src={userData.avatar}
              alt="User Avatar"
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  "https://api.dicebear.com/7.x/initials/svg?seed=user&backgroundColor=ffadad";
              }}
            />
          </div>

          {/* User Info */}
          <div>
            <h1 className="text-lg sm:text-3xl font-bold">
              Welcome back, <strong>{userData.name}</strong>!
            </h1>
            <p className="text-white/90">{userData.email}</p>

            {/* Stats */}
            <div className="flex gap-5 mt-3 text-sm">
              {statsLoading ? (
                <p className="text-white/70">Loading stats...</p>
              ) : (
                <>
                  <div className="bg-white/20 px-3 py-1 rounded-lg backdrop-blur-sm">
                    <strong>{bookingStats.totalBookings}</strong>{" "}
                    {bookingStats.totalBookings === 1 ? "Booking" : "Bookings"}
                  </div>
                  <div className="bg-white/20 px-3 py-1 rounded-lg backdrop-blur-sm">
                    <strong>
                      Rs. {bookingStats.totalSpent.toLocaleString()}
                    </strong>{" "}
                    Total Spent
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="max-w-7xl mx-auto xl:px-0 px-2 py-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-5 bg-light-gray p-2 rounded-2xl">
          {["bookings", "wishlist", "profile", "settings"].map((tab) => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`cursor-pointer flex items-center justify-center gap-2 p-1 rounded-lg ${
                activeTab === tab ? "bg-white" : ""
              }`}
            >
              {tab === "bookings" && <span>My Bookings</span>}
              {tab === "wishlist" && <span>Wishlist</span>}
              {tab === "profile" && <span>Profile</span>}
              {tab === "settings" && <span>Settings</span>}
            </div>
          ))}
        </div>

        {/* Tabs Content */}
        <div className="p-2 xl:p-0">
          {activeTab === "bookings" && <MyBookings />}
          {activeTab === "wishlist" && <Wishlist />}
          {activeTab === "profile" && <Profile />}
          {activeTab === "settings" && <UserSetting />}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
