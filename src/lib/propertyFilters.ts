import type { PropertySummary, VibeAnalysis } from "@/services/properties";

/**
 * Filtros del feed.
 *
 * - maxPrice y maxDistance los resuelve el backend (GET /properties).
 * - search, type y lifestyle se aplican en el frontend porque el backend
 *   no expone parámetros para ellos.
 */
export interface FeedFilters {
  search: string;
  type: number | null;
  lifestyle: LifestyleKey | null;
  maxPrice: number | null;
  maxDistance: number | null;
}

export interface FeedState extends FeedFilters {
  page: number;
}

export const FEED_PAGE_SIZE = 6;

export const EMPTY_FILTERS: FeedFilters = {
  search: "",
  type: null,
  lifestyle: null,
  maxPrice: null,
  maxDistance: null,
};

export const PRICE_OPTIONS = [700_000, 1_000_000, 1_500_000, 2_000_000];

/** En metros, la misma unidad de distanceToCampus. */
export const DISTANCE_OPTIONS = [500, 1_000, 2_000, 3_000];

type VibeMetric = keyof Pick<
  VibeAnalysis,
  "studentDensity" | "nightlife" | "studySpots" | "quietness" | "essentialSpots"
>;

export type LifestyleKey =
  | "quiet"
  | "study"
  | "student"
  | "nightlife"
  | "essentials";

export interface LifestyleOption {
  value: LifestyleKey;
  label: string;
  metric: VibeMetric;
}

/**
 * Cada estilo de vida se basa en un indicador del Vibe Analyzer (escala 1-5).
 */
export const LIFESTYLE_OPTIONS: LifestyleOption[] = [
  { value: "quiet", label: "Tranquilo", metric: "quietness" },
  { value: "study", label: "Ideal para estudiar", metric: "studySpots" },
  { value: "student", label: "Ambiente estudiantil", metric: "studentDensity" },
  { value: "nightlife", label: "Vida nocturna", metric: "nightlife" },
  { value: "essentials", label: "Servicios cerca", metric: "essentialSpots" },
];

/** Puntaje mínimo del indicador para considerar que cumple el estilo. */
export const LIFESTYLE_MIN_SCORE = 4;

function parseOption(value: string | null, options: number[]): number | null {
  if (value === null) return null;

  const parsed = Number(value);

  return options.includes(parsed) ? parsed : null;
}

function parsePositiveInt(value: string | null): number | null {
  if (value === null || !/^\d+$/.test(value)) return null;

  const parsed = Number(value);

  return parsed > 0 ? parsed : null;
}

export function parseFeedParams(params: Pick<URLSearchParams, "get">): FeedState {
  const lifestyle = params.get("lifestyle");

  return {
    search: params.get("q")?.trim() ?? "",
    type: parsePositiveInt(params.get("type")),
    lifestyle:
      LIFESTYLE_OPTIONS.find((option) => option.value === lifestyle)?.value ??
      null,
    maxPrice: parseOption(params.get("maxPrice"), PRICE_OPTIONS),
    maxDistance: parseOption(params.get("maxDistance"), DISTANCE_OPTIONS),
    page: parsePositiveInt(params.get("page")) ?? 1,
  };
}

export function buildFeedParams(state: FeedState): URLSearchParams {
  const params = new URLSearchParams();

  if (state.search) params.set("q", state.search);
  if (state.type !== null) params.set("type", String(state.type));
  if (state.lifestyle) params.set("lifestyle", state.lifestyle);
  if (state.maxPrice !== null) params.set("maxPrice", String(state.maxPrice));
  if (state.maxDistance !== null) {
    params.set("maxDistance", String(state.maxDistance));
  }
  if (state.page > 1) params.set("page", String(state.page));

  return params;
}

export function countActiveFilters(filters: FeedFilters): number {
  return [
    filters.search !== "",
    filters.type !== null,
    filters.lifestyle !== null,
    filters.maxPrice !== null,
    filters.maxDistance !== null,
  ].filter(Boolean).length;
}

export function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

/**
 * Busca cada palabra del término en nombre, descripción, dirección,
 * tipo de vivienda y amenidades.
 */
export function matchesSearch(property: PropertySummary, search: string): boolean {
  const terms = normalizeText(search).split(/\s+/).filter(Boolean);

  if (terms.length === 0) return true;

  const haystack = normalizeText(
    [
      property.name,
      property.description,
      property.address,
      property.propertyType?.name ?? "",
      ...(property.amenities ?? []).map((amenity) => amenity.name),
    ].join(" "),
  );

  return terms.every((term) => haystack.includes(term));
}

export function matchesLifestyle(
  vibe: VibeAnalysis | undefined,
  lifestyle: LifestyleKey,
): boolean {
  const option = LIFESTYLE_OPTIONS.find((item) => item.value === lifestyle);

  if (!option || !vibe) return false;

  return vibe[option.metric] >= LIFESTYLE_MIN_SCORE;
}
