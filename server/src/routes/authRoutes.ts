import express from "express";
import upload from "../middleware/multer";
import { login, register, updateUser } from "../controllers/authController";

const router = express.Router();

router.post("/login", login);
router.post("/register", upload.single("profileImage"), register);
router.put("/update/:id", upload.single("profileImage"), updateUser);

export default router;
