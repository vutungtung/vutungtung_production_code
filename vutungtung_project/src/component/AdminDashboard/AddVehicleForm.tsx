import { useEffect, useRef, useState, useCallback } from "react";
import type { NewVehicle } from "../../types/vehicle";

interface AddVehicleFormProps {
  onSave: (vehicle: NewVehicle) => void;
  onClose: () => void;
}

interface Category {
  c_id: number;
  name: string;
}

const AddVehicleForm = ({ onSave, onClose }: AddVehicleFormProps) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    brand: "",
    model: "",
    transmission: "MANUAL",
    fuelType: "PETROL",
    seatingCapacity: 1,
    mileage: "",
    pricePerDay: 0,
    features: [] as string[],
    description: "",
    images: ["", "", ""], // local previews for 3 images
    status: "AVAILABLE",
    licensePlate: "",
    vin: "",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const featureOptions = [
    "AC",
    "GPS",
    "Bluetooth",
    "Airbags",
    "Power Steering",
  ];

  useEffect(() => {
    fetch("https://vutungtungrental-backend.onrender.com/api/category/all")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Failed to fetch categories:", err));
  }, []);

  // ✅ Proper ref callback for multiple file inputs
  const setFileInputRef = useCallback(
    (index: number) => (el: HTMLInputElement | null) => {
      fileInputRefs.current[index] = el;
    },
    []
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFeatureToggle = (feature: string) => {
    const features = [...formData.features];
    if (features.includes(feature)) {
      setFormData({
        ...formData,
        features: features.filter((f) => f !== feature),
      });
    } else {
      features.push(feature);
      setFormData({ ...formData, features });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Check if at least first image is selected (compulsory)
    if (!fileInputRefs.current[0]?.files?.[0]) {
      setError("Please upload at least the main image (Image 1)");
      return;
    }

    const form = new FormData();

    // Match backend expected field names exactly:
    form.append("name", formData.title);
    form.append("brand", formData.brand);
    form.append("model", formData.model);
    form.append("description", formData.description);

    // Add required fields
    form.append("licensePlate", formData.licensePlate || "TEMP-PLATE");
    form.append("vin", formData.vin || "TEMP-VIN");

    form.append("mileage", formData.mileage);
    form.append("fuelType", formData.fuelType.toUpperCase());
    form.append("seatingCapacity", formData.seatingCapacity.toString());
    form.append("dailyRate", formData.pricePerDay.toString());
    form.append("transmission", formData.transmission.toUpperCase());
    form.append("status", formData.status.toUpperCase());

    // Add features as comma-separated string
    if (formData.features.length > 0) {
      form.append("features", formData.features.join(","));
    }

    const categoryId = categories.find(
      (c) => c.name === formData.category
    )?.c_id;
    if (categoryId) {
      form.append("categoryId", categoryId.toString());
    } else {
      setError("Please select a valid category");
      return;
    }

    // ✅ Append multiple images with correct field names
    fileInputRefs.current.forEach((ref, index) => {
      if (ref?.files?.[0]) {
        const fieldName = index === 0 ? "image" : `image${index}`;
        form.append(fieldName, ref.files[0]);
      }
    });

    setLoading(true);
    setError("");

    try {
      // ✅ DEBUG: Log the request details
      console.log(
        "Sending request to:",
        "https://vutungtungrental-backend.onrender.com/api/vehicles/create"
      );

      const res = await fetch("https://vutungtungrental-backend.onrender.com/api/vehicles/create", {
        method: "POST",
        body: form,
        credentials: "include",
      });

      // ✅ Get the response text first to see what's actually returned
      const responseText = await res.text();
      console.log("Raw response:", responseText);
      console.log("Response status:", res.status, res.statusText);

      let data;
      try {
        // ✅ Try to parse as JSON
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error("JSON parse error. Response was:", responseText);
        setError(
          "Server returned invalid response. Check console for details."
        );
        return;
      }

      if (!res.ok) {
        console.error("Server error details:", data);
        setError(
          data.message ||
            data.error ||
            `Server error: ${res.status} ${res.statusText}`
        );
        return;
      }

      alert("Vehicle created successfully with images!");
      onSave(data);
      onClose();
    } catch (err: unknown) {
      console.error("Network error:", err);
      setError("Network error. Please check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-xs bg-opacity-40 flex justify-center items-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 overflow-y-auto max-h-[90vh]"
        encType="multipart/form-data"
      >
        <h2 className="text-2xl font-bold mb-4 flex justify-between items-center">
          Add Vehicle
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            X
          </button>
        </h2>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="title"
            placeholder="Vehicle Title"
            value={formData.title}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="brand"
            placeholder="Brand"
            value={formData.brand}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="model"
            placeholder="Model"
            value={formData.model}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="licensePlate"
            placeholder="License Plate"
            value={formData.licensePlate}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="vin"
            placeholder="VIN Number"
            value={formData.vin}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.c_id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            name="transmission"
            value={formData.transmission}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="MANUAL">Manual</option>
            <option value="AUTOMATIC">Automatic</option>
          </select>
          <select
            name="fuelType"
            value={formData.fuelType}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="PETROL">Petrol</option>
            <option value="DIESEL">Diesel</option>
            <option value="ELECTRIC">Electric</option>
            <option value="HYBRID">Hybrid</option>
          </select>
          <input
            type="number"
            name="seatingCapacity"
            value={formData.seatingCapacity}
            onChange={handleChange}
            placeholder="Seating Capacity"
            className="border p-2 rounded"
            min={1}
          />
          <input
            type="text"
            name="mileage"
            value={formData.mileage}
            onChange={handleChange}
            placeholder="Mileage"
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="pricePerDay"
            value={formData.pricePerDay}
            onChange={handleChange}
            placeholder="Price Per Day"
            className="border p-2 rounded"
            min={0}
          />
        </div>

        {/* Status */}
        <div className="mt-4">
          <label className="block font-semibold mb-2">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="AVAILABLE">Available</option>
            <option value="RENTED">Rented</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>
        </div>

        {/* Features */}
        <div className="mt-4">
          <p className="font-semibold mb-2">Features:</p>
          <div className="flex flex-wrap gap-2">
            {featureOptions.map((f) => (
              <label key={f} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={formData.features.includes(f)}
                  onChange={() => handleFeatureToggle(f)}
                />
                {f}
              </label>
            ))}
          </div>
        </div>

        {/* Description */}
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 rounded w-full mt-4"
          rows={4}
        />

        {/* Multiple Image Upload */}
        <div className="mt-4">
          <p className="font-semibold mb-2">
            Upload Images (Image 1 is required):
          </p>
          {[0, 1, 2].map((index) => (
            <div key={index} className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image {index + 1} {index === 0 && "(Required)"}
              </label>
              <input
                type="file"
                id={`image${index}`}
                ref={setFileInputRef(index)}
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const newImages = [...formData.images];
                    newImages[index] = URL.createObjectURL(file);
                    setFormData({ ...formData, images: newImages });
                  }
                }}
                className="border p-2 rounded w-full"
                required={index === 0} // Only first image is required
              />
              {formData.images[index] && (
                <div className="mt-2 flex items-center gap-3">
                  <img
                    src={formData.images[index]}
                    alt={`Preview ${index + 1}`}
                    className="h-32 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newImages = [...formData.images];
                      newImages[index] = "";
                      setFormData({ ...formData, images: newImages });
                      if (fileInputRefs.current[index]) {
                        fileInputRefs.current[index]!.value = "";
                      }
                    }}
                    className="text-red-500 text-sm hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="flex justify-end mt-4 gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-red text-white rounded hover:bg-gradient-red"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Vehicle"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddVehicleForm;
