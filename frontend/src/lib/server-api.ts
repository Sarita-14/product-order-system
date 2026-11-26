// Server-side API client: the one place that calls the NestJS backend with the token.
// Backend shapes (see src/common in the backend):
//   success -> { success: true,  statusCode, data, timestamp }
//   error   -> { success: false, statusCode, message, errors?, path, timestamp }
// apiFetch() returns `data` on success and throws ApiError on failure.
import { redirect } from 'next/navigation';
import { getToken } from './session';

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

export async function apiFetch<T>(
  path: string,
  init: { method?: string; body?: unknown } = {},
): Promise<T> {
  const token = await getToken();

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method: init.method ?? 'GET',
      headers: {
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: init.body ? JSON.stringify(init.body) : undefined,
      cache: 'no-store', // data depends on who is logged in
    });
  } catch {
    throw new ApiError('Cannot reach the server. Is the backend running?', 0);
  }

  // Token missing/expired on a protected route -> back to login.
  // (Login itself also returns 401 for a wrong password, so skip it there.)
  if (response.status === 401 && token && !path.startsWith('/auth/login')) {
    redirect('/login?expired=1');
  }
  if (response.status === 204) return null as T;

  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload?.success) {
    const message = payload?.errors?.join(', ') ?? payload?.message;
    throw new ApiError(message ?? `Request failed (${response.status})`, response.status);
  }
  return payload.data as T;
}