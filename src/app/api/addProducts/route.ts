import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConfig";
import ProductModel from "@/model/productModel";
import ShopModel from "@/model/shopModel";
import { getToken } from "next-auth/jwt";
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
      const shopInfo = await ShopModel.findOne({ userId: token._id });
      // When creating the product, ensure you're using productMainImage correctly
      const product = new ProductModel({
        productName,
        productDescription,
        category,
        productPrice,
        productMainImage: {
          imageUrl: productMainImage.imageUrl, // Access the object fields properly
          publicId: productMainImage.publicId,
        },
        viewImages: viewImages.map((viewImage: any) => ({
          imageUrl: viewImage.imageUrl,
          publicId: viewImage.publicId,
        })),
        userId: token._id,
        shopInfo: shopInfo,
      });
      console.log("product", product);
      await product.save();
      return NextResponse.json({ success: true, message: "Product Added" });
    }
  } catch (error: any) {
    console.log("Error in adding image ", error.message);
    return NextResponse.json({
      success: false,
      message: "Could not add image",
    });
  }
};
