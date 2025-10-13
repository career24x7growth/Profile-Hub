"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../lib/axios";

export default function AddUserPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    age: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    zipCode: "",
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onChange = (k: string, v: string) => setForm((s) => ({ ...s, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError("Name, email, and password are required");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value as string);
      });
      if (profileImage) formData.append("profileImage", profileImage);

      await api.post("/api/superadmin/addUser", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("User added successfully!");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to add user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white p-6 rounded shadow space-y-4"
    >
      <h2 className="text-2xl font-semibold">Add User</h2>
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {["name","email","password","role","age","phone","address","city","country","zipCode"].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium capitalize">{field}</label>
            {field === "role" ? (
              <select
                value={form.role}
                onChange={(e) => onChange("role", e.target.value)}
                className="mt-1 w-full border px-3 py-2 rounded"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            ) : (
              <input
                type={field === "age" ? "number" : field === "password" ? "password" : "text"}
                value={form[field as keyof typeof form]}
                onChange={(e) => onChange(field, e.target.value)}
                className="mt-1 w-full border px-3 py-2 rounded"
              />
            )}
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium">Profile Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
            className="mt-1 w-full border px-3 py-2 rounded"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
      >
        {loading ? "Adding..." : "Add User"}
      </button>
    </form>
  );
}
