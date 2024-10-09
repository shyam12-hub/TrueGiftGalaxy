import mongoose, { Schema, Document } from "mongoose";
export interface Shop extends Document {
  shopName: string;
  shopPhoneNumber: string;
  shopAddress: string;
  areaPinCode: number;
  state: string;
  userId: mongoose.Schema.Types.ObjectId | string;
}

const shopSchema: Schema<Shop> = new Schema({
  shopName: {
    type: String,
    required: true,
  },
  shopPhoneNumber: {
    type: String,
    required: true,
  },
  shopAddress: {
    type: String,
    required: true,
  },
  areaPinCode: {
    type: Number,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});
const ShopModel =
  (mongoose.models.Shop as mongoose.Model<Shop>) ||
  mongoose.model("Shop", shopSchema);
export default ShopModel;
