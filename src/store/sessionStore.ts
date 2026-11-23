import { create } from "zustand";

import type { AuthUser } from "../services/auth";

const TOKEN_KEY = "uhome_token";
const USER_KEY = "uhome_user";

interface SessionState {
  token: string | null;
  user: AuthUser | null;
  hydrated: boolean;
  hydrate: () => void;
  setSession: (token: string, user: AuthUser) => void;
  clear: () => void;
}

function readStoredUser(): AuthUser | null {
  const storedUser = localStorage.getItem(USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as AuthUser;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

export const useSessionStore = create<SessionState>((set, get) => ({
  token: null,
  user: null,
  hydrated: false,

  hydrate: () => {
    if (get().hydrated || typeof window === "undefined") {
      return;
    }

    set({
      token: localStorage.getItem(TOKEN_KEY),
      user: readStoredUser(),
      hydrated: true,
    });
  },

  setSession: (token, user) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ token, user, hydrated: true });
  },

  clear: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }

    set({ token: null, user: null, hydrated: true });
  },
}));
