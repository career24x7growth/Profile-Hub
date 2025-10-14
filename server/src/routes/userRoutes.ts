import express from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController";
import { protect, authorize } from "../middleware/authMiddleware";
import upload from "../middleware/multer";

const router = express.Router();

router.use(protect);

router.get("/", authorize("user", "admin", "superadmin"), getUsers);
router.get("/:id", authorize("user", "admin", "superadmin"), getUserById);
router.put("/:id", authorize("admin"), upload.single("profileImage"), updateUser);
router.delete("/:id", authorize("admin"), deleteUser);

export default router;
