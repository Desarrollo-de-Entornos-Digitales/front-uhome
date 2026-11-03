import { cx } from "@/utils/classNames";

import { StarIcon } from "./icons";
import styles from "./RatingStars.module.css";

export interface RatingStarsProps {
  /** Calificación entre 0 y `max`. Admite decimales. */
  value: number;
  max?: number;
  /** Número de reseñas que respaldan la calificación. */
  count?: number;
  size?: "sm" | "md";
  showValue?: boolean;
  className?: string;
}

const STAR_SIZE = {
  sm: 16,
  md: 20,
} as const;

function formatRating(value: number) {
  return value.toLocaleString("es-CO", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

export function RatingStars({
  value,
  max = 5,
  count,
  size = "md",
  showValue = true,
  className,
}: RatingStarsProps) {
  const safeValue = Math.min(Math.max(value, 0), max);
  const starSize = STAR_SIZE[size];
  const countLabel =
    count === undefined
      ? ""
      : ` (${count} ${count === 1 ? "reseña" : "reseñas"})`;

  return (
    <div
      className={cx(styles.rating, styles[size], className)}
      role="img"
      aria-label={`Calificación de ${formatRating(safeValue)} sobre ${max}${countLabel}`}
    >
      <span className={styles.stars} aria-hidden="true">
        {Array.from({ length: max }, (_, index) => {
          const fill = Math.min(Math.max(safeValue - index, 0), 1);

          return (
            <span
              key={index}
              className={styles.star}
              style={{ width: starSize, height: starSize }}
            >
              <StarIcon size={starSize} className={styles.empty} />
              <span className={styles.fill} style={{ width: `${fill * 100}%` }}>
                <StarIcon size={starSize} />
              </span>
            </span>
          );
        })}
      </span>

      {showValue ? (
        <span className={styles.value} aria-hidden="true">
          {formatRating(safeValue)}
        </span>
      ) : null}

      {count !== undefined ? (
        <span className={styles.count} aria-hidden="true">
          ({count})
        </span>
      ) : null}
    </div>
  );
}
