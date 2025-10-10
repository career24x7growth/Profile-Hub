import { Request, Response } from "express";
import User from "../models/user";
import { registerValidation } from "../validations/authValidation";
import { hashPassword } from "../utils/hashPassword";

// POST /api/superadmin/addUser
export const addUserBySuperAdmin = async (req: Request, res: Response) => {
  try {
    const { error } = registerValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { name, email, password, role, age, phone, address, city, country, zipCode } = req.body;

    // Prevent Superadmin from creating another superadmin
    if (role === "superadmin") {
      return res.status(403).json({ message: "Superadmin cannot create another superadmin" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await hashPassword(password);

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
    });

    res.status(201).json({ message: "User added successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
