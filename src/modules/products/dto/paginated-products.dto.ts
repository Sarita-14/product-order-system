import { Product } from '../entities/product.entity';

export class PaginationMetaDto {
  /** Current page @example 1 */
  page: number;

  /** Products per page @example 10 */
  limit: number;

  /** Products matching the search, across all pages @example 95 */
  total: number;

  /** Number of pages (0 when nothing matches) @example 10 */
  totalPages: number;

  /** Is there a page after this one? @example true */
  hasNextPage: boolean;

  /** Is there a page before this one? @example false */
  hasPreviousPage: boolean;
}

/** One page of products plus the numbers needed to draw the pagination. */
export class PaginatedProductsDto {
  items: Product[];
  meta: PaginationMetaDto;
}
