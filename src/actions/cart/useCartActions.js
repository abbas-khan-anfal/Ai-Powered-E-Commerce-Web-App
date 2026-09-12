'use server';

import cartModel from "@/models/cartModel";
import productModel from "@/models/productModel";
import mongoose from "mongoose";
import { auth } from "@/auth";
import connectDB from "@/lib/db";

export async function addToCartAction(productId){
    try
    {
        const session = await auth();
        const user = session?.user;
        if(!user)
        {
            return { success : false, message : "Please login to continue" };
        }

        if(!mongoose.isValidObjectId(productId))
        {
            return { success : false, message : "Invalid product id" };
        }
        await connectDB();
        const productExistInCart = await cartModel.findOne({ userId : user?.id, productId });
        if(productExistInCart)
        {
            return { success : false, message : "Item already exist in cart" };
        }
        await cartModel.create({ userId : user?.id, productId });


        return { success : true, message : "Item added to cart" };
    }
    catch(error)
    {
        return { success : false, message : "Something went wrong" };
    }
}


export async function removeCartItemAction(itemId){
    try
    {
        const session = await auth();
        const user = session?.user;
        if(!user)
        {
            return { success : false, message : "Please login to continue" };
        }
        if(!mongoose.isValidObjectId(itemId))
        {
            return { success : false, message : "Invalid product id" };
        }
        await connectDB();
        const productExistInCart = await cartModel.findOne({ _id : itemId, userId : user?.id }).populate("productId", "_id");
        if(!productExistInCart)
        {
            return { success : false, message : "Item not found in cart" };
        }
        await cartModel.deleteOne({ _id : itemId, userId : user?.id });
        return { success : true, message : "Item removed from cart" };
    }
    catch(error)
    {
        return { success : false, message : "Something went wrong" };
    }
}


export async function updateCartAction(itemId, qty = 1){
    try
    {
        const session = await auth();
        const user = session?.user;
        if(!user)
        {
            return { success : false, message : "Please login to continue" };
        }
        if(!mongoose.isValidObjectId(itemId))
        {
            return { success : false, message : "Invalid product id" };
        }
        if(qty <= 0)
        {
            return { success : false, message : "Quantity must 1 or greater" };
        }
        await connectDB();
        const productExistInCart = await cartModel.findOne({ _id : itemId, userId : user?.id });
        if(!productExistInCart)
        {
            return { success : false, message : "Item not found in cart, Something went wrong" };
        }
        await cartModel.updateOne({ _id : itemId, userId : user?.id }, { qty });
        return { success : true, message : "Item updated in cart" };
    }
    catch(error)
    {
        return { success : false, message : "Something went wrong" };
    }
}