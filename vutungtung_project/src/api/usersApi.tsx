 // ✅ make sure you have a User type

import type { User } from "../types/users";

export const USER_API_URL =
  "https://68b7d508b7154050432608f0.mockapi.io/vehicles/users";

// ✅ Fetch all users
export const fetchUsers = async (): Promise<User[]> => {
  const res = await fetch(USER_API_URL);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

// ✅ Fetch single user by ID
export const fetchUserById = async (id: string): Promise<User> => {
  const res = await fetch(`${USER_API_URL}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
};

// ✅ Create new user
export const createUser = async (user: User): Promise<User> => {
  const res = await fetch(USER_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error("Failed to create user");
  return res.json();
};

// ✅ Update user
export const updateUser = async (id: string, user: User): Promise<User> => {
  const res = await fetch(`${USER_API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error("Failed to update user");
  return res.json();
};

// ✅ Delete user
export const deleteUser = async (id: string): Promise<boolean> => {
  const res = await fetch(`${USER_API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete user");
  return true;
};
