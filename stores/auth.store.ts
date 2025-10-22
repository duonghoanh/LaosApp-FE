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
}

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
    }
    set({ user, accessToken: token, isAuthenticated: true });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
    }
    set({ user: null, accessToken: null, isAuthenticated: false });
  },
}));
