import connectDB from "@/lib/db";
import getLoggedInUser from "@/lib/getLoggedInUser";
import categoryModel from "@/models/categoryModel";
import { sellerOrderModel } from "@/models/orderModel";
import productModel from "@/models/productModel";
import userModel from "@/models/userModel";
import { NextResponse } from "next/server";

// get total of products, categories, users, and orders
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

    await connectDB();

    const filter = user?.role === "admin" ? {} : {userId : user._id};

    // Fetch products count
    const productsCount = await productModel.countDocuments(filter);

    // Fetch categories count
    const categoriesCount = await categoryModel.countDocuments(filter);
    
    // Fetch users count
    const usersCount = await userModel.countDocuments({
      _id : { $ne : user?._id}
    });

    const isSellerOrdersFilter = user?.role == "admin" ? {} : {sellerId : user._id};
    // Fetch sellers orders
    const sellersOrders = ['seller','admin'].includes(user?.role) ? await sellerOrderModel.find(isSellerOrdersFilter) : [];
        
    return NextResponse.json(
      {
        success: true,
        totalProducts: productsCount,
        totalCategories: categoriesCount,
        totalUsers: user?.role === "admin" ? usersCount : 0,
        totalOrders: sellersOrders
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
