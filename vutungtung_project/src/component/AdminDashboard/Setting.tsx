import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

interface Settings {
  companyName: string;
  supportEmail: string;
  defaultCurrency: string;
  taxRate: number;
  emailNotifications: boolean;
}

const Settings = () => {
  const { logout, user } = useContext(AuthContext)!;
  const navigate = useNavigate();
  const [settings, setSettings] = useState<Settings>({
    companyName: "",
    supportEmail: "",
    defaultCurrency: "USD",
    taxRate: 0,
    emailNotifications: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Fetch settings from API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("https://api.example.com/settings");
        const data = await res.json();
        setSettings(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching settings:", err);
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value, type } = target;
    setSettings((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (target as HTMLInputElement).checked : value,
    }));
  };

  // Save settings
  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      alert("Settings saved successfully!");
    } catch (err) {
      console.error("Error saving settings:", err);
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  // Handle logout with API call
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Call the logout API endpoint
      const response = await fetch("https://vutungtungrental-backend.onrender.com/userlogout/", {
        method: "POST",
        credentials: "include", // Include cookies/session
        headers: {
          "Content-Type": "application/json",
        },
        // Send token if needed by backend
        body: JSON.stringify({
          token: user?.token,
        }),
      });

      // Check if logout was successful
      if (response.ok) {
        console.log("Admin logout successful");
      } else {
        console.warn(
          "Logout API call failed, but proceeding with client-side logout"
        );
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Even if API call fails, we still want to logout from the client side
    } finally {
      // Always perform client-side logout
      logout();
      setIsLoggingOut(false);
      navigate("/"); // Redirect to home page after logout
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading settings...</p>;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex w-full justify-between items-center gap-4  flex-wrap">
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-gray-500">
              Manage organization and system preferences
            </p>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="bg-red-500 text-white flex justify-center items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50"
          >
            {isLoggingOut ? "Logging out..." : "Logout"} <FiLogOut />
          </button>
        </div>
      </div>

      {/* Card */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Organization</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Company Name
            </label>
            <input
              type="text"
              name="companyName"
              value={settings.companyName}
              onChange={handleChange}
              placeholder="Enter company name"
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>

          {/* Support Email */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Support Email
            </label>
            <input
              type="email"
              name="supportEmail"
              value={settings.supportEmail}
              onChange={handleChange}
              placeholder="Enter support email"
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>

          {/* Default Currency */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Default Currency
            </label>
            <select
              name="defaultCurrency"
              value={settings.defaultCurrency}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="NPR">NPR</option>
            </select>
          </div>

          {/* Tax Rate */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Tax Rate (%)
            </label>
            <input
              type="number"
              name="taxRate"
              value={settings.taxRate}
              onChange={handleChange}
              placeholder="Enter tax rate"
              className="w-full border border-gray-300 rounded-lg p-2"
            />
            <p className="text-gray-400 text-xs">Applied to booking totals.</p>
          </div>
        </div>

        {/* Email Notifications */}
        <div className="flex items-center mt-6">
          <label className="text-sm font-medium flex-1">
            Email Notifications
            <p className="text-gray-400 text-xs">
              Receive updates for new bookings and user activity.
            </p>
          </label>
          <input
            type="checkbox"
            name="emailNotifications"
            checked={settings.emailNotifications}
            onChange={handleChange}
            className="w-5 h-5"
          />
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
