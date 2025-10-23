import { create } from "zustand";
import { User } from "@/types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  initializeAuth: () => void;
}

// Helper to decode mock JWT token
const parseToken = (token: string): User | null => {
  try {
    // Mock token format: "mock-token-{userId}"
    if (token.startsWith("mock-token-")) {
      const userId = token.replace("mock-token-", "");

      // Try to get user data from localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        return JSON.parse(storedUser);
      }

      // Fallback: create minimal user object
      return {
        _id: userId,
        email: "",
        nickname: "User",
        avatar: "",
        createdAt: new Date().toISOString(),
      };
    }
    return null;
  } catch (error) {
    console.error("Failed to parse token:", error);
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken:
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  setAccessToken: (token) => {
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("accessToken", token);
      } else {
        localStorage.removeItem("accessToken");
      }
    }
    set({ accessToken: token });
  },

  login: (user, token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", token);
      localStorage.setItem("user", JSON.stringify(user));
    }
    set({ user, accessToken: token, isAuthenticated: true });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    }
    set({ user: null, accessToken: null, isAuthenticated: false });
  },

  initializeAuth: () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const user = parseToken(token);
        if (user) {
          set({ user, accessToken: token, isAuthenticated: true });
        }
      }
    }
  },
}));
