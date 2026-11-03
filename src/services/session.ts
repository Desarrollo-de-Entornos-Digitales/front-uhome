import type { AuthUser } from "./auth";

const TOKEN_KEY = "uhome_token";
const USER_KEY = "uhome_user";
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

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  if (rememberMe) {
    localStorage.setItem(REMEMBER_KEY, "true");
    localStorage.setItem(
      REMEMBERED_EMAIL_KEY,
      user.email,
    );
  } else {
    localStorage.removeItem(REMEMBER_KEY);
    localStorage.removeItem(REMEMBERED_EMAIL_KEY);
  }
}

export function getToken(): string | null {
  if (!isBrowser()) return null;

  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): AuthUser | null {
  if (!isBrowser()) return null;

  const storedUser =
    localStorage.getItem(USER_KEY);

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

export function getRememberMe(): boolean {
  if (!isBrowser()) return false;

  return (
    localStorage.getItem(REMEMBER_KEY) === "true"
  );
}

export function getRememberedEmail(): string {
  if (!isBrowser()) return "";

  return (
    localStorage.getItem(REMEMBERED_EMAIL_KEY) ??
    ""
  );
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
  if (!isBrowser()) return;

  /*
   * Conservamos el correo recordado para que
   * "Remember me" siga siendo útil después de logout.
   */
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function clearRememberedUser() {
  if (!isBrowser()) return;

  localStorage.removeItem(REMEMBER_KEY);
  localStorage.removeItem(REMEMBERED_EMAIL_KEY);
}

export function isAuthenticated(): boolean {
  return Boolean(getToken());
}