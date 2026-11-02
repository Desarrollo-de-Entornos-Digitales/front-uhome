import Image from "next/image";
import Link from "next/link";
import styles from "./Footer.module.css";

export interface FooterLink {
  label: string;
  href?: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface FooterContact {
  email: string;
  phone: string;
  address: string;
}

export interface FooterProps {
  tagline: string;
  columns: FooterColumn[];
  contact: FooterContact;
  contactTitle?: string;
  copyright: string;
}

export function Footer({
  tagline,
  columns,
  contact,
  contactTitle = "Contacto",
  copyright,
}: FooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Image
            src="/images/uhome-logo.svg"
            alt="UHome"
            width={220}
            height={76}
            unoptimized
          />
          <p className={styles.tagline}>{tagline}</p>
        </div>

        {columns.map((column) => (
          <nav
            key={column.title}
            className={styles.column}
            aria-label={column.title}
          >
            <h2 className={styles.columnTitle}>{column.title}</h2>
            <ul className={styles.list}>
              {column.links.map((link) => (
                <li key={link.label}>
                  {link.href ? (
                    <Link href={link.href} className={styles.link}>
                      {link.label}
                    </Link>
                  ) : (
                    <span className={styles.muted}>{link.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className={styles.column}>
          <h2 className={styles.columnTitle}>{contactTitle}</h2>
          <ul className={styles.list}>
            <li>
              <a href={`mailto:${contact.email}`} className={styles.link}>
                {contact.email}
              </a>
            </li>
            <li className={styles.muted}>{contact.phone}</li>
            <li className={styles.muted}>{contact.address}</li>
          </ul>
        </div>
      </div>

      <p className={styles.copyright}>{copyright}</p>
    </footer>
  );
}
