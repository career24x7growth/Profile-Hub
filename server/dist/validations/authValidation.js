"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidation = exports.signupValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.signupValidation = joi_1.default.object({
    name: joi_1.default.string().min(3).max(50).required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string()
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}$"))
        .message("Password must have at least 8 characters, including uppercase, lowercase, number and special character")
        .required(),
    age: joi_1.default.number().min(1).max(120),
    phone: joi_1.default.string().min(10).max(15),
    address: joi_1.default.string().max(100),
    city: joi_1.default.string().max(50),
    country: joi_1.default.string().max(50),
    zipCode: joi_1.default.string().max(20),
    role: joi_1.default.string().valid("user", "admin", "superadmin"),
});
exports.loginValidation = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
});
