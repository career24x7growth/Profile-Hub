import mongoose, { Schema, Document } from "mongoose";

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
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin", "superadmin"], default: "user" },
  age: { type: Number },
  phone: { type: String },
  address: { type: String },
  city: { type: String },
  country: { type: String },
  zipCode: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IUser>("User", UserSchema);
