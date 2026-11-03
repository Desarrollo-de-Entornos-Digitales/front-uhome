import type { ReactNode } from "react";

import { appNavLinks } from "@/content/navigation";
import { Navbar } from "@/components/ui/Navbar";
import { UserMenu } from "@/components/ui/UserMenu";

import styles from "./AppShell.module.css";

export interface AppShellProps {
  eyebrow: string;
  title: string;
  /** Parte del título que se muestra con la tipografía de acento. */
  accent?: string;
  description?: string;
  activeHref?: string;
  children: ReactNode;
}

export function AppShell({
  eyebrow,
  title,
  accent,
  description,
  activeHref,
  children,
}: AppShellProps) {
  return (
    <div className={styles.shell}>
      <Navbar
        links={appNavLinks}
        account={<UserMenu />}
        activeHref={activeHref}
      />

      <main className={styles.main}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1 className={styles.title}>
            {title}
            {accent ? (
              <>
                {" "}
                <span className={styles.accent}>{accent}</span>
              </>
            ) : null}
          </h1>
          {description ? (
            <p className={styles.description}>{description}</p>
          ) : null}
        </header>

        {children}
      </main>
    </div>
  );
}
