"use server";
import categoryModel from "@/models/categoryModel";
import connectDB from "@/lib/db";
import getLoggedInUser from "@/lib/getLoggedInUser";

export async function createCategoryAction({ name, description = "" }) {
  try {
    await connectDB();

    const user = await getLoggedInUser();
    if (!user) return { success: false, message: "Unauthorized" };

    const categoryName = name?.trim()?.toLowerCase();
    const categoryDescription = description?.trim();

    // validations
    if (!categoryName) return { success: false, message: "Category name is required" };
    if (categoryName.length < 3) return { success: false, message: "Min 3 characters" };
    if (categoryName.length > 50) return { success: false, message: "Max 50 characters" };
    if (categoryDescription.length > 100) return { success: false, message: "Desc max 100 chars" };

    // if (!/^[a-z0-9\s\-]+$/i.test(categoryName))
    //   return { success: false, message: "Invalid category name" };

    // if (categoryDescription && !/^[a-z0-9\s\-]+$/i.test(categoryDescription))
    //   return { success: false, message: "Invalid description" };

    // duplicate check
    const exists = await categoryModel.findOne({ name: categoryName });
    if (exists) return { success: false, message: "Category already exists" };

    // create
    const category = await categoryModel.create({
      name: categoryName,
      description: categoryDescription,
      userId : user._id
    });

    return {
      success: true,
      message: "Category created successfully",
    };
  } catch (err) {
    return { success: false, message: "Server error" };
  }
}
