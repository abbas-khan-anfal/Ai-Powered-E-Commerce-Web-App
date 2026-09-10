import connectDB from "@/lib/db";
import getLoggedInUser from "@/lib/getLoggedInUser";
import productModel from "@/models/productModel";
import { NextResponse } from "next/server";

// get all categories
export async function GET(req) {
  try {

        const user = await getLoggedInUser();
        if(!user)
        {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    const skip = (page - 1) * limit;

    await connectDB();

    let isFilter = user?.role === "admin" ? {} : {userId : user._id};

    // Fetch products
    const products = await productModel.find(isFilter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Total products count
    const totalProducts = await productModel.countDocuments(isFilter);
    const totalPages = Math.ceil(totalProducts / limit);

    return NextResponse.json(
      {
        success: true,
        totalPages,
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
