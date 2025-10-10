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

  // ✅ Fetch users
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push("/login");
      return;
    }

    if (isLoggedIn) {
      const fetchUsers = async () => {
        try {
          const res = await api.get(`/api/users`);
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

  // ✅ Delete user function
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/api/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      alert("User deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  };

  if (loading || !isLoggedIn) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Users</h2>
        {user && (
          <div className="text-sm text-gray-600">
            Logged in as <span className="font-medium">{user.name}</span>
          </div>
        )}
      </div>

      {fetching ? (
        <div className="text-center py-8 text-gray-500">Loading users...</div>
      ) : (
        <div className="flex flex-col gap-4">
          {users.map((u) => (
            <div
              key={u._id}
              className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition"
            >
              {/* Avatar and User Info */}
              <div
                className="flex items-center gap-3 flex-1 justify-center cursor-pointer"
                onClick={() => router.push(`/user/${u._id}`)} // ✅ Navigate to user details
              >
                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center uppercase font-semibold">
                  {u.name.charAt(0)}
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-800">{u.name}</div>
                  <div className="text-sm text-gray-500">{u.email}</div>
                </div>
              </div>

              {/* Admin Controls */}
              {user?.role === "admin" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/user/${u._id}`)}
                    className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(u._id)}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
