import { Router } from "express";
import {
  createCategoryController,
  getCategoryByIdController,
  updateCategoryController,
  deleteCategoryController,
  getCategoryByNameController,
  getAllCategoryController,
} from "../Controller/categoryController";

export const categoryRouter = Router();

categoryRouter.post("/create", createCategoryController);
categoryRouter.get("/all", getAllCategoryController);
categoryRouter.get("/id/:c_id", getCategoryByIdController);
categoryRouter.put("/update/:c_id", updateCategoryController);
categoryRouter.delete("/delete/:c_id", deleteCategoryController);
categoryRouter.get("/by-name/:name", getCategoryByNameController);


