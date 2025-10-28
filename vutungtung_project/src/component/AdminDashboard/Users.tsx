import { useEffect, useState } from "react";
import { FiUsers } from "react-icons/fi";

interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");

        const res = await fetch("http://localhost:4000/user", {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch users");

        const data = await res.json();
        const usersData = Array.isArray(data)
          ? data
          : data.users || data.data || [];

        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh] text-red-600 font-medium">
        Loading users...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b-2 border-red-500 pb-3">
        <div className="flex items-center gap-2">
          <FiUsers className="text-red-600 text-2xl" />
          <h1 className="text-2xl font-semibold text-red-600">
            User Management
          </h1>
        </div>
        <span className="text-sm bg-red-600 text-white px-3 py-1 rounded-full shadow">
          Total: {users.length}
        </span>
      </div>

      {/* User List */}
      <div className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden">
        {users.length > 0 ? (
          <div className="divide-y divide-red-100">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 hover:bg-red-50 transition"
              >
                <div>
                  <p className="font-semibold text-gray-800">{user.username}</p>
                  <p className="text-gray-500 text-sm">{user.email}</p>
                  <p className="text-gray-400 text-sm">{user.phone}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-6">No users found.</p>
        )}
      </div>
    </div>
  );
};

export default Users;
