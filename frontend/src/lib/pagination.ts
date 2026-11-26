export type PageItem = number | "dots-left" | "dots-right";

/**
 * Which buttons to draw: first page, last page, the current page and its
 * neighbours. Everything skipped becomes "…".
 *
 * getPageItems(1, 10) -> 1 2 … 10
 * getPageItems(5, 10) -> 1 … 4 5 6 … 10
 */
export function getPageItems(current: number, total: number): PageItem[] {
  const items: PageItem[] = [];
  let previous = 0;

  for (let page = 1; page <= total; page++) {
    const isEdge = page === 1 || page === total;
    if (!isEdge && Math.abs(page - current) > 1) continue;

    const gap = page - previous - 1;
    if (gap === 1) items.push(page - 1); // dots hiding a single page are pointless
    if (gap > 1) items.push(page <= current ? "dots-left" : "dots-right");

    items.push(page);
    previous = page;
  }
  return items;
}
