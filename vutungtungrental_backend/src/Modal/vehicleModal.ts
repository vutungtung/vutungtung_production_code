import e from "express";
import { prisma } from "../db";
import {
  Prisma,
  type VehicleFuelType,
  type VehicleStatus,
  type VehicleTransmission,
} from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

// CREATE
export async function createVehicle(data: {
  name: string;
  brand?: string;
  model?: string;
  fuelType?: VehicleFuelType;
  licensePlate?: string;
  vin?: string;
  mileage?: number;
  description?: string;
  transmission?: VehicleTransmission;
  image?: string;
  image1?: string;
  image2?: string;
  dailyRate?: number;
  categoryId?: number;
  seatingCapacity?: number;
}) {
  if (!data.name) throw new Error("Vehicle name is required");

  const vehicleData: any = {
    name: data.name,
    brand: data.brand ?? null,
    model: data.model ?? null,
    fuelType: data.fuelType ?? "PETROL",
    licensePlate: data.licensePlate ?? null,
    vin: data.vin ?? null,
    mileage: data.mileage ?? 0,
    description: data.description ?? null,
    transmission: data.transmission ?? "MANUAL",
    image: data.image ?? null,
    image1: data.image1 ?? null,
    image2: data.image2 ?? null,
    dailyRate: data.dailyRate ?? 0,
    seatingCapacity: data.seatingCapacity ?? 0,
  };

  if (data.categoryId) {
    const categoryExists = await prisma.category.findUnique({
      where: { c_id: data.categoryId },
    });
    if (!categoryExists) throw new Error("Invalid categoryId");
    vehicleData.category = { connect: { c_id: data.categoryId } };
  }

  return prisma.vehicle.create({ data: vehicleData });
}

// READ
export async function getVehicles() {
  return prisma.vehicle.findMany({ include: { category: true } });
}

export async function getVehicleById(id: number) {
  return prisma.vehicle.findUnique({
    where: {
      v_id: id,
    },
    include: {
      category: true,
    },
  });
}

// UPDATE
export async function updateVehicle(
  id: number,
  data: {
    name?: string;
    brand?: string;
    model?: string;
    fuelType?: VehicleFuelType;
    licensePlate?: string;
    vin?: string;
    mileage?: number;
    description?: string;
    transmissionType?: VehicleTransmission;
    image?: string;
    image1?: string;
    image2?: string;
    dailyRate?: number;
    categoryId?: number;
    seatingCapacity?: number;
    status?: VehicleStatus;
  }
) {
  try {
    const updateData: any = {};

    if (data.name) updateData.name = data.name;
    if (data.brand) updateData.brand = data.brand;
    if (data.model) updateData.model = data.model;
    if (data.fuelType) updateData.fuelType = data.fuelType;
    if (data.licensePlate) updateData.licensePlate = data.licensePlate;
    if (data.vin) updateData.vin = data.vin;
    if (data.mileage !== undefined) updateData.mileage = data.mileage;
    if (data.description) updateData.description = data.description;
    if (data.image !== undefined) updateData.image = data.image;
    if (data.image1 !== undefined) updateData.image1 = data.image1;
    if (data.image2 !== undefined) updateData.image2 = data.image2;
    if (data.dailyRate !== undefined) updateData.dailyRate = data.dailyRate;
    if (data.seatingCapacity !== undefined)
      updateData.seatingCapacity = data.seatingCapacity;
    if (data.status) updateData.status = data.status;

    if (data.licensePlate) {
      const existingVehicle = await prisma.vehicle.findUnique({
        where: { licensePlate: data.licensePlate },
      });

      if (existingVehicle && existingVehicle.v_id !== id) {
        throw new Error("License plate already exists for another vehicle");
      }

      updateData.licensePlate = data.licensePlate;
    }
    if (data.categoryId) {
      const categoryExists = await prisma.category.findUnique({
        where: { c_id: data.categoryId },
      });
      if (!categoryExists) throw new Error("Invalid categoryId");
      updateData.category = { connect: { c_id: data.categoryId } };
    }

    return await prisma.vehicle.update({
      where: { v_id: id },
      data: updateData,
      include: { category: true },
    });
  } catch (error) {
    console.error("Prisma error (updateVehicle):", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to update vehicle"
    );
  }
}
// DELETE
export async function deleteVehicle(id: number) {
  return prisma.vehicle.delete({ where: { v_id: id } });
}

//Get by name
export async function getVehicleByName(name: string) {
  return prisma.vehicle.findMany({
    where: { name },
    include: { category: true },
  });
}

// Get vehicles by price range
export async function getVehiclesByPriceRange(gte: number, lte: number) {
  return prisma.vehicle.findMany({
    where: {
      dailyRate: {
        gte: new Decimal(gte),
        lte: new Decimal(lte),
      },
    },
    orderBy: { dailyRate: "asc" },
    include: { category: true },
  });
}

//get by status
export async function getVehiclesByStatus(status: VehicleStatus) {
  return prisma.vehicle.findMany({
    where: { status },
    include: { category: true },
  });
}

//get by category
export async function getVehiclesByCategory(categoryId: number) {
  return prisma.vehicle.findMany({
    where: { categoryId },
    include: { category: true },
  });
}

//get by category name
export async function getVehiclesByCategoryName(categoryName: string) {
  return prisma.vehicle.findMany({
    where: {
      category: {
        name: categoryName,
      },
    },
    include: { category: true },
  });
}

//get by transmission
export async function getVehiclesByTransmission(
  transmission: VehicleTransmission
) {
  return prisma.vehicle.findMany({
    where: { transmission },
    include: { category: true },
  });
}

//get by fuel type
export async function getVehiclesByFuelType(fuelType: VehicleFuelType) {
  return prisma.vehicle.findMany({
    where: { fuelType },
    include: { category: true },
  });
}
