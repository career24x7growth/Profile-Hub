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
    <div>
      <h2 className="text-2xl font-semibold mb-4">Users</h2>
      {fetching ? (
        <div>Loading users...</div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {users.map((u) => (
            <div
              key={u._id}
              className="flex items-center gap-2 p-3 bg-white shadow rounded cursor-pointer"
              onClick={() => router.push(`/user/${u._id}`)}
            >
              <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center uppercase">
                {u.name.charAt(0)}
              </div>
              <span>{u.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
