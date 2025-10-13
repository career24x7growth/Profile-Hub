import express from "express";
import { addUserBySuperAdmin } from "../controllers/superAdmin";
import { protect, authorize } from "../middleware/authMiddleware";
import upload from "../middleware/multer";

const router = express.Router();

router.post("/addUser", protect, authorize("superadmin"), upload.single("profileImage"),
    addUserBySuperAdmin);

export default router;
