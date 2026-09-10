import categoryModel from "@/models/categoryModel";
import connectDB from "@/lib/db";
import { NextResponse } from "next/server";
import getLoggedInUser from "@/lib/getLoggedInUser";

// GET /api/categories
// GET /api/categories?userOnly=true
// GET /api/categories?page=1&limit=10

export async function GET(req) {
  try {
    await connectDB();

    const searchParams = req.nextUrl.searchParams;
    // const userOnly = searchParams.get("userOnly") === "true";
    const userOnly = searchParams.get("userOnly") === "true";
    const page = Number(searchParams.get("page"));
    const limit = Number(searchParams.get("limit"));
    const user = await getLoggedInUser();
    const isPaginationValid = page && limit;

    // Pagination request
    if (isPaginationValid) {

      if (!user) {
        return NextResponse.json(
          {
            success: false,
            message: "Please login to continue.",
          },
          { status: 401 }
        );
      }

      const skip = (page - 1) * limit;

      const filter = user && user?.role === 'admin' ? {} : {userId : user?._id};

      const [categories, totalDocs] = await Promise.all([
        categoryModel
          .find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),

        categoryModel.countDocuments(filter)
      ]);

      return NextResponse.json(
        {
          success: true,
          currentPage: page,
          totalPages: Math.ceil(totalDocs / limit),
          totalDocs,
          categories,
        },
        { status: 200 }
      );
    }

    // Logged-in user's categories
    if (userOnly) {

      if (!user) {
        return NextResponse.json(
          {
            success: false,
            message: "Please login to continue.",
          },
          { status: 401 }
        );
      }

      const filter = user && user?.role === 'admin' ? {} : {userId : user?._id};

      const categories = await categoryModel
        .find(filter)
        .sort({ createdAt: -1 });

      return NextResponse.json(
        {
          success: true,
          categories,
        },
        { status: 200 }
      );
    }

    // All categories
    const categories = await categoryModel
      .find()
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        categories,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Something went wrong.",
      },
      { status: 500 }
    );
  }
}