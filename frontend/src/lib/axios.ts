// ─────────────────────────────────────────────────────────────────────────────
// FILE: lib/axios.ts — the ONLY HTTP client of the app (talks to the backend).
//
// CONCEPT — Axios: a library that sends HTTP requests (GET, POST...) and gives
//   back the answer. We configure it ONCE here; services use `http` below.
//
// CONCEPT — "interceptor": a function Axios runs automatically before every
//   request (to add the token) or after every answer (to tidy up errors).
// ─────────────────────────────────────────────────────────────────────────────

// axios = the library; AxiosError = the type of its errors; AxiosInstance = the type of a set-up copy.
import axios, { type AxiosError, type AxiosInstance } from 'axios';
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

// The kind of error JSON the backend sends (from its AllExceptionsFilter).
type ErrorBody = { message?: string; errors?: string[] };

// AFTER each response: turn any Axios error into our simple ApiError.
// Written once here and attached to BOTH instances below.
function toApiError(error: AxiosError<ErrorBody> | unknown) {
  // Not an HTTP error (e.g. Next.js' internal signal from cookies() while pre-rendering):
  // pass it on untouched so Next can handle it, instead of disguising it as "backend down".
  if (!axios.isAxiosError<ErrorBody>(error)) {
    return Promise.reject(error);
  }
  // The HTTP status (404, 400...), or 0 when the backend didn't answer at all.
  const status = error.response?.status ?? 0;
  // The error JSON the backend sent.
  const body = error.response?.data;
  // Best message available: the validation list, else the message, else "backend down".
  const message =
    body?.errors?.join(', ') ?? body?.message ?? 'Cannot reach the server. Is the backend running?';
  // Reject = the code that is waiting (await) gets this ApiError as its error.
  return Promise.reject(new ApiError(message, status));
}

// Makes one Axios "instance" (our own set-up copy of Axios) for the NestJS API.
// Both instances below share these settings, so they are written only once.
function createApi() {
  const instance = axios.create({
    // The start of every URL. Comes from API_URL in .env.local (if it is missing, use this address on your own computer).
    baseURL: process.env.API_URL ?? 'http://localhost:3000/api/v1',
    timeout: 10000, // give up after 10 seconds
    headers: { 'Content-Type': 'application/json' }, // we send JSON
  });
  // Success: pass the response through unchanged. Failure: toApiError.
  instance.interceptors.response.use((response) => response, toApiError);
  return instance;
}

// 1) The normal instance: sends the login token (for "my orders", admin pages, placing orders...).
const api = createApi();

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

// 2) The public instance: NEVER reads the cookie. For data that is the same for everyone
// (products). Because it doesn't touch cookies, its answers may be cached with
// 'use cache' (cached code is not allowed to read cookies; see services/product.service.ts).
const publicApi = createApi();

// NestJS wraps every success as { success, statusCode, data, timestamp }.
// These helpers unwrap it once here, so services just get `data` back:
//   http.get<Product[]>('/products')  ->  Product[]
// unwrap: from Axios' response, take .data (the envelope) then .data (the real content).
const unwrap = <T>(response: { data: ApiResponse<T> }) => response.data.data;

// The 4 kinds of request our services use, built for one instance. <T> = what `data` will contain.
// AxiosInstance = the type of what createApi() returns.
const methodsFor = (instance: AxiosInstance) => ({
  // GET  = read something
  get: <T>(url: string) => instance.get<ApiResponse<T>>(url).then(unwrap),
  // POST = create something; body = the JSON to send
  post: <T>(url: string, body?: unknown) => instance.post<ApiResponse<T>>(url, body).then(unwrap),
  // PATCH = change some fields of something
  patch: <T>(url: string, body?: unknown) => instance.patch<ApiResponse<T>>(url, body).then(unwrap),
  // DELETE = remove something
  delete: (url: string) => instance.delete(url).then(() => undefined), // 204: no body
});

// With the login token (most services).
export const http = methodsFor(api);
// Without it: public, cacheable reads only.
export const publicHttp = methodsFor(publicApi);
