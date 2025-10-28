import { Request, Response } from "express";
import {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  getVehiclesByCategoryName,
  getVehiclesByCategory,
  getVehiclesByPriceRange,
  getVehiclesByStatus,
  getVehicleByName,
  getVehiclesByTransmission,
  getVehiclesByFuelType,
} from "../Modal/vehicleModal";
import {
  VehicleFuelType,
  VehicleStatus,
  VehicleTransmission,
} from "@prisma/client";
import { prisma } from "../db";
import { checkformRefreshToken } from "../Modal/Login-Logout/loginModal";

export async function createVehicleController(req: Request, res: Response) {
  try {
    const files: any = req.files;
    const image = files?.image?.[0]?.filename ?? req.body.image ?? null;
    const image1 = files?.image1?.[0]?.filename ?? req.body.image1 ?? null;
    const image2 = files?.image2?.[0]?.filename ?? req.body.image2 ?? null;
    const {
      name,
      brand,
      model,
      fuelType,
      licensePlate,
      vin,
      mileage,
      description,
      transmission,
      dailyRate,
      categoryId,
      seatingCapacity,
    } = req.body;
    const login = req.cookies["refresh_token"];
    const logInfo = await checkformRefreshToken(login);
    if (logInfo?.role !== "admin") {
      res.status(400).json({
        message: "Admin only can create vehicles",
      });
      return;
    }
    if (!name) {
      res.status(400).json({ error: "Vehicle name is required" });
      return;
    }

    const vehicle = await createVehicle({
      name,
      brand,
      model,
      fuelType: fuelType as any,
      licensePlate,
      vin,
      mileage: mileage ? Number(mileage) : 0,
      description,
      transmission: transmission as any,
      image,
      image1,
      image2,
      dailyRate: dailyRate ? Number(dailyRate) : 0,
      categoryId: categoryId ? Number(categoryId) : undefined,
      seatingCapacity: seatingCapacity ? Number(seatingCapacity) : 0,
    });

    res.status(201).json(vehicle);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to create vehicle",
      details: error instanceof Error ? error.message : error,
    });
  }
}

export async function getVehiclesController(req: Request, res: Response) {
  try {
    const vehicles = await getVehicles();
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch vehicles",
      details: error instanceof Error ? error.message : error,
    });
  }
}

export async function getVehicleByIdController(req: Request, res: Response) {
  try {
    const v_id = Number(req.params.v_id);
    if (isNaN(v_id)) {
      res
        .status(400)
        .json({ error: "Invalid ID", details: "v_id must be a number" });
      return;
    }
    const vehicle = await prisma.vehicle.findUnique({
      where: { v_id },
      include: { category: true },
    });
    if (!vehicle) {
      res.status(404).json({ error: "Vehicle not found" });
      return;
    }
    res.status(200).json(vehicle);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch vehicle",
      details: error instanceof Error ? error.message : error,
    });
  }
}

// export async function updateVehicleController(req: Request, res: Response) {
//   try {
//     const v_id = Number(req.params.v_id);
//     const login=req.cookies['refresh_token']
// const logInfo=await checkformRefreshToken(login)
// if(logInfo?.role!=="admin"){
//   res.status(400).json({
//     message:"Admin only can update vehicles"
//   })
//   return;
// }
//     if (isNaN(v_id)) {
//       res
//         .status(400)
//         .json({ error: "Invalid ID", details: "v_id must be a number" });
//       return;
//     }
//     const files: any = req.files;
//     const image = files?.image?.[0]?.filename ?? req.body.image ?? undefined;
//     const image1 = files?.image1?.[0]?.filename ?? req.body.image1 ?? undefined;
//     res.status(200).json(vehicle);
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({
//         error: "Failed to update vehicle",
//         details: error instanceof Error ? error.message : error,
//       });
//   }
// }

export async function updateVehicleController(req: Request, res: Response) {
  try {
    const v_id = Number(req.params.v_id);
    const login = req.cookies["refresh_token"];
    const logInfo = await checkformRefreshToken(login);

    if (logInfo?.role !== "admin") {
      res.status(400).json({
        message: "Admin only can update vehicles",
      });
      return;
    }

    if (isNaN(v_id)) {
      res.status(400).json({
        error: "Invalid ID",
        details: "v_id must be a number",
      });
      return;
    }

    const files: any = req.files;
    const image = files?.image?.[0]?.filename ?? req.body.image ?? undefined;
    const image1 = files?.image1?.[0]?.filename ?? req.body.image1 ?? undefined;
    const image2 = files?.image2?.[0]?.filename ?? req.body.image2 ?? undefined;

    // ✅ ADD THIS: Prepare the update data
    const updateData: any = {
      name: req.body.name,
      brand: req.body.brand,
      model: req.body.model,
      description: req.body.description,
      licensePlate: req.body.licensePlate,
      vin: req.body.vin,
      fuelType: req.body.fuelType,
      transmissionType: req.body.transmissionType,
      status: req.body.status,
      dailyRate: req.body.dailyRate ? Number(req.body.dailyRate) : undefined,
      seatingCapacity: req.body.seatingCapacity
        ? Number(req.body.seatingCapacity)
        : undefined,
      mileage: req.body.mileage ? Number(req.body.mileage) : undefined,
      categoryId: req.body.categoryId ? Number(req.body.categoryId) : undefined,
    };

    // Add images if they exist
    if (image) updateData.image = image;
    if (image1) updateData.image1 = image1;
    if (image2) updateData.image2 = image2;

    // Remove undefined values
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    // ✅ ADD THIS: Actually update the vehicle
    const vehicle = await updateVehicle(v_id, updateData);

    res.status(200).json(vehicle);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to update vehicle",
      details: error instanceof Error ? error.message : error,
    });
  }
}

