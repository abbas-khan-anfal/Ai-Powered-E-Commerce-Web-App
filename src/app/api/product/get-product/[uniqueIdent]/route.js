import mongoose from "mongoose";
import { NextResponse } from "next/server";
import categoryModel from "@/models/categoryModel";
import productModel from "@/models/productModel";
import userModel from "@/models/userModel";
import connectDB from "@/lib/db";
import getLoggedInUser from "@/lib/getLoggedInUser";

// get single product
export async function GET(req, {params}) {
    try
    {
        const searchParams = req.nextUrl.searchParams;
        const isDashboard = Boolean(searchParams.get('isDashboard') === "true");
        const { uniqueIdent } = await params;
        await connectDB();

        if(isDashboard)
        {
            const user = await getLoggedInUser();
            if(!user)
            {
                return NextResponse.json(
                    { success: false, message: "Unauthorized" },
                    { status: 401 }
                );
            }

            if(!mongoose.isValidObjectId(uniqueIdent))
            {
                return NextResponse.json(
                    { success: false, message: "Product not found" },
                    { status: 400 }
                );
            }
            const filter = user?.role == "admin" ? {_id : uniqueIdent} : {_id : uniqueIdent, userId : user._id};
            const productToFind = await productModel.findOne(filter)
            .populate("category")
            .populate("userId").select("-password");
            if(!productToFind)
            {
                return NextResponse.json(
                    { success: false, message: "Product not found" },
                    { status: 400 }
                );
            }

            return NextResponse.json({
                success : true,
                product : productToFind
            }, { status : 200 });
        }
        else
        {
            const productToFind = await productModel.findOne({slug: uniqueIdent})
            .populate("category")
            .populate({
                path : "userId",
                select : "-password -isExpiry -isVerify -otp"
            })
            .populate("reviews.userId", "-password -isExpiry -isVerify -otp");

            if(!productToFind)
            {
                return NextResponse.json(
                    { success: false, message: "Product not found" },
                    { status: 400 }
                );
            }

            return NextResponse.json({
                success : true,
                product : productToFind
            }, { status : 200 });
        }
    }
    catch(err)
    {
        return NextResponse.json(
            { success: false, message: err?.message || "Something went wrong" },
            { status: 500 }
        );
    }
}