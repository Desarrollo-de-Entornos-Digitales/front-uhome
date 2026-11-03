"use client";

import { useMemo } from "react";

import Spinner from "@/components/Spinner";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { HeartIcon } from "@/components/ui/icons";
import { useAsync } from "@/hooks/useAsync";
import { useFavorites } from "@/hooks/useFavorites";
import {
  getProperties,
  getPropertyRatings,
  type Property,
  type PropertyRating,
  type PropertySummary,
} from "@/services/properties";

import { FavoritesNotice } from "./FavoritesNotice";
import { PropertyGrid } from "./PropertyGrid";
import styles from "./FavoritesView.module.css";

interface FavoritesCatalog {
  properties: Map<number, Property> | null;
  ratings: Map<number, PropertyRating> | null;
}

/**
 * Los favoritos traen la propiedad sin tipo ni amenidades; se completan
 * con GET /properties. Si eso falla, se muestran los datos básicos.
 */
async function loadCatalog(): Promise<FavoritesCatalog> {
  const [properties, ratings] = await Promise.allSettled([
    getProperties(),
    getPropertyRatings(),
  ]);

  return {
    properties:
      properties.status === "fulfilled"
        ? new Map(properties.value.map((property) => [property.id, property]))
        : null,
    ratings: ratings.status === "fulfilled" ? ratings.value : null,
  };
}

export function FavoritesView() {
  const favorites = useFavorites();
  const catalogQuery = useAsync(loadCatalog, "favorites-catalog");
  const catalog = catalogQuery.data ?? null;

  const savedProperties = useMemo(() => {
    const items: PropertySummary[] = [];
    const seen = new Set<number>();

    for (const favorite of favorites.favorites) {
      const property =
        catalog?.properties?.get(favorite.propertyId) ?? favorite.property;

      if (property && !seen.has(property.id)) {
        seen.add(property.id);
        items.push(property);
      }
    }

    return items;
  }, [favorites.favorites, catalog]);

  if (favorites.status === "unavailable") {
    return (
      <EmptyState
        icon={<HeartIcon size={26} />}
        title="Favoritos no disponible para tu cuenta"
        description="Guardar propiedades en favoritos está disponible para cuentas de estudiante."
        action={
          <ButtonLink href="/properties" variant="accent" size="sm">
            Explorar propiedades
          </ButtonLink>
        }
      />
    );
  }

  if (favorites.status === "error") {
    return (
      <EmptyState
        tone="error"
        title="No pudimos cargar tus favoritos"
        description={favorites.error ?? undefined}
        action={
          <Button variant="accent" size="sm" onClick={favorites.reload}>
            Reintentar
          </Button>
        }
      />
    );
  }

  if (favorites.status === "loading" || catalogQuery.status === "loading") {
    return <Spinner message="Cargando tus favoritos..." />;
  }

  if (savedProperties.length === 0) {
    return (
      <EmptyState
        icon={<HeartIcon size={26} />}
        title="Todavía no tienes favoritos"
        description="Toca el corazón en cualquier propiedad del feed para guardarla aquí."
        action={
          <ButtonLink href="/properties" variant="accent" size="sm">
            Explorar propiedades
          </ButtonLink>
        }
      />
    );
  }

  return (
    <>
      <div className={styles.notices}>
        <FavoritesNotice favorites={favorites} />
      </div>

      <p className={styles.count}>
        <strong>{savedProperties.length}</strong>{" "}
        {savedProperties.length === 1
          ? "propiedad guardada"
          : "propiedades guardadas"}
      </p>

      <PropertyGrid
        properties={savedProperties}
        ratings={catalog?.ratings}
        favorites={favorites}
      />
    </>
  );
}
