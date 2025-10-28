

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import BackButton from "../component/navigate";
import { useState } from "react";

const otpSchema = z.object({
  otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
});
type OtpFormData = z.infer<typeof otpSchema>;

export const ResetPasswordOTP = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
  });

  const onSubmit = async (data: OtpFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const email = localStorage.getItem("resetEmail");

      if (!email) {
        setError("Email not found. Please start the process again.");
        return;
      }

      console.log("Sending verification request:", { email, otp: data.otp });

      const response = await fetch(
        "http://localhost:4000/userlogin/reset-password/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // ADD THIS LINE
          body: JSON.stringify({
            email: email,
            otp: data.otp,
          }),
        }
      );

      const result = await response.json();
      console.log("Verification response:", result);

      if (response.ok) {
        navigate("/reset-password");
      } else {
        setError(
          result.message || result.error || "Invalid OTP or session expired"
        );
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-light-gray min-h-screen flex justify-center items-center px-4">
      <div className="w-full max-w-3xl mx-auto py-10">
        <BackButton />
        <div className="bg-white shadow-xl rounded-2xl p-10 text-center space-y-6">
          <h1 className="text-3xl font-bold text-black">Reset Password</h1>
          <p className="text-gray-600">Enter the OTP sent to your email</p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input
              type="text"
              placeholder="Enter OTP"
              {...register("otp")}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 outline-0 focus:ring-red"
            />
            {errors.otp && (
              <p className="text-red text-sm">{errors.otp.message}</p>
            )}
            {error && <p className="text-red text-sm">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red hover:bg-gradient-red text-white py-3 px-6 rounded-xl font-semibold disabled:opacity-50"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
