"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const user_1 = __importDefault(require("../models/user"));
const authValidation_1 = require("../validations/authValidation");
const hashPassword_1 = require("../utils/hashPassword");
const generateTokens_1 = require("../utils/generateTokens");
const signup = async (req, res) => {
    try {
        const { error } = authValidation_1.signupValidation.validate(req.body);
        if (error)
            return res.status(400).json({ message: error.details[0].message });
        const { name, email, password, role, age, phone, address, city, country, zipCode } = req.body;
        const existingUser = await user_1.default.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: "User already exists" });
        const hashedPassword = await (0, hashPassword_1.hashPassword)(password);
        const user = await user_1.default.create({
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
        const token = (0, generateTokens_1.generateToken)(user._id, user.role);
        res.status(201).json({ token, user });
    }
    catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        const { error } = authValidation_1.loginValidation.validate(req.body);
        if (error)
            return res.status(400).json({ message: error.details[0].message });
        const { email, password } = req.body;
        const user = await user_1.default.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "Invalid credentials" });
        const isMatch = await (0, hashPassword_1.comparePassword)(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid credentials" });
        const token = (0, generateTokens_1.generateToken)(user._id, user.role);
        res.status(200).json({ token, user });
    }
    catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};
exports.login = login;
