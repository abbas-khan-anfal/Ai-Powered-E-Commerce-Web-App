"use server";
import categoryModel from "@/models/categoryModel";
import connectDB from "@/lib/db";
import mongoose from "mongoose";
import getLoggedInUser from "@/lib/getLoggedInUser";

export async function updateCategoryAction(data) {
  try {

    const user = await getLoggedInUser();
    if (!user) return { success: false, message: "Unauthorized" };

    const { name, description, cid } = data;

    if (!mongoose.isValidObjectId(cid)) {
      return { success: false, message: "Invalid category ID" };
    }

    const categoryName = name?.trim()?.toLowerCase();
    const categoryDescription = description?.trim();
    await connectDB();

    const filter = user?.role == "admin" ? {_id : cid} : {_id : cid, userId : user._id};

    const categoryToUpdate = await categoryModel.findOne(filter);
    if (!categoryToUpdate) {
      return { success: false, message: "Category not found, or you are not authorized to update this category" };
    }

    // check duplicate
    const categoryExists = await categoryModel.findOne({
      name: categoryName,
      _id: { $ne: cid },
    });
    if (categoryExists) {
      return { success: false, message: "Category already exists" };
    }

    // update fields
    if (categoryName && categoryName !== categoryToUpdate.name) {
      categoryToUpdate.name = categoryName;
    }

    if (categoryDescription && categoryDescription !== categoryToUpdate.description) {
      categoryToUpdate.description = categoryDescription;
    }

    await categoryToUpdate.save();

    return { success: true, message: "Category updated successfully" };
  } catch (err) {
    return { success: false, message: err?.message || "Something went wrong" };
  }
}
