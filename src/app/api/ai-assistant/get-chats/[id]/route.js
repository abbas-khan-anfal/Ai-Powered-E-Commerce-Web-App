import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import aiChatsModel from "@/models/aiChatsModel";


// get all chats
export async function GET(req, { params })
{
  try
  {
    await connectDB();
    const { id } = await params;
    
    if(!id)
    {
      return NextResponse.json({
        success : false,
        message : "User id is required"
      }, { status : 400 });
    }
    
    const chats = await aiChatsModel.find({ userId : id });

    return NextResponse.json({
      success : true,
      chats : chats
    }, { status : 200 });
  }
  catch(error)
  {
    return NextResponse.json({
      success : false,
      message : error?.message
    }, { status : 500 });
  }
}