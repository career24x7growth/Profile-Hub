import { useState, useEffect } from "react";
import axiosInstance from "../lib/axios";
import { Conversation } from "../types/chat";

export const useAllConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllConversations = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/chat/conversations/all");
      setConversations(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch conversations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllConversations();
  }, []);

  return { conversations, loading, error, refetch: fetchAllConversations };
};
