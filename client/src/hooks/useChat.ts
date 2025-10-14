import { useState, useEffect } from "react";
import axiosInstance from "../lib/axios";
import { Conversation, Message, MessagesResponse } from "../types/chat";

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/chat/conversations");
      setConversations(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch conversations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return { conversations, loading, error, refetch: fetchConversations };
};

export const useMessages = (conversationId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    if (!conversationId) return;

    try {
      setLoading(true);
      const response = await axiosInstance.get<MessagesResponse>(
        `/chat/messages/${conversationId}`
      );
      setMessages(response.data.messages);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [conversationId]);

  return { messages, loading, error, refetch: fetchMessages };
};

export const useCreateConversation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createConversation = async (data: {
    type: "direct" | "group";
    participants: string[];
    name?: string;
  }) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/chat/conversations", data);
      setError(null);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create conversation");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createConversation, loading, error };
};

export const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (conversationId: string, content: string) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/chat/messages", {
        conversationId,
        content,
      });
      setError(null);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send message");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading, error };
};

export const useEditMessage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editMessage = async (messageId: string, content: string) => {
    try {
      setLoading(true);
      const response = await axiosInstance.put(`/chat/messages/${messageId}`, {
        content,
      });
      setError(null);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to edit message");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editMessage, loading, error };
};

export const useDeleteMessage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteMessage = async (messageId: string) => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/chat/messages/${messageId}`);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete message");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteMessage, loading, error };
};
