'use server';
import { auth } from "@/auth";
import cloudinary from "@/lib/cloudinary";
import connectDB from "@/lib/db";
import userModel from "@/models/userModel";

export async function editProfileAction(formData) {
  try {
    await connectDB();
    const { user } = await auth();
    if (!user) {
      return {
        success: false,
        message: "Somethin went wrong, please login to continue",
      };
    }

    const userExist = await userModel.findById(user?.id);
    if(!userExist)
    {
        return {
            success: false,
            message: "Somethin went wrong, please login to continue",
        };
    }

    const username = formData.get("username");
    const bio = formData.get("bio");
    const avatar = formData.get("avatar");

    if (!username) {
      return {
        success: false,
        message: "Username will not be empty",
      };
    }

    if (bio && bio.length > 200) {
      return {
        success: false,
        message: "Bio must be 200 characters or less",
      };
    }

    // delete old picture
    if(avatar)
    {
        if(userExist.avatar_pub_id && userExist.avatar_pub_id !== "")
        {
            await cloudinary.uploader.destroy(userExist.avatar_pub_id)
        }
    }

    let updatedData = {};

    if (avatar) {
      // first delete old avatar
      if (userExist.avatar_pub_id && userExist.avatar_pub_id !== "") {
        await cloudinary.uploader.destroy(userExist.avatar_pub_id);
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
        updatedData.avatar_pub_id = uploadResponse.public_id;
        updatedData.avatar_path = uploadResponse.secure_url;
      }
    }

    if(bio !== userExist.bio)
    {
        updatedData.bio = bio;
    }
    if(username !== userExist.username)
    {
        updatedData.username = username;
    }

    await userModel.findByIdAndUpdate(
        userExist._id,
        updatedData
    );

    return {
      success: true,
      message: "Profile updated successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: error?.message,
    };
  }
}
