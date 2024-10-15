import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { dbConnect } from "@/lib/dbConfig";
import ProductModel from "@/model/productModel";

export const GET = async (req: NextRequest) => {
  await dbConnect();
  try {
    const token = await getToken({ req });

    // Check if token and userId exist
    if (!token || !token._id) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized: No token found",
      });
    }

    const allProducts = await ProductModel.find({
      userId: token._id, // Ensure you access the correct property
    });

    // Check for empty product list
    if (allProducts.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        message: "No products found for this user.",
      });
    }

    return NextResponse.json({
      success: true,
      data: allProducts,
    });
  } catch (e: any) {
    console.log("Could not able to get Product ", e); // Log full error for debugging
    return NextResponse.json({
      success: false,
      message: "Could not able to get Product",
    });
  }
};
