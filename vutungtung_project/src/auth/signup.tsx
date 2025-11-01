import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import BackButton from "../component/navigate";
import { signupSchema } from "../lib/validation";
import api from "../lib/api";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // local validation with zod
    const result = signupSchema.safeParse({
      fullname: form.fullname,
      email: form.email,
      password: form.password,
    });

    if (!result.success) {
      setError(result.error.errors[0].message);
      setLoading(false);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // Keep email as-is (trim only) - backend might be case-sensitive
      const trimmedEmail = form.email.trim();
      
      console.log("Registering user with:", {
        username: form.fullname,
        email: trimmedEmail,
        role: "user",
      });

      const resp = await api.post("/user/register", {
        username: form.fullname,
        email: trimmedEmail,
        password: form.password,
        role: "user",
      });

      console.log("Signup success response:", resp);
      console.log("Response data:", resp.data);
      console.log("Full response:", JSON.stringify(resp.data, null, 2));
      
      // Check if registration was successful
      const responseData = resp.data as any;
      if (responseData && (responseData.success === false || responseData.message?.includes("error"))) {
        setError(responseData.message || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      // ✅ Store email exactly as sent to backend - ensure it's stored before navigation
      sessionStorage.setItem("signupEmail", trimmedEmail);
      
      // Small delay to ensure backend has processed the registration
      await new Promise(resolve => setTimeout(resolve, 100));

      // ✅ Navigate without email in URL
      navigate("/verify-otp");
    } catch (err: unknown) {
      console.error("Signup error (full):", err);

      let serverMsg: string | null = null;
      let status: number | undefined;
      let networkMsg: string | undefined;

      if (typeof err === "object" && err !== null && "response" in err) {
        const axiosErr = err as {
          response?: {
            data?: { message?: string; error?: string } | string;
            status?: number;
          };
          message?: string;
        };

        const data = axiosErr.response?.data;
        status = axiosErr.response?.status;
        networkMsg = axiosErr.message;

        if (typeof data === "string") {
          serverMsg = data;
        } else {
          serverMsg = data?.message || data?.error || null;
        }
      } else if (err instanceof Error) {
        networkMsg = err.message;
      }

      if (serverMsg) {
        setError(`Server: ${serverMsg} ${status ? `(status ${status})` : ""}`);
      } else if (networkMsg) {
        setError(networkMsg);
      } else {
        setError("Something went wrong");
      }

      setLoading(false);
    }
  };

  return (
    <div className="bg-light-gray min-h-screen flex justify-center items-center px-4">
      <div className="w-full max-w-7xl mx-auto py-10">
        <BackButton />
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px] shadow-xl bg-white rounded-2xl overflow-hidden">
          {/* Left Image */}
          <div className="relative overflow-hidden h-64 lg:h-auto">
            <img
              src="/image/image-5.png"
              alt="signup"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute bottom-6 left-6 lg:bottom-8 lg:left-8 z-10 w-full text-white bg-gradient-red/50 p-4 rounded-l-xl">
              <h1 className="text-2xl lg:text-4xl font-bold">Join Us</h1>
              <p className="text-sm lg:text-lg max-w-sm">
                Create your account to book vehicles quickly and easily.
              </p>
            </div>
          </div>

          {/* Right Form */}
          <div className="flex flex-col p-6 sm:p-10 lg:p-12 space-y-5 justify-center bg-white">
            <h1 className="text-2xl sm:text-3xl font-bold text-black">
              Create an Account
            </h1>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="fullname"
                placeholder="Full Name"
                value={form.fullname}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red outline-0"
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red outline-0"
              />

              {/* ✅ Password Field */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red outline-0 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible size={22} />
                  ) : (
                    <AiOutlineEye size={22} />
                  )}
                </button>
              </div>

              {/* ✅ Confirm Password Field */}
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red outline-0 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <AiOutlineEyeInvisible size={22} />
                  ) : (
                    <AiOutlineEye size={22} />
                  )}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red hover:bg-gradient-red text-white py-3 px-6 rounded-xl font-semibold disabled:opacity-60"
              >
                {loading ? "Creating..." : "Sign Up"}
              </button>
            </form>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-red hover:underline font-medium"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
