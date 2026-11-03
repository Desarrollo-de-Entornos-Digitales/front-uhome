import { ApiError, apiRequest, getErrorMessage } from "./api";
import type { PropertyType } from "./properties";

export const PRIORITY_LEVELS = ["alta", "media", "baja"] as const;
export const VIBE_PREFERENCES = [
  "tranquilo",
  "equilibrado",
  "social",
  "estudioso",
] as const;

export type PriorityLevel = (typeof PRIORITY_LEVELS)[number];
export type VibePreference = (typeof VIBE_PREFERENCES)[number];

export interface StudentProfile {
  id: number;
  userId: number;
  university: string;
  maxBudget: number;
  maxDistanceToCampus: number;
  safetyPriority: PriorityLevel;
  nightlifePriority: PriorityLevel;
  amenitiesPriority: PriorityLevel;
  vibePreference: VibePreference;
  desiredStayMonths: number | null;
  preferredPropertyTypeId: number | null;
  preferredPropertyType: PropertyType | null;
  minBedrooms: number;
  minBathrooms: number;
  petFriendly: boolean;
}

export type ProfileChanges = Partial<
  Omit<StudentProfile, "id" | "userId" | "preferredPropertyType">
>;

export type NewProfileData = Pick<
  StudentProfile,
  "university" | "maxBudget" | "safetyPriority" | "nightlifePriority"
> &
  Omit<
    ProfileChanges,
    "university" | "maxBudget" | "safetyPriority" | "nightlifePriority"
  >;

export interface UserAccount {
  id: number;
  fullName: string;
  email: string;
  createdAt: string;
  role: { id: number; name: string } | null;
}

async function ensureOk(response: Response): Promise<void> {
  if (!response.ok) {
    throw new ApiError(await getErrorMessage(response), response.status);
  }
}

export async function getMyProfile(): Promise<StudentProfile | null> {
  const response = await apiRequest("/student-profile/me");

  if (response.status === 404) {
    return null;
  }

  await ensureOk(response);

  return (await response.json()) as StudentProfile;
}

export async function updateProfile(
  id: number,
  changes: ProfileChanges,
): Promise<StudentProfile> {
  const response = await apiRequest(`/student-profile/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(changes),
  });

  await ensureOk(response);

  return (await response.json()) as StudentProfile;
}

export async function createProfile(
  data: NewProfileData,
): Promise<StudentProfile> {
  const response = await apiRequest("/student-profile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  await ensureOk(response);

  return (await response.json()) as StudentProfile;
}

export async function getPropertyTypes(): Promise<PropertyType[]> {
  const response = await apiRequest("/property-types");

  await ensureOk(response);

  return (await response.json()) as PropertyType[];
}

export async function getUserAccount(
  userId: number | string,
): Promise<UserAccount> {
  const response = await apiRequest(
    `/users/${encodeURIComponent(String(userId))}`,
  );

  await ensureOk(response);

  return (await response.json()) as UserAccount;
}
