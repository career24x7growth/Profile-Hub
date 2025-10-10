// src/components/RegisterForm.tsx
"use client";
import { useState } from "react";
import api from "../../lib/axios";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
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

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onChange = (k: string, v: string) => setForm((s) => ({ ...s, [k]: v }));

  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  const validate = () => {
    if (!form.name || form.name.length < 3) {
      setError("Name must be at least 3 characters");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError("Enter a valid email");
      return false;
    }
    if (!passwordPattern.test(form.password)) {
      setError(
        "Password must be at least 8 chars, include uppercase, lowercase, number and special char"
      );
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      // Public registration uses /api/auth/signup
      await api.post("/api/auth/signup", {
        ...form,
        age: form.age ? Number(form.age) : undefined,
      });
      setLoading(false);
      router.push("/login");
    } catch (err: any) {
      setLoading(false);
      setError(err?.response?.data?.message ?? "Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>

      {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input placeholder="Name" value={form.name} onChange={(e) => onChange("name", e.target.value)} className="border px-3 py-2 rounded" />
        <input placeholder="Email" type="email" value={form.email} onChange={(e) => onChange("email", e.target.value)} className="border px-3 py-2 rounded" />
        <input placeholder="Password" type="password" value={form.password} onChange={(e) => onChange("password", e.target.value)} className="border px-3 py-2 rounded" />
        <select value={form.role} onChange={(e) => onChange("role", e.target.value)} className="border px-3 py-2 rounded">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <input placeholder="Age" value={form.age} onChange={(e) => onChange("age", e.target.value)} className="border px-3 py-2 rounded" />
        <input placeholder="Phone" value={form.phone} onChange={(e) => onChange("phone", e.target.value)} className="border px-3 py-2 rounded" />
        <input placeholder="Address" value={form.address} onChange={(e) => onChange("address", e.target.value)} className="border px-3 py-2 rounded" />
        <input placeholder="City" value={form.city} onChange={(e) => onChange("city", e.target.value)} className="border px-3 py-2 rounded" />
        <input placeholder="Country" value={form.country} onChange={(e) => onChange("country", e.target.value)} className="border px-3 py-2 rounded" />
        <input placeholder="ZIP Code" value={form.zipCode} onChange={(e) => onChange("zipCode", e.target.value)} className="border px-3 py-2 rounded" />
      </div>

      <button className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 transition" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
}
