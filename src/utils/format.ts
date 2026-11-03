const priceFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export function formatPrice(price: number): string {
  return priceFormatter.format(price);
}

/**
 * distanceToCampus llega en metros desde el backend.
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${meters.toLocaleString("es-CO")} m`;
  }

  return `${(meters / 1000).toLocaleString("es-CO", {
    maximumFractionDigits: 1,
  })} km`;
}
