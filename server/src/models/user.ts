import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin" | "superadmin";
  age?: number;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  zipCode?: string;
  profileImage?: string;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin", "superadmin"], default: "user" },
    age: Number,
    phone: String,
    address: String,
    city: String,
    country: String,
    zipCode: String,
    profileImage: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
