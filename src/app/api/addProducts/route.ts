import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConfig";
import ProductModel from "@/model/productModel";
import ShopModel from "@/model/shopModel";
import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";

export const POST = async (req: NextRequest) => {
  await dbConnect();
  try {
    const token = await getToken({ req: req });
    const {
      productName,
      productDescription,
      category,
      productPrice,
      productMainImage, // This should now be an object { imageUrl, publicId }
      viewImages,
    } = await req.json();

    if (token) {
      // Find the shop using the user's token ID
      const shop = await ShopModel.findOne({
        userId: new mongoose.Types.ObjectId(token._id),
      });

      if (!shop) {
        return NextResponse.json({
          success: false,
          message: "No shop found for this user",
        });
      }

      // Create the product if the shop exists
      const product = new ProductModel({
        productName,
        productDescription,
        category,
        productPrice,
        productMainImage: {
          imageUrl: productMainImage.imageUrl,
          publicId: productMainImage.publicId,
        },
        viewImages: viewImages.map((viewImage: any) => ({
          imageUrl: viewImage.imageUrl,
          publicId: viewImage.publicId,
        })),
        userId: token._id,
        shop: {
          shopName: shop.shopName,
          shopPhoneNumber: shop.shopPhoneNumber,
          shopAddress: shop.shopAddress,
          areaPinCode: shop.areaPinCode,
          state: shop.state,
          shopId: shop._id, // Add the shop ID for reference
        },
      });

      await product.save();
      return NextResponse.json({ success: true, message: "Product Added" });
    }

    return NextResponse.json({ success: false, message: "Unauthorized" });
  } catch (error: any) {
    console.log("Error in adding product: ", error.message);
    return NextResponse.json({
      success: false,
      message: "Could not add product",
    });
  }
};
