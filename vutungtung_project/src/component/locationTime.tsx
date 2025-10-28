import { useState, useEffect } from "react";

interface LocationData {
  pickupLocation: string;
  returnLocation: string;
  pickupDate: string;
  returnDate: string;
}

interface LocationFormProps {
  onFormChange: (data: LocationData) => void;
  initialData?: LocationData; // <-- Add this, optional if you want default fallback
}

const LocationForm: React.FC<LocationFormProps> = ({
  onFormChange,
  initialData,
}) => {
  const locations = ["Kathmandu", "Pokhara", "Butwal", "Biratnagar", "Chitwan"];

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(today.getDate() + 2);

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const [formData, setFormData] = useState<LocationData>({
    pickupLocation: initialData?.pickupLocation || "",
    returnLocation: initialData?.returnLocation || "",
    pickupDate: initialData?.pickupDate || formatDate(tomorrow),
    returnDate: initialData?.returnDate || formatDate(dayAfterTomorrow),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      if (
        name === "pickupDate" &&
        new Date(updated.returnDate) <= new Date(value)
      ) {
        const newReturn = new Date(value);
        newReturn.setDate(newReturn.getDate() + 1);
        updated.returnDate = formatDate(newReturn);
      }

      return updated;
    });
  };

  useEffect(() => {
    onFormChange(formData);
  }, [formData, onFormChange]);

  return (
    <div className="max-w-md mx-auto rounded-lg space-y-4">
      {/* Pickup Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Pickup Location
        </label>
        <select
          name="pickupLocation"
          value={formData.pickupLocation}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        >
          <option value="">Select location</option>
          {locations.map((loc, idx) => (
            <option key={idx} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Return Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Return Location
        </label>
        <select
          name="returnLocation"
          value={formData.returnLocation}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        >
          <option value="">Select return location</option>
          {locations.map((loc, idx) => (
            <option key={idx} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Pickup Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Pickup Date
        </label>
        <input
          type="date"
          name="pickupDate"
          value={formData.pickupDate}
          onChange={handleChange}
          min={formatDate(tomorrow)} // cannot pick today or past
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      {/* Return Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Return Date
        </label>
        <input
          type="date"
          name="returnDate"
          value={formData.returnDate}
          onChange={handleChange}
          min={formatDate(dayAfterTomorrow)} // must be at least +1 day
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>
    </div>
  );
};

export default LocationForm;
