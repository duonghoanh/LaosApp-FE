import { useEffect, useRef } from "react";
import { socketClient } from "@/lib/socket/socket-client";
import { useRoomStore } from "@/stores/room.store";
import { useAuthStore } from "@/stores/auth.store";
import { Participant } from "@/types";
import toast from "react-hot-toast";

export function useRoomSocket(roomId: string | null) {
  const socketRef = useRef(socketClient.getRoomSocket());
  const { addParticipant, removeParticipant, updateParticipant } =
    useRoomStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!roomId || !user) return;

    const socket = socketRef.current;

    // Join room
    socket.emit("joinRoom", {
      roomId,
      userId: user._id,
      nickname: user.nickname,
    });

    // Listen for participant events
    socket.on("participantJoined", (data: { participant: Participant }) => {
      addParticipant(data.participant);
      toast.success(`${data.participant.nickname} joined the room`);
    });

    socket.on(
      "participantLeft",
      (data: { userId: string; nickname: string }) => {
        removeParticipant(data.userId);
        toast(`${data.nickname} left the room`);
      }
    );

    socket.on(
      "participantStatusChanged",
      (data: { userId: string; status: string }) => {
        updateParticipant(data.userId, { status: data.status as any });
      }
    );

    socket.on("roomUpdated", (data: any) => {
      console.log("Room updated:", data);
    });

    socket.on("error", (error: { message: string }) => {
      toast.error(error.message);
    });

    return () => {
      socket.emit("leaveRoom", { roomId, userId: user._id });
      socket.off("participantJoined");
      socket.off("participantLeft");
      socket.off("participantStatusChanged");
      socket.off("roomUpdated");
      socket.off("error");
    };
  }, [roomId, user, addParticipant, removeParticipant, updateParticipant]);

  return socketRef.current;
}
