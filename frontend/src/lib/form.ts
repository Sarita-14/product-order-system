import { ApiError } from './axios';

export type FormState = { error?: string; success?: string; values?: Record<string, string> } | undefined;
export type FormAction = (state: FormState, formData: FormData) => Promise<FormState>;
export const QTY_PREFIX = 'qty-';
export type QuantityInput = { productId: string; quantity: number };
export function readQuantities(formData: FormData, keepZero = false): QuantityInput[] {
  // [...formData.entries()] = every field as a [name, value] pair.
  return [...formData.entries()]
    .filter(([name]) => name.startsWith(QTY_PREFIX))
    .map(([name, value]) => ({ productId: name.slice(QTY_PREFIX.length), quantity: Number(value) }))
    .filter(({ quantity }) => Number.isInteger(quantity) && (quantity > 0 || (keepZero && quantity === 0)));
}

export const text = (formData: FormData, name: string) => String(formData.get(name) ?? '').trim();

export type AttemptResult<T> = { ok: true; data: T } | { ok: false; state: FormState };

export async function attempt<T>(
  work: () => Promise<T>, // the API call to make
  fallback: string, // message to show if the error has no clear message
  values?: Record<string, string>, // what the user typed (to refill the form)
): Promise<AttemptResult<T>> {
  try {
    return { ok: true, data: await work() };
  } catch (error) {
    const message = error instanceof ApiError ? error.message : fallback;
    return { ok: false, state: { error: message, values } };
  }
}
