"use client";

import type { FavoritesController } from "@/hooks/useFavorites";
import type { PropertyRating, PropertySummary } from "@/services/properties";

import { PropertyCard } from "./PropertyCard";
import styles from "./PropertyGrid.module.css";

export interface PropertyGridProps {
  properties: PropertySummary[];
  ratings?: Map<number, PropertyRating> | null;
  /** Si se omite o aún no está listo, las tarjetas no muestran el corazón. */
  favorites?: FavoritesController | null;
}

export function PropertyGrid({ properties, ratings, favorites }: PropertyGridProps) {
  const favoritesReady = favorites?.status === "ready";

  return (
    <ul className={styles.grid}>
      {properties.map((property) => (
        <li key={property.id} className={styles.item}>
          <PropertyCard
            property={property}
            rating={ratings?.get(property.id) ?? null}
            favorite={
              favorites && favoritesReady
                ? {
                    active: favorites.isFavorite(property.id),
                    pending: favorites.isPending(property.id),
                    onToggle: () => void favorites.toggleFavorite(property.id),
                  }
                : undefined
            }
          />
        </li>
      ))}
    </ul>
  );
}
