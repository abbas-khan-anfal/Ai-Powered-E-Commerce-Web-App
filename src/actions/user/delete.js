"use server";
import userModel from "@/models/userModel";
import connectDB from "@/lib/db";
import mongoose from "mongoose";
import cloudinary from "@/lib/cloudinary";
import getLoggedInUser from "@/lib/getLoggedInUser";

// delete user
export async function deleteUserAction(uid) {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    if (user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }
    
    if (!mongoose.isValidObjectId(uid)) {
      return { success: false, message: "User not found, Something went wrong" };
    }

    await connectDB();
    const userToDelete = await userModel.findById(uid);
    if (!userToDelete) {
      return { success: false, message: "User not found" };
    }
    if (userToDelete.avatar_pub_id && userToDelete.avatar_pub_id !== "") {
      await cloudinary.uploader.destroy(userToDelete.avatar_pub_id);
    }
    await userToDelete.deleteOne();
    return { success: true, message: "User deleted successfully" };
  } catch (err) {
    return { success: false, message: err?.message || "Something went wrong" };
  }
}
