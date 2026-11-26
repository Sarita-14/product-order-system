import Link from "next/link";
import { getPageItems } from "@/lib/pagination";

interface PaginationProps {
  page: number;
  totalPages: number;
  /** Server-side pagination: every page is a link. */
  hrefFor?: (page: number) => string;
  /** Client-side pagination: every page is a button. */
  onPageChange?: (page: number) => void;
}

const base =
  "flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm";
const styles = {
  normal: `${base} border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800`,
  current: `${base} border-blue-600 bg-blue-600 font-semibold text-white`,
  disabled: `${base} border-zinc-200 text-zinc-400 dark:border-zinc-800 dark:text-zinc-600`,
};

/** ‹ Prev  1 … 4 [5] 6 … 10  Next › */
export function Pagination({
  page,
  totalPages,
  hrefFor,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const renderItem = (target: number, label: string, ariaLabel: string) => {
    if (target === page) {
      return (
        <span aria-current="page" aria-label={ariaLabel} className={styles.current}>
          {label}
        </span>
      );
    }
    if (target < 1 || target > totalPages) {
      return (
        <span aria-disabled="true" className={styles.disabled}>
          {label}
        </span>
      );
    }
    return hrefFor ? (
      <Link href={hrefFor(target)} aria-label={ariaLabel} className={styles.normal}>
        {label}
      </Link>
    ) : (
      <button
        type="button"
        onClick={() => onPageChange?.(target)}
        aria-label={ariaLabel}
        className={`${styles.normal} cursor-pointer`}
      >
        {label}
      </button>
    );
  };

  return (
    <nav aria-label="Pagination" className="mt-6">
      <ul className="flex flex-wrap items-center justify-center gap-2">
        <li>{renderItem(page - 1, "‹ Prev", "Previous page")}</li>
        {getPageItems(page, totalPages).map((item) => (
          <li key={item}>
            {typeof item === "number" ? (
              renderItem(item, String(item), `Page ${item}`)
            ) : (
              <span aria-hidden="true" className="px-1 text-zinc-500">
                …
              </span>
            )}
          </li>
        ))}
        <li>{renderItem(page + 1, "Next ›", "Next page")}</li>
      </ul>
    </nav>
  );
}
