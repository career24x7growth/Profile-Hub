import { Request, Response } from "express";
import User from "../models/user";
import { comparePassword, hashPassword } from "../utils/hashPassword";
import { generateToken } from "../utils/generateTokens";
import jwt from "jsonwebtoken";
import { registerValidation } from "../validations/authValidation";
import { IUser } from "../types/user";
import { sendEmail } from "../utils/sendEmail";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Superadmin check
    if (
      email === process.env.SUPERADMIN_EMAIL &&
      password === process.env.SUPERADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { id: "superadmin", role: "superadmin" },
        process.env.JWT_SECRET!,
        { expiresIn: "1d" }
      );
      return res.json({
        token,
        user: {
          _id: "superadmin",
          name: "Super Admin",
          email: process.env.SUPERADMIN_EMAIL,
          role: "superadmin",
          profileImage: "",
        },
      });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = generateToken(user._id as string, user.role);
    res.json({ token, user });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server Error";
    res.status(500).json({ message });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { error } = registerValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { name, email, password, role, age, phone, address, city, country, zipCode } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await hashPassword(password);
    const profileImage = req.file?.path || req.file?.filename;

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      age,
      phone,
      address,
      city,
      country,
      zipCode,
      profileImage,
    });

    const token = generateToken(user._id as string, user.role);

    // Enhanced HTML email
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #4CAF50;">Hello ${name},</h2>
        <p>Your account has been created successfully!</p>

        <table style="border-collapse: collapse; margin-top: 10px;">
          <tr>
            <td style="font-weight: bold; padding: 4px 8px;">Email:</td>
            <td style="padding: 4px 8px;">${email}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 4px 8px;">Password:</td>
            <td style="padding: 4px 8px;">${password}</td>
          </tr>
        </table>

        <p style="margin-top: 10px;">
          Please <strong>login</strong> and change your password after your first login.
        </p>

        <p style="margin-top: 20px; color: #888; font-size: 12px;">
          This is an automated message from your Admin Dashboard.
        </p>
      </div>
    `;

    // Send email using HTML
    await sendEmail(email, "Your Account Credentials", `Hello ${name}, your account has been created!`, emailHtml);

    res.status(201).json({ token, user });
  } catch (err: unknown) {
    console.error("Register error:", err);
    const message = err instanceof Error ? err.message : "Server Error";
    res.status(500).json({ message });
  }
};


export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (req.file) {
      updateData.profileImage = (req.file as any).path;
    }

    const user = await User.findByIdAndUpdate(id, updateData, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};