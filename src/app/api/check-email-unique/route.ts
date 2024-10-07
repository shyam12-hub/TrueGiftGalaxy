import { NextResponse, NextRequest } from "next/server";
import { dbConnect } from "@/lib/dbConfig";
import userModel from "@/model/user";

export const GET = async (req: NextRequest) => {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const queryparam = searchParams.get("email");
    if (queryparam) {
      // checking if this email is found in database or not
      const user = await userModel.findOne({ email: queryparam });
      // if user exists and user is verified
      if (user && user.isVerified) {
        return NextResponse.json({
          success: false,
          message: "email is already exists",
        });
      } // if user exists but user is not verified
      else if ((user && !user.isVerified) || !user) {
        return NextResponse.json({ success: true, message: "email is unique" });
      }
    }
  } catch (error: any) {
    console.log("Error in checking email ", error.message);
    return NextResponse.json(
      {
        success: false,
        message: "Error in checking email",
      },
      { status: 500 }
    );
  }
};
