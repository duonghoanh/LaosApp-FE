import { create } from "zustand";
import { Wheel, WheelSegment, SpinResult } from "@/types";

interface WheelState {
  currentWheel: Wheel | null;
  isSpinning: boolean;
  currentSpin: SpinResult | null;
  spinHistory: SpinResult[];
  rotation: number;
  setCurrentWheel: (wheel: Wheel | null) => void;
  updateSegments: (segments: WheelSegment[]) => void;
  startSpin: (spin: SpinResult) => void;
  endSpin: () => void;
  setRotation: (rotation: number) => void;
  addToHistory: (spin: SpinResult) => void;
  setSpinHistory: (history: SpinResult[]) => void;
  clearWheel: () => void;
}

export const useWheelStore = create<WheelState>((set) => ({
  currentWheel: null,
  isSpinning: false,
  currentSpin: null,
  spinHistory: [],
  rotation: 0,

  setCurrentWheel: (wheel) => set({ currentWheel: wheel }),

  updateSegments: (segments) =>
    set((state) => ({
      currentWheel: state.currentWheel
        ? { ...state.currentWheel, segments }
        : null,
    })),

  startSpin: (spin) =>
    set({
      isSpinning: true,
      currentSpin: spin,
    }),

  endSpin: () => set({ isSpinning: false }),

  setRotation: (rotation) => set({ rotation }),

  addToHistory: (spin) =>
    set((state) => ({
      spinHistory: [spin, ...state.spinHistory],
    })),

  setSpinHistory: (history) => set({ spinHistory: history }),

  clearWheel: () =>
    set({
      currentWheel: null,
      isSpinning: false,
      currentSpin: null,
      rotation: 0,
    }),
}));
