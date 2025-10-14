<<<<<<< HEAD
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/axios";
import { IUser } from "../types/user";

export const useAuth = () => {
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", { email, password });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      return user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/Components/login");
  };

  return { user, login, logout, loading, isLoggedIn: !!user };
};
=======
>>>>>>> ee079cd197d587bf3dd07f58fb998ae75617d1e4
