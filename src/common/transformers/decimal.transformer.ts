import { ValueTransformer } from 'typeorm';

export const decimalTransformer: ValueTransformer = {
  to: (value?: number | null) => value,
  from: (value?: string | null) => (value == null ? value : Number(value)),
};

export const toMoney = (value: number): number => Math.round(value * 100) / 100;