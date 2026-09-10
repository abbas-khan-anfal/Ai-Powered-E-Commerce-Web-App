import mongoose from "mongoose";
import { NextResponse } from "next/server";
import productModel from "@/models/productModel";
import userModel from "@/models/userModel";
import connectDB from "@/lib/db";
import { auth } from "@/auth";

// add review for product
export async function POST(req) {
    try
    {
        await connectDB();

        const { user } = await auth();
        if(!user)
        {
            return NextResponse.json(
                { success: false, message: "Please login to continue" },
                { status: 401 }
            );
        }


        const { review, rating, productId } = await req.json();
        if(!review || review?.trim() === "")
        {
            return NextResponse.json(
                { success: false, message: "Review is required" },
                { status: 400 }
            );
        }

        if(rating)
        {
            if(rating < 0 || rating > 5)
            {
                return NextResponse.json(
                    { success: false, message: "Rating must be between 0 and 5" },
                    { status: 400 }
                );
            }
        }

        const productExist = await productModel.findById(productId);
        if(!productExist)
        {
            return NextResponse.json(
                { success: false, message: "Product not found" },
                { status: 404 }
            );
        }
        
        const userExist = await userModel.findById(user.id);
        if(!userExist)
        {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        
        await productModel.findOneAndUpdate(
            { _id: productId },
            {
                $push: {
                    reviews: {
                        userId: user.id,
                        review,
                        rating,
                        createdAt: new Date()
                    }
                }
            }
        )

        return NextResponse.json({
            success : true,
            message : "Review submitted successfully",
            redirectUrl : `/shop/product-details/${productExist.slug}`
        }, { status : 200 });
    }
    catch(err)
    {
        return NextResponse.json(
            { success: false, message: err?.message || "Something went wrong" },
            { status: 500 }
        );
    }
}