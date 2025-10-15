"use client";

import { useState } from "react";
import { useCreateConversation } from "@/hooks/useChat";
import { useUsers } from "@/hooks/useUsers";

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function NewChatModal({ isOpen, onClose, onSuccess }: NewChatModalProps) {
  const { users } = useUsers(true, false);
  const { createConversation, loading } = useCreateConversation();
  const [type, setType] = useState<"direct" | "group">("direct");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("");

  const currentUserId = localStorage.getItem("userId");
  const availableUsers = users.filter(u => u._id !== currentUserId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedUsers.length === 0) {
      alert("Please select at least one user");
      return;
    }

    if (type === "group" && !groupName.trim()) {
      alert("Please enter a group name");
      return;
    }

    try {
      await createConversation({
        type,
        participants: selectedUsers,
        name: type === "group" ? groupName : undefined,
      });
      onSuccess();
      onClose();
      setSelectedUsers([]);
      setGroupName("");
      setType("direct");
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  const toggleUser = (userId: string) => {
    if (type === "direct") {
      setSelectedUsers([userId]);
    } else {
      setSelectedUsers((prev) =>
        prev.includes(userId)
          ? prev.filter((id) => id !== userId)
          : [...prev, userId]
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">New Conversation</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="direct"
                  checked={type === "direct"}
                  onChange={(e) => setType(e.target.value as "direct" | "group")}
                  className="mr-2"
                />
                Direct Message
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="group"
                  checked={type === "group"}
                  onChange={(e) => setType(e.target.value as "direct" | "group")}
                  className="mr-2"
                />
                Group Chat
              </label>
            </div>
          </div>

          {type === "group" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group Name
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter group name"
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Users {type === "direct" ? "(1)" : "(multiple)"}
            </label>
            <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-lg">
              {availableUsers.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No users available</div>
              ) : (
                availableUsers.map((user) => (
                  <label
                    key={user._id}
                    className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => toggleUser(user._id)}
                      className="mr-3"
                    />
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
