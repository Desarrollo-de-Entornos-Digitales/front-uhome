import { create } from "zustand";

export type NotificationType = "success" | "error" | "info";

export interface AppNotification {
  id: number;
  type: NotificationType;
  title: string;
  message?: string;
}

interface NotificationState {
  notifications: AppNotification[];
  notify: (type: NotificationType, title: string, message?: string) => void;
  dismiss: (id: number) => void;
}

const AUTO_DISMISS_MS = 5000;

let nextId = 1;

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],

  notify: (type, title, message) => {
    const id = nextId++;

    set((state) => ({
      notifications: [...state.notifications, { id, type, title, message }],
    }));

    setTimeout(() => get().dismiss(id), AUTO_DISMISS_MS);
  },

  dismiss: (id) => {
    set((state) => ({
      notifications: state.notifications.filter(
        (notification) => notification.id !== id,
      ),
    }));
  },
}));

export const toast = {
  success: (title: string, message?: string) =>
    useNotificationStore.getState().notify("success", title, message),
  error: (title: string, message?: string) =>
    useNotificationStore.getState().notify("error", title, message),
  info: (title: string, message?: string) =>
    useNotificationStore.getState().notify("info", title, message),
};
