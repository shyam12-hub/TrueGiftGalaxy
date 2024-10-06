import mongoose, { Schema, Document } from "mongoose";

interface User extends Document {
  username: String;
  email: String;
  password: String;
  isSeller: Boolean;
  verificationCode: String;
  verifiedCodeExpiry: Date;
  isVerified: Boolean;
}

const userSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isSeller: {
    type: Boolean,
    default: false,
  },
  verificationCode: {
    type: String,
    required: true,
  },
  verifiedCodeExpiry: {
    type: Date,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

const userModel =
  (mongoose.models.Users as mongoose.Model<User>) ||
  mongoose.model<User>("users", userSchema);
export default userModel;
