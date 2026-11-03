"use client";

import { useState } from "react";
import type { ReactNode } from "react";

import Spinner from "@/components/Spinner";
import { Avatar } from "@/components/ui/Avatar";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { HomeIcon } from "@/components/ui/icons";
import { useAsync } from "@/hooks/useAsync";
import { getUser } from "@/services/session";
import {
  getMyProfile,
  getUserAccount,
  type StudentProfile,
} from "@/services/studentProfile";
import { cx } from "@/utils/classNames";
import { formatDistance, formatPrice } from "@/utils/format";

import { PreferencesForm } from "./PreferencesForm";
import {
  capitalize,
  formatCount,
  formatMemberSince,
  formatRole,
  formatStayMonths,
  priorityLabels,
  vibeLabels,
} from "./profileLabels";
import styles from "./ProfileView.module.css";

interface ProfilePageData {
  profile: StudentProfile | null;
  fullName: string;
  role: string | null;
  memberSince: string | null;
}

type ChipColor = "university" | "preferences" | "name" | "member";

interface PreferenceItem {
  label: string;
  value: string;
  tone?: BadgeTone;
  chip?: ChipColor;
}

async function loadProfilePage(): Promise<ProfilePageData> {
  const user = getUser();

  const [profile, account] = await Promise.all([
    getMyProfile(),
    user ? getUserAccount(user.id).catch(() => null) : Promise.resolve(null),
  ]);

  return {
    profile,
    fullName: account?.fullName ?? user?.fullName ?? "Usuario",
    role: account?.role?.name ?? user?.role ?? null,
    memberSince: account ? formatMemberSince(account.createdAt) : null,
  };
}

function buildPreferenceItems(profile: StudentProfile): PreferenceItem[] {
  return [
    { label: "Universidad", value: profile.university, chip: "university" },
    {
      label: "Presupuesto máximo",
      value: `${formatPrice(profile.maxBudget)} al mes`,
      tone: "price",
    },
    {
      label: "Distancia máxima al campus",
      value: formatDistance(profile.maxDistanceToCampus),
      tone: "distance",
    },
    {
      label: "Prioridad de seguridad",
      value: priorityLabels[profile.safetyPriority],
      chip: "preferences",
    },
    {
      label: "Prioridad de vida nocturna",
      value: priorityLabels[profile.nightlifePriority],
      chip: "preferences",
    },
    {
      label: "Prioridad de amenidades",
      value: priorityLabels[profile.amenitiesPriority],
      chip: "preferences",
    },
    {
      label: "Vibra del barrio",
      value: vibeLabels[profile.vibePreference],
      tone: "lifestyle",
    },
    {
      label: "Estancia deseada",
      value: formatStayMonths(profile.desiredStayMonths),
      chip: "preferences",
    },
    profile.preferredPropertyType
      ? {
          label: "Tipo de vivienda",
          value: capitalize(profile.preferredPropertyType.name),
          tone: "type",
        }
      : {
          label: "Tipo de vivienda",
          value: "Sin preferencia",
          chip: "preferences",
        },
    {
      label: "Habitaciones mínimas",
      value: formatCount(profile.minBedrooms, "habitación", "habitaciones"),
      chip: "preferences",
    },
    {
      label: "Baños mínimos",
      value: formatCount(profile.minBathrooms, "baño", "baños"),
      chip: "preferences",
    },
    {
      label: "Mascotas",
      value: profile.petFriendly ? "Necesito que las acepten" : "No las necesito",
      chip: "preferences",
    },
  ];
}

function Chip({ item }: { item: PreferenceItem }) {
  return (
    <Badge
      tone={item.tone ?? "neutral"}
      className={item.chip ? cx(styles.chip, styles[item.chip]) : undefined}
    >
      {item.value}
    </Badge>
  );
}

interface AccountHeaderProps {
  fullName: string;
  role: string | null;
  memberSince: string | null;
}

function AccountHeader({ fullName, role, memberSince }: AccountHeaderProps) {
  const roleLabel = formatRole(role);

  return (
    <Card as="section" className={styles.account} aria-label="Tu cuenta">
      <Avatar name={fullName} size="lg" />
      <div className={styles.accountInfo}>
        <h2 className={styles.accountName}>{fullName}</h2>
        <div className={styles.chips}>
          {roleLabel ? (
            <Badge className={cx(styles.chip, styles.name)}>{roleLabel}</Badge>
          ) : null}
          {memberSince ? (
            <Badge className={cx(styles.chip, styles.member)}>
              Miembro desde {memberSince}
            </Badge>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

function PreferencesSummary({ profile }: { profile: StudentProfile }) {
  return (
    <Card as="section" aria-labelledby="preferences-title">
      <CardHeader>
        <h2 id="preferences-title" className={styles.sectionTitle}>
          Tus preferencias
        </h2>
      </CardHeader>
      <CardBody>
        <dl className={styles.preferenceList}>
          {buildPreferenceItems(profile).map((item) => (
            <div key={item.label} className={styles.preference}>
              <dt className={styles.preferenceLabel}>{item.label}</dt>
              <dd className={styles.preferenceValue}>
                <Chip item={item} />
              </dd>
            </div>
          ))}
        </dl>
      </CardBody>
    </Card>
  );
}

function FormSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Card as="section" aria-labelledby="form-title">
      <CardHeader>
        <h2 id="form-title" className={styles.sectionTitle}>
          {title}
        </h2>
      </CardHeader>
      <CardBody>{children}</CardBody>
    </Card>
  );
}

export function ProfileView() {
  const query = useAsync(loadProfilePage, "profile");
  const [savedProfile, setSavedProfile] = useState<StudentProfile | null>(
    null,
  );

  if (query.status === "loading") {
    return <Spinner message="Cargando tu perfil..." />;
  }

  if (query.status === "error" || !query.data) {
    return (
      <EmptyState
        tone="error"
        title="No pudimos cargar tu perfil"
        description={query.error ?? undefined}
        action={
          <Button variant="accent" size="sm" onClick={query.retry}>
            Reintentar
          </Button>
        }
      />
    );
  }

  const { fullName, role, memberSince } = query.data;
  const profile = savedProfile ?? query.data.profile;

  if (!profile && role !== "student") {
    return (
      <div className={styles.layout}>
        <AccountHeader
          fullName={fullName}
          role={role}
          memberSince={memberSince}
        />
        <EmptyState
          icon={<HomeIcon size={26} />}
          title="Tu cuenta no tiene perfil de estudiante"
          description="El perfil de preferencias de vivienda solo está disponible para cuentas de estudiante. Con tu cuenta puedes seguir explorando las propiedades publicadas."
          action={
            <ButtonLink href="/properties" variant="accent" size="sm">
              Explorar propiedades
            </ButtonLink>
          }
        />
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <AccountHeader fullName={fullName} role={role} memberSince={memberSince} />

      {profile ? (
        <PreferencesSummary profile={profile} />
      ) : (
        <EmptyState
          icon={<HomeIcon size={26} />}
          title="Aún no tienes perfil"
          description="Cuéntanos qué buscas en una vivienda. Completa el formulario de abajo para crear tu perfil de preferencias."
        />
      )}

      <FormSection title={profile ? "Editar preferencias" : "Crea tu perfil"}>
        <PreferencesForm profile={profile} onSaved={setSavedProfile} />
      </FormSection>
    </div>
  );
}
