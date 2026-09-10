'use server';

import connectDB from '@/lib/db';
import userModel from '@/models/userModel';
import bcrypt from 'bcryptjs';

export default async function verifyOtpAction(email, otp)
{
    try
    {
        // validations
        if(otp.trim() == "")
        {
            return { success : false, message : "OTP is required" };
        }
        if(otp.toString().length < 6 || otp.toString().length > 6)
        {
            return { success : false, message : "OTP must be 6 digits" };
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

        // decrypt and compare the otp
        const isMatchOtp = await bcrypt.compare(otp, userExist.otp);
        if(!isMatchOtp)
        {
            return { success : false, message : "Invalid Otp" };
        }

        // check otp expiry
        if(Date.now() > userExist.isExpiry)
        {
            return { success : false, message : "This OTP is Expired" };
        }

        // update isVerify flag for further password updation.
        userExist.isVerify = true;
        await userExist.save();

        return { success : true, message : "OTP verified successfully" };
    }
    catch(error)
    {
        return { success : false, message : error.message || "Something went wrong" };
    }
}