import { ButtonLink } from "../components/ui/Button";
import { Footer } from "../components/ui/Footer";
import { AccountLink, Navbar } from "../components/ui/Navbar";
import {
  features,
  footer,
  hero,
  heroCards,
  navLinks,
  problem,
  steps,
  testimonials,
  vibe,
} from "../content/landing";
import type { Tone } from "../content/landing";
import styles from "./page.module.css";

const toneClass: Record<Tone, string> = {
  green: styles.toneGreen,
  blue: styles.toneBlue,
  orange: styles.toneOrange,
  lilac: styles.toneLilac,
  periwinkle: styles.tonePeriwinkle,
  tan: styles.toneTan,
  crimson: styles.toneCrimson,
  blueStrong: styles.toneBlueStrong,
  peach: styles.tonePeach,
  pink: styles.tonePink,
  purple: styles.tonePurple,
  sky: styles.toneSky,
};

export default function LandingPage() {
  return (
    <div className={styles.page}>
      <div className={styles.panel}>
        <Navbar
          links={navLinks}
          account={<AccountLink href="/login" label="Iniciar sesión" />}
        />

        <section className={styles.hero} aria-labelledby="hero-title">
          <div>
            <h1 id="hero-title" className={styles.heroTitle}>
              {hero.title} <span className={styles.accent}>{hero.accent}</span>
            </h1>
            <p className={styles.heroText}>{hero.text}</p>
            <div className={styles.heroActions}>
              <ButtonLink href="/properties" variant="accent" size="lg">
                {hero.primaryCta}
              </ButtonLink>
              <ButtonLink href="#como-funciona" variant="outline" size="lg">
                {hero.secondaryCta}
              </ButtonLink>
            </div>
          </div>

          <div className={styles.heroCards} aria-hidden="true">
            {heroCards.map((card) => (
              <div
                key={card.label}
                className={`${styles.heroCard} ${toneClass[card.tone]}`}
              >
                <p className={styles.heroCardLabel}>{card.label}</p>
                <p className={styles.heroCardValue}>
                  {card.value}{" "}
                  <span className={styles.heroCardUnit}>{card.unit}</span>
                </p>
                <p className={styles.heroCardNote}>{card.note}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="problem-title">
          <h2 id="problem-title" className={styles.sectionTitle}>
            {problem.title}
          </h2>
          <ul className={styles.grid3}>
            {problem.items.map((item) => (
              <li
                key={item.text}
                className={`${styles.problemCard} ${toneClass[item.tone]}`}
              >
                {item.text}
              </li>
            ))}
          </ul>
          <p className={styles.problemNote}>
            {problem.note} <strong>{problem.strong}</strong>
          </p>
        </section>

        <section
          id="funciones"
          className={styles.section}
          aria-labelledby="features-title"
        >
          <h2 id="features-title" className={styles.sectionTitle}>
            {features.title}
          </h2>
          <ul className={styles.grid4}>
            {features.items.map((item) => (
              <li key={item.title} className={styles.featureCard}>
                <h3 className={`${styles.featureHead} ${toneClass[item.tone]}`}>
                  {item.title}
                </h3>
                <p className={styles.featureBody}>{item.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section
          id="como-funciona"
          className={styles.section}
          aria-labelledby="steps-title"
        >
          <h2 id="steps-title" className={styles.sectionTitle}>
            {steps.title}
          </h2>
          <ol className={styles.steps}>
            {steps.items.map((item, index) => (
              <li key={item.text} className={styles.step}>
                <span
                  className={`${styles.stepNumber} ${toneClass[item.tone]}`}
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <span className={styles.stepLabel}>{item.text}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.vibe} aria-labelledby="vibe-title">
          <div>
            <h2 id="vibe-title" className={styles.sectionTitle}>
              {vibe.title}
            </h2>
            {vibe.paragraphs.map((paragraph) => (
              <p key={paragraph} className={styles.vibeText}>
                {paragraph}
              </p>
            ))}
          </div>
          <ul className={styles.tags}>
            {vibe.tags.map((tag) => (
              <li key={tag} className={styles.tag}>
                {tag}
              </li>
            ))}
          </ul>
        </section>

        <section
          id="opiniones"
          className={styles.section}
          aria-labelledby="quotes-title"
        >
          <h2 id="quotes-title" className={styles.sectionTitle}>
            {testimonials.title}
          </h2>
          <ul className={styles.quotes}>
            {testimonials.items.map((item) => (
              <li
                key={item.text}
                className={`${styles.quote} ${toneClass[item.tone]}`}
              >
                “{item.text}”
              </li>
            ))}
          </ul>
        </section>
      </div>

      <Footer
        tagline={footer.tagline}
        columns={footer.columns}
        contact={footer.contact}
        copyright={footer.copyright}
      />
    </div>
  );
}
