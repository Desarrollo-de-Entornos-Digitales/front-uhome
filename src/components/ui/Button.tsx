import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "accent" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

interface SharedProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: ReactNode;
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  SharedProps & {
    loading?: boolean;
  };

export type ButtonLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
> &
  SharedProps & {
    href: string;
  };

interface ClassOptions {
  variant: ButtonVariant;
  size: ButtonSize;
  fullWidth: boolean;
  loading: boolean;
  extra?: string;
}

function buildClassName({
  variant,
  size,
  fullWidth,
  loading,
  extra,
}: ClassOptions) {
  return [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : "",
    loading ? styles.loading : "",
    extra ?? "",
  ]
    .filter(Boolean)
    .join(" ");
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  disabled,
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buildClassName({
        variant,
        size,
        fullWidth,
        loading,
        extra: className,
      })}
      disabled={disabled || loading}
      aria-busy={loading}
      {...rest}
    >
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      <span className={styles.label}>{children}</span>
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  children,
  href,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={buildClassName({
        variant,
        size,
        fullWidth,
        loading: false,
        extra: className,
      })}
      {...rest}
    >
      <span className={styles.label}>{children}</span>
    </Link>
  );
}
