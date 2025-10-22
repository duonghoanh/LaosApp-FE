"use client";

import { useRoomStore } from "@/stores/room.store";
import { RoomRole, ParticipantStatus } from "@/types";
import { FaCrown, FaCircle } from "react-icons/fa";

export function ParticipantsList() {
  const { participants, currentRoom } = useRoomStore();

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h3 className="font-bold text-lg mb-4 text-gray-800">
        Participants ({participants.length})
      </h3>

      <div className="space-y-2">
        {participants.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No participants yet</p>
        ) : (
          participants.map((participant) => (
            <div
              key={participant.userId}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
                  {participant.nickname[0].toUpperCase()}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800">
                      {participant.nickname}
                    </span>
                    {participant.role === RoomRole.HOST && (
                      <FaCrown className="text-yellow-500" title="Host" />
                    )}
                  </div>
                  <span className="text-xs text-gray-500 capitalize">
                    {participant.role.toLowerCase()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <FaCircle
                  className={`text-xs ${
                    participant.status === ParticipantStatus.ONLINE
                      ? "text-green-500"
                      : "text-gray-300"
                  }`}
                />
                <span className="text-xs text-gray-500">
                  {participant.status === ParticipantStatus.ONLINE
                    ? "Online"
                    : "Offline"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {currentRoom && (
        <div className="mt-4 p-3 bg-purple-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Room Code:{" "}
            <span className="font-mono font-bold text-purple-600">
              {currentRoom.code}
            </span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Share this code with others to join
          </p>
        </div>
      )}
    </div>
  );
}
