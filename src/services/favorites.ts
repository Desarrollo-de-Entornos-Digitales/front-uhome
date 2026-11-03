import { ApiError, apiRequest, getErrorMessage } from "./api";
import type { PropertySummary } from "./properties";

export interface Favorite {
  id: number;
  userId: number;
  propertyId: number;
  /** GET /favorites/user/:userId no incluye tipo ni amenidades. */
  property: PropertySummary | null;
}

async function ensureOk(response: Response): Promise<void> {
  if (!response.ok) {
    throw new ApiError(await getErrorMessage(response), response.status);
  }
}

export async function getUserFavorites(
  userId: number | string,
): Promise<Favorite[]> {
  const response = await apiRequest(
    `/favorites/user/${encodeURIComponent(String(userId))}`,
  );

  await ensureOk(response);

  return (await response.json()) as Favorite[];
}

/**
 * El backend toma el usuario del token JWT; solo se envía la propiedad.
 */
export async function addFavorite(propertyId: number): Promise<Favorite> {
  const response = await apiRequest("/favorites", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ propertyId }),
  });

  await ensureOk(response);

  return (await response.json()) as Favorite;
}

export async function removeFavorite(
  userId: number | string,
  propertyId: number,
): Promise<void> {
  const response = await apiRequest(
    `/favorites/user/${encodeURIComponent(String(userId))}/property/${propertyId}`,
    {
      method: "DELETE",
    },
  );

  await ensureOk(response);
}
