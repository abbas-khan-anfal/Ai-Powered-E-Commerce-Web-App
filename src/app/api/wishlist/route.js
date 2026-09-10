import wishlistModel from "@/models/wishlistModel";
import connectDB from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import productModel from "@/models/productModel";

// get wishlist items
export async function GET(req) {
  try {
    await connectDB();
    const { user } = await auth();
    if(!user)
    {
      return NextResponse.json({
        success : false,
        message : "Please login to continue"
      }, { status : 401 });
    }

    const wishlistItems = await wishlistModel.find({userId : user?.id}).populate("productId", "name discountPrice img_paths");
    
    return NextResponse.json(
      {
        success: true,
        message: "Wishlist items fetched successfully",
        items : wishlistItems || [],
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
