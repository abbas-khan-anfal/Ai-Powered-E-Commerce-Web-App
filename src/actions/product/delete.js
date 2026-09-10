"use server";
import categoryModel from "@/models/categoryModel";
import productModel from "@/models/productModel";
import connectDB from "@/lib/db";
import mongoose from "mongoose";
import cloudinary from "@/lib/cloudinary";
import getLoggedInUser from "@/lib/getLoggedInUser";

export async function deleteProductAction(pid) {
  try {

    const user = await getLoggedInUser();
    const userId = user?._id;
    if(!user)
    {
      return { success: false, message: "Unauthorized" };
    }

    if (!mongoose.isValidObjectId(pid)) {
      return { success: false, message: "Product not found" };
    }

    await connectDB();

    const filter = user && user?.role === 'admin' ? { _id : pid } : {_id: pid, userId : userId};

    const product = await productModel.findOne(filter);
    if (!product) {
      return { success: false, message: "Product not found, or you are not authorized to delete this product" };
    }

    if(product.img_pub_ids.length > 0)
    {
      const deletedImgs = product.img_pub_ids.map((currId) => (
        cloudinary.uploader.destroy(currId)
      ));
      await Promise.all(deletedImgs);
    }

    // decrement category count
    const categoryExist = await categoryModel.findByIdAndUpdate(
      product.category,
      { $inc: { totalProducts: -1 } },
      { returnDocument: "after" }
    );

    if (!categoryExist) {
      return { success: false, message: "Category not found" };
    }

    await product.deleteOne();

    return { success: true, message: "Product deleted successfully" };

  } catch (err) {
    return { success: false, message: err?.message || "Something went wrong" };
  }
}
