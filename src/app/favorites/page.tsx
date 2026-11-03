import type { Metadata } from "next";

import { AppShell } from "@/components/layout/AppShell";
import { FavoritesView } from "@/components/properties/FavoritesView";

export const metadata: Metadata = {
  title: "Favoritos | UHome",
};

export default function FavoritesPage() {
  return (
    <AppShell
      eyebrow="Tu selección"
      title="Mis"
      accent="favoritos."
      description="Las propiedades que guardaste quedan asociadas a tu cuenta para que las compares cuando quieras."
      activeHref="/favorites"
    >
      <FavoritesView />
    </AppShell>
  );
}
