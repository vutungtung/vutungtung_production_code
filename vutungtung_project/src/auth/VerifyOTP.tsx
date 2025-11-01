import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../component/navigate";
import api from "../lib/api";
import { z } from "zod";

// Zod schema for OTP validation
const otpSchema = z.object({
  email: z.string().email(),
  otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
});

export const VerifyOTP = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Get email from sessionStorage
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("signupEmail");
    if (storedEmail) {
      // Keep email exactly as stored (only trim) - backend might be case-sensitive
      const trimmedEmail = storedEmail.trim();
      setEmail(trimmedEmail);
      // Update sessionStorage with trimmed email to ensure consistency
      sessionStorage.setItem("signupEmail", trimmedEmail);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("No email found. Please signup first.");
      return;
    }

    // Zod validation
    const result = otpSchema.safeParse({ email, otp });
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    try {
      setLoading(true);
      
      // Keep email exactly as it was during registration (only trim) - backend might be case-sensitive
      const trimmedEmail = email.trim();
      
      console.log("Verifying OTP with:", { 
        email: trimmedEmail, 
        otp,
        originalEmail: email 
      });
      
      // Log the exact request being sent
      console.log("Request payload:", JSON.stringify({ 
        email: trimmedEmail, 
        otp 
      }));
      
      const response = await api.post("/user/verify-otp", { 
        email: trimmedEmail, 
        otp 
      });
      console.log("OTP verification response:", response);
      
      sessionStorage.removeItem("signupEmail"); // clear email after success

      // ✅ Redirect to Verify Successful page
      navigate("/verify-success");
    } catch (err: unknown) {
      console.error("OTP verification error:", err);

      let serverMsg: string | null = null;

      if (typeof err === "object" && err !== null && "response" in err) {
        const axiosErr = err as {
          response?: {
            data?: { message?: string; error?: string } | string;
            status?: number;
          };
        };

        console.log("Error response:", axiosErr.response);
        console.log("Error status:", axiosErr.response?.status);
        console.log("Error data:", axiosErr.response?.data);

        const data = axiosErr.response?.data;

        if (typeof data === "string") {
          serverMsg = data;
        } else if (data && typeof data === "object") {
          // Try to get error message from various possible fields
          serverMsg = data.message || data.error || (data as any).msg || null;
          
          // If still no message, show the full response for debugging
          if (!serverMsg && axiosErr.response?.status === 400) {
            const errorData = axiosErr.response.data;
            if (errorData && typeof errorData === "object") {
              serverMsg = errorData.message || errorData.error || "Invalid OTP or session expired. Please try signing up again.";
            } else {
              serverMsg = "Invalid OTP or session expired. Please try signing up again.";
            }
          }
        }
      }

      setError(serverMsg || "Failed to verify OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    if (!email) return setError("No email found. Please signup first.");
    try {
      setLoading(true);
      
      // Keep email exactly as it was during registration (only trim) - backend might be case-sensitive
      const trimmedEmail = email.trim();
      
      console.log("Resending OTP for email:", {
        email: trimmedEmail,
        originalEmail: email
      });
      
      console.log("Request payload:", JSON.stringify({ 
        email: trimmedEmail 
      }));
      
      const response = await api.post("/user/ressend-otp", { 
        email: trimmedEmail 
      });
      console.log("Resend OTP response:", response);
      
      alert("OTP resent successfully! Check your email.");
    } catch (err: unknown) {
      console.error("Resend OTP error:", err);
      
      let serverMsg: string | null = null;
      if (typeof err === "object" && err !== null && "response" in err) {
        const axiosErr = err as {
          response?: {
            data?: { message?: string; error?: string } | string;
            status?: number;
          };
        };
        
        console.log("Resend error response:", axiosErr.response);
        console.log("Resend error status:", axiosErr.response?.status);
        
        const data = axiosErr.response?.data;
        if (typeof data === "string") {
          serverMsg = data;
        } else if (data && typeof data === "object") {
          serverMsg = data.message || data.error || (data as any).msg || null;
        }
        
        // If 404, provide specific error
        if (axiosErr.response?.status === 404) {
          serverMsg = "Resend endpoint not found. Please contact support.";
        }
      }
      setError(serverMsg || "Failed to resend OTP. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light-gray min-h-screen flex justify-center items-center px-4">
      <div className="w-full max-w-3xl mx-auto py-10">
        <BackButton />
        <div className="bg-white shadow-xl rounded-2xl p-10 text-center space-y-6">
          <h1 className="text-3xl font-bold text-black">Verify Your Email</h1>
          <p className="text-gray-600">
            Enter the 6-digit code sent to your email.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red outline-0"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red hover:bg-gradient-red text-white py-3 px-6 rounded-xl font-semibold disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>

          {error && <p className="text-red-600">{error}</p>}

          <button
            className="text-sm text-red hover:underline mt-2"
            onClick={handleResend}
            disabled={loading}
          >
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
};
