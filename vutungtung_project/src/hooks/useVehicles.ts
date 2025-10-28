// import { useState, useEffect } from "react";
// import { fetchVehicles } from "../api/vehicleApi";
// import type { Vehicle } from "../types/vehicle";

// export const useVehicles = () => {
//   const [vehicles, setVehicles] = useState<Vehicle[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const loadVehicles = async () => {
//       try {
//         const data = await fetchVehicles();
//         setVehicles(data);
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadVehicles();
//   }, []);

//   return { vehicles, setVehicles, loading, error };
// };

// import { useState, useEffect } from "react";
// import { fetchVehicles } from "../api/vehicleApi";
// import type { Vehicle } from "../types/vehicle";

// export const useVehicles = () => {
//   const [vehicles, setVehicles] = useState<Vehicle[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string>("");

//   useEffect(() => {
//     const loadVehicles = async () => {
//       try {
//         const data = await fetchVehicles();
//         setVehicles(data);
//       } catch (err) {
//         if (err instanceof Error) {
//           setError(err.message);
//         } else {
//           setError("An unknown error occurred");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadVehicles();
//   }, []);

//   return { vehicles, setVehicles, loading, error };
// };

import { useState, useEffect } from "react";
import { type Vehicle, type VehicleFront } from "../types/vehicle"; // backend type // frontend type
export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<VehicleFront[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Put your backend URL here directly
  const BASE_URL = "http://localhost:4000/api/vehicles"; // <-- replace with your API URL

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await fetch(`${BASE_URL}/`);
        if (!res.ok) throw new Error("Failed to fetch vehicles");

        const data: Vehicle[] = await res.json();

        const mappedVehicles: VehicleFront[] = data.map((v) => ({
          id: v.v_id.toString(),
          name: v.name,
          dailyRate: v.dailyRate,
          image: [v.image, v.image1, v.image2].filter(Boolean) as string[],
          image1: v.image1,
          image2: v.image2,
          pricePerDay: Number(v.dailyRate),
          title: v.name,
          status: v.status,

          seatingCapacity: v.seatingCapacity,
          transmission: v.transmission,
          fuelType: v.fuelType,
          description: v.description,
        }));

        setVehicles(mappedVehicles);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  return { vehicles, loading, error };
};
