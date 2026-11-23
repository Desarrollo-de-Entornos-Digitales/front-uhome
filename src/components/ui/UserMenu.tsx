"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { logout } from "../../services/auth";
import { useSessionStore } from "../../store/sessionStore";
import { Avatar } from "./Avatar";

import styles from "./UserMenu.module.css";

export function UserMenu() {
  const router = useRouter();
  const user = useSessionStore((state) => state.user);
  const hydrate = useSessionStore((state) => state.hydrate);
  const clear = useSessionStore((state) => state.clear);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  async function handleLogout() {
    setLoading(true);
    await logout().catch(() => undefined);
    clear();
    router.replace("/login");
    router.refresh();
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.menu}>
      <Avatar name={user.fullName} size="sm" />

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
