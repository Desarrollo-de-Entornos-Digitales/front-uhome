import { cx } from "@/utils/classNames";

import { ChevronLeftIcon, ChevronRightIcon } from "./icons";
import styles from "./Pagination.module.css";

export interface PaginationProps {
  /** Página actual, empezando en 1. */
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Páginas visibles a cada lado de la actual antes de abreviar. */
  siblingCount?: number;
  label?: string;
  className?: string;
}

type PageItem = number | "start-ellipsis" | "end-ellipsis";

export function getPageItems(
  currentPage: number,
  totalPages: number,
  siblingCount = 1,
): PageItem[] {
  // Primera, última, actual, hermanos y dos posibles elipsis.
  const maxVisible = siblingCount * 2 + 5;

  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const start = Math.max(currentPage - siblingCount, 2);
  const end = Math.min(currentPage + siblingCount, totalPages - 1);
  const items: PageItem[] = [1];

  if (start > 2) {
    items.push("start-ellipsis");
  }

  for (let page = start; page <= end; page += 1) {
    items.push(page);
  }

  if (end < totalPages - 1) {
    items.push("end-ellipsis");
  }

  items.push(totalPages);

  return items;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  label = "Paginación",
  className,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const items = getPageItems(currentPage, totalPages, siblingCount);
  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;

  return (
    <nav className={cx(styles.pagination, className)} aria-label={label}>
      <button
        type="button"
        className={cx(styles.control, styles.step)}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isFirst}
        aria-label="Página anterior"
      >
        <ChevronLeftIcon size={18} />
        <span className={styles.stepLabel}>Anterior</span>
      </button>

      <ul className={styles.pages}>
        {items.map((item) =>
          typeof item === "number" ? (
            <li key={item}>
              <button
                type="button"
                className={cx(
                  styles.control,
                  styles.page,
                  item === currentPage && styles.current,
                )}
                onClick={() => onPageChange(item)}
                aria-current={item === currentPage ? "page" : undefined}
                aria-label={`Página ${item}`}
              >
                {item}
              </button>
            </li>
          ) : (
            <li key={item} className={styles.ellipsis} aria-hidden="true">
              …
            </li>
          ),
        )}
      </ul>

      <p className={styles.status} aria-live="polite">
        Página {currentPage} de {totalPages}
      </p>

      <button
        type="button"
        className={cx(styles.control, styles.step)}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLast}
        aria-label="Página siguiente"
      >
        <span className={styles.stepLabel}>Siguiente</span>
        <ChevronRightIcon size={18} />
      </button>
    </nav>
  );
}
