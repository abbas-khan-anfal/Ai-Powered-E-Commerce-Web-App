"use server";
import productModel from "@/models/productModel";
import connectDB from "@/lib/db";
import mongoose from "mongoose";
import cloudinary from "@/lib/cloudinary";
import categoryModel from "@/models/categoryModel";
import getLoggedInUser from "@/lib/getLoggedInUser";

export async function createProductAction(formData) {
  try {
    await connectDB();
    const user = await getLoggedInUser();
    const userId = user?._id;
    if (!user) {
      return { success: false, message: "Unauthorized" };
    }


    // get form data
    const files = formData.getAll("files");
    const name = formData.get("name");
    const description = formData.get("description");
    const price = Number(formData.get("price"));
    const discountPrice = Number(formData.get("discountPrice"));
    const stock = Number(formData.get("stock"));
    const catId = formData.get("catId");

    // validation
    if (!mongoose.isValidObjectId(catId)) {
      return { success: false, message: "Invalid category" };
    }

    if (!name || name.trim() === "") {
      return { success: false, message: "Product name is required" };
    }

    if (!price || !discountPrice) {
      return { success: false, message: "Product prices are required" };
    }

    if(discountPrice > price)
    {
      return { success: false, message: "Discount price cannot be greater than original price" };
    }

    // slug
    const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // remove special characters
    .replace(/\s+/g, "-")         // spaces -> hyphens
    .replace(/-+/g, "-");         // remove duplicate hyphens

    // unique product number
    const uniqueNum = Math.floor(100000 * Math.random() + 900000);
    const productUniqueNum = `PN-${uniqueNum}`;

    // product exist
    const productExist = await productModel.findOne({ slug });
    if (productExist) {
      return { success: false, message: "Product already exists" };
    }

    // category update
    const isCategoryExist = await categoryModel.findByIdAndUpdate(
      catId,
      { $inc: { totalProducts: 1 } },
      { returnDocument: "after" }
    );

    if (!isCategoryExist) {
      return { success: false, message: "Category not found" };
    }

    // image upload
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


    // create product
    await productModel.create({
      name,
      description,
      slug,
      price,
      discountPrice,
      stock,
      category: catId,
      userId,
      productNumber: productUniqueNum,
      img_paths: imgPaths,
      img_pub_ids: imgPubIds,
    });

    return { success: true, message: "Product published successfully" };

  } catch (error) {
    console.log(error);
    return { success: false, message: "Server error" };
  }
}
