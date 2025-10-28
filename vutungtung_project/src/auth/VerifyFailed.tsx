import { useNavigate } from "react-router-dom";
import api from "../lib/api";

export const VerifyFailed = () => {
  const navigate = useNavigate();

  const handleResend = async () => {
    const email = sessionStorage.getItem("signupEmail");
    if (!email) return alert("No email found. Please signup first.");

    try {
      await api.post("/user/resend-otp", { email });
      alert("OTP resent successfully! Check your email.");
      navigate("/verify-otp"); // redirect back to OTP page
    } catch (err) {
      console.error("Resend OTP error:", err);

      if (err instanceof Error) {
        alert(`Failed to resend OTP: ${err.message}`);
      } else {
        alert("Failed to resend OTP. Try again later.");
      }
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-light-gray">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center space-y-4">
        <h1 className="text-3xl font-bold text-red-600">
          Verification Failed!
        </h1>
        <p className="text-gray-600">
          Invalid or expired OTP. Please try again.
        </p>
        <button
          type="button"
          onClick={handleResend}
          className="mt-4 bg-red hover:bg-gradient-red text-white py-3 px-6 rounded-xl font-semibold transition"
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
};
