import { Suspense } from "react";
import type { Metadata } from "next";

import Spinner from "@/components/Spinner";
import { AppShell } from "@/components/layout/AppShell";
import { PropertiesFeed } from "@/components/properties/PropertiesFeed";

export const metadata: Metadata = {
  title: "Propiedades | UHome",
};

export default function PropertiesPage() {
  return (
    <AppShell
      eyebrow="Encuentra tu próximo hogar"
      title="Viviendas cerca de tu"
      accent="campus."
      description="Busca, filtra y compara opciones de vivienda. Guarda en favoritos las que más te gusten para revisarlas después."
      activeHref="/properties"
    >
      {/* useSearchParams requiere un límite de Suspense en build. */}
      <Suspense fallback={<Spinner message="Cargando propiedades..." />}>
        <PropertiesFeed />
      </Suspense>
    </AppShell>
  );
}
