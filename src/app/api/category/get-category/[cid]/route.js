import categoryModel from "@/models/categoryModel";
import connectDB from "@/lib/db";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import getLoggedInUser from "@/lib/getLoggedInUser";

// get single category
export async function GET(req, {params}) {
    try
    {
        const user = await getLoggedInUser();
        if (!user) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }
        const { cid } = await params;
        if(!mongoose.isValidObjectId(cid))
        {
            return NextResponse.json(
                { success: false, message: "Category not found" },
                { status: 400 }
            );
        }
        await connectDB();
        const filter = user?.role === "admin" ? {_id : cid} : {_id : cid, userId : user._id};
        const categoryToFind = await categoryModel.findOne(filter);
        if(!categoryToFind)
        {
            return NextResponse.json(
                { success: false, message: "Category not found" },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success : true,
            category : categoryToFind
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