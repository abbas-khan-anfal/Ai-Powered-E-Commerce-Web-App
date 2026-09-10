'use server';

import wishlistModel from "@/models/wishlistModel";
import mongoose from "mongoose";
import { auth } from "@/auth";

export async function addToWishlistAction(productId){
    try
    {
        const { user } = await auth();
        if(!user)
        {
            return { success : false, message : "Please login to continue" };
        }

        if(!mongoose.isValidObjectId(productId))
        {
            return { success : false, message : "Invalid product id" };
        }
        const productExistInWishlit = await wishlistModel.findOne({ userId : user?.id, productId });
        if(productExistInWishlit)
        {
            // delete if exist
            await productExistInWishlit.deleteOne();
            return { success : true, message : "Item removed from wishlist" };
        }
        await wishlistModel.create({ userId : user?.id, productId });

        return { success : true, message : "Item added to wishlit" };
    }
    catch(error)
    {
        return { success : false, message : "Something went wrong" };
    }
}


export async function removeWishlistItemAction(itemId){
    try
    {
        const { user } = await auth();
        if(!user)
        {
            return { success : false, message : "Please login to continue" };
        }
        if(!mongoose.isValidObjectId(itemId))
        {
            return { success : false, message : "Invalid product id" };
        }
        const productExistInWishlit = await wishlistModel.findOne({ _id : itemId, userId : user?.id });
        if(!productExistInWishlit)
        {
            return { success : false, message : "Item not found in wishlist" };
        }
        await wishlistModel.deleteOne({ _id : itemId, userId : user?.id });

        return { success : true, message : "Item removed from wishlist" };
    }
    catch(error)
    {
        return { success : false, message : "Something went wrong" };
    }
}