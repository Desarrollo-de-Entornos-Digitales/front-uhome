import { create } from "zustand";

import { ApiError } from "@/services/api";
import {
  addFavorite,
  getUserFavorites,
  removeFavorite,
  type Favorite,
} from "@/services/favorites";

import { toast } from "./notificationStore";

export type FavoritesStatus = "loading" | "ready" | "error" | "unavailable";

type UserId = number | string;

interface FavoritesState {
  favorites: Favorite[];
  status: FavoritesStatus;
  error: string | null;
  actionError: string | null;
  pendingIds: number[];
  loadedUserId: UserId | null;
  load: (userId: UserId) => Promise<void>;
  toggle: (userId: UserId, propertyId: number) => Promise<void>;
  dismissActionError: () => void;
  reset: () => void;
}

const initialState = {
  favorites: [] as Favorite[],
  status: "loading" as FavoritesStatus,
  error: null as string | null,
  actionError: null as string | null,
  pendingIds: [] as number[],
  loadedUserId: null as UserId | null,
};

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  ...initialState,

  load: async (userId) => {
    set({ status: "loading", loadedUserId: userId });

    try {
      const data = await getUserFavorites(userId);

      if (get().loadedUserId !== userId) return;

      set({ favorites: data, error: null, status: "ready" });
    } catch (err) {
      if (get().loadedUserId !== userId) return;

      set({
        error: errorMessage(err, "No se pudieron cargar tus favoritos."),
        status:
          err instanceof ApiError && err.status === 403
            ? "unavailable"
            : "error",
      });
    }
  },

  toggle: async (userId, propertyId) => {
    const { pendingIds, favorites } = get();

    if (pendingIds.includes(propertyId)) {
      return;
    }

    const wasFavorite = favorites.some(
      (favorite) => favorite.propertyId === propertyId,
    );

    set({ actionError: null, pendingIds: [...pendingIds, propertyId] });

    try {
      let created: Favorite | null = null;

      try {
        if (wasFavorite) {
          await removeFavorite(userId, propertyId);
        } else {
          created = await addFavorite(propertyId);
        }
      } catch (err) {
        const alreadySynced =
          err instanceof ApiError &&
          (wasFavorite ? err.status === 404 : err.status === 409);

        if (!alreadySynced) {
          set({
            actionError: errorMessage(
              err,
              wasFavorite
                ? "No se pudo quitar la propiedad de favoritos."
                : "No se pudo agregar la propiedad a favoritos.",
            ),
          });
          return;
        }
      }

      try {
        set({ favorites: await getUserFavorites(userId) });
      } catch {
        set((state) => ({
          favorites: wasFavorite
            ? state.favorites.filter(
                (favorite) => favorite.propertyId !== propertyId,
              )
            : created
              ? [...state.favorites, created]
              : state.favorites,
        }));
      }

      toast.success(
        wasFavorite ? "Removed from favorites" : "Added to favorites",
      );
    } finally {
      set((state) => ({
        pendingIds: state.pendingIds.filter((id) => id !== propertyId),
      }));
    }
  },

  dismissActionError: () => set({ actionError: null }),

  reset: () => set({ ...initialState }),
}));
