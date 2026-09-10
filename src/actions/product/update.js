"use server";
import mongoose from "mongoose";
import categoryModel from "@/models/categoryModel";
import productModel from "@/models/productModel";
import cloudinary from "@/lib/cloudinary";
import connectDB from "@/lib/db";
import getLoggedInUser from "@/lib/getLoggedInUser";

export async function updateProductAction(formData) {
  try {
    await connectDB();

    const user = await getLoggedInUser();
    const userId = user?._id;
    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    const name = formData.get("name");
    const description = formData.get("description");
    const catId = formData.get("category");
    const stock = Number(formData.get("stock"));
    const price = Number(formData.get("price"));
    const discountPrice = Number(formData.get("discountPrice"));
    const pid = formData.get("pId");
    const files = formData.getAll("files");

    if (!mongoose.isValidObjectId(pid)) {
      return { success: false, message: "Invalid product ID" };
    }

    // validation
    if (name && name.trim() === "") {
      return { success: false, message: "Product name is required" };
    }

    if (price && isNaN(price)) {
      return { success: false, message: "Invalid original price" };
    }

    const filter = user && user?.role === 'admin' ? {_id : pid} : {_id : pid, userId : userId};

    const productToFind = await productModel.findOne({_id : pid, userId : userId});
    if (!productToFind) {
      return { success: false, message: "Product not found, or you are not authorized to update this product" };
    }

    const updateFields = {};

    if (description) updateFields.description = description;
    if (stock) updateFields.stock = stock;
    if (price) updateFields.price = price;
    if (discountPrice) updateFields.discountPrice = discountPrice;

    // name + slug
    if (name && productToFind.name !== name) {
      const slug = name.replaceAll(" ", "-");

      const productExists = await productModel.findOne({
        slug,
        _id: { $ne: pid },
      });

      if (productExists) {
        return { success: false, message: "Product already exists with this name" };
      }

      updateFields.name = name;
      updateFields.slug = slug;
    }

    // category change
    if (catId && productToFind.category.toString() !== catId.toString()) {
      await categoryModel.findByIdAndUpdate(catId, { $inc: { totalProducts: 1 } });
      await categoryModel.findByIdAndUpdate(productToFind.category, { $inc: { totalProducts: -1 } });
      updateFields.category = catId;
    }

    // image update
    if (files.length > 0) {
      const deletedImgs = productToFind.img_pub_ids.map((currId) => (
        cloudinary.uploader.destroy(currId)
      ));
      await Promise.all(deletedImgs);

      let imgPaths = [];
      let imgPubIds = [];
      for (const file of files){
        if(file)
        {
          if(file.size > 1024 * 1024 * 5)
          {
            return { success: false, message: "Image size should be less than 5MB" };
          }
          if(!file.type.startsWith("image/"))
          {
            return { success: false, message: "Invalid file type" };
          }
          const buffer = await file.arrayBuffer();
          const bytes = new Uint8Array(buffer);
          const base64String = Buffer.from(bytes).toString("base64");
          const fileName = file.name.split(".")[0].replace(/[^a-zA-Z0-9_-]/g, "");
          const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
          const response = await cloudinary.uploader.upload(
            `data:${file.type};base64,${base64String}`,
            {
              folder: "multivendor-system/products",
              public_id: `${fileName}-${uniqueId}`,
            }
          );
          imgPaths.push(response.secure_url);
          imgPubIds.push(response.public_id);
        }
      }

      updateFields.img_paths = imgPaths;
      updateFields.img_pub_ids = imgPubIds;
    }

    await productModel.findByIdAndUpdate(pid, updateFields, {returnDocument: "after"});

    return { success: true, message: "Product updated and published successfully" };

  } catch (err) {
    console.log(err);
    return { success: false, message: err?.message || "Something went wrong" };
  }
}
