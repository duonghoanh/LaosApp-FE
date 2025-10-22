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
    if (!roomId || !user) return;

    const socket = socketRef.current;

    // Join chat room
    socket.emit("joinRoom", { roomId, userId: user._id });

    // Listen for messages
    socket.on("newMessage", (message: ChatMessage) => {
      addMessage(message);
    });

    socket.on("error", (error: { message: string }) => {
      toast.error(error.message);
    });

    return () => {
      socket.emit("leaveRoom", { roomId });
      socket.off("newMessage");
      socket.off("error");
    };
  }, [roomId, user, addMessage]);

  const sendMessage = (content: string) => {
    if (!roomId || !user) return;

    const socket = socketRef.current;
    socket.emit("sendMessage", {
      roomId,
      content,
      nickname: user.nickname,
    });
  };

  const sendEmoji = (emoji: string) => {
    if (!roomId || !user) return;

    const socket = socketRef.current;
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
