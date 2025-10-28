import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import BackButton from "../component/navigate";
import { useState } from "react";

const forgotSchema = z.object({
  email: z.string().email("Invalid email address"),
});
type ForgotFormData = z.infer<typeof forgotSchema>;

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:4000/userlogin/reset-password/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // ADD THIS LINE
          body: JSON.stringify({
            email: data.email,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("resetEmail", data.email);
        navigate("/reset-password-otp");
      } else {
        setError(result.message || "Failed to send OTP");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-light-gray min-h-screen flex justify-center items-center px-4">
      <div className="w-full max-w-7xl mx-auto py-10">
        <BackButton />
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px] shadow-xl bg-white rounded-2xl overflow-hidden">
          <div className="relative h-64 overflow-hidden lg:h-auto">
            <img
              src="/image/image-6.png"
              alt="forgot"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute bottom-6 left-6 lg:bottom-8 lg:left-8 z-10 text-white bg-gradient-red/50 w-full  p-4 rounded-l-xl">
              <h1 className="text-2xl lg:text-4xl font-bold">
                Forgot Password?
              </h1>
              <p className="text-sm lg:text-lg max-w-sm">
                Enter your email to receive a 6-digit verification code.
              </p>
            </div>
          </div>
          <div className="flex flex-col p-6 sm:p-10 lg:p-12 justify-center space-y-5">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <h1 className="text-3xl font-bold">Enter Your Email</h1>
              <input
                type="email"
                placeholder="Email"
                {...register("email")}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-0 focus:ring-2 focus:ring-red"
              />
              {errors.email && (
                <p className="text-red text-sm">{errors.email.message}</p>
              )}
              {error && <p className="text-red text-sm">{error}</p>}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red hover:bg-gradient-red text-white py-3 px-6 rounded-xl font-semibold disabled:opacity-50"
              >
                {isLoading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
