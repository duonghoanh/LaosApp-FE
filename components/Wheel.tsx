"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { WheelSegment } from "@/types";
import { cn, normalizeAngle } from "@/lib/utils";

interface WheelProps {
  segments: WheelSegment[];
  isSpinning: boolean;
  targetRotation?: number;
  onSpinComplete?: () => void;
  size?: number;
}

export function Wheel({
  segments,
  isSpinning,
  targetRotation = 0,
  onSpinComplete,
  size = 400,
}: WheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controls = useAnimation();
  const [currentRotation, setCurrentRotation] = useState(0);

  // Draw wheel on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 10;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Draw segments
    const anglePerSegment = (2 * Math.PI) / segments.length;

    segments.forEach((segment, index) => {
      const startAngle = index * anglePerSegment - Math.PI / 2;
      const endAngle = startAngle + anglePerSegment;

      // Draw segment
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle =
        segment.color || `hsl(${(index * 360) / segments.length}, 70%, 60%)`;
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + anglePerSegment / 2);
      ctx.textAlign = "center";
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 16px Arial";
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 4;
      ctx.fillText(segment.text, radius * 0.7, 5);
      ctx.restore();
    });

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 3;
    ctx.stroke();
  }, [segments, size]);

  // Animate spin
  useEffect(() => {
    if (isSpinning) {
      const spins = 5; // Number of full rotations
      const totalRotation = spins * 360 + targetRotation;

      controls
        .start({
          rotate: totalRotation,
          transition: {
            duration: 4,
            ease: [0.25, 0.1, 0.25, 1],
          },
        })
        .then(() => {
          setCurrentRotation(normalizeAngle(totalRotation));
          onSpinComplete?.();
        });
    }
  }, [isSpinning, targetRotation, controls, onSpinComplete]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Pointer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[40px] border-t-red-500 drop-shadow-lg" />
      </div>

      {/* Wheel */}
      <motion.div
        animate={controls}
        initial={{ rotate: currentRotation }}
        className="relative"
      >
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          className="rounded-full shadow-2xl"
        />
      </motion.div>

      {/* Spin button (center) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
          SPIN
        </div>
      </div>
    </div>
  );
}
