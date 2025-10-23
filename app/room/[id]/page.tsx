"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apolloClient } from "@/lib/graphql/client";
import {
  GET_ROOM,
  GET_WHEEL_BY_ROOM,
  CREATE_WHEEL,
} from "@/lib/graphql/queries";
import { useAuthStore } from "@/stores/auth.store";
import { useRoomStore } from "@/stores/room.store";
import { useWheelStore } from "@/stores/wheel.store";
import { useRoomSocket } from "@/hooks/useRoomSocket";
import { useWheelSocket } from "@/hooks/useWheelSocket";
import { useChatSocket } from "@/hooks/useChatSocket";
import { Wheel } from "@/components/Wheel";
import { ChatBox } from "@/components/ChatBox";
import { ParticipantsList } from "@/components/ParticipantsList";
import { AuthModal } from "@/components/AuthModal";
import { generateRandomSeed } from "@/lib/utils";
import { RoomRole, WheelSegment } from "@/types";
import toast from "react-hot-toast";
import { FaArrowLeft, FaCog, FaDice } from "react-icons/fa";

const DEFAULT_SEGMENTS: WheelSegment[] = [
  { text: "Prize 1", color: "#FF6B6B", weight: 1, order: 0 },
  { text: "Prize 2", color: "#4ECDC4", weight: 1, order: 1 },
  { text: "Prize 3", color: "#45B7D1", weight: 1, order: 2 },
  { text: "Prize 4", color: "#FFA07A", weight: 1, order: 3 },
  { text: "Prize 5", color: "#98D8C8", weight: 1, order: 4 },
  { text: "Prize 6", color: "#F7DC6F", weight: 1, order: 5 },
];

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.id as string;

  const { isAuthenticated, user } = useAuthStore();
  const { currentRoom, setCurrentRoom, participants } = useRoomStore();
  const { currentWheel, setCurrentWheel, isSpinning, currentSpin, endSpin } =
    useWheelStore();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [targetRotation, setTargetRotation] = useState(0);

  useRoomSocket(roomId);
  const { spin } = useWheelSocket(roomId);
  useChatSocket(roomId);

  // Helper function to load or create wheel
  const loadOrCreateWheel = async (roomId: string) => {
    try {
      // Try to get existing wheel for room
      const wheelData = await apolloClient.query({
        query: GET_WHEEL_BY_ROOM,
        variables: { roomId },
        fetchPolicy: "no-cache",
      });

      if (wheelData?.data?.wheelByRoom) {
        setCurrentWheel(wheelData.data.wheelByRoom);
      }
    } catch (error) {
      // If no wheel exists, create default one
      await createDefaultWheel();
    }
  };

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    }
  }, [isAuthenticated]);

  // Load room data
  useEffect(() => {
    const loadRoom = async () => {
      try {
        const { data } = await apolloClient.query({
          query: GET_ROOM,
          variables: { id: roomId },
          fetchPolicy: "network-only",
        });

        if (data?.room) {
          setCurrentRoom(data.room);

          // Try to load or create wheel
          await loadOrCreateWheel(roomId);
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to load room");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && roomId) {
      loadRoom();
    }
  }, [roomId, isAuthenticated]);

  const createDefaultWheel = async () => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: CREATE_WHEEL,
        variables: {
          input: {
            roomId,
            title: "Lucky Wheel",
            segments: DEFAULT_SEGMENTS,
          },
        },
      });

      if (data?.createWheel) {
        setCurrentWheel(data.createWheel);
      }
    } catch (error: any) {
      console.error("Failed to create wheel:", error);
    }
  };

  const handleSpin = () => {
    if (!currentWheel || isSpinning) return;

    const isHost =
      participants.find((p) => p.userId === user?._id)?.role === RoomRole.HOST;

    if (!isHost) {
      toast.error("Only the host can spin the wheel");
      return;
    }

    const seed = generateRandomSeed();
    spin(currentWheel._id, seed);
  };

  // Calculate target rotation when spin result comes
  useEffect(() => {
    if (currentSpin && currentWheel) {
      const segments = currentWheel.segments;
      const winnerIndex = segments.findIndex(
        (s) => s.id === currentSpin.segmentId
      );

      if (winnerIndex !== -1) {
        const anglePerSegment = 360 / segments.length;
        const targetAngle =
          360 - (winnerIndex * anglePerSegment + anglePerSegment / 2);
        setTargetRotation(targetAngle);
      }
    }
  }, [currentSpin, currentWheel]);

  const handleSpinComplete = () => {
    endSpin();
    if (currentSpin) {
      toast.success(`Winner: ${currentSpin.result}! 🎉`, {
        duration: 5000,
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => router.push("/")}
        onSuccess={async () => {
          // Reload room after login
          setLoading(true);
          try {
            const { data } = await apolloClient.query({
              query: GET_ROOM,
              variables: { id: roomId },
              fetchPolicy: "network-only",
            });

            if (data?.room) {
              setCurrentRoom(data.room);
              await loadOrCreateWheel(roomId);
            }
          } catch (error: any) {
            toast.error(error.message || "Failed to load room");
            router.push("/");
          } finally {
            setLoading(false);
          }
        }}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
        <div className="text-white text-2xl">Loading room... 🎡</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
          >
            <FaArrowLeft />
            Back to Home
          </button>

          <h1 className="text-3xl font-bold text-white">
            {currentRoom?.name || "Room"}
          </h1>

          <button className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors">
            <FaCog />
            Settings
          </button>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Participants */}
          <div className="lg:col-span-3">
            <ParticipantsList />
          </div>

          {/* Center - Wheel */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <div className="flex flex-col items-center">
                {currentWheel ? (
                  <>
                    <Wheel
                      segments={currentWheel.segments}
                      isSpinning={isSpinning}
                      targetRotation={targetRotation}
                      onSpinComplete={handleSpinComplete}
                      size={400}
                    />

                    <button
                      onClick={handleSpin}
                      disabled={isSpinning}
                      className="mt-8 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold rounded-full hover:shadow-2xl transition-shadow disabled:opacity-50 flex items-center gap-3"
                    >
                      <FaDice className="text-2xl" />
                      {isSpinning ? "Spinning..." : "SPIN THE WHEEL"}
                    </button>
                  </>
                ) : (
                  <div className="text-gray-400 py-20">
                    <p>No wheel available. Creating default wheel...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Spin History */}
            {currentSpin && (
              <div className="mt-6 bg-white rounded-lg p-4 shadow-lg">
                <h3 className="font-bold text-lg mb-2">Last Result</h3>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">
                    Spun by:{" "}
                    <span className="font-semibold">
                      {currentSpin.spinnerNickname}
                    </span>
                  </span>
                  <span className="text-xl font-bold text-purple-600">
                    {currentSpin.result}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar - Chat */}
          <div className="lg:col-span-3 h-[600px]">
            <ChatBox roomId={roomId} />
          </div>
        </div>
      </div>
    </div>
  );
}
