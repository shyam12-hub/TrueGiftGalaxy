import mongoose, { Schema, Document } from "mongoose";
import Shop from "./shopModel";
interface Product extends Document {
  productName: string;
  productDescription: string;
  productPrice: number;
  rating: number;
  category: string;
  productMainImage: {
    imageUrl: string;
    publicId: string;
  };
  viewImages: [
    {
      imageUrl: string;
      publicId: string;
    }
  ];
  userId: mongoose.Schema.Types.ObjectId | string;
  shop: object;
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
  category: {
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
    imageUrl: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
  },
  viewImages: [
    {
      imageUrl: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      },
    },
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  shop: {
    type: Object,
    required: true,
  },
});

export const ProductModel =
  (mongoose.models.Product as mongoose.Model<Product>) ||
  mongoose.model<Product>("Product", productSchema);
export default ProductModel;
