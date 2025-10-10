"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { IUser } from "../../types/user";
import api from "../../lib/axios";
import { useAuth } from "../../hooks/useAuth";

export default function UserProfilePage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await api.get(`/api/users/${userId}`);
        setUser(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [isLoggedIn, userId, router]);

  if (!isLoggedIn) return null;
  if (loading) return <div className="text-center py-8 text-gray-500">Loading...</div>;
  if (!user) return <div className="text-center py-8 text-red-600">User not found</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => router.push('/dashboard')}
        className="mb-4 px-4 py-2 text-blue-600 hover:text-blue-800 transition"
      >
        ← Back to Users
      </button>

      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b">
          <div className="w-20 h-20 rounded-full bg-blue-500 text-white flex items-center justify-center uppercase font-bold text-2xl">
            {user.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-gray-600">{user.role}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-500">Email</label>
            <p className="font-medium text-gray-800">{user.email}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Age</label>
            <p className="font-medium text-gray-800">{user.age ?? "-"}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Phone</label>
            <p className="font-medium text-gray-800">{user.phone ?? "-"}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Address</label>
            <p className="font-medium text-gray-800">{user.address ?? "-"}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">City</label>
            <p className="font-medium text-gray-800">{user.city ?? "-"}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Country</label>
            <p className="font-medium text-gray-800">{user.country ?? "-"}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">ZIP Code</label>
            <p className="font-medium text-gray-800">{user.zipCode ?? "-"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
