"use server";
import categoryModel from "@/models/categoryModel";
import connectDB from "@/lib/db";
import mongoose from "mongoose";
import getLoggedInUser from "@/lib/getLoggedInUser";

export async function deleteCategoryAction(cid) {
  try {

    const user = await getLoggedInUser();
    if (!user) return { success: false, message: "Unauthorized" };


    if (!mongoose.isValidObjectId(cid)) {
      return { success: false, message: "Category not found" };
    }

    await connectDB();

    const filter = user?.role == "admin" ? {_id : cid} : {_id : cid, userId : user._id};

    const category = await categoryModel.findOne(filter);
    if (!category) {
      return { success: false, message: "Category not found, or you are not authorized to delete this category" };
    }

    await category.deleteOne();

    return { success: true, message: "Category deleted successfully" };
  } catch (err) {
    return { success: false, message: err?.message || "Something went wrong" };
  }
}
