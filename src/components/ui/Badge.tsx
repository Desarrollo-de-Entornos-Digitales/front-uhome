import type { ReactNode } from "react";

import { cx } from "@/utils/classNames";

import styles from "./Badge.module.css";

export type BadgeTone =
  | "neutral"
  | "price"
  | "type"
  | "distance"
  | "lifestyle"
  | "success"
  | "muted";

export interface BadgeProps {
  tone?: BadgeTone;
  size?: "sm" | "md";
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function Badge({
  tone = "neutral",
  size = "md",
  icon,
  className,
  children,
}: BadgeProps) {
  return (
    <span className={cx(styles.badge, styles[tone], styles[size], className)}>
      {icon ? (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      ) : null}
      {children}
    </span>
  );
}
