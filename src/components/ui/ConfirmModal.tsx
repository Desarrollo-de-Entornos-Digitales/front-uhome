"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

import styles from "./ConfirmModal.module.css";

export interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onCancel();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onCancel]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div className={styles.overlay} onClick={onCancel}>
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-description"
        className={styles.dialog}
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="confirm-modal-title" className={styles.title}>
          {title}
        </h2>

        <p id="confirm-modal-description" className={styles.description}>
          {description}
        </p>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancel}
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            className={styles.confirm}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </section>
    </div>,
    document.body,
  );
}
