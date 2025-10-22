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
  avatarUrl?: string;
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
  _id?: string;
  text: string;
  color: string;
  weight: number;
  order: number;
  iconUrl?: string;
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
  ownerId: string;
  isPublic: boolean;
  status: RoomStatus;
  participants: Participant[];
  currentWheelId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SpinResult {
  _id: string;
  roomId: string;
  wheelId: string;
  winnerId: string;
  winner: WheelSegment;
  seed: number;
  spinnerNickname: string;
  timestamp: string;
}

export interface ChatMessage {
  _id: string;
  roomId: string;
  userId: string;
  nickname: string;
  content: string;
  type: "MESSAGE" | "EMOJI";
  timestamp: string;
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
