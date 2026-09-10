"use server";
import connectDB from "@/lib/db";
import getLoggedInUser from "@/lib/getLoggedInUser";
import { sellerOrderModel } from "@/models/orderModel";
import mongoose from "mongoose";

export async function updateOrderStatusAction({ orderId, orderStatus }) {
  try {
    await connectDB();

    if(!mongoose.isValidObjectId(orderId))
    {
        return { success: false, message: "Invalid order id" };
    }

    const orderStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

    if(!orderStatuses.includes(orderStatus))
    {
        return { success: false, message: "Invalid order status" };
    }

    const user = await getLoggedInUser();
    if (!user) return { success: false, message: "Unauthorized" };

    const orderExist = await sellerOrderModel.findById(orderId);
    if (!orderExist) return { success: false, message: "Order not found" };

    orderExist.orderStatus = orderStatus;
    await orderExist.save();

    return {
      success: true,
      message: "Order status changed successfully",
    };
  } catch (err) {
    return { success: false, message: "Server error" };
  }
}
