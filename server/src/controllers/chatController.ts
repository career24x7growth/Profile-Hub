import { Request, Response } from "express";
import Conversation from "../models/conversation";
import Message from "../models/message";
import mongoose from "mongoose";

export const createConversation = async (req: Request, res: Response) => {
  try {
    const { type, name, participants } = req.body;
    const userId = (req as any).user.id;

    if (!participants || participants.length === 0) {
      return res.status(400).json({ message: "Participants are required" });
    }

    const allParticipants = [...new Set([userId, ...participants])];

    if (type === "direct" && allParticipants.length !== 2) {
      return res
        .status(400)
        .json({ message: "Direct conversation must have exactly 2 participants" });
    }

    if (type === "direct") {
      const existingConversation = await Conversation.findOne({
        type: "direct",
        participants: { $all: allParticipants, $size: 2 },
      });

      if (existingConversation) {
        return res.status(200).json(existingConversation);
      }
    }

    const conversation = new Conversation({
      type,
      name: type === "group" ? name : undefined,
      participants: allParticipants,
      createdBy: userId,
    });

    await conversation.save();
    await conversation.populate("participants", "name email profileImage");

    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getUserConversations = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "name email profileImage")
      .populate("lastMessage.sender", "name profileImage")
      .sort({ updatedAt: -1 });

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getAllConversations = async (req: Request, res: Response) => {
  try {
    const conversations = await Conversation.find()
      .populate("participants", "name email profileImage")
      .populate("createdBy", "name email")
      .populate("lastMessage.sender", "name profileImage")
      .sort({ updatedAt: -1 });

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { conversationId, content } = req.body;
    const userId = (req as any).user.id;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Message content is required" });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    if (!conversation.participants.includes(userId)) {
      return res
        .status(403)
        .json({ message: "You are not a participant in this conversation" });
    }

    const message = new Message({
      conversationId,
      sender: userId,
      content: content.trim(),
    });

    await message.save();
    await message.populate("sender", "name email profileImage");

    conversation.lastMessage = {
      content: content.trim(),
      sender: new mongoose.Types.ObjectId(userId),
      timestamp: new Date(),
    };
    await conversation.save();

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;
    const userId = (req as any).user.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    if (!conversation.participants.includes(userId)) {
      return res
        .status(403)
        .json({ message: "You are not a participant in this conversation" });
    }

    const messages = await Message.find({
      conversationId,
      isDeleted: false,
    })
      .populate("sender", "name email profileImage")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Message.countDocuments({
      conversationId,
      isDeleted: false,
    });

    res.status(200).json({
      messages: messages.reverse(),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const editMessage = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;
    const userId = (req as any).user.id;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Message content is required" });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.sender.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You can only edit your own messages" });
    }

    if (message.isDeleted) {
      return res.status(400).json({ message: "Cannot edit deleted message" });
    }

    message.content = content.trim();
    message.isEdited = true;
    message.editedAt = new Date();
    await message.save();

    await message.populate("sender", "name email profileImage");

    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;
    const userId = (req as any).user.id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.sender.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You can only delete your own messages" });
    }

    message.isDeleted = true;
    message.content = "This message has been deleted";
    await message.save();

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const addParticipant = async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;
    const { participantId } = req.body;
    const userId = (req as any).user.id;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    if (conversation.type !== "group") {
      return res
        .status(400)
        .json({ message: "Can only add participants to group conversations" });
    }

    if (conversation.createdBy.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Only the creator can add participants" });
    }

    if (conversation.participants.includes(participantId)) {
      return res
        .status(400)
        .json({ message: "User is already a participant" });
    }

    conversation.participants.push(participantId);
    await conversation.save();
    await conversation.populate("participants", "name email profileImage");

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const removeParticipant = async (req: Request, res: Response) => {
  try {
    const { conversationId, participantId } = req.params;
    const userId = (req as any).user.id;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    if (conversation.type !== "group") {
      return res
        .status(400)
        .json({ message: "Can only remove participants from group conversations" });
    }

    if (conversation.createdBy.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Only the creator can remove participants" });
    }

    conversation.participants = conversation.participants.filter(
      (p) => p.toString() !== participantId
    );
    await conversation.save();
    await conversation.populate("participants", "name email profileImage");

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
