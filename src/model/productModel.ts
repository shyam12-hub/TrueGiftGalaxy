import mongoose, { Schema, Document } from "mongoose";
import { Shop } from "./shopModel";
interface Product extends Document {
  productName: string;
  productDescription: string;
  productPrice: number;
  rating: number;
  productMainImage: string;
  viewImages: string[];
  userId: mongoose.Schema.Types.ObjectId | string;
  shopInfo: mongoose.Schema.Types.ObjectId | Shop;
}

const productSchema: Schema<Product> = new Schema({
  productName: {
    type: String,
    required: true,
  },
  productDescription: {
    type: String,
    required: true,
  },
  productPrice: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  productMainImage: {
    type: String,
    required: true,
  },
  viewImages: {
    type: [String],
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  shopInfo: {
    type: mongoose.Schema.Types.ObjectId, // Reference the Shop by ObjectId
    ref: "Shop", // Reference to Shop model
    required: true,
  },
});

export const ProductModel =
  (mongoose.models.Product as mongoose.Model<Product>) ||
  mongoose.model<Product>("Product", productSchema);
export default ProductModel;
