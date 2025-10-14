"use client";

import { useState, useEffect, useRef } from "react";
import { useConversations, useMessages, useSendMessage, useEditMessage, useDeleteMessage } from "@/hooks/useChat";
import { Message } from "@/types/chat";
import NewChatModal from "./NewChatModal";

export default function ChatPage() {
  const { conversations, loading: loadingConversations, refetch: refetchConversations } = useConversations();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const { messages, loading: loadingMessages, refetch: refetchMessages } = useMessages(selectedConversationId);
  const { sendMessage, loading: sending } = useSendMessage();
  const { editMessage } = useEditMessage();
  const { deleteMessage } = useDeleteMessage();

  const [messageText, setMessageText] = useState("");
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [editText, setEditText] = useState("");
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedConversation = conversations.find(c => c._id === selectedConversationId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConversationId) return;

    try {
      await sendMessage(selectedConversationId, messageText);
      setMessageText("");
      refetchMessages();
      refetchConversations();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleEditMessage = async (messageId: string) => {
    if (!editText.trim()) return;

    try {
      await editMessage(messageId, editText);
      setEditingMessage(null);
      setEditText("");
      refetchMessages();
    } catch (error) {
      console.error("Failed to edit message:", error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      await deleteMessage(messageId);
      refetchMessages();
      refetchConversations();
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  const startEdit = (message: Message) => {
    setEditingMessage(message);
    setEditText(message.content);
  };

  const cancelEdit = () => {
    setEditingMessage(null);
    setEditText("");
  };

  const getConversationName = (conv: any) => {
    if (conv.type === "group") {
      return conv.name;
    }
    const otherUser = conv.participants.find((p: any) => p._id !== localStorage.getItem("userId"));
    return otherUser?.name || "Unknown";
  };

  if (loadingConversations) {
    return <div className="flex items-center justify-center h-screen">Loading conversations...</div>;
  }

  return (
    <>
      <NewChatModal
        isOpen={showNewChatModal}
        onClose={() => setShowNewChatModal(false)}
        onSuccess={() => {
          refetchConversations();
        }}
      />
      <div className="flex h-screen bg-gray-50">
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
            <button
              onClick={() => setShowNewChatModal(true)}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition"
            >
              + New
            </button>
          </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No conversations yet</div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv._id}
                onClick={() => setSelectedConversationId(conv._id)}
                className={`w-full p-4 text-left border-b border-gray-100 hover:bg-gray-50 transition ${
                  selectedConversationId === conv._id ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
                    {getConversationName(conv).charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {getConversationName(conv)}
                      </h3>
                      {conv.type === "group" && (
                        <span className="text-xs text-gray-500 ml-2">Group</span>
                      )}
                    </div>
                    {conv.lastMessage && (
                      <p className="text-sm text-gray-600 truncate">
                        {conv.lastMessage.content}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="p-4 bg-white border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                {getConversationName(selectedConversation)}
              </h2>
              <p className="text-sm text-gray-500">
                {selectedConversation.participants.length} participants
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loadingMessages ? (
                <div className="text-center text-gray-500">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-500">No messages yet. Start the conversation!</div>
              ) : (
                messages.map((message) => {
                  const isOwnMessage = message.sender._id === localStorage.getItem("userId");

                  return (
                    <div
                      key={message._id}
                      className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-md ${isOwnMessage ? "items-end" : "items-start"} flex flex-col`}>
                        {!isOwnMessage && (
                          <span className="text-xs text-gray-500 mb-1 px-3">
                            {message.sender.name}
                          </span>
                        )}

                        {editingMessage?._id === message._id ? (
                          <div className="w-full">
                            <input
                              type="text"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              autoFocus
                            />
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => handleEditMessage(message._id)}
                                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div
                            className={`px-4 py-2 rounded-2xl ${
                              isOwnMessage
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-800"
                            }`}
                          >
                            <p className="break-words">{message.content}</p>
                            {message.isEdited && (
                              <span className="text-xs opacity-75 italic">edited</span>
                            )}
                          </div>
                        )}

                        <div className="flex items-center gap-2 mt-1 px-3">
                          <span className="text-xs text-gray-400">
                            {new Date(message.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {isOwnMessage && !message.isDeleted && editingMessage?._id !== message._id && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => startEdit(message)}
                                className="text-xs text-blue-500 hover:underline"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteMessage(message._id)}
                                className="text-xs text-red-500 hover:underline"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={sending || !messageText.trim()}
                  className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                >
                  {sending ? "Sending..." : "Send"}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
      </div>
    </>
  );
}
