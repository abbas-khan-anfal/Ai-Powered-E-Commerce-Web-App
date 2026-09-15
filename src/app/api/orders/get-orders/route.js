import connectDB from "@/lib/db";
import getLoggedInUser from "@/lib/getLoggedInUser";
import { sellerOrderModel } from "@/models/orderModel";
import { NextResponse } from "next/server";
import { orderModel } from "@/models/orderModel";
import userModel from "@/models/userModel";
import productModel from "@/models/productModel";

// get all orders
export async function GET(req) {
  try {
    await connectDB();

    const user = await getLoggedInUser();
      if(!user)
      {
        return NextResponse.json(
        { success: false, message: "Unauthorized" },
          { status: 401 }
        );
      }
      
      const searchParams = await req.nextUrl.searchParams;
      const page = Number(searchParams.get('page')) || 1;
      const limit = Number(searchParams.get('limit')) || 5;
      const skip = (page - 1) * limit;

      const isFilter = user?.role === "admin" ? {} : { sellerId: user._id };

      const orders = await sellerOrderModel
      .find(isFilter)
      .populate("customerId", "fullName email image")
      .populate("products.productId")
      .populate('orderId', "shippingAddress paymentMethod paymentStatus createdAt")
      .skip(skip)
      .limit(limit);

    const totalOrders = await sellerOrderModel.countDocuments({
      isFilter
    });

    // const totalAmount = orders.reduce(
    //   (acc, order) => acc + order.subtotal,
    //   0
    // );

    return NextResponse.json({
      success: true,
      orders,
      totalPages: Math.ceil(totalOrders / limit),
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { success: false, message: err?.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
