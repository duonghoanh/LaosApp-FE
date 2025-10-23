"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth.store";

export function AuthInitializer() {
  useEffect(() => {
    // Initialize auth from localStorage when app loads
    useAuthStore.getState().initializeAuth();
  }, []);

  return null;
}
