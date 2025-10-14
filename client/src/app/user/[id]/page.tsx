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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();

      Object.keys(form).forEach(key => {
        if (form[key] !== null && form[key] !== undefined) {
          formData.append(key, form[key]);
        }
      });

      if (password) formData.append('password', password);
      if (imageFile) formData.append('profileImage', imageFile);

      const response = await api.put(`/api/users/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUser(response.data);
      alert("User updated successfully!");
      router.push("/Components/dashboard");

      setPassword("");
      setImageFile(null);
      setImagePreview(null);
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
    setImageFile(null);
    setImagePreview(null);
    // router.push("/dashboard");
  };

  if (authLoading || loading || !user) return <div>Loading...</div>;

  const isAdmin = me?.role === "admin";

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-2xl font-semibold">{user.name}</h2>
      {error && <p className="text-red-600">{error}</p>}

      {isAdmin && (
        <div className="space-y-3">
          <label className="block text-sm font-medium">Profile Image</label>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : user.profileImage ? (
                <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl text-gray-500">{user.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>
      )}

      {!isAdmin && user.profileImage && (
        <div className="flex justify-center">
          <div className="w-32 h-32 rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
            <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
          </div>
        </div>
      )}

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
