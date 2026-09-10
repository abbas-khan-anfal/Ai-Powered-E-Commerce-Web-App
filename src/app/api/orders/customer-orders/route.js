import { auth } from "@/auth";
import connectDB from "@/lib/db";
import getLoggedInUser from "@/lib/getLoggedInUser";
import { orderModel, sellerOrderModel } from "@/models/orderModel";
import { NextResponse } from "next/server";

// get all orders
export async function GET(req) {
  try {
    await connectDB();

    const session = await auth();
    const user = session?.user;
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
      const orders = await orderModel.find({userId : user?.id})
      .sort({createdAt : -1}).populate('products.productId')
      .skip(skip)
      .limit(limit);
      
      const ordersCount = await orderModel.countDocuments({userId : user?.id});
      const totalPages = Math.ceil(ordersCount / limit);


      const result = [];

        for (const order of orders) {
            const sellerOrders = await sellerOrderModel.find({
                orderId: order._id,
            });

            const products = order.products.map((product) => {
                const sellerOrder = sellerOrders.find(
                (s) => s.sellerId.toString() === product.sellerId.toString()
                );

                return {
                ...product.toObject(),
                status: sellerOrder?.orderStatus || "pending",
                };
            });

            result.push({
                ...order.toObject(),
                products,
            });
        }

   
      return NextResponse.json(
      {
          success: true,
          orders : result,
          totalPages : totalPages,
          currentPage : page,
        },
        { status: 200 }
      );
    
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { success: false, message: err?.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
