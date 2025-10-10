import Joi from "joi";

export const registerValidation = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}$"))
    .message(
      "Password must have at least 8 characters, including uppercase, lowercase, number and special character"
    )
    .required(),
  age: Joi.number().min(1).max(120),
  phone: Joi.string().min(10).max(15),
  address: Joi.string().max(100),
  city: Joi.string().max(50),
  country: Joi.string().max(50),
  zipCode: Joi.string().max(20),
  role: Joi.string().valid("user", "admin", "superadmin"),
});

export const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
