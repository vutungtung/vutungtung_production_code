import { useNavigate } from "react-router-dom";

export const VerifySuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex justify-center items-center bg-light-gray">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center space-y-4">
        <h1 className="text-3xl font-bold text-green-600">
          Verification Successful!
        </h1>
        <p className="text-gray-600">
          Your email has been verified. You can now log in.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 bg-red hover:bg-gradient-red text-white py-3 px-6 rounded-xl font-semibold transition"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};
