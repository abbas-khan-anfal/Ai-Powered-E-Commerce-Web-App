import cartModel from "@/models/cartModel";
import connectDB from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import productModel from "@/models/productModel";

// get cart items
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

    const cartItems = await cartModel.find({userId : user?.id}).populate("productId", "name discountPrice img_paths");
    
    return NextResponse.json(
      {
        success: true,
        message: "Cart items fetched successfully",
        cartItems : cartItems || [],
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
