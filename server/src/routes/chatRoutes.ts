import express from "express";
import {
  createConversation,
  getUserConversations,
  getAllConversations,
  sendMessage,
  getMessages,
  editMessage,
  deleteMessage,
  addParticipant,
  removeParticipant,
} from "../controllers/chatController";
import { authenticateToken } from "../middleware/authMiddleware";
import { isAdmin } from "../middleware/userMiddleware";

const router = express.Router();

router.post("/conversations", authenticateToken, createConversation);
router.get("/conversations", authenticateToken, getUserConversations);
router.get("/conversations/all", authenticateToken, isAdmin, getAllConversations);

router.post("/messages", authenticateToken, sendMessage);
router.get("/messages/:conversationId", authenticateToken, getMessages);
router.put("/messages/:messageId", authenticateToken, editMessage);
router.delete("/messages/:messageId", authenticateToken, deleteMessage);

router.post("/conversations/:conversationId/participants", authenticateToken, addParticipant);
router.delete("/conversations/:conversationId/participants/:participantId", authenticateToken, removeParticipant);

export default router;
