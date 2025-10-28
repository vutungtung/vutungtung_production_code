import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="text-black gap-1 text-lg mb-5 font-semibold inline-flex justify-center items-center"
    >
      <IoArrowBackSharp /> Go Back
    </button>
  );
}

export default BackButton;
