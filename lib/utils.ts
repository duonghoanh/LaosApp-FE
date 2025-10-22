import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRandomSeed(): number {
  return Math.floor(Math.random() * 1e9);
}

export function degToRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function normalizeAngle(angle: number): number {
  return ((angle % 360) + 360) % 360;
}
