"use client";

import { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../hooks/useAuth";
import { useUsers } from "@/hooks/useUsers";

const DashboardPage = () => {
  const router = useRouter();
  const { user, isLoggedIn, loading } = useAuth();
  const { users, fetching, handleDelete } = useUsers(isLoggedIn, loading);

  const onUserClick = useCallback(
    (id: string) => router.push(`/user/${id}`),
    [router]
  );

  const userItems = useMemo(
    () =>
      users.map((u) => (
        <div
          key={u._id}
          className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition"
        >
          <div
            className="flex items-center gap-3 flex-1 justify-center cursor-pointer"
            onClick={() => onUserClick(u._id)}
          >
            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-blue-500 text-white uppercase font-semibold">
              {u.profileImage ? (
                <img
                  src={u.profileImage}
                  alt={u.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                u.name.charAt(0)
              )}
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-800">{u.name}</div>
              <div className="text-sm text-gray-500">{u.email}</div>
            </div>
          </div>

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
      )),
    [users, user, handleDelete, onUserClick, router]
  );

  if (loading || !isLoggedIn) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Users</h2>

        <div className="flex items-center gap-4">
          {user && (
            <div className="text-sm text-gray-600">
              Logged in as <span className="font-medium">{user.name}</span>
            </div>
          )}

          {user?.role === "superadmin" && (
            <button
              onClick={() => router.push("/Components/superadmin/add-user")}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Add User
            </button>
          )}
        </div>
      </div>

      {fetching ? (
        <div className="text-center py-8 text-gray-500">Loading users...</div>
      ) : (
        <div className="flex flex-col gap-4">{userItems}</div>
      )}
    </div>
  );
};

export default DashboardPage;
