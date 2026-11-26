// ─────────────────────────────────────────────────────────────────────────────
// FILE: lib/axios.ts — the ONLY HTTP client of the app (talks to the backend).
//
// CONCEPT — Axios: a library that sends HTTP requests (GET, POST...) and gives
//   back the answer. We configure it ONCE here; services use `http` below.
//
// CONCEPT — "interceptor": a function Axios runs automatically before every
//   request (to add the token) or after every answer (to tidy up errors).
// ─────────────────────────────────────────────────────────────────────────────

// axios = the library; AxiosError = the type of its errors.
import axios, { type AxiosError } from 'axios';
// The envelope shape { success, statusCode, data, timestamp }.
import type { ApiResponse } from '@/types/api';
// Reads the login token from the cookie.
import { getToken } from './session';

// Our own error type: every failed API call becomes ApiError(message, status),
// so the rest of the app handles errors in ONE way.
// "extends Error" = it is a normal error, plus a `status` number.
export class ApiError extends Error {
  constructor(
    message: string, // the human-readable reason
    public status: number, // 0 = backend not reachable
  ) {
    // pass the message to the normal Error
    super(message);
  }
}

// One Axios "instance" (our own set-up copy of Axios) for the NestJS API. Every request uses these settings.
const api = axios.create({
  // The start of every URL. Comes from API_URL in .env.local (if it is missing, use this address on your own computer).
  baseURL: process.env.API_URL ?? 'http://localhost:3000/api/v1',
  timeout: 10000, // give up after 10 seconds
  headers: { 'Content-Type': 'application/json' }, // we send JSON
});

// BEFORE each request: attach the JWT from the httpOnly cookie (if logged in)
api.interceptors.request.use(async (config) => {
  // Read the token from the cookie (undefined for visitors).
  const token = await getToken();
  if (token) {
    // The backend's JwtAuthGuard reads this header.
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Hand the (changed) request settings back to Axios.
  return config;
});

// AFTER each response: turn any Axios error into our simple ApiError
api.interceptors.response.use(
  // Success: pass the response through unchanged.
  (response) => response,
  // Failure: build an ApiError.
  (error: AxiosError<{ message?: string; errors?: string[] }>) => {
    // The HTTP status (404, 400...), or 0 when the backend didn't answer at all.
    const status = error.response?.status ?? 0;
    // The error JSON the backend sent (from its AllExceptionsFilter).
    const body = error.response?.data;
    // Best message available: the validation list, else the message, else "backend down".
    const message =
      body?.errors?.join(', ') ?? body?.message ?? 'Cannot reach the server. Is the backend running?';
    // Reject = the code that is waiting (await) gets this ApiError as its error.
    return Promise.reject(new ApiError(message, status));
  },
);

// NestJS wraps every success as { success, statusCode, data, timestamp }.
// These helpers unwrap it once here, so services just get `data` back:
//   http.get<Product[]>('/products')  ->  Product[]
// unwrap: from Axios' response, take .data (the envelope) then .data (the real content).
const unwrap = <T>(response: { data: ApiResponse<T> }) => response.data.data;

// The 4 kinds of request our services use. <T> = what `data` will contain.
export const http = {
  // GET  = read something
  get: <T>(url: string) => api.get<ApiResponse<T>>(url).then(unwrap),
  // POST = create something; body = the JSON to send
  post: <T>(url: string, body?: unknown) => api.post<ApiResponse<T>>(url, body).then(unwrap),
  // PATCH = change some fields of something
  patch: <T>(url: string, body?: unknown) => api.patch<ApiResponse<T>>(url, body).then(unwrap),
  // DELETE = remove something
  delete: (url: string) => api.delete(url).then(() => undefined), // 204: no body
};
