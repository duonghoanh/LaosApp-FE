import { useEffect, useRef } from "react";
import { socketClient } from "@/lib/socket/socket-client";
import { useChatStore } from "@/stores/chat.store";
import { useAuthStore } from "@/stores/auth.store";
import { ChatMessage } from "@/types";
import toast from "react-hot-toast";

export function useChatSocket(roomId: string | null) {
  const socketRef = useRef(socketClient.getChatSocket());
  const { addMessage } = useChatStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!roomId || !user) {
      console.log("useChatSocket: Missing roomId or user", {
        roomId,
        user: !!user,
      });
      return;
    }

    const socket = socketRef.current;

    console.log("useChatSocket: Joining chat room", {
      roomId,
      userId: user._id,
    });

    // Join chat room
    socket.emit("joinChatRoom", { roomId, userId: user._id });

    // Listen for messages
    socket.on("newMessage", (message: ChatMessage) => {
      console.log("New message received:", message);
      addMessage(message);
    });

    socket.on(
      "emojiReaction",
      (data: {
        userId?: string;
        nickname: string;
        emoji: string;
        timestamp: Date;
      }) => {
        console.log("Emoji reaction received:", data);
        // Convert emoji reaction to message format
        const emojiMessage: ChatMessage = {
          _id: `emoji-${Date.now()}`,
          roomId: roomId,
          userId: data.userId,
          nickname: data.nickname,
          content: data.emoji,
          type: "TEXT",
          createdAt: new Date(data.timestamp).toISOString(),
        };
        addMessage(emojiMessage);
      }
    );

    socket.on("systemMessage", (message: ChatMessage) => {
      console.log("System message received:", message);
      addMessage(message);
    });

    socket.on("error", (error: { message: string }) => {
      console.error("Chat socket error:", error);
      toast.error(error.message);
    });

    return () => {
      console.log("useChatSocket: Leaving chat room", { roomId });
      socket.emit("leaveRoom", { roomId });
      socket.off("newMessage");
      socket.off("emojiReaction");
      socket.off("systemMessage");
      socket.off("error");
    };
  }, [roomId, user, addMessage]);

  const sendMessage = (content: string) => {
    if (!roomId || !user) return;

    const socket = socketRef.current;
    console.log("Sending message:", {
      roomId,
      content,
      nickname: user.nickname,
    });
    socket.emit("sendMessage", {
      roomId,
      content,
      nickname: user.nickname,
    });
  };

  const sendEmoji = (emoji: string) => {
    if (!roomId || !user) return;

    const socket = socketRef.current;
    console.log("Sending emoji:", { roomId, emoji, nickname: user.nickname });
    socket.emit("sendEmoji", {
      roomId,
      emoji,
      nickname: user.nickname,
    });
  };

  return {
    socket: socketRef.current,
    sendMessage,
    sendEmoji,
  };
}
