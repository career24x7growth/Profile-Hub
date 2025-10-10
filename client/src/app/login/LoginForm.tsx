// src/components/LoginForm.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";

export default function LoginForm() {
  const router = useRouter();
  const { login, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const validate = () => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      setError("Enter a valid email");
      return false;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>

      {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

      <label className="block mb-3">
        <span className="text-sm">Email</span>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full border px-3 py-2 rounded"
          type="email"
          required
        />
      </label>

      <label className="block mb-4">
        <span className="text-sm">Password</span>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full border px-3 py-2 rounded"
          type="password"
          required
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
