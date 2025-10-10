import { Request, Response } from "express";
import User, { IUser } from "../models/user";
import { signupValidation, loginValidation } from "../validations/authValidation";
import { hashPassword, comparePassword } from "../utils/hashPassword";
import { generateToken } from "../utils/generateTokens";

export const signup = async (req: Request, res: Response) => {
  try {
    const { error } = signupValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { name, email, password, role, age, phone, address, city, country, zipCode } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await hashPassword(password);

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
    });

    const token = generateToken(user._id , user.role);
    res.status(201).json({ token, user });
  } catch (err: unknown) {
  const message = err instanceof Error ? err.message : "Server Error";
  res.status(500).json({ message });
}

};


export const login = async (req: Request, res: Response) => {
  try {
    const { error } = loginValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id, user.role);
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
