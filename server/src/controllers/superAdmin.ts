import { Request, Response } from "express";
import User from "../models/user";
import { registerValidation } from "../validations/authValidation";
import { hashPassword } from "../utils/hashPassword";

export const addUserBySuperAdmin = async (req: Request, res: Response) => {
  try {
    const { error } = registerValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const {
      name,
      email,
      password,
      role,
      age,
      phone,
      address,
      city,
      country,
      zipCode,
    } = req.body;

    if (role === "superadmin") {
      return res.status(403).json({ message: "Superadmin cannot create another superadmin" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);

    let profileImageUrl = "";
    if (req.file && (req.file as any).path) {
      profileImageUrl = (req.file as any).path;
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      age,
      phone,
      address,
      city,
      country,
      zipCode,
      profileImage: profileImageUrl,
    });

    res.status(201).json({
      message: "User added successfully",
      user,
    });
  } catch (err: any) {
    console.error("Error in addUserBySuperAdmin:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
