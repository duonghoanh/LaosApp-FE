"use client";

import { useState } from "react";
import { Wheel } from "@/components/Wheel";
import { Button } from "@/components/ui/Button";
import { generateRandomSeed, normalizeAngle } from "@/lib/utils";
import { WheelSegment } from "@/types";

const DEMO_SEGMENTS: WheelSegment[] = [
  { text: "🎁 Prize 1", color: "#FF6B6B", weight: 1, order: 0 },
  { text: "🎉 Prize 2", color: "#4ECDC4", weight: 1, order: 1 },
  { text: "⭐ Prize 3", color: "#45B7D1", weight: 1, order: 2 },
  { text: "🏆 Prize 4", color: "#FFA07A", weight: 1, order: 3 },
  { text: "💎 Prize 5", color: "#98D8C8", weight: 1, order: 4 },
  { text: "🎯 Prize 6", color: "#F7DC6F", weight: 1, order: 5 },
  { text: "🔥 Prize 7", color: "#BB8FCE", weight: 1, order: 6 },
  { text: "✨ Prize 8", color: "#F8B4D9", weight: 1, order: 7 },
];

export default function DemoPage() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [targetRotation, setTargetRotation] = useState(0);
  const [winner, setWinner] = useState<WheelSegment | null>(null);

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setWinner(null);

    // Weighted random selection
    const totalWeight = DEMO_SEGMENTS.reduce((sum, seg) => sum + seg.weight, 0);
    let random = Math.random() * totalWeight;
    let selectedSegment: WheelSegment | null = null;

    for (const segment of DEMO_SEGMENTS) {
      random -= segment.weight;
      if (random <= 0) {
        selectedSegment = segment;
        break;
      }
    }

    if (selectedSegment) {
      const winnerIndex = DEMO_SEGMENTS.findIndex(
        (s) => s.order === selectedSegment!.order
      );
      const anglePerSegment = 360 / DEMO_SEGMENTS.length;
      const angle = 360 - (winnerIndex * anglePerSegment + anglePerSegment / 2);

      setTargetRotation(angle);
      setWinner(selectedSegment);
    }
  };

  const handleSpinComplete = () => {
    setIsSpinning(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-bold text-white mb-8 drop-shadow-lg">
        🎡 Wheel Demo
      </h1>

      <div className="bg-white rounded-2xl p-8 shadow-2xl">
        <Wheel
          segments={DEMO_SEGMENTS}
          isSpinning={isSpinning}
          targetRotation={targetRotation}
          onSpinComplete={handleSpinComplete}
          size={500}
        />

        <div className="mt-8 text-center">
          <Button
            onClick={handleSpin}
            disabled={isSpinning}
            size="lg"
            className="w-full"
          >
            {isSpinning ? "🎡 Spinning..." : "🎯 SPIN THE WHEEL"}
          </Button>

          {winner && !isSpinning && (
            <div className="mt-6 p-4 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-lg">
              <p className="text-2xl font-bold" style={{ color: winner.color }}>
                🎉 Winner: {winner.text}
              </p>
            </div>
          )}
        </div>
      </div>

      <p className="text-white mt-8 text-center max-w-md">
        This is a demo wheel. Go to{" "}
        <a href="/" className="underline font-bold">
          Home
        </a>{" "}
        to create a room and play with friends!
      </p>
    </div>
  );
}
