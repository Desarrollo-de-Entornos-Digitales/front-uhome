"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { logout, type AuthUser } from "../../services/auth";
import { clearSession, getUser } from "../../services/session";
import { Avatar } from "./Avatar";

import styles from "./UserMenu.module.css";

export function UserMenu() {
  const router = useRouter();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUser(getUser());
  }, []);

  async function handleLogout() {
    setLoading(true);

    try {
      await logout();
    } catch {
      // Aunque falle el backend, cerramos la sesión local.
    } finally {
      clearSession();
      router.replace("/login");
      router.refresh();
    }
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.menu}>
      <Avatar
        name={user.fullName}
        size="sm"
      />

      <div className={styles.user}>
        <strong>{user.fullName}</strong>
        <span>{user.email}</span>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className={styles.logout}
        disabled={loading}
      >
        {loading ? "Logging out..." : "Log out"}
      </button>
    </div>
  );
}