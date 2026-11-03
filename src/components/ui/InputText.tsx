import type { InputHTMLAttributes } from "react";
import styles from "./InputText.module.css";

export interface InputTextProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
}

export function InputText({
  label,
  error,
  id,
  className,
  ...props
}: InputTextProps) {
  const inputId = id ?? props.name;

  return (
    <div className={`${styles.field} ${className ?? ""}`}>
      {label ? (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      ) : null}

      <div
        className={`${styles.inputWrapper} ${
          error ? styles.hasError : ""
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
          className={styles.icon}
        >
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m4 7 8 6 8-6" />
        </svg>

        <input
          {...props}
          id={inputId}
          type="text"
          className={styles.input}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
        />
      </div>

      {error ? (
        <p id={`${inputId}-error`} className={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  );
}