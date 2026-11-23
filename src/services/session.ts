import type { AuthUser } from "./auth";
import { useSessionStore } from "../store/sessionStore";

const REMEMBER_KEY = "uhome_remember_me";
const REMEMBERED_EMAIL_KEY = "uhome_remembered_email";

export interface AuthSession {
  token: string;
  user: AuthUser;
  rememberMe: boolean;
}

function isBrowser() {
  return typeof window !== "undefined";
}

export function saveSession(
  token: string,
  user: AuthUser,
  rememberMe: boolean,
) {
  if (!isBrowser()) return;

  useSessionStore.getState().setSession(token, user);

  if (rememberMe) {
    localStorage.setItem(REMEMBER_KEY, "true");
    localStorage.setItem(REMEMBERED_EMAIL_KEY, user.email);
  } else {
    localStorage.removeItem(REMEMBER_KEY);
    localStorage.removeItem(REMEMBERED_EMAIL_KEY);
  }
}

export function getToken(): string | null {
  const state = useSessionStore.getState();
  state.hydrate();

  return useSessionStore.getState().token;
}

export function getUser(): AuthUser | null {
  const state = useSessionStore.getState();
  state.hydrate();

  return useSessionStore.getState().user;
}

export function getRememberMe(): boolean {
  if (!isBrowser()) return false;

  return localStorage.getItem(REMEMBER_KEY) === "true";
}

export function getRememberedEmail(): string {
  if (!isBrowser()) return "";

  return localStorage.getItem(REMEMBERED_EMAIL_KEY) ?? "";
}

export function getSession(): AuthSession | null {
  const token = getToken();
  const user = getUser();

  if (!token || !user) {
    return null;
  }

  return {
    token,
    user,
    rememberMe: getRememberMe(),
  };
}

export function clearSession() {
  useSessionStore.getState().clear();
}

export function clearRememberedUser() {
  if (!isBrowser()) return;

  localStorage.removeItem(REMEMBER_KEY);
  localStorage.removeItem(REMEMBERED_EMAIL_KEY);
}

export function isAuthenticated(): boolean {
  return Boolean(getToken());
}
