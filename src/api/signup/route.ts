import { dbConnect } from "@/lib/dbConfig";
import bcrypt from "bcryptjs";
import userModel from "@/model/user";
import { sendVerificationCode } from "@/helper/sendVerificationCode";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const { username, email, password, isSeller } = await req.json();
    // if user exists
    const isUser = await userModel.findOne({ email });
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 1);
    if (isUser) {
      return NextResponse.json({
        sucess: false,
        message: "This email is already exists",
      });
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      const newUser = new userModel({
        username,
        email,
        password: hashPassword,
        isSeller,
        verificationCode: verificationCode,
        verifiedCodeExpiry: expiry,
        isVerified: false,
      });
      // send user to database
      await newUser.save();

      // send verification code
      const emailResponse = await sendVerificationCode(
        username,
        email,
        verificationCode
      );
      if (!emailResponse.success) {
        return NextResponse.json({
          sucess: false,
          message: emailResponse.message,
        });
      }
      return NextResponse.json({
        sucess: true,
        message:
          "User register successfully and verification code send to email please verify",
      });
    }
  } catch (e: any) {
    console.log(`Error in Resgistion of user ${e.message}`);
    return NextResponse.json({
      sucess: false,
      message: "Error in Resgistion of user",
    });
  }
}
