// The URL is typed by the user, so never trust it: ?page=abc, ?page=-1 and
// ?query=a&query=b must not break the page.

const MAX_PAGE = 100_000; // same limits as ProductQueryDto in the API
const MAX_QUERY_LENGTH = 100;

type Param = string | string[] | null | undefined;

const first = (value: Param) => (Array.isArray(value) ? value[0] : value) ?? "";

export function parsePage(value: Param): number {
  const page = Number(first(value));
  return Number.isInteger(page) && page >= 1 && page <= MAX_PAGE ? page : 1;
}

export function parseQuery(value: Param): string {
  return first(value).trim().slice(0, MAX_QUERY_LENGTH);
}

/** buildHref("/products", { query: "mouse", page: 2 }) -> /products?query=mouse&page=2 */
export function buildHref(
  path: string,
  { query, page }: { query?: string; page?: number },
): string {
  const params = new URLSearchParams();
  if (query) params.set("query", query);
  if (page && page > 1) params.set("page", String(page));
  return params.size > 0 ? `${path}?${params}` : path;
}
