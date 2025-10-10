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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onChange = (k: string, v: string) => setForm((s) => ({ ...s, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/superadmin/add", {
        ...form,
        age: form.age ? Number(form.age) : undefined,
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
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-2xl font-semibold">Add User</h2>
      {error && <p className="text-red-600">{error}</p>}

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
