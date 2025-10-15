"use client";
import { useState } from "react";
import api from "../lib/axios";
import { useRouter } from "next/navigation";

export const useAddUser = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addUser = async (data: Record<string, string>, profileImage: File | null) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      if (profileImage) formData.append("profileImage", profileImage);

      await api.post("/superadmin/addUser", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("User added successfully!");
      router.push("/Components/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to add user");
    } finally {
      setLoading(false);
    }
  };

  return { addUser, loading, error, setError };
};
