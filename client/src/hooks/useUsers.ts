"use client";
import { useEffect, useState } from "react";
import api from "../lib/axios";
import { IUser } from "../types/user";

export const useUsers = (isLoggedIn: boolean, loading: boolean) => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && isLoggedIn) {
      const fetchUsers = async () => {
        try {
          const res = await api.get("/users");
          setUsers(res.data);
        } catch (err) {
          console.error("Failed to fetch users:", err);
        } finally {
          setFetching(false);
        }
      };
      fetchUsers();
    }
  }, [isLoggedIn, loading]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete user");
    }
  };

  return { users, fetching, handleDelete };
};
