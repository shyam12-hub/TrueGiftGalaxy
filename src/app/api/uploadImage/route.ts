import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configuration
interface CloundaryUploadResult {
  public_id: string;

  secure_url: string;
  [key: string]: any;
}

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("file");

    // Upload all files
    const uploadPromises = files.map(async (file) => {
      // Check if the entry is a File
      if (file instanceof File) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        return new Promise<CloundaryUploadResult>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "Product-Images" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result as CloundaryUploadResult);
            }
          );
          uploadStream.end(buffer);
        });
      }
      return null; // Return null for non-File entries
    });

    // Wait for all uploads to complete
    const uploadResults = await Promise.all(uploadPromises);
    const filteredResults = uploadResults.filter((result) => result !== null);

    const imageUrls = filteredResults.map((result: any) => result.secure_url);
    const publicIds = filteredResults.map((result: any) => result.public_id);

    return NextResponse.json({
      success: true,
      message: "Images uploaded successfully",
      imageUrls, // Returning uploaded image URLs
      publicIds,
    });
  } catch (error) {
    console.log("Error in uploading image:", error);
    return NextResponse.json({
      success: false,
      message: "Error in Uploading Image",
    });
  }
}
