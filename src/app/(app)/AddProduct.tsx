"use client";

import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, PlusCircle } from "lucide-react";
import Image from "next/image";
import { Loader2 } from "lucide-react";

const AddProduct = ({ onProductAdded }: { onProductAdded: () => void }) => {
  interface ViewImage {
    imageUrl: string;
    publicId: string;
  }

  interface ProductData {
    productName: string;
    productDescription: string;
    category: string;
    productPrice: string;
    productMainImage: ViewImage;
    viewImages: ViewImage[];
  }

  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    productName: "",
    productDescription: "",
    productCategory: "",
    productPrice: "",
  });
  const isOpen = useRef(true);
  const [error, setError] = useState("");

  const togglePopup = () => {
    isOpen.current = !isOpen.current;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const removeImage = (fileToRemove: File) => {
    const index = files.indexOf(fileToRemove);
    if (index !== -1) {
      URL.revokeObjectURL(preview[index]);
      setPreview((prev) => prev.filter((_, i) => i !== index));
      setFiles((prev) => prev.filter((file) => file !== fileToRemove));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setFiles(filesArray);
      setPreview(filesArray.map((file) => URL.createObjectURL(file)));
    }
  };

  useEffect(() => {
    return () => {
      preview.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [preview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setError("");

    if (files.length === 0) {
      setError("No files to upload");
      setIsUploading(false);
      return;
    }

    const submissionData = new FormData();
    submissionData.append("productName", formData.productName);
    submissionData.append("productDescription", formData.productDescription);
    submissionData.append("productCategory", formData.productCategory);
    submissionData.append("productPrice", formData.productPrice);
    files.forEach((file) => submissionData.append("file", file));

    try {
      const response = await axios.post("/api/uploadImage", submissionData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

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

        await axios.post("/api/addProducts", productData);
        onProductAdded();
        isOpen.current = false; // Close the popup
        setFiles([]); // Clear the files
        setPreview([]); // Clear the previews
        setFormData({
          productName: "",
          productDescription: "",
          productCategory: "",
          productPrice: "",
        }); // Reset form data
      } else {
        setError("Unexpected response format.");
      }
    } catch (error) {
      setError("Error uploading files. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <div className="mb-6 text-center flex justify-start items-center">
        <Button className="bg-rose-600 hover:bg-rose-700" onClick={togglePopup}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>
      {isOpen.current && (
        <div
          className="fixed top-14 inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out"
          onClick={togglePopup}
        >
          <Card
            className="w-full max-w-md max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="sticky top-0 bg-background z-10 pb-4 shadow-sm">
              <CardTitle className="text-2xl font-bold text-center text-rose-700">
                Add New Product
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 text-rose-800 text-3xl hover:text-rose-600"
                onClick={togglePopup}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && <p className="text-red-500">{error}</p>}
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
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productDescription">Product Description</Label>
                  <Textarea
                    id="productDescription"
                    name="productDescription"
                    placeholder="Enter product description"
                    className="border-rose-200 focus:border-rose-500"
                    rows={4}
                    onChange={handleInputChange}
                    value={formData.productDescription}
                    required
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
                    required
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
                    required
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
                          onClick={() => removeImage(file)}
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
                  {isUploading ? (
                    <span className="flex gap-3">
                      <Loader2 className="animate-spin" />
                      Please wait..
                    </span>
                  ) : (
                    "Add Product"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AddProduct;
