// src/types/user.ts
export interface IUser {
  _id: string;
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
  createdAt?: string;
}
