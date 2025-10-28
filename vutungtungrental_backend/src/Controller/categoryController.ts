import { Request, Response } from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  getCategoryByName,
  updateCategory,
} from "../Modal/categoryModal";

export async function createCategoryController(req: Request, res: Response) {
  try {
    const { name } = req.body;
    if (!name) {
      res.status(400).json({ error: "Category name is required" });
      return;
    }
    const category = await createCategory({ name });
    res.status(201).json(category);
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ error: error.message || "Failed to create category" });
  }
}

export async function getAllCategoryController(req: Request, res: Response) {
  try {
    const categories = await getCategories();
    res.status(200).json(categories);
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ error: error.message || "Failed to fetch categories" });
  }
}

export async function getCategoryByIdController(req: Request, res: Response) {
  try {
    const { c_id } = req.params;
    const categoryId = Number(c_id);
    if (isNaN(categoryId)) {
      res.status(400).json({ error: "Invalid category ID" });
      return;
    }
    const category = await getCategoryById(categoryId);
    if (!category) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    res.status(200).json(category);
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ error: error.message || "Failed to fetch category" });
  }
}

export async function updateCategoryController(req: Request, res: Response) {
  try {
    const { c_id } = req.params;
    const categoryId = Number(c_id);
    const { name } = req.body;
    const category = await updateCategory(categoryId, { name });
    res.status(200).json(category);
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ error: error.message || "Failed to update category" });
  }
}

export async function deleteCategoryController(req: Request, res: Response) {
  try {
    const { c_id } = req.params;
    const categoryId = Number(c_id);
    if (isNaN(categoryId)) {
      res.status(400).json({ error: "Invalid category ID" });
      return;
    }
    await deleteCategory(categoryId);
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ error: error.message || "Failed to delete category" });
  }
}

export async function getCategoryByNameController(req: Request, res: Response) {
  try {
    const { name } = req.params;
    if (!name) {
      res.status(400).json({ error: "Category name is required" });
      return;
    }
    const category = await getCategoryByName(name);
    if (!category) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    res.status(200).json(category);
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ error: error.message || "Failed to fetch category" });
  }
}
