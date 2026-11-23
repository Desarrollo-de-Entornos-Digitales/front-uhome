"use client";

import { useNotificationStore } from "../../store/notificationStore";

import styles from "./ToastViewport.module.css";

export function ToastViewport() {
  const notifications = useNotificationStore((state) => state.notifications);
  const dismiss = useNotificationStore((state) => state.dismiss);

  return (
    <div className={styles.viewport} aria-live="polite">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${styles.toast} ${styles[notification.type]}`}
          role={notification.type === "error" ? "alert" : "status"}
        >
          <div className={styles.body}>
            <strong>{notification.title}</strong>
            {notification.message ? <span>{notification.message}</span> : null}
          </div>

          <button
            type="button"
            className={styles.close}
            onClick={() => dismiss(notification.id)}
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
