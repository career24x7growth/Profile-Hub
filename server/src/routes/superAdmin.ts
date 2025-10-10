import express from "express";
import { addUserBySuperAdmin } from "../controllers/superAdmin";
import { protect, authorize } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/addUser", protect, authorize("superadmin"), addUserBySuperAdmin);

export default router;
