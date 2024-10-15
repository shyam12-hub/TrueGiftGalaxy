import { NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configuration
interface CloundaryUploadResult {
  public_id: string;
  [key: string]: any;
}
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = (formData.get("file") as File) || null;
    if (!file) {
      return {
        success: false,
        message: "File not found",
      };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<CloundaryUploadResult>((resolve, rej) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "Product-Image" },
        (error, result) => {
          if (error) rej(error);
          else resolve(result as CloundaryUploadResult);
        }
      );
      uploadStream.end(buffer);
    });
    return {
      publicId: result.public_id,
    };
  } catch (error) {
    console.log("Error in uploading image ", error);
    return {
      success: false,
      message: "Error in Uploading Image",
    };
  }
}
