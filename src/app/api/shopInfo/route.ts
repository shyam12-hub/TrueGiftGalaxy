import { NextResponse, NextRequest } from "next/server";
import { dbConnect } from "@/lib/dbConfig";
import ShopModel from "@/model/shopModel";
import { getToken } from "next-auth/jwt";
export const POST = async (req: NextRequest) => {
  await dbConnect();
  try {
    const { shopName, shopPhoneNumber, shopAddress, areaPinCode, state } =
      await req.json();

    const token = await getToken({ req: req });
    if (token) {
      const shopInfo = new ShopModel({
        shopName,
        shopPhoneNumber,
        shopAddress,
        areaPinCode,
        state,
        userId: token._id,
      });
      await shopInfo.save();
      return NextResponse.json({
        success: true,
        message: "Shop Info Added Successfully",
      });
    } else
      return NextResponse.json({
        success: false,
        message: "Please login again",
      });
  } catch (e: any) {
    console.log("Error in added Shop Info ", e.message);
    return NextResponse.json({
      success: false,
      message: "Could not able to add Shop Info",
    });
  }
};
