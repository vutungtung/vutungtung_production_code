import { useNavigate, useSearchParams } from "react-router-dom";
import { MdError } from "react-icons/md";

const PaymentFailure = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const bookingId = searchParams.get("bookingId");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 text-center max-w-md w-full">
        <MdError className="text-red-500 text-6xl mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Failed
        </h2>
        <p className="text-gray-600 mb-6">
          Your payment could not be processed. Please try again or contact support if the problem persists.
        </p>
        
        {bookingId && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Booking ID:</span> {bookingId}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => navigate("/payment")}
            className="w-full px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow"
          >
            Try Payment Again
          </button>
          <button
            onClick={() => navigate("/available-vehicles")}
            className="w-full px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Back to Vehicles
          </button>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          <p>
            Need help? Contact our support team at{" "}
            <a href="mailto:support@vutungtung.com" className="text-red-600 hover:underline">
              support@vutungtung.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
