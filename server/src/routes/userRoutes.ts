import express from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController";
import { protect, authorize } from "../middleware/authMiddleware";

const router = express.Router();

router.use(protect);

router.get("/", authorize("user", "admin", "superadmin"), getUsers);
router.get("/:id", authorize("user", "admin", "superadmin"), getUserById);
router.put("/:id", authorize("admin"), updateUser);
router.delete("/:id", authorize("admin"), deleteUser);

export default router;
