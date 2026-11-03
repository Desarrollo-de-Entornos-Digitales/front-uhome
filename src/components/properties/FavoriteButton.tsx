"use client";

import { HeartIcon } from "@/components/ui/icons";
import { cx } from "@/utils/classNames";

import styles from "./FavoriteButton.module.css";

export interface FavoriteButtonProps {
  propertyName: string;
  active: boolean;
  pending?: boolean;
  onToggle: () => void;
  className?: string;
}

export function FavoriteButton({
  propertyName,
  active,
  pending = false,
  onToggle,
  className,
}: FavoriteButtonProps) {
  return (
    <button
      type="button"
      className={cx(
        styles.button,
        active && styles.active,
        pending && styles.pending,
        className,
      )}
      onClick={onToggle}
      disabled={pending}
      aria-pressed={active}
      aria-busy={pending}
      aria-label={
        active
          ? `Quitar ${propertyName} de favoritos`
          : `Agregar ${propertyName} a favoritos`
      }
      title={active ? "Quitar de favoritos" : "Agregar a favoritos"}
    >
      <HeartIcon size={20} filled={active} />
    </button>
  );
}
