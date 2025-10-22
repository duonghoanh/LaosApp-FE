"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apolloClient } from "@/lib/graphql/client";
import { CREATE_ROOM, JOIN_ROOM } from "@/lib/graphql/queries";
import { useAuthStore } from "@/stores/auth.store";
import { AuthModal } from "@/components/AuthModal";
import toast from "react-hot-toast";
import { FaPlus, FaSignInAlt, FaDice } from "react-icons/fa";

export default function Home() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  const handleCreateRoom = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    if (!roomName.trim()) {
      toast.error("Please enter a room name");
      return;
    }

    try {
      setLoading(true);
      const { data } = await apolloClient.mutate({
        mutation: CREATE_ROOM,
        variables: {
          input: {
            name: roomName,
            isPublic: true,
          },
        },
      });

      if (data?.createRoom) {
        toast.success("Room created successfully! 🎉");
        router.push(`/room/${data.createRoom._id}`);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    if (!roomCode.trim()) {
      toast.error("Please enter a room code");
      return;
    }

    try {
      setLoading(true);
      const { data } = await apolloClient.mutate({
        mutation: JOIN_ROOM,
        variables: {
          input: {
            code: roomCode,
            nickname: user?.nickname || "Guest",
          },
        },
      });

      if (data?.joinRoom) {
        toast.success("Joined room successfully! 🎉");
        router.push(`/room/${data.joinRoom._id}`);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to join room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
            🎡 LuckyRoom
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Realtime Multiplayer Wheel of Names
          </p>
          {isAuthenticated && (
            <p className="text-white/80">
              Welcome, <span className="font-bold">{user?.nickname}</span>! 👋
            </p>
          )}
        </div>

        {/* Main Actions */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 mb-12">
          {/* Create Room */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaPlus className="text-4xl text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Create Room</h2>
              <p className="text-gray-600 mt-2">
                Start a new wheel and invite friends
              </p>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Enter room name..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={handleCreateRoom}
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-shadow font-medium disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Room"}
              </button>
            </div>
          </div>

          {/* Join Room */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaSignInAlt className="text-4xl text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Join Room</h2>
              <p className="text-gray-600 mt-2">Enter a room code to join</p>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="Enter room code..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 uppercase text-center font-mono text-lg"
              />
              <button
                onClick={handleJoinRoom}
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg transition-shadow font-medium disabled:opacity-50"
              >
                {loading ? "Joining..." : "Join Room"}
              </button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-white text-center mb-8">
            Features
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "🎡",
                title: "Realtime Spinning",
                desc: "Everyone sees the same spin result at the same time",
              },
              {
                icon: "⚙️",
                title: "Customizable Wheels",
                desc: "Add segments, change colors, set win probabilities",
              },
              {
                icon: "💬",
                title: "Live Chat",
                desc: "Chat with participants and react with emojis",
              },
              {
                icon: "📊",
                title: "Statistics",
                desc: "Track spin history and win rates",
              },
              {
                icon: "👥",
                title: "Multiplayer",
                desc: "Create rooms and play with friends",
              },
              {
                icon: "🔒",
                title: "Private Rooms",
                desc: "Share room codes with specific people",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-colors"
              >
                <div className="text-5xl mb-3">{feature.icon}</div>
                <h4 className="text-xl font-bold text-white mb-2">
                  {feature.title}
                </h4>
                <p className="text-white/80">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}
