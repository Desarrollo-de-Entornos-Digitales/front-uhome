"use client";

import { useId } from "react";

import { Button } from "@/components/ui/Button";
import { SearchIcon } from "@/components/ui/icons";
import {
  DISTANCE_OPTIONS,
  LIFESTYLE_OPTIONS,
  PRICE_OPTIONS,
  type FeedFilters,
} from "@/lib/propertyFilters";
import type { PropertyType } from "@/services/properties";
import { cx } from "@/utils/classNames";
import { formatDistance, formatPrice } from "@/utils/format";

import styles from "./PropertyFilters.module.css";

type FilterTone = "price" | "type" | "distance" | "lifestyle";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  label: string;
  tone: FilterTone;
  value: string;
  allLabel: string;
  options: FilterOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

function FilterSelect({
  label,
  tone,
  value,
  allLabel,
  options,
  onChange,
  disabled = false,
}: FilterSelectProps) {
  const id = useId();

  return (
    <div
      className={cx(
        styles.filter,
        styles[tone],
        value !== "" && styles.filterActive,
      )}
    >
      <label htmlFor={id} className={styles.filterLabel}>
        {label}
      </label>
      <select
        id={id}
        className={styles.select}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
      >
        <option value="">{allLabel}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export interface PropertyFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters: FeedFilters;
  typeOptions: PropertyType[];
  /** false cuando no se pudo cargar el Vibe Analyzer. */
  lifestyleAvailable: boolean;
  onFiltersChange: (patch: Partial<FeedFilters>) => void;
  onClear: () => void;
  activeCount: number;
}

function toNumberOrNull(value: string): number | null {
  return value === "" ? null : Number(value);
}

export function PropertyFilters({
  searchValue,
  onSearchChange,
  filters,
  typeOptions,
  lifestyleAvailable,
  onFiltersChange,
  onClear,
  activeCount,
}: PropertyFiltersProps) {
  const searchId = useId();

  return (
    <section className={styles.panel} aria-label="Buscar y filtrar propiedades">
      <form
        role="search"
        className={styles.searchRow}
        onSubmit={(event) => event.preventDefault()}
      >
        <label htmlFor={searchId} className={styles.srOnly}>
          Buscar propiedades
        </label>
        <div className={styles.searchField}>
          <SearchIcon size={20} className={styles.searchIcon} />
          <input
            id={searchId}
            type="search"
            className={styles.searchInput}
            placeholder="Busca por nombre, barrio, dirección o amenidad"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            autoComplete="off"
          />
        </div>
      </form>

      <div className={styles.filters}>
        <FilterSelect
          label="Precio"
          tone="price"
          allLabel="Cualquier precio"
          value={filters.maxPrice === null ? "" : String(filters.maxPrice)}
          options={PRICE_OPTIONS.map((price) => ({
            value: String(price),
            label: `Hasta ${formatPrice(price)}`,
          }))}
          onChange={(value) => onFiltersChange({ maxPrice: toNumberOrNull(value) })}
        />

        <FilterSelect
          label="Tipo de vivienda"
          tone="type"
          allLabel="Todos los tipos"
          value={filters.type === null ? "" : String(filters.type)}
          options={typeOptions.map((type) => ({
            value: String(type.id),
            label: type.name.charAt(0).toUpperCase() + type.name.slice(1),
          }))}
          onChange={(value) => onFiltersChange({ type: toNumberOrNull(value) })}
          disabled={typeOptions.length === 0}
        />

        <FilterSelect
          label="Distancia al campus"
          tone="distance"
          allLabel="Cualquier distancia"
          value={filters.maxDistance === null ? "" : String(filters.maxDistance)}
          options={DISTANCE_OPTIONS.map((meters) => ({
            value: String(meters),
            label: `Hasta ${formatDistance(meters)}`,
          }))}
          onChange={(value) =>
            onFiltersChange({ maxDistance: toNumberOrNull(value) })
          }
        />

        <FilterSelect
          label="Estilo de vida"
          tone="lifestyle"
          allLabel="Cualquier estilo"
          value={filters.lifestyle ?? ""}
          options={LIFESTYLE_OPTIONS.map((option) => ({
            value: option.value,
            label: option.label,
          }))}
          onChange={(value) =>
            onFiltersChange({
              lifestyle:
                LIFESTYLE_OPTIONS.find((option) => option.value === value)
                  ?.value ?? null,
            })
          }
          disabled={!lifestyleAvailable}
        />

        {activeCount > 0 ? (
          <Button
            variant="outline"
            size="sm"
            className={styles.clear}
            onClick={onClear}
          >
            Limpiar filtros ({activeCount})
          </Button>
        ) : null}
      </div>
    </section>
  );
}
