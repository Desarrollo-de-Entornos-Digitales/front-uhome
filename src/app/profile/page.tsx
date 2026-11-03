import type { Metadata } from "next";

import { AppShell } from "@/components/layout/AppShell";
import { ProfileView } from "@/components/profile/ProfileView";

export const metadata: Metadata = {
  title: "Perfil | UHome",
};

export default function ProfilePage() {
  return (
    <AppShell
      eyebrow="Tu cuenta"
      title="Mi"
      accent="perfil."
      description="Revisa y ajusta tus preferencias para que UHome te muestre las viviendas que mejor encajan contigo."
      activeHref="/profile"
    >
      <ProfileView />
    </AppShell>
  );
}
