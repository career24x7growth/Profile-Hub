"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAddUser } from "@/hooks/useAddUser";

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

  const { addUser, loading, error, setError } = useAddUser();

  const onChange = (k: string, v: string) => setForm((s) => ({ ...s, [k]: v }));

  const validate = () => {
    if (!form.name.trim()) {
      setError("Name is required");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError("Valid email is required");
      return false;
    }
    if (!form.password || form.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await addUser(form, profileImage);
  };

  const handleCancel = () => router.push("/dashboard");

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white p-6 rounded shadow space-y-4"
    >
      <h2 className="text-2xl font-semibold text-center">Add User</h2>
      {error && <p className="text-red-600 text-center">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[
          "name",
          "email",
          "password",
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
              {field === "zipCode" ? "ZIP Code" : field}
            </label>
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
                type={
                  field === "age"
                    ? "number"
                    : field === "password"
                    ? "password"
                    : "text"
                }
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

      <div className="flex justify-between mt-5">
        <button
          type="button"
          onClick={handleCancel}
          className="px-5 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          {loading ? "Adding..." : "Save User"}
        </button>
      </div>
    </form>
  );
}
