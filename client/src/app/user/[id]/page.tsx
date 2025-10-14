"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { IUser } from "../../../types/user";
import api from "../../../lib/axios";
import { useAuth } from "../../../hooks/useAuth";

export default function UserProfilePage() {
  const { isLoggedIn, user: me, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({});
  const [password, setPassword] = useState(""); 
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn && !authLoading) {
      router.push("/Components/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await api.get(`/api/users/${userId}`);
        setUser(res.data);
        setForm(res.data); 
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUser();
  }, [isLoggedIn, authLoading, userId, router]);

  const onChange = (key: string, value: any) =>
    setForm((prev: any) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const updateData = { ...form };
      if (password) updateData.password = password; 

      await api.put(`/api/users/${userId}`, updateData);
      setUser(updateData);
      alert("User updated successfully!");
      router.push("/Components/dashboard");

      setPassword("");
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message ?? "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm(user);
    setPassword("");
    router.push("/Components/dashboard");
  };

  if (authLoading || loading || !user) return <div>Loading...</div>;

  const isAdmin = me?.role === "admin";

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-2xl font-semibold">{user.name}</h2>
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium">Email</label>
          {isAdmin ? (
            <input
              type="email"
              value={form.email ?? ""}
              onChange={(e) => onChange("email", e.target.value)}
              className="mt-1 w-full border px-3 py-2 rounded"
            />
          ) : (
            <p className="mt-1">{user.email}</p>
          )}
        </div>

        {isAdmin && (
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full border px-3 py-2 rounded"
            />
          </div>
        )}
      </div>

      {[
        "name",
        "role",
        "age",
        "phone",
        "address",
        "city",
        "country",
        "zipCode",
      ].map((field) => (
        <div key={field}>
          <label className="block text-sm font-medium capitalize">
            {field}
          </label>
          {isAdmin ? (
            <input
              type={field === "age" ? "number" : "text"}
              value={form[field] ?? ""}
              onChange={(e) => onChange(field, e.target.value)}
              className="mt-1 w-full border px-3 py-2 rounded"
            />
          ) : (
            <p className="mt-1">{user[field as keyof IUser] ?? "-"}</p>
          )}
        </div>
      ))}

      {isAdmin && (
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={handleCancel}
            type="button"
            className="flex-1 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
