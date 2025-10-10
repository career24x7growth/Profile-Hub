"use client";
import { useEffect, useState } from "react";
import api from "../../lib/axios";
import { IUser } from "../../types/user";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";

export default function DashboardPage() {
  const { user, isLoggedIn, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<IUser[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push("/login"); 
      return;
    }

    if (isLoggedIn) {
      const fetchUsers = async () => {
        try {
          const res = await api.get("/api/users");
          setUsers(res.data);
        } catch (err) {
          console.error(err);
        } finally {
          setFetching(false);
        }
      };
      fetchUsers();
    }
  }, [isLoggedIn, loading, router]);

  if (loading || !isLoggedIn) return <div>Loading...</div>; // show until auth is checked

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Users</h2>
        {user && <div className="text-sm text-gray-600">Logged in as <span className="font-medium">{user.name}</span></div>}
      </div>
      {fetching ? (
        <div className="text-center py-8 text-gray-500">Loading users...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((u) => (
            <div
              key={u._id}
              className="flex items-center gap-3 p-4 bg-white shadow-md rounded-lg cursor-pointer hover:shadow-lg transition"
              onClick={() => router.push(`/user/${u._id}`)}
            >
              <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center uppercase font-semibold">
                {u.name.charAt(0)}
              </div>
              <div>
                <div className="font-medium text-gray-800">{u.name}</div>
                <div className="text-sm text-gray-500">{u.email}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
