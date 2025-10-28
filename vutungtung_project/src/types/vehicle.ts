// export type FuelType = "petrol" | "diesel" | "electric" | "hybrid";
// export type Transmission = "manual" | "automatic";
// export type Status =  "Available" | "Rented" | "Maintanence";

// export type VehicleBase = {
//   id?: string;
//   title: string;
//   name: string; // not title
//   brand: string;
//   model: string;
//   type: string; // e.g., "SUV", "Sedan"
//   seats: number;
//   description: string;
//   category: string;
//   fuelType: FuelType;
//   seatingCapacity: number;
//   transmission: Transmission;
//   mileage: string;
//   pricePerDay: number;
//   features: string[]; // ["AC", "ABS", ...]
//   image: string[]; // array of image URLs
//   licenseNumber?: string; // optional if you use it
//   status: Status;
// };

// export type Vehicle = VehicleBase & { id: string }; // server records always have id
// export type NewVehicle = VehicleBase; // when creating (id is server-generated)

export interface Category {
  c_id: number;
  name: string;
}

export interface Vehicle {
  v_id: number;
  name: string;
  brand: string;
  model: string;
  description: string;
  licensePlate?: string;
  vin?: string;
  mileage: number;
  features: string;
  fuelType: string;
  transmission: string;
  seatingCapacity: number;
  dailyRate: string;
  status: "AVAILABLE" | "RENTED" | "MAINTENANCE";
  image: string;
  image1?: string;
  image2?: string;
  categoryId: number;
  category: Category;
  createdAt: string;
  updatedAt: string;
  pricePerDay?: number;
  title?: string;
  id?: string; // add this
}

export interface NewVehicle {
  name: string;
  brand: string;
  model: string;
  description: string;
  licensePlate?: string;
  vin?: string;
  mileage: number;
  fuelType: string;
  transmission: string;
  seatingCapacity: number;
  dailyRate: string;
  status: "AVAILABLE" | "RENTED" | "MAINTENANCE";
  image: string;
  image1?: string;
  image2?: string;
  categoryId: number;
}

export type VehicleFront = {
  id: string, // required for your state
  name: string;
  dailyRate: string;
  image: string[];
  image1?: string;
  image2?: string;
  pricePerDay: number;
  title: string;
  categoryId?: number;
  status?: "AVAILABLE" | "RENTED" | "MAINTENANCE";

  seatingCapacity: number;
  transmission: string;
  fuelType: string;
  description: string;
};