export async function deleteVehicleController(req: Request, res: Response) {
  try {
    const v_id = Number(req.params.v_id);
    const login = req.cookies["refresh_token"];
    const logInfo = await checkformRefreshToken(login);
    if (logInfo?.role !== "admin") {
      res.status(400).json({
        message: "Admin only can Delete vehicles",
      });
      return;
    }

    if (isNaN(v_id)) {
      res
        .status(400)
        .json({ error: "Invalid ID", details: "v_id must be a number" });
      return;
    }
    await deleteVehicle(v_id);
    res.status(200).json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete vehicle",
      details: error instanceof Error ? error.message : error,
    });
  }
}

export async function getVehiclesByCategoryNameController(
  req: Request,
  res: Response
) {
  try {
    const { categoryName } = req.params;
    const vehicles = await getVehiclesByCategoryName(categoryName);
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch vehicles by category name",
      details: error instanceof Error ? error.message : error,
    });
  }
}

export async function getVehicleByCategoryIdController(
  req: Request,
  res: Response
) {
  try {
    const categoryId = Number(req.params.categoryId);
    const vehicles = await getVehiclesByCategory(categoryId);
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch vehicles by category ID",
      details: error instanceof Error ? error.message : error,
    });
  }
}

export async function getVehicleByPriceRangeController(
  req: Request,
  res: Response
) {
  try {
    const gte = req.params.gte ? parseFloat(req.params.gte) : 0;
    const lte = req.params.lte
      ? parseFloat(req.params.lte)
      : Number.MAX_SAFE_INTEGER;
    if (isNaN(gte) || isNaN(lte)) {
      res.status(400).json({
        error: "Invalid price range",
        details: "'gte' and 'lte' must be numbers",
      });
      return;
    }
    if (gte > lte) {
      res.status(400).json({
        error: "Invalid price range",
        details: "'gte' must be <= 'lte'",
      });
      return;
    }
    const vehicles = await getVehiclesByPriceRange(gte, lte);
    if (!vehicles.length) {
      res
        .status(200)
        .json({ message: "No vehicles found in this price range", data: [] });
      return;
    }
    res.status(200).json(vehicles);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch vehicles by price range",
      details: error instanceof Error ? error.message : error,
    });
  }
}

export async function getVehiclesByStatusController(
  req: Request,
  res: Response
) {
  try {
    const status = req.params.status as VehicleStatus;
    const vehicles = await getVehiclesByStatus(status);
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch vehicles by status",
      details: error instanceof Error ? error.message : error,
    });
  }
}

export async function getVehiclesByNameController(req: Request, res: Response) {
  try {
    const { name } = req.params;
    const vehicles = await getVehicleByName(name);
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch vehicles by name",
      details: error instanceof Error ? error.message : error,
    });
  }
}

export async function getVehicleByTransmissionController(
  req: Request,
  res: Response
) {
  try {
    const transmission = req.params.transmission as VehicleTransmission;
    const vehicles = await getVehiclesByTransmission(transmission);
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch vehicles by transmission",
      details: error instanceof Error ? error.message : error,
    });
  }
}

export async function getVehicleByFuelTypeController(
  req: Request,
  res: Response
) {
  try {
    const fuelType = req.params.fuelType as VehicleFuelType;
    const validFuelTypes: VehicleFuelType[] = [
      "PETROL",
      "DIESEL",
      "ELECTRIC",
      "HYBRID",
    ];
    if (!validFuelTypes.includes(fuelType)) {
      res.status(400).json({
        error: "Invalid fuel type",
        details: `Allowed values are: ${validFuelTypes.join(", ")}`,
      });
      return;
    }
    const vehicles = await getVehiclesByFuelType(fuelType);
    if (!vehicles || vehicles.length === 0) {
      res.status(200).json({
        message: `No vehicles found with fuel type '${fuelType}'`,
        data: [],
      });
      return;
    }
    res.status(200).json(vehicles);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch vehicles by fuel type",
      details: error instanceof Error ? error.message : error,
    });
  }
}
