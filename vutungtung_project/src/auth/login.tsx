import { useState, useContext, useEffect } from "react";
import { useNavigate, Link, NavLink } from "react-router-dom";
import { RiHome5Line } from "react-icons/ri";
import api from "../lib/api";
import { z } from "zod";
import { AuthContext } from "../context/AuthContext";
import type { User } from "../context/AuthProvider";

type AuthContextType = {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  loading: boolean;
};

type LoginResponse = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  token?: string;
};

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Helper functions
const generateNameFromEmail = (email: string): string => {
  if (!email) return "User";
  const username = email.split("@")[0];
  return username
    .split(".")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

export const Login = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext) as AuthContextType;
  if (!auth) throw new Error("AuthContext is missing");

  const { login, user } = auth;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Prevent accessing /login if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin-dashboard", { replace: true });
      } else {
        navigate("/user-dashboard", { replace: true });
      }
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    try {
      setLoading(true);

      // 1. First, authenticate the user
      const resp = await api.post<LoginResponse>("/userlogin", {
        email,
        password,
      });

      console.log("Login response:", resp.data);
      console.log("Full response object:", resp);

      // 2. The backend returns {message, role, data: {count}} - let's check if there's more data
      let userDetails: any = {};

      // Check if the login response has more data than we initially saw
      if (resp.data.data && typeof resp.data.data === 'object') {
        console.log("Checking data object:", resp.data.data);
        // Maybe the user details are in resp.data.data
        if (resp.data.data.id || resp.data.data.email) {
          userDetails = resp.data.data;
          console.log("Found user details in data object:", userDetails);
        }
      }

      // If we still don't have user details, we'll need to work with what we have
      if (!userDetails.id && !userDetails.email) {
        console.log("No user details found in login response, using email as fallback");
        // For now, we'll create a basic user object with the email
        userDetails = {
          email: email,
          // We'll need to get the actual name from somewhere else or ask the user
        };
      }

      // 3. Create user data with proper fallbacks
      const userData: User = {
        id: userDetails.id || `user-${Date.now()}`,
        name: userDetails.name || userDetails.username || userDetails.fullname || userDetails.user_name || email.split('@')[0], // Use email prefix as fallback
        email: userDetails.email || email,
        role: resp.data.role || userDetails.role || "user", // Use role from login response
        token: userDetails.token || "", // No token in response, using empty string
      };

      // Store the email for potential future use
      localStorage.setItem("userEmail", email);

      login(userData);

      if (userData.token) {
        localStorage.setItem("token", userData.token);
        console.log("✅ Token saved to localStorage:", userData.token);
      } else {
        console.warn("⚠️ No token found in response");
      }

      if (userData.role === "admin") {
        navigate("/admin-dashboard", { replace: true });
      } else {
        navigate("/user-dashboard", { replace: true });
      }
    } catch (err: unknown) {
      console.error("Login error:", err);

      let serverMsg: string | null = null;

      if (typeof err === "object" && err !== null && "response" in err) {
        const axiosErr = err as {
          response?: {
            data?: { message?: string; error?: string } | string;
          };
        };

        const data = axiosErr.response?.data;

        if (typeof data === "string") {
          serverMsg = data;
        } else {
          serverMsg = data?.message || data?.error || null;
        }
      }

      setError(serverMsg || "Failed to login. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light-gray min-h-screen flex justify-center items-center px-4">
      <div className="w-full max-w-7xl mx-auto py-10">
        <div className="mb-3">
          <NavLink
            className="font-semibold flex items-center text-gradient-red gap-2"
            to={"/"}
          >
            <RiHome5Line size={20} />
            <strong>Home</strong>
          </NavLink>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px] shadow-xl bg-white rounded-2xl overflow-hidden">
          <div className="relative overflow-hidden h-64 lg:h-auto">
            <img
              src="/image/img-3.png"
              alt="login"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute bottom-6 left-6 lg:bottom-8 lg:left-8 z-10 w-full text-white bg-gradient-red/50 p-4 rounded-l-xl">
              <h1 className="text-2xl lg:text-4xl font-bold">Welcome Back</h1>
              <p className="text-sm lg:text-lg max-w-sm">
                Log in to continue booking vehicles quickly and securely.
              </p>
            </div>
          </div>

          <div className="flex flex-col p-6 sm:p-10 lg:p-12 space-y-5 justify-center bg-[#FFFFFF]">
            <h1 className="text-2xl sm:text-3xl font-bold black">
              Login to Your Account
            </h1>

            <form className="space-y-4" onSubmit={handleLogin}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red text-white py-3 px-6 rounded-xl font-semibold disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              {error && <p className="text-red-600 mt-2">{error}</p>}
            </form>

            <div className="flex justify-between text-sm text-gray-600">
              <Link to="/forgot-password" className="hover:underline">
                Forgot Password?
              </Link>
              <Link to="/signup" className="text-red hover:underline">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
