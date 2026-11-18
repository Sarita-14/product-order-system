import { ValueTransformer } from 'typeorm';

/**
 * Postgres returns NUMERIC columns as strings ("499.00").
 * This converts them to numbers so the API returns 499, not "499.00".
 */
export const decimalTransformer: ValueTransformer = {
  to: (value?: number | null) => value,
  from: (value?: string | null) => (value == null ? value : Number(value)),
};

/** Rounds to 2 decimals, avoiding float drift like 0.1 + 0.2 = 0.30000000000000004 */
export const toMoney = (value: number): number => Math.round(value * 100) / 100;