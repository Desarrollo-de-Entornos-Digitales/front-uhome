"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import Alert from "@/components/Alert";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchIcon } from "@/components/ui/icons";
import { Pagination } from "@/components/ui/Pagination";
import { useAsync } from "@/hooks/useAsync";
import { useFavorites } from "@/hooks/useFavorites";
import {
  EMPTY_FILTERS,
  FEED_PAGE_SIZE,
  buildFeedParams,
  countActiveFilters,
  matchesLifestyle,
  matchesSearch,
  parseFeedParams,
  type FeedFilters,
  type FeedState,
} from "@/lib/propertyFilters";
import {
  getProperties,
  getPropertyRatings,
  getPropertyTypes,
  getVibeAnalyses,
  type Property,
  type PropertyRating,
  type PropertyType,
  type VibeAnalysis,
} from "@/services/properties";
import { cx } from "@/utils/classNames";

import { FavoritesNotice } from "./FavoritesNotice";
import { PropertyFilters } from "./PropertyFilters";
import { PropertyGrid } from "./PropertyGrid";
import styles from "./PropertiesFeed.module.css";

const SEARCH_DEBOUNCE_MS = 300;

interface FeedExtras {
  types: PropertyType[] | null;
  vibes: Map<number, VibeAnalysis> | null;
  ratings: Map<number, PropertyRating> | null;
}

/**
 * Datos complementarios del feed. Si alguno falla, el feed sigue
 * funcionando sin esa información.
 */
async function loadFeedExtras(): Promise<FeedExtras> {
  const [types, vibes, ratings] = await Promise.allSettled([
    getPropertyTypes(),
    getVibeAnalyses(),
    getPropertyRatings(),
  ]);

  return {
    types: types.status === "fulfilled" ? types.value : null,
    vibes:
      vibes.status === "fulfilled"
        ? new Map(vibes.value.map((vibe) => [vibe.propertyId, vibe]))
        : null,
    ratings: ratings.status === "fulfilled" ? ratings.value : null,
  };
}

function uniqueById(properties: Property[]): Property[] {
  return Array.from(
    new Map(properties.map((property) => [property.id, property])).values(),
  );
}

function typesFromProperties(properties: Property[]): PropertyType[] {
  const types = new Map<number, PropertyType>();

  for (const property of properties) {
    if (property.propertyType) {
      types.set(property.propertyType.id, property.propertyType);
    }
  }

  return Array.from(types.values());
}

