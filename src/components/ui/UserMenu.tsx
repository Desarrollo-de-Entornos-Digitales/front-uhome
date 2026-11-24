"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { logout } from "../../services/auth";
import { useNotificationStore, toast } from "../../store/notificationStore";
import { useSessionStore } from "../../store/sessionStore";
import { Avatar } from "./Avatar";
import { ConfirmModal } from "./ConfirmModal";

import styles from "./UserMenu.module.css";

export function UserMenu() {
  const router = useRouter();
  const user = useSessionStore((state) => state.user);
  const hydrate = useSessionStore((state) => state.hydrate);
  const clear = useSessionStore((state) => state.clear);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  async function handleConfirmLogout() {
    setLoading(true);
    await logout().catch(() => undefined);
    clear();
    setConfirmOpen(false);
    setLoading(false);
    toast.success("You've been logged out", "See you soon!");
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
        onClick={() => setConfirmOpen(true)}
        className={styles.logout}
      >
        Log out
      </button>

      <ConfirmModal
        open={confirmOpen}
        title="Log out of UHome?"
        description="You'll need to sign in again to see your favorites and preferences."
        confirmLabel="Log out"
        cancelLabel="Stay logged in"
        loading={loading}
        onConfirm={handleConfirmLogout}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
