import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

const Profile = () => {
  const auth = useContext(AuthContext);

  // ✅ All hooks must be called unconditionally
  const [name, setName] = useState(auth?.user?.name || "");
  const [email, setEmail] = useState(auth?.user?.email || "");
  const [phone, setPhone] = useState(""); // optional
  const [avatar, setAvatar] = useState(auth?.user?.avatar || "");
  const [loading, setLoading] = useState(false);

  if (!auth || !auth.user) {
    return <p className="text-center py-10">Loading profile...</p>;
  }

  const { user, login } = auth;

  const handleSave = async () => {
    setLoading(true);
    try {
      const API_URL = `https://68b7d508b7154050432608f0.mockapi.io/vehicles/users/${user.id}`;

      const res = await fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, avatar }),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      const updatedUser = await res.json();

      login({
        ...user,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
      });
      alert("Profile updated successfully!");
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow border border-gray-300">
      <h2 className="text-xl font-semibold mb-6">Profile Information</h2>

      {/* Profile Avatar */}
      <div className="flex items-center mb-6">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 bg-amber-200 border-gray-300">
          <img
            src={avatar || "/default-avatar.png"}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <hr className="my-6 border-gray-300" />

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-black focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-black focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-black focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Member Since
          </label>
          <input
            type="text"
            value="January 2025"
            readOnly
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 bg-gray-50 text-gray-500 cursor-not-allowed"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
        <button
          onClick={() => {
            setName(user.name);
            setEmail(user.email);
            setPhone("");
            setAvatar(user.avatar || "");
          }}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Profile;
