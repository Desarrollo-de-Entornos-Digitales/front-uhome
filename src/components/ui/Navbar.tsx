import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./Navbar.module.css";

export interface NavbarLink {
  label: string;
  href: string;
}

export interface NavbarProps {
  links?: NavbarLink[];
  account?: ReactNode;
  logoHref?: string;
}

export function Navbar({ links = [], account, logoHref = "/" }: NavbarProps) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link
          href={logoHref}
          className={styles.logo}
          aria-label="UHome, ir al inicio"
        >
          <Image
            src="/images/uhome-logo.svg"
            alt="UHome"
            width={104}
            height={36}
            priority
            unoptimized
          />
        </Link>

        <nav className={styles.nav} aria-label="Principal">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={styles.link}>
              {link.label}
            </Link>
          ))}
        </nav>

        {account ? <div className={styles.account}>{account}</div> : null}
      </div>
    </header>
  );
}

export interface AccountLinkProps {
  href: string;
  label: string;
}

export function AccountLink({ href, label }: AccountLinkProps) {
  return (
    <Link href={href} className={styles.accountLink} aria-label={label}>
      <svg
        viewBox="0 0 24 24"
        width="36"
        height="36"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="10" r="3.2" />
        <path
          d="M5.8 18.6c1.6-2.6 3.7-3.8 6.2-3.8s4.6 1.2 6.2 3.8"
          strokeLinecap="round"
        />
      </svg>
    </Link>
  );
}