export function PropertiesFeed() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const state = useMemo(() => parseFeedParams(searchParams), [searchParams]);

  const [searchInput, setSearchInput] = useState(state.search);
  const resultsRef = useRef<HTMLDivElement>(null);

  const navigate = useCallback(
    (next: FeedState) => {
      const query = buildFeedParams(next).toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [router, pathname],
  );

  const updateFilters = useCallback(
    (patch: Partial<FeedFilters>) => navigate({ ...state, ...patch, page: 1 }),
    [navigate, state],
  );

  useEffect(() => {
    const search = searchInput.trim();

    if (search === state.search) return;

    const timeout = window.setTimeout(
      () => updateFilters({ search }),
      SEARCH_DEBOUNCE_MS,
    );

    return () => window.clearTimeout(timeout);
  }, [searchInput, state.search, updateFilters]);

  const { maxPrice, maxDistance } = state;
  const propertiesQuery = useAsync(
    () =>
      getProperties({
        maxPrice: maxPrice ?? undefined,
        maxDistance: maxDistance ?? undefined,
      }),
    `${maxPrice ?? ""}|${maxDistance ?? ""}`,
  );
  const extrasQuery = useAsync(loadFeedExtras, "feed-extras");
  const favorites = useFavorites();

  const extras = extrasQuery.data ?? null;
  const loadedProperties = propertiesQuery.data ?? propertiesQuery.latestData;
  const properties = useMemo(
    () => uniqueById(loadedProperties ?? []),
    [loadedProperties],
  );

  const typeOptions = useMemo(
    () => extras?.types ?? typesFromProperties(properties),
    [extras, properties],
  );

  const vibes = extras?.vibes ?? null;
  const lifestyleUnavailable = extrasQuery.status === "success" && !vibes;
  const waitingForLifestyle =
    state.lifestyle !== null && extrasQuery.status === "loading";

  const filtered = useMemo(
    () =>
      properties.filter(
        (property) =>
          (state.type === null || property.propertyTypeId === state.type) &&
          matchesSearch(property, state.search) &&
          (state.lifestyle === null ||
            !vibes ||
            matchesLifestyle(vibes.get(property.id), state.lifestyle)),
      ),
    [properties, state.type, state.search, state.lifestyle, vibes],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / FEED_PAGE_SIZE));
  const currentPage = Math.min(state.page, totalPages);
  const firstIndex = (currentPage - 1) * FEED_PAGE_SIZE;
  const pageItems = filtered.slice(firstIndex, firstIndex + FEED_PAGE_SIZE);
  const activeCount = countActiveFilters(state);

  const isLoading =
    (propertiesQuery.status === "loading" && !loadedProperties) ||
    waitingForLifestyle;
  const isRefreshing =
    propertiesQuery.status === "loading" && Boolean(loadedProperties);

  function handleClear() {
    setSearchInput("");
    navigate({ ...EMPTY_FILTERS, page: 1 });
  }

  function handlePageChange(page: number) {
    navigate({ ...state, page });
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  let content;

  if (propertiesQuery.status === "error") {
    content = (
      <EmptyState
        tone="error"
        title="No pudimos cargar las propiedades"
        description={propertiesQuery.error ?? undefined}
        action={
          <Button variant="accent" size="sm" onClick={propertiesQuery.retry}>
            Reintentar
          </Button>
        }
      />
    );
  } else if (isLoading) {
    content = <Spinner message="Cargando propiedades..." />;
  } else if (filtered.length === 0) {
    content = (
      <EmptyState
        icon={<SearchIcon size={26} />}
        title={
          activeCount > 0
            ? "No encontramos coincidencias"
            : "Aún no hay propiedades publicadas"
        }
        description={
          activeCount > 0
            ? "Prueba con otro término de búsqueda o ajusta los filtros."
            : "Vuelve pronto para descubrir nuevas opciones de vivienda."
        }
        action={
          activeCount > 0 ? (
            <Button variant="accent" size="sm" onClick={handleClear}>
              Limpiar filtros
            </Button>
          ) : undefined
        }
      />
    );
  } else {
    content = (
      <>
        <div className={styles.summary}>
          <p className={styles.count}>
            <strong>{filtered.length}</strong>{" "}
            {filtered.length === 1
              ? "propiedad encontrada"
              : "propiedades encontradas"}
          </p>
          <p className={styles.range}>
            Mostrando {firstIndex + 1}–{firstIndex + pageItems.length} de{" "}
            {filtered.length}
            {isRefreshing ? " · Actualizando…" : ""}
          </p>
        </div>

        <div className={cx(isRefreshing && styles.refreshing)}>
          <PropertyGrid
            properties={pageItems}
            ratings={extras?.ratings}
            favorites={favorites}
          />
        </div>

        <Pagination
          className={styles.pagination}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          label="Paginación de propiedades"
        />
      </>
    );
  }

  return (
    <>
      <PropertyFilters
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        filters={state}
        typeOptions={typeOptions}
        lifestyleAvailable={extrasQuery.status === "success" && Boolean(vibes)}
        onFiltersChange={updateFilters}
        onClear={handleClear}
        activeCount={activeCount}
      />

      <div className={styles.notices}>
        {lifestyleUnavailable && state.lifestyle !== null ? (
          <Alert
            type="info"
            message="No se pudo cargar el análisis de ambiente, por eso el filtro de estilo de vida no se está aplicando."
          />
        ) : null}
        <FavoritesNotice favorites={favorites} />
      </div>

      <div
        ref={resultsRef}
        className={styles.results}
        aria-busy={isLoading || isRefreshing}
      >
        {content}
      </div>
    </>
  );
}
