import { create } from "zustand";
import { Room, Participant } from "@/types";

interface RoomState {
  currentRoom: Room | null;
  participants: Participant[];
  setCurrentRoom: (room: Room | null) => void;
  updateParticipants: (participants: Participant[]) => void;
  addParticipant: (participant: Participant) => void;
  removeParticipant: (userId: string) => void;
  updateParticipant: (userId: string, updates: Partial<Participant>) => void;
  clearRoom: () => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  currentRoom: null,
  participants: [],

  setCurrentRoom: (room) =>
    set({
      currentRoom: room,
      participants: room?.participants || [],
    }),

  updateParticipants: (participants) => set({ participants }),

  addParticipant: (participant) =>
    set((state) => ({
      participants: [...state.participants, participant],
    })),

  removeParticipant: (userId) =>
    set((state) => ({
      participants: state.participants.filter((p) => p.userId !== userId),
    })),

  updateParticipant: (userId, updates) =>
    set((state) => ({
      participants: state.participants.map((p) =>
        p.userId === userId ? { ...p, ...updates } : p
      ),
    })),

  clearRoom: () => set({ currentRoom: null, participants: [] }),
}));
