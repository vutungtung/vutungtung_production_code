
// // src/api/vehicleApi.ts
import type { NewVehicle, Vehicle, VehicleFront } from "../types/vehicle";

const BASE_URL = "https://vutungtungrental-backend.onrender.com/api/vehicles";

// Fetch all vehicles
export const fetchVehicles = async (): Promise<Vehicle[]> => {
  try {
    const res = await fetch(`${BASE_URL}/`);
    if (!res.ok) throw new Error("Failed to fetch vehicles");
    const data = await res.json();
    return data; // Assuming backend returns an array of vehicles
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const fetchVehicleById = async (
  id: string | number
): Promise<VehicleFront> => {
  try {
    const res = await fetch(`${BASE_URL}/`);
    if (!res.ok) throw new Error("Failed to fetch vehicle");

    const data: Vehicle[] = await res.json();
    const vehicle = data.find((v) => v.v_id === Number(id));
    if (!vehicle) throw new Error("Vehicle not found");

    return {
      id: vehicle.v_id.toString(),
      name: vehicle.name,
      dailyRate: vehicle.dailyRate,
      image: [vehicle.image, vehicle.image1, vehicle.image2].filter(
        Boolean
      ) as string[],
      pricePerDay: Number(vehicle.dailyRate),
      title: vehicle.name,
      categoryId: vehicle.categoryId,
      status: vehicle.status,
      image1: vehicle.image1,
      image2: vehicle.image2,

      // Add required properties
      seatingCapacity: vehicle.seatingCapacity,
      transmission: vehicle.transmission,
      fuelType: vehicle.fuelType,
      description: vehicle.description,
    };
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
      throw err;
    } else {
      console.error("Unknown error occurred");
      throw new Error("Unknown error occurred");
    }
  }
};

// Add new vehicle
export const addVehicle = async (vehicle: NewVehicle): Promise<Vehicle> => {
  const res = await fetch(`${BASE_URL}/create/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(vehicle),
  });
  if (!res.ok) throw new Error("Failed to create vehicle");
  return await res.json();
};

// Update vehicle
export const updateVehicle = async (id: string | number, vehicle: Vehicle) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(vehicle),
  });
  if (!res.ok) throw new Error("Failed to update vehicle");
  return await res.json();
};

// Delete vehicle
export const deleteVehicle = async (id: string | number) => {
  const res = await fetch(`${BASE_URL}/delete/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete vehicle");
};
