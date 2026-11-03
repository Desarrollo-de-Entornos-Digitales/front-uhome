import type { ReactNode } from "react";

import { ProtectedRoute } from "../../components/auth/ProtectedRoute";

export default function FavoritesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}
