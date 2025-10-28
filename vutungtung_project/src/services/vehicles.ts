import type { NewVehicle, Vehicle } from "../types/vehicle";

const API = "https://68b7d508b7154050432608f0.mockapi.io/vehicles/vehicleddata"; // replace with your vehicles endpoint if different

export async function addVehicle(data: NewVehicle): Promise<Vehicle> {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add vehicle");
  return (await res.json()) as Vehicle;
}
