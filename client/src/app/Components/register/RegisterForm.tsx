"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useRegister } from "@/hooks/useRegister";

const RegisterForm = () => {
  const router = useRouter();
  const { register, loading, error, setError } = useRegister();

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

  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  const onChange = useCallback(
    (key: string, value: string) =>
      setData((prev) => ({ ...prev, [key]: value })),
    []
  );

  const validate = useCallback(() => {
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
  }, [data, profileImage, setError]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;
      register(data, profileImage);
    },
    [data, profileImage, register, validate]
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white p-6 rounded shadow"
    >
      <h2 className="text-2xl font-semibold mb-4">Register</h2>

      {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[
          { key: "name", type: "text", placeholder: "Name" },
          { key: "email", type: "email", placeholder: "Email" },
          { key: "password", type: "password", placeholder: "Password" },
          { key: "role", type: "select", placeholder: "" },
          { key: "age", type: "number", placeholder: "Age" },
          { key: "phone", type: "text", placeholder: "Phone" },
          { key: "address", type: "text", placeholder: "Address" },
          { key: "city", type: "text", placeholder: "City" },
          { key: "country", type: "text", placeholder: "Country" },
          { key: "zipCode", type: "text", placeholder: "ZIP Code" },
        ].map((field) =>
          field.type === "select" ? (
            <select
              key={field.key}
              value={data.role}
              onChange={(e) => onChange("role", e.target.value)}
              className="border px-3 py-2 rounded"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          ) : (
            <input
              key={field.key}
              type={field.type}
              placeholder={field.placeholder}
              value={data[field.key as keyof typeof data]}
              onChange={(e) => onChange(field.key, e.target.value)}
              className="border px-3 py-2 rounded"
            />
          )
        )}

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
};

export default RegisterForm;
