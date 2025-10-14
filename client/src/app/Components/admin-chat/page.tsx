"use client";

import { useState } from "react";
import { useAllConversations } from "@/hooks/useAdminChat";
import { useMessages } from "@/hooks/useChat";

export default function AdminChatView() {
  const { conversations, loading, error } = useAllConversations();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const { messages, loading: loadingMessages } = useMessages(selectedConversationId);

  const selectedConversation = conversations.find(c => c._id === selectedConversationId);

  const getConversationName = (conv: any) => {
    if (conv.type === "group") {
      return conv.name;
    }
    const users = conv.participants.map((p: any) => p.name).join(" & ");
    return users;
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading conversations...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Chat Monitor</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">All Conversations</h2>
              <p className="text-sm text-gray-500 mt-1">Total: {conversations.length}</p>
            </div>

            <div className="divide-y divide-gray-200 max-h-[calc(100vh-200px)] overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No conversations yet</div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv._id}
                    onClick={() => setSelectedConversationId(conv._id)}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition ${
                      selectedConversationId === conv._id ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">
                            {getConversationName(conv)}
                          </h3>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              conv.type === "group"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {conv.type === "group" ? "Group" : "Direct"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {conv.participants.length} participants
                        </p>
                        <p className="text-xs text-gray-500">
                          Created: {new Date(conv.createdAt).toLocaleString()}
                        </p>
                        {conv.lastMessage && (
                          <p className="text-sm text-gray-600 mt-2 truncate">
                            Last: {conv.lastMessage.content}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {selectedConversation ? (
              <>
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {getConversationName(selectedConversation)}
                  </h2>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-600">
                      Type: {selectedConversation.type}
                    </p>
                    <p className="text-sm text-gray-600">
                      Participants: {selectedConversation.participants.map(p => p.name).join(", ")}
                    </p>
                    <p className="text-sm text-gray-600">
                      Created: {new Date(selectedConversation.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="p-4 max-h-[calc(100vh-350px)] overflow-y-auto space-y-4">
                  {loadingMessages ? (
                    <div className="text-center text-gray-500">Loading messages...</div>
                  ) : messages.length === 0 ? (
                    <div className="text-center text-gray-500">No messages in this conversation</div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message._id}
                        className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-xs">
                              {message.sender.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">
                                {message.sender.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(message.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {message.isEdited && (
                              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                                Edited
                              </span>
                            )}
                            {message.isDeleted && (
                              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                                Deleted
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-800 text-sm">{message.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Select a conversation to view messages
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
