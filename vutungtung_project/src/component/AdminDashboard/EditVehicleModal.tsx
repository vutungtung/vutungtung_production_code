import { useEffect, useRef, useState, useCallback } from "react";

interface Vehicle {
  v_id: number;
  name?: string;
  title?: string;
  category?: string | { name: string } | null;
  brand?: string;
  model?: string;
  transmission?: string;
  fuelType?: string;
  seatingCapacity?: number;
  mileage?: string;
  dailyRate?: number;
  pricePerDay?: number;
  features?: string[] | string;
  description?: string;
  image?: string;
  image1?: string;
  image2?: string;
  status?: string;
  licensePlate?: string;
  vin?: string;
}

interface EditVehicleFormProps {
  vehicle: Vehicle;
  onUpdate: (vehicle: Vehicle) => void;
  onClose: () => void;
}

interface Category {
  c_id: number;
  name: string;
}

const EditVehicleModal = ({
  vehicle,
  onUpdate,
  onClose,
}: EditVehicleFormProps) => {
  // Helper function to safely get category name
  const getCategoryName = (
    cat: string | { name: string } | null | undefined
  ): string => {
    if (!cat) return "";
    if (typeof cat === "object" && cat.name) return cat.name;
    if (typeof cat === "string") return cat;
    return "";
  };

  const [formData, setFormData] = useState({
    title: vehicle?.name || vehicle?.title || "",
    category: getCategoryName(vehicle?.category),
    brand: vehicle?.brand || "",
    model: vehicle?.model || "",
    transmission: vehicle?.transmission || "MANUAL",
    fuelType: vehicle?.fuelType || "PETROL",
    seatingCapacity: vehicle?.seatingCapacity || 1,
    mileage: vehicle?.mileage || "",
    pricePerDay: vehicle?.dailyRate || vehicle?.pricePerDay || 0,
    features: Array.isArray(vehicle?.features)
      ? vehicle.features
      : typeof vehicle?.features === "string"
      ? vehicle.features
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean)
      : [],
    description: vehicle?.description || "",
    images: [
      vehicle?.image
        ? `https://vutungtungrental-backend.onrender.com/uploads/vehicles/${vehicle.image}`
        : "",
      vehicle?.image1
        ? `https://vutungtungrental-backend.onrender.com/uploads/vehicles/${vehicle.image1}`
        : "",
      vehicle?.image2
        ? `https://vutungtungrental-backend.onrender.com/uploads/vehicles/${vehicle.image2}`
        : "",
    ],
    status: vehicle?.status || "AVAILABLE",
    licensePlate: vehicle?.licensePlate || "",
    vin: vehicle?.vin || "",
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
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        }
      })
      .catch((err) => console.error("Failed to fetch categories:", err));
  }, []);

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

    if (!vehicle?.v_id) {
      setError("Vehicle ID is missing");
      return;
    }

    const form = new FormData();

    form.append("name", formData.title);
    form.append("brand", formData.brand);
    form.append("model", formData.model);
    form.append("description", formData.description);
    form.append("licensePlate", formData.licensePlate);
    form.append("vin", formData.vin);
    form.append("mileage", formData.mileage);
    form.append("fuelType", formData.fuelType.toUpperCase());
    form.append("seatingCapacity", formData.seatingCapacity.toString());
    form.append("dailyRate", formData.pricePerDay.toString());
    form.append("transmissionType", formData.transmission.toUpperCase());
    form.append("status", formData.status.toUpperCase());
    if (formData.features.length > 0)
      form.append("features", formData.features.join(","));

    const categoryId = categories.find(
      (c) => c.name === formData.category
    )?.c_id;
    if (categoryId) {
      form.append("categoryId", categoryId.toString());
    } else {
      setError("Please select a valid category");
      return;
    }

    // Attach updated images if new ones are chosen
    fileInputRefs.current.forEach((ref, index) => {
      if (ref?.files?.[0]) {
        const fieldName = index === 0 ? "image" : `image${index}`;
        form.append(fieldName, ref.files[0]);
      }
    });

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `https://vutungtungrental-backend.onrender.com/api/vehicles/update/${vehicle.v_id}`,
        {
          method: "PUT",
          body: form,
          credentials: "include",
        }
      );

      const responseText = await res.text();
      console.log("Raw response:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        console.error("Invalid JSON response:", responseText);
        setError(`Invalid response from server: ${responseText}`);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setError(data.error || data.message || "Failed to update vehicle");
        console.error("Server error:", data);
        setLoading(false);
        return;
      }

      alert("Vehicle updated successfully!");
      onUpdate(data);
      onClose();
    } catch (err) {
      console.error("Network error:", err);
      setError(
        `Network error: ${
          err instanceof Error ? err.message : "Please try again."
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0  backdrop-blur-sm bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Edit Vehicle</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

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

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 rounded w-full mt-4"
          rows={4}
        />

        <div className="mt-4">
          <p className="font-semibold mb-2">Update Images (Optional):</p>
          {[0, 1, 2].map((index) => (
            <div key={index} className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image {index + 1}
              </label>
              <input
                type="file"
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
              />
              {formData.images[index] && (
                <img
                  src={formData.images[index]}
                  alt={`Preview ${index + 1}`}
                  className="h-32 object-cover rounded mt-2 border"
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-4 gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Vehicle"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditVehicleModal;
