import connectDB from "@/lib/db";
import categoryModel from "@/models/categoryModel";
import productModel from "@/models/productModel";
import { NextResponse } from "next/server";

// get search lists
export async function POST(req) {
  try {
    const { searchTerm } = await req.json();

    await connectDB();

    // 🔥 Build single filter object
    let filter = {};


    // Search filter
    if (searchTerm.trim() !== "") {
      filter.$or = [
        { title: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
      ];
    }

    // Fetch products
    const products = await productModel
      .find(filter)
      .limit(10)
      .select("_id name");

    return NextResponse.json(
      {
        success: true,
        products,
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