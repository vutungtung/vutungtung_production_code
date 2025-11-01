import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import BackButton from "../component/navigate";
import { useState } from "react";

const resetSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
type ResetFormData = z.infer<typeof resetSchema>;

export const ResetPassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetFormData) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        "https://vutungtungrental-backend.onrender.com/userlogin/reset-password/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // ADD THIS LINE
          body: JSON.stringify({
            newPassword: data.newPassword,
            confirmPassword: data.confirmPassword,
          }),
        }
      );

      const result = await response.json();
      console.log("Reset response:", result);

      if (response.ok) {
        setSuccess("Password reset successfully!");

        localStorage.removeItem("resetEmail");
        localStorage.removeItem("verifiedOtp");

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(result.message || "Failed to reset password");
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
          {/* Left Image */}
          <div className="relative h-64 overflow-hidden lg:h-auto">
            <img
              src="/image/image-8.png"
              alt="reset"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute bottom-6 left-6 lg:bottom-8 lg:left-8 z-10 text-white bg-gradient-red/50 w-full  p-4 rounded-l-xl">
              <h1 className="text-2xl lg:text-4xl font-bold">Reset Password</h1>
              <p className="text-sm lg:text-lg max-w-sm">
                Create a new password for your account.
              </p>
            </div>
          </div>

          {/* Right Form */}
          <div className="flex flex-col p-6 sm:p-10 lg:p-12 justify-center space-y-5">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input
                type="password"
                placeholder="New Password"
                {...register("newPassword")}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-red"
              />
              {errors.newPassword && (
                <p className="text-red text-sm">{errors.newPassword.message}</p>
              )}

              <input
                type="password"
                placeholder="Confirm Password"
                {...register("confirmPassword")}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-red"
              />
              {errors.confirmPassword && (
                <p className="text-red text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}

              {error && <p className="text-red text-sm">{error}</p>}

              {success && <p className="text-green text-sm">{success}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red hover:bg-gradient-red text-white py-3 px-6 rounded-xl font-semibold disabled:opacity-50"
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
