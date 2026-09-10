import { auth } from "@/auth";
import connectDB from "@/lib/db";
import categoryModel from "@/models/categoryModel";
import productModel from "@/models/productModel";
import wishlistModel from "@/models/wishlistModel";
import { NextResponse } from "next/server";

// get all products
export async function GET(req) {
  try {

    await connectDB();
    const session = await auth();
    const user = session?.user;

    const searchParams = req.nextUrl.searchParams;

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const min = parseInt(searchParams.get("min"));
    const max = parseInt(searchParams.get("max"));
    const searchTerm = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "";
    const category = searchParams.get("category") || "";

    const skip = (page - 1) * limit;

    // 🔥 Build single filter object
    let filter = {};

    // Price filter
    if (min && max) {
      filter.discountPrice = { $gte: min, $lte: max };
    }

    // Search filter
    if (searchTerm.trim() !== "") {
      filter.$or = [
        { title: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
      ];
    }

    // category exist or not
    if(category.trim() !== "")
    {
      const categoryExist = await categoryModel.findOne({ name: category });
      if (categoryExist) {
        filter.category = categoryExist._id;
      }
    }


    // sorting
    let sortOption = {};

    if (sort === "az") {
      sortOption.title = 1; // ascending
    } else if (sort === "za") {
      sortOption.title = -1; // descending
    } else if (sort === "price_low") {
      sortOption.discountPrice = 1;
    } else if (sort === "price_high") {
      sortOption.discountPrice = -1;
    } else {
      sortOption.createdAt = -1; // default (latest first)
    }

    // Fetch products
    const products = await productModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sortOption);

    // Count filtered docs
    const totalDocs = await productModel.countDocuments(filter);
    const totalPages = Math.ceil(totalDocs / limit);

    // get wishlisted items and look up it

    let wishlistSet = new Set();

    // console.log("User : ", user);
    if (user) {
      const wishlistItems = await wishlistModel.find({ userId: user?.id });
      // console.log("Wishlist items : ", wishlistItems);

      wishlistSet = new Set(
        wishlistItems.map(item => item.productId.toString())
      );
    }

    const updatedProducts = products.map(product => ({
      ...product._doc,
      isWishlisted: wishlistSet.has(product._id.toString())
    }));

    return NextResponse.json(
      {
        success: true,
        totalPages,
        products : updatedProducts,
      },
      { status: 200 }
    );

  } catch (err) {
    return NextResponse.json(
      { success: false, message: err?.message || "Something went wrong" },
      { status: 500 }
    );
  }
}