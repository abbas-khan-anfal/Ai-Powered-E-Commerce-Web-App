"use server";
import userModel from "@/models/userModel";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import { generateToken } from "@/lib/token";
import { cookies } from "next/headers";

export async function loginUserAction({ email, password }) {
  try {
    await connectDB();

    // validation
    if (!email || !password) {
      return { success: false, message: "Please fill all the fields" };
    }

    if (!email.includes("@") || !email.includes(".")) {
      return { success: false, message: "Please enter a valid email" };
    }

    // if (password.length < 6) {
    //   return { success: false, message: "Password must be at least 6 characters or longer" };
    // }

    const user = await userModel.findOne({ email });
    if (!user) {
      return { success: false, message: "Incorrect email & password" };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { success: false, message: "Incorrect email & password" };
    }

    // check user role to prevent customer from accessing dashboard
    if (user?.role === "customer") {
      return { success: false, message: "Unauthorized!" };
    }

    const tokenUser = {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        bio: user.bio,
        avatar: user.avatar_path,
    }

    const token = await generateToken(tokenUser);
    if(!token)
    {
        return {success: false, message: "Failed to login, try again"};
    }

    // cookies
    const store = await cookies();
    store.set("ecom-dash-token", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60,
    });
    store.set("ecom-dash-user", JSON.stringify(tokenUser), {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60,
    });

    return {
      success: true,
      message: "Login successful",
    };

  } catch (err) {
    return { success: false, message: err?.message || "Something went wrong" };
  }
}
