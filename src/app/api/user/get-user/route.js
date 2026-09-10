import mongoose from "mongoose";
import userModel from "@/models/userModel";
import connectDB from "@/lib/db";
import { NextResponse } from "next/server";
import getLoggedInUser from "@/lib/getLoggedInUser";
import { auth } from "@/auth";

// get single user
export async function GET(req) {
  try {

    const searchParams = req.nextUrl.searchParams;
    const uid = searchParams.get("uid") || "";

    if(uid && mongoose.isValidObjectId(uid) && uid?.toString()?.trim() !== "")
    {
        // dashboard user
        const user = await getLoggedInUser();
        if (!user) {
        return NextResponse.json(
            { success: false, message: "Unauthorized" },
            { status: 401 },
        );
        }

        if (!mongoose.isValidObjectId(uid)) {
        return NextResponse.json(
            { success: false, message: "User not found" },
            { status: 400 },
        );
        }

        let select = "-password";
        if(user.role !== "admin")
        {
        select = "username bio avatar_path email";
        }

        await connectDB();
        const userToFind = await userModel.findById(uid).select(select);
        if (!userToFind) {
        return NextResponse.json(
            { success: false, message: "User not found" },
            { status: 400 },
        );
        }

        return NextResponse.json(
        {
            success: true,
            user: userToFind,
        },
        { status: 200 },
        );
    }

    // normal/frontend user
    const session = await auth();
    const user = session?.user;
    
        if(!user)
        {
            return NextResponse.json({
                success : false,
                message : "Something went wrong, Please login to continue"
            }, { status : 401 });
        }

        const userExist = await userModel.findById(user?.id).select("-password");
        if(!userExist)
        {
            return NextResponse.json({
                success : false,
                message : "Someting went wrong, Your account is not found"
            }, { status : 404 });
        }

        return NextResponse.json({
            success : true,
            user : userExist
        }, { status : 200 });

  } catch (err) {
    return NextResponse.json(
      { success: false, message: err?.message || "Something went wrong" },
      { status: 500 },
    );
  }
}
