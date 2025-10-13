"use client";

import { useState } from "react";
import api from "../../lib/axios";
import { useRouter } from "next/navigation";

export default function Registerdata() {
  const router = useRouter();

  const [data, setData] = useState({
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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onChange = (key: string, value: string) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  const validate = () => {
    if (!data.name || data.name.length < 3) {
      setError("Name must be at least 3 characters");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(data.email)) {
      setError("Enter a valid email");
      return false;
    }
    if (!passwordPattern.test(data.password)) {
      setError(
        "Password must be at least 8 chars, include uppercase, lowercase, number, and special char"
      );
      return false;
    }
    if (!profileImage) {
      setError("Please upload a profile image");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value as string);
      });
      if (profileImage) formData.append("profileImage", profileImage);

      await api.post("/api/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }); 

      setLoading(false);
      router.push("/login");
    } catch (err: any) {
      setLoading(false);
      setError(err?.response?.data?.message ?? "Registration failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white p-6 rounded shadow"
    >
      <h2 className="text-2xl font-semibold mb-4">Register</h2>

      {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          placeholder="Name"
          value={data.name}
          onChange={(e) => onChange("name", e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          placeholder="Email"
          type="email"
          value={data.email}
          onChange={(e) => onChange("email", e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          placeholder="Password"
          type="password"
          value={data.password}
          onChange={(e) => onChange("password", e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <select
          value={data.role}
          onChange={(e) => onChange("role", e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <input
          placeholder="Age"
          value={data.age}
          onChange={(e) => onChange("age", e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          placeholder="Phone"
          value={data.phone}
          onChange={(e) => onChange("phone", e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          placeholder="Address"
          value={data.address}
          onChange={(e) => onChange("address", e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          placeholder="City"
          value={data.city}
          onChange={(e) => onChange("city", e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          placeholder="Country"
          value={data.country}
          onChange={(e) => onChange("country", e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          placeholder="ZIP Code"
          value={data.zipCode}
          onChange={(e) => onChange("zipCode", e.target.value)}
          className="border px-3 py-2 rounded"
        />
        {/* Profile Image Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
          className="border px-3 py-2 rounded"
        />
      </div>

      <button
        type="submit"
        className="mt-4 px-5 py-2 bg-green-600 text-white rounded"
        disabled={loading}
      >
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
}