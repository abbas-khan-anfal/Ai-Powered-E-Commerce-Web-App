'use server';

import connectDB from '@/lib/db';
import userModel from '@/models/userModel';
import bcrypt from 'bcryptjs';

export default async function resetPasswordAction(email, password)
{
    try
    {
        // validations
        if(password.trim() == "")
        {
            return { success : false, message : "Password is required" };
        }
        
        if(password.length < 7)
        {
            return { success : false, message : "Password must be at least 7 characters long" };
        }

        if(email.trim() == "")
        {
            return { success : false, message : "Something went wront, try again" };
        }
        if(!email.includes("@"))
        {
            return { success : false, message : "Invalid email" };
        }

        // check if email exist or not in db
        await connectDB();
        const userExist = await userModel.findOne({ email : email });
        if(!userExist)
        {
            return { success : false, message : "Something went wront, try again" };
        }

        if(!userExist.isVerify)
        {
            return { success : false, message : "OTP not verified correctly, try again and verify your OTP again." };
        }

        // encrypt/hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // update password
        userExist.password = hashedPassword;
        userExist.isVerify = false;
        userExist.otp = null;
        userExist.isExpiry = null;
        await userExist.save();

        return { success : true, message : "Password updated successfully" };
    }
    catch(error)
    {
        return { success : false, message : error.message || "Something went wrong" };
    }
}