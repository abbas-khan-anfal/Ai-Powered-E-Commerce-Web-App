
import userModel from "@/models/userModel";
import connectDB from "@/lib/db";
import { NextResponse } from "next/server";
import getLoggedInUser from "@/lib/getLoggedInUser";

// get users
export async function GET(req) {
    try
    {
        const searchParams = req.nextUrl.searchParams;
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 3;

        const user = await getLoggedInUser();
        if(!user)
        {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        if(user.role !== "admin")
        {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const skip = (page - 1) * limit;
        await connectDB();
        // get users and remove the logged in uer from it
        const users = await userModel.find({ _id: { $ne: user._id } })
            .skip(skip)
            .limit(limit)
            .select("-password")
            .sort({ createdAt: -1 });

        const totalDocs = await userModel.countDocuments();
        // get total pages one less if on the last page is only admin
        const totalDocsExcludingAdmin = totalDocs - 1;
        const totalPages = Math.ceil(totalDocsExcludingAdmin / limit);

        return NextResponse.json({
            success : true,
            totalPages,
            users
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