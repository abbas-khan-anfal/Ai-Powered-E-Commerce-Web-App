"use server";
import userModel from "@/models/userModel";
import connectDB from "@/lib/db";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import cloudinary from "@/lib/cloudinary";
import getLoggedInUser from "@/lib/getLoggedInUser";

export async function updateUserAction(formData) {
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

    await connectDB();
    const username = formData.get("username");
    const password = formData.get("password");
    const role = formData.get("role");
    const uid = formData.get("uid");
    const avatar = formData.get("avatar");
    const bio = formData.get("bio");

    const userData = { username, bio };

    if (!mongoose.isValidObjectId(uid)) {
      return { success: false, message: "Invalid user ID" };
    }

    const userToUpdate = await userModel.findById(uid);
    if (!userToUpdate) {
      return { success: false, message: "User not found" };
    }

    const updated = {};

    for (const key in userData) {
      if (userData[key] && userData[key] !== userToUpdate[key]) {
        updated[key] = userData[key];
      }
    }

    if (password) {
      if (password.length < 6) {
        return {
          success: false,
          message: "Password must be at least 6 characters",
        };
      }

      const isSame = await bcrypt.compare(password, userToUpdate.password);
      if (!isSame) {
        updated.password = await bcrypt.hash(password, 10);
      }
    }

    if(user?.role === "admin")
    {
      if(role)
      {
        updated.role = role;
      }
    }

    if (avatar) {
      // first delete old avatar
      if (userToUpdate.avatar_pub_id && userToUpdate.avatar_pub_id !== "") {
        await cloudinary.uploader.destroy(userToUpdate.avatar_pub_id);
      }

      const arrayBuffer = await avatar.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const base64File = Buffer.from(bytes).toString("base64");
      const dataUri = `data:${avatar?.type};base64,${base64File}`;
      const publicId = `${avatar.name}-${Math.random().toString(36).substring(2, 15)}`;
      const uploadResponse = await cloudinary.uploader.upload(dataUri, {
        folder: "multivendor-system/users",
        public_id: publicId,
      });

      if (uploadResponse) {
        updated.avatar_pub_id = uploadResponse.public_id;
        updated.avatar_path = uploadResponse.secure_url;
      }
    }

    await userModel.findByIdAndUpdate(uid, updated, { new: true });

    return { success: true, message: "User updated successfully" };
  } catch (err) {
    console.log(err);
    return { success: false, message: err?.message || "Something went wrong" };
  }
}
