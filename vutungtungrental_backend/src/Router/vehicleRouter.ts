import { Router } from "express";
import {
  createVehicleController,
  getVehiclesController,
  getVehicleByIdController,
  updateVehicleController,
  deleteVehicleController,
  getVehiclesByCategoryNameController,
  getVehicleByCategoryIdController,
  getVehicleByPriceRangeController,
  getVehiclesByNameController,
  getVehiclesByStatusController,
  getVehicleByTransmissionController,
  getVehicleByFuelTypeController,
} from "../Controller/vehicleController";
import upload from "../middleware/multerMiddleware";

export const vehicleRouter = Router();

vehicleRouter.post(
  "/create",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
  ]),
  createVehicleController
);

vehicleRouter.get("/", getVehiclesController);
vehicleRouter.get("/id/:v_id", getVehicleByIdController);
vehicleRouter.put(
  "/update/:v_id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
  ]),
  updateVehicleController
);
vehicleRouter.delete("/delete/:v_id", deleteVehicleController);

vehicleRouter.get(
  "/category/name/:categoryName",
  getVehiclesByCategoryNameController
);
vehicleRouter.get("/category/:categoryId", getVehicleByCategoryIdController);
vehicleRouter.get("/price/:gte/:lte", getVehicleByPriceRangeController);
vehicleRouter.get("/status/:status", getVehiclesByStatusController);
vehicleRouter.get("/name/:name", getVehiclesByNameController);
vehicleRouter.get(
  "/transmission/:transmission",
  getVehicleByTransmissionController
);
vehicleRouter.get("/fuel/:fuelType", getVehicleByFuelTypeController);
