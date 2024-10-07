import { dbConnect } from "@/lib/dbConfig";
import userModel from "@/model/user";
import { sendVerificationCode } from "@/helper/sendVerificationCode";
import { NextRequest, NextResponse } from "next/server";
export const POST = async (req: NextRequest) => {
  await dbConnect();
  try {
    const { email } = await req.json();
    const user = await userModel.findOne({ email });
    if (user) {
      const username = user.username.toString();
      const verificationCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      const expiry = new Date();
      expiry.setSeconds(expiry.getSeconds() + 60);
      user.verificationCode = verificationCode;
      user.verifiedCodeExpiry = expiry;
      await user.save();
      const emailResponse = await sendVerificationCode(
        username,
        email,
        verificationCode
      );
      if (!emailResponse.success) {
        return NextResponse.json({
          success: false,
          message: emailResponse.message,
        });
      }
      return NextResponse.json({
        success: true,
        message: "Verification code send to email please verify",
      });
    }
  } catch (e: any) {
    console.log("could not able to resend otp ", e.message);
    return NextResponse.json({
      success: false,
      message: "Could not able to resend otp please try again later",
    });
  }
};
