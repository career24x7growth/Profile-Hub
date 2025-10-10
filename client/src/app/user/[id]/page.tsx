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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn && !authLoading) {
      router.push("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await api.get(`/api/users/${userId}`);
        setUser(res.data);
        setForm(res.data); // fill form with user data
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchUser();
  }, [isLoggedIn, authLoading, userId, router]);

  const onChange = (key: string, value: any) => setForm((prev: any) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/api/users/${userId}`, form);
      setUser(form);
      alert("User updated successfully!");
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message ?? "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading || !user) return <div>Loading...</div>;

  const isAdmin = me?.role === "admin";

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-2xl font-semibold">{user.name}</h2>
      {error && <p className="text-red-600">{error}</p>}

      {["name","email","role","age","phone","address","city","country","zipCode"].map((field) => (
        <div key={field}>
          <label className="block text-sm font-medium capitalize">{field}</label>
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
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      )}
    </div>
  );
}
