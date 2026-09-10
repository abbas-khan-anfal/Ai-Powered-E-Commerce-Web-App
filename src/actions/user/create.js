"use server";

import userModel from "@/models/userModel";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import cloudinary from "@/lib/cloudinary";
import getLoggedInUser from "@/lib/getLoggedInUser";

export async function createUserAction(formData) {
  try {
    await connectDB();

    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");
    const role = formData.get("role");
    const avatar = formData.get("avatar");
    const bio = formData.get("bio") || "";

    // validation
    if (!username || !email || !password || !role) {
      return { success: false, message: "Please fill all the fields" };
    }

    if (!email.includes("@") || !email.includes(".")) {
      return { success: false, message: "Please enter a valid email" };
    }

    if (password.length < 6) {
      return {
        success: false,
        message: "Password must be at least 6 characters or longer",
      };
    }

    const user = await getLoggedInUser();

    if(role !== "customer")
    {
      if(!user)
      {
        return {
          success: false,
          message: "UnAuthorized!",
        };
      }
      else
      {
        if(user?.role !== "admin")
        {
          return {
            success: false,
            message: "UnAuthorized!",
          };
        }
      }
    }

    // check existing user
    const existingUser = await userModel.findOne({
      $or: [{ email }, { username }]
    });
    if (existingUser) {
      return { success: false, message: "User already exist with this email or username" };
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // store file in cloudinary
    let avatar_pub_id = "";
    let avatar_path = "";
    if (avatar) {
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
        avatar_pub_id = uploadResponse.public_id;
        avatar_path = uploadResponse.secure_url;
      }
    }

    // create user
    const newUser = new userModel({
      username,
      email,
      password: hashedPassword,
      role,
      bio,
      avatar_pub_id,
      avatar_path,
    });

    const resMessage = role === "admin" ? "Admin created successfully" : role === "seller" ? "Seller account has been created successfully" : "Signup successful";

    await newUser.save();

    return { success: true, message: resMessage };
  } catch (err) {
    return { success: false, message: err?.message || "Something went wrong" };
  }
}
