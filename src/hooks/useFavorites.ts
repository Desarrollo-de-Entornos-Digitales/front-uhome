"use client";

import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/services/api";
import {
  addFavorite,
  getUserFavorites,
  removeFavorite,
  type Favorite,
} from "@/services/favorites";
import { getUser } from "@/services/session";

/** Roles que el backend autoriza en /favorites. */
const FAVORITE_ROLES = ["student", "admin"];

export type FavoritesStatus = "loading" | "ready" | "error" | "unavailable";

export interface FavoritesController {
  favorites: Favorite[];
  status: FavoritesStatus;
  error: string | null;
  actionError: string | null;
  isFavorite: (propertyId: number) => boolean;
  isPending: (propertyId: number) => boolean;
  toggleFavorite: (propertyId: number) => Promise<void>;
  reload: () => void;
  dismissActionError: () => void;
}

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

/**
 * Favoritos del usuario autenticado, persistidos en el backend.
 * Se usa dentro de rutas protegidas, que solo se montan en el cliente,
 * por eso la sesión se lee al inicializar el estado.
 */
export function useFavorites(): FavoritesController {
  const [user] = useState(getUser);
  const canFavorite =
    user !== null && (!user.role || FAVORITE_ROLES.includes(user.role));

  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [status, setStatus] = useState<FavoritesStatus>(
    canFavorite ? "loading" : "unavailable",
  );
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [pendingIds, setPendingIds] = useState<ReadonlySet<number>>(
    () => new Set(),
  );
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!user || !canFavorite) {
      return;
    }

    let active = true;

    getUserFavorites(user.id)
      .then((data) => {
        if (!active) return;
        setFavorites(data);
        setError(null);
        setStatus("ready");
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(errorMessage(err, "No se pudieron cargar tus favoritos."));
        setStatus(
          err instanceof ApiError && err.status === 403 ? "unavailable" : "error",
        );
      });

    return () => {
      active = false;
    };
  }, [user, canFavorite, reloadKey]);

  const reload = useCallback(() => {
    setStatus("loading");
    setReloadKey((key) => key + 1);
  }, []);

  const isFavorite = useCallback(
    (propertyId: number) =>
      favorites.some((favorite) => favorite.propertyId === propertyId),
    [favorites],
  );

  const isPending = useCallback(
    (propertyId: number) => pendingIds.has(propertyId),
    [pendingIds],
  );

  const toggleFavorite = useCallback(
    async (propertyId: number) => {
      if (!user || !canFavorite || pendingIds.has(propertyId)) {
        return;
      }

      const wasFavorite = favorites.some(
        (favorite) => favorite.propertyId === propertyId,
      );

      setActionError(null);
      setPendingIds((current) => new Set(current).add(propertyId));

      try {
        let created: Favorite | null = null;

        try {
          if (wasFavorite) {
            await removeFavorite(user.id, propertyId);
          } else {
            created = await addFavorite(propertyId);
          }
        } catch (err) {
          // 404 al quitar o 409 al agregar significan que el backend ya
          // estaba en el estado deseado; basta con resincronizar.
          const alreadySynced =
            err instanceof ApiError &&
            (wasFavorite ? err.status === 404 : err.status === 409);

          if (!alreadySynced) {
            setActionError(
              errorMessage(
                err,
                wasFavorite
                  ? "No se pudo quitar la propiedad de favoritos."
                  : "No se pudo agregar la propiedad a favoritos.",
              ),
            );
            return;
          }
        }

        try {
          setFavorites(await getUserFavorites(user.id));
        } catch {
          // La acción ya quedó guardada; si falla la recarga se refleja
          // el cambio localmente.
          setFavorites((current) => {
            if (wasFavorite) {
              return current.filter(
                (favorite) => favorite.propertyId !== propertyId,
              );
            }

            return created ? [...current, created] : current;
          });
        }
      } finally {
        setPendingIds((current) => {
          const next = new Set(current);
          next.delete(propertyId);
          return next;
        });
      }
    },
    [user, canFavorite, favorites, pendingIds],
  );

  const dismissActionError = useCallback(() => setActionError(null), []);

  return {
    favorites,
    status,
    error,
    actionError,
    isFavorite,
    isPending,
    toggleFavorite,
    reload,
    dismissActionError,
  };
}
