import { prisma } from "../db";

// Create a category
export async function createCategory(data: { name: string }) {
  try {
    return await prisma.category.create({
      data: {
        name: data.name,
      },
    });
  } catch (error) {
    console.error("Prisma error (createCategory):", error);
    throw new Error("Failed to create category");
  }
}

// Get all categories
export async function getCategories() {
  return await prisma.category.findMany();
}

// Get category by id
export async function getCategoryById(c_id: number) {
  return await prisma.category.findUnique({ where: { c_id } });
}

//Get category by name
export async function getCategoryByName(name: string) {
  return await prisma.category.findUnique({ where: { name } });
}

// Update category
export async function updateCategory(c_id: number, data: { name?: string }) {
  try {
    const updateData: any = {};
    if (data.name) updateData.name = data.name;

    return await prisma.category.update({ where: { c_id }, data: updateData });
  } catch (error) {
    console.error("Prisma error (updateCategory):", error);
    throw new Error("Failed to update category");
  }
}

// Delete category
export async function deleteCategory(c_id: number) {
  return await prisma.category.delete({ where: { c_id } });
}
