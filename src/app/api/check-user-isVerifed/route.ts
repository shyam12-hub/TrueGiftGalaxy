import { NextResponse, NextRequest } from "next/server";
import { dbConnect } from "@/lib/dbConfig";
import userModel from "@/model/user";

export const POST = async (req: NextRequest) => {
  await dbConnect(); // Ensure database connection

  try {
    const { email } = await req.json(); // Extract email from request body

    // Check if the user exists in the database
    const user = await userModel.findOne({ email });

    // If no user found, return an error response
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Email not found",
      });
    }

    // Check if the user is verified or not
    if (!user.isVerified) {
      return NextResponse.json({
        success: false,
        message: "You are not verified",
      });
    }

    // If user is verified
    return NextResponse.json({
      success: true,
      message: "Email is verified",
    });
  } catch (error: any) {
    console.log("Could not verify user status: ", error.message);

    // Handle server errors
    return NextResponse.json({
      success: false,
      message:
        "Could not check if the user is verified. Please try again later.",
    });
  }
};
