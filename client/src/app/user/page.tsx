"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { IUser } from "../../types/user";
import api from "../../lib/axios";
import { useAuth } from "../../hooks/useAuth";

export default function UserProfilePage() {
  const { isLoggedIn, user: me } = useAuth();
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
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">{user.name}</h2>
      <div className="space-y-2">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Age:</strong> {user.age ?? "-"}</p>
        <p><strong>Phone:</strong> {user.phone ?? "-"}</p>
        <p><strong>Address:</strong> {user.address ?? "-"}</p>
        <p><strong>City:</strong> {user.city ?? "-"}</p>
        <p><strong>Country:</strong> {user.country ?? "-"}</p>
        <p><strong>ZIP:</strong> {user.zipCode ?? "-"}</p>
      </div>
    </div>
  );
}
