"use client";

import { useChatSocket } from "@/hooks/useChatSocket";
import { useChatStore } from "@/stores/chat.store";
import { useState, useEffect, useRef } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { format } from "date-fns";

interface ChatBoxProps {
  roomId: string | null;
}

export function ChatBox({ roomId }: ChatBoxProps) {
  const [message, setMessage] = useState("");
  const { sendMessage, sendEmoji } = useChatSocket(roomId);
  const { messages } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const emojis = ["👍", "❤️", "😂", "🎉", "🔥", "👏"];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
        <h3 className="font-bold text-lg">Chat Room</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-8">
            <p>No messages yet. Start the conversation! 💬</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex flex-col ${
                msg.type === "EMOJI" ? "items-center" : "items-start"
              }`}
            >
              {msg.type === "EMOJI" ? (
                <div className="text-4xl animate-bounce">{msg.content}</div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-purple-600">
                      {msg.nickname}
                    </span>
                    <span className="text-xs text-gray-400">
                      {format(new Date(msg.timestamp), "HH:mm")}
                    </span>
                  </div>
                  <div className="bg-gray-100 rounded-lg px-3 py-2 max-w-[80%]">
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Emoji bar */}
      <div className="px-4 py-2 border-t bg-gray-50">
        <div className="flex gap-2 justify-center">
          {emojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => sendEmoji(emoji)}
              className="text-2xl hover:scale-125 transition-transform"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition-shadow flex items-center gap-2"
          >
            <FaPaperPlane />
          </button>
        </div>
      </form>
    </div>
  );
}
