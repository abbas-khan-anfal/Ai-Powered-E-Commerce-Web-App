'use server';

import connectDB from "@/lib/db";
import userModel from "@/models/userModel";
import { isSendEmail } from "@/lib/isSendEmail";
import bcrypt from 'bcryptjs';

// otp 5 mint expirty time
const isExpiryTime = 5 * 60 * 1000;

export default async function forgotPasswordAction(email)
{
    try
    {
        // validations
        if(email.trim() == "")
        {
            return { success : false, message : "Email is not provided or missing" };
        }
        if(!email.includes("@"))
        {
            return { success : false, message : "Invalid email" };
        }

        // generate 6-digit otp
        const sixDigitOtp = Math.floor(100000 + Math.random() * 900000);

        // check if email exist or not in db
        await connectDB();
        const userExist = await userModel.findOne({ email : email });
        if(!userExist)
        {
            return { success : false, message : "This email is not registered with us." };
        }

        // encrypt the otp
        const encryptedOtp = await bcrypt.hash(sixDigitOtp.toString(), 10);

        // update the user with otp and expiry time
        userExist.isExpiry = Date.now() + isExpiryTime;
        userExist.otp = encryptedOtp;
        await userExist.save();

        // call the email sender function
        await isSendEmail(email, sixDigitOtp);

        return { success : true, message : "A 6-digit OTP sent to your email" };
    }
    catch(error)
    {
        return { success : false, message : error.message || "Something went wrong" };
    }
}