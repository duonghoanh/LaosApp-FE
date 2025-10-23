export enum RoomRole {
  HOST = "HOST",
  PLAYER = "PLAYER",
  SPECTATOR = "SPECTATOR",
}

export enum RoomStatus {
  ACTIVE = "ACTIVE",
  ENDED = "ENDED",
}

export enum ParticipantStatus {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
}

export interface User {
  _id: string;
  email?: string;
  nickname: string;
  avatar?: string;
  createdAt: string;
}

export interface Participant {
  userId: string;
  nickname: string;
  role: RoomRole;
  status: ParticipantStatus;
  joinedAt: string;
}

export interface WheelSegment {
  id?: string;
  text: string;
  color: string;
  weight: number;
  order: number;
  icon?: string;
}

export interface Wheel {
  _id: string;
  roomId: string;
  title: string;
  segments: WheelSegment[];
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  _id: string;
  code: string;
  name: string;
  hostId: string;
  isPublic: boolean;
  isActive: boolean;
  participants: Participant[];
  createdAt: string;
  updatedAt: string;
}

export interface SpinResult {
  _id: string;
  roomId: string;
  wheelId: string;
  spinnerId: string;
  spinnerNickname: string;
  result: string;
  segmentId: string;
  seed: number;
  rotation: number;
  spunAt: string;
}

export interface ChatMessage {
  _id: string;
  roomId: string;
  userId?: string;
  nickname?: string;
  content: string;
  type: "TEXT" | "SYSTEM" | "SPIN_RESULT" | "USER_JOINED" | "USER_LEFT";
  emoji?: string;
  createdAt: string;
}

export interface SpinStatistics {
  totalSpins: number;
  segmentStats: Array<{
    segmentId: string;
    text: string;
    count: number;
    percentage: number;
  }>;
}
