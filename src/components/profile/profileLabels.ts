import type {
  PriorityLevel,
  VibePreference,
} from "@/services/studentProfile";

export const priorityLabels: Record<PriorityLevel, string> = {
  alta: "Alta",
  media: "Media",
  baja: "Baja",
};

export const vibeLabels: Record<VibePreference, string> = {
  tranquilo: "Tranquilo",
  equilibrado: "Equilibrado",
  social: "Social",
  estudioso: "Estudioso",
};

const roleLabels: Record<string, string> = {
  student: "Estudiante",
  landlord: "Arrendador",
  admin: "Administrador",
};

export function formatRole(role: string | null): string | null {
  if (!role) {
    return null;
  }

  return roleLabels[role] ?? capitalize(role);
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const memberSinceFormatter = new Intl.DateTimeFormat("es-CO", {
  month: "long",
  year: "numeric",
});

export function formatMemberSince(isoDate: string): string | null {
  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return memberSinceFormatter.format(date);
}

export function formatStayMonths(months: number | null): string {
  if (months === null) {
    return "Sin definir";
  }

  return `${months} ${months === 1 ? "mes" : "meses"}`;
}

export function formatCount(
  count: number,
  singular: string,
  plural: string,
): string {
  return `${count} ${count === 1 ? singular : plural}`;
}
