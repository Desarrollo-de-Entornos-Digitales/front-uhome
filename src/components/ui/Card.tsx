import type { HTMLAttributes, ReactNode } from "react";

import { cx } from "@/utils/classNames";

import styles from "./Card.module.css";

type CardElement = "article" | "div" | "section" | "li";

export interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: CardElement;
  /** Activa el efecto de elevación al pasar el cursor. */
  interactive?: boolean;
  children: ReactNode;
}

export interface CardSectionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({
  as: Component = "article",
  interactive = false,
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <Component
      className={cx(styles.card, interactive && styles.interactive, className)}
      {...rest}
    >
      {children}
    </Component>
  );
}

export function CardHeader({ className, children, ...rest }: CardSectionProps) {
  return (
    <div className={cx(styles.header, className)} {...rest}>
      {children}
    </div>
  );
}

export function CardBody({ className, children, ...rest }: CardSectionProps) {
  return (
    <div className={cx(styles.body, className)} {...rest}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...rest }: CardSectionProps) {
  return (
    <div className={cx(styles.footer, className)} {...rest}>
      {children}
    </div>
  );
}
