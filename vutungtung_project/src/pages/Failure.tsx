import React from "react";
import { Link } from "react-router-dom";

const Failure: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-center">
      <h1 className="text-3xl font-bold text-red-600">❌ Payment Failed</h1>
      <p className="mt-4 text-gray-700">
        Sorry, your transaction could not be processed.
      </p>
      <Link
        to="/"
        className="mt-6 px-4 py-2 bg-red-600 text-white rounded-lg shadow"
      >
        Try Again
      </Link>
    </div>
  );
};

export default Failure;
