"use client";

import { useState, useEffect } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X } from "lucide-react";
import Image from "next/image"; // Import Image for previews

const AddProduct = () => {
  interface ViewImage {
    imageUrl: string;
    publicId: string;
  }

  interface ProductData {
    productName: string;
    productDescription: string;
    category: string;
    productPrice: string; // or number if it's numeric
    productMainImage: ViewImage; // Type according to your needs
    viewImages: ViewImage[];
  }

  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    productName: "",
    productDescription: "",
    productCategory: "",
    productPrice: "",
  });

  // Handle input change for product details
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Remove image and its file
  const removeImage = (fileToRemove: File) => {
    // Revoke the object URL to release memory
    const index = files.indexOf(fileToRemove);
    if (index !== -1) {
      URL.revokeObjectURL(preview[index]); // Revoke the URL for the file being removed
      setPreview((prev) => prev.filter((_, i) => i !== index)); // Remove from preview
      setFiles((prev) => prev.filter((file) => file !== fileToRemove)); // Remove from files
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setFiles((prevFiles) => [...prevFiles, ...filesArray]);

      // Create preview URLs for all files
      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setPreview((prevPreview) => [...prevPreview, ...newPreviews]);
    }
  };

  useEffect(() => {
    // Cleanup the preview object URLs to prevent memory leaks
    return () => {
      preview.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [preview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      console.log("No files to upload");
      return;
    }

    const submissionData = new FormData();

    // Append product data to form
    submissionData.append("productName", formData.productName);
    submissionData.append("productDescription", formData.productDescription);
    submissionData.append("productCategory", formData.productCategory);
    submissionData.append("productPrice", formData.productPrice);

    // Append image files to form
    files.forEach((file) => {
      submissionData.append("file", file);
    });

    try {
      const response = await axios.post("/api/uploadImage", submissionData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Ensure imageUrls and publicIds are arrays
      if (
        Array.isArray(response.data.imageUrls) &&
        response.data.imageUrls.length > 0 &&
        Array.isArray(response.data.publicIds)
      ) {
        const imageUrls = response.data.imageUrls;
        const publicIds = response.data.publicIds;

        const productMainImage = {
          imageUrl: imageUrls[0],
          publicId: publicIds[0],
        };

        const viewImages = imageUrls
          .slice(1)
          .map((url: string, index: number) => ({
            imageUrl: url,
            publicId: publicIds[index + 1],
          }));

        const productData: ProductData = {
          productName: formData.productName,
          productDescription: formData.productDescription,
          category: formData.productCategory,
          productPrice: formData.productPrice,
          productMainImage,
          viewImages,
        };

        // Send product data to the backend
        const responseOfProduct = await axios.post(
          "/api/addProducts",
          productData
        );
        console.log("Response of product:", responseOfProduct.data.message);
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  return (
    <div className="container overflow-y-auto mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-rose-700">
            Add New Product
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input
                type="text"
                name="productName"
                onChange={handleInputChange}
                value={formData.productName}
                id="productName"
                placeholder="Enter product name"
                className="border-rose-200 focus:border-rose-500"
                required // Add required attribute
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productDescription">Product Description</Label>
              <Textarea
                id="productDescription"
                name="productDescription" // Add name attribute
                placeholder="Enter product description"
                className="border-rose-200 focus:border-rose-500"
                rows={4}
                onChange={handleInputChange}
                value={formData.productDescription}
                required // Add required attribute
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productCategory">Category</Label>
              <Input
                type="text"
                name="productCategory"
                id="productCategory"
                placeholder="Enter a category"
                className="border-rose-200 focus:border-rose-500"
                onChange={handleInputChange}
                value={formData.productCategory}
                required // Add required attribute
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productPrice">Price</Label>
              <Input
                type="number"
                name="productPrice"
                id="productPrice"
                onChange={handleInputChange}
                value={formData.productPrice}
                placeholder="Enter price"
                className="border-rose-200 focus:border-rose-500"
                min="0"
                step="0.01"
                required // Add required attribute
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productImage">Product Images</Label>
              <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-rose-400 transition-colors">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="productImage"
                      className="ml-5 relative cursor-pointer bg-white rounded-md font-medium text-rose-600 hover:text-rose-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-rose-500"
                    >
                      <span>Upload images</span>
                      <Input
                        id="productImage"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                      <p className="pl-1">or drag and drop</p>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 ml-2">PNG and JPG</p>
                </div>
              </div>
            </div>

            {/* Image Previews */}
            {files.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {files.map((file, index) => (
                  <div className="relative group" key={index}>
                    <Image
                      src={preview[index]}
                      alt={`preview-${index}`}
                      width={400}
                      height={400}
                      className="h-24 w-full object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      onClick={() => removeImage(file)} // Call removeImage with the file object
                      className="absolute top-0 right-0 bg-rose-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-6 w-8 rounded-xl" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-rose-600 hover:bg-rose-700 text-white"
            >
              Add Product
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProduct;
