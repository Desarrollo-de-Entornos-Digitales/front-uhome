import type { ReactNode } from "react";

import { cx } from "@/utils/classNames";

import styles from "./EmptyState.module.css";

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  /** "error" lo anuncia como alerta a los lectores de pantalla. */
  tone?: "neutral" | "error";
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  tone = "neutral",
}: EmptyStateProps) {
  return (
    <div
      className={cx(styles.empty, tone === "error" && styles.error)}
      role={tone === "error" ? "alert" : "status"}
    >
      {icon ? (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <h3 className={styles.title}>{title}</h3>
      {description ? <p className={styles.description}>{description}</p> : null}
      {action ? <div className={styles.action}>{action}</div> : null}
    </div>
  );
}
