"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/axios";
import { IUser } from "../types/user";

export const useAuth = () => {
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true); // NEW: loading state while checking localStorage

  useEffect(() => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("user");
      if (raw) setUser(JSON.parse(raw));
      setLoading(false); // done checking
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", { email, password });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      setLoading(false);
      return user;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  const isLoggedIn = !!user;

  return { user, login, logout, isLoggedIn, loading };
};
