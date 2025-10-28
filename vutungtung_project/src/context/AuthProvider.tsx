import { useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { getAvatar } from "../lib/avatar";

export type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatar?: string;
  token?: string;
};

type AuthProviderProps = { children: ReactNode };

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Add loading state

  // // ✅ Load user from localStorage on first render
  // useEffect(() => {
  //   const storedUser = localStorage.getItem("user");
  //   if (storedUser) {
  //     const parsedUser: User = JSON.parse(storedUser);
  //     if (!parsedUser.avatar) {
  //       parsedUser.avatar = getAvatar(parsedUser.name);
  //     }
  //     setUser(parsedUser);
  //   }
  //   setLoading(false);
  // }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser) {
      const parsedUser: User = JSON.parse(storedUser);
      parsedUser.token = parsedUser.token || storedToken || "";
      if (!parsedUser.avatar) {
        parsedUser.avatar = getAvatar(parsedUser.name);
      }
      setUser(parsedUser);
    }

    setLoading(false);
  }, []);

  // ✅ Save user to localStorage when logging in
  const login = (userData: User) => {
    // Ensure avatar exists
    if (!userData.avatar) {
      userData.avatar = getAvatar(userData.name); // Use your dicebear API
    }

    // ✅ Store token inside the user object
    if (userData.token) {
      localStorage.setItem("token", userData.token);
    }

    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // ✅ Remove user from localStorage on logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
