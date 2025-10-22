import { useEffect, useRef } from "react";
import { socketClient } from "@/lib/socket/socket-client";
import { useWheelStore } from "@/stores/wheel.store";
import { useAuthStore } from "@/stores/auth.store";
import { SpinResult } from "@/types";
import toast from "react-hot-toast";

export function useWheelSocket(roomId: string | null) {
  const socketRef = useRef(socketClient.getWheelSocket());
  const { startSpin, endSpin, addToHistory, updateSegments } = useWheelStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!roomId || !user) return;

    const socket = socketRef.current;

    // Join wheel room
    socket.emit("joinRoom", { roomId, userId: user._id });

    // Listen for spin events
    socket.on(
      "spinStarted",
      (data: { seed: number; spinnerNickname: string }) => {
        console.log("Spin started:", data);
        toast(`${data.spinnerNickname} is spinning the wheel!`, {
          icon: "🎡",
        });
      }
    );

    socket.on("spinResult", (result: SpinResult) => {
      console.log("Spin result:", result);
      startSpin(result);
      addToHistory(result);
    });

    socket.on("spinEnded", () => {
      endSpin();
    });

    socket.on("wheelUpdated", (data: { segments: any[] }) => {
      updateSegments(data.segments);
      toast.success("Wheel updated");
    });

    socket.on("error", (error: { message: string }) => {
      toast.error(error.message);
    });

    return () => {
      socket.emit("leaveRoom", { roomId });
      socket.off("spinStarted");
      socket.off("spinResult");
      socket.off("spinEnded");
      socket.off("wheelUpdated");
      socket.off("error");
    };
  }, [roomId, user, startSpin, endSpin, addToHistory, updateSegments]);

  const spin = (wheelId: string, seed: number) => {
    const socket = socketRef.current;
    socket.emit("spin", {
      roomId,
      wheelId,
      seed,
      spinnerNickname: user?.nickname || "Anonymous",
    });
  };

  return { socket: socketRef.current, spin };
}
