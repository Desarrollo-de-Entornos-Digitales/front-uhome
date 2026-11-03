"use client";

import Alert from "@/components/Alert";
import { Button } from "@/components/ui/Button";
import type { FavoritesController } from "@/hooks/useFavorites";

import styles from "./FavoritesNotice.module.css";

export interface FavoritesNoticeProps {
  favorites: FavoritesController;
}

/**
 * Errores de favoritos que no bloquean la pantalla: fallo al cargar la
 * lista (con reintento) o fallo al agregar/quitar una propiedad.
 */
export function FavoritesNotice({ favorites }: FavoritesNoticeProps) {
  return (
    <>
      {favorites.status === "error" ? (
        <div className={styles.notice}>
          <Alert
            type="error"
            message={`No pudimos cargar tus favoritos: ${favorites.error ?? "error desconocido"}.`}
          />
          <Button variant="outline" size="sm" onClick={favorites.reload}>
            Reintentar
          </Button>
        </div>
      ) : null}

      {favorites.actionError ? (
        <div className={styles.notice}>
          <Alert type="error" message={favorites.actionError} />
          <Button
            variant="outline"
            size="sm"
            onClick={favorites.dismissActionError}
          >
            Cerrar
          </Button>
        </div>
      ) : null}
    </>
  );
}
