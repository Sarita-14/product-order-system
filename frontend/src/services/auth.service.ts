// ─────────────────────────────────────────────────────────────────────────────
// FILE: services/auth.service.ts — all auth API calls live here.
//
// CONCEPT — "service" (frontend): the ONLY files that know backend URLs.
//   Pages and actions call these functions and never write URLs themselves.
// ─────────────────────────────────────────────────────────────────────────────

// Our HTTP helper (adds the token, unwraps `data`, turns errors into ApiError).
import { http } from '@/lib/axios';
// The shapes we send and receive.
import type { LoginResponse, RegisterInput, User } from '@/types/user';

// POST /auth/login  ->  { accessToken, user }
export const loginUser = (email: string, password: string) =>
  http.post<LoginResponse>('/auth/login', { email, password });

// POST /auth/register  ->  the new user (always a customer)
export const registerUser = (input: RegisterInput) => http.post<User>('/auth/register', input);

// GET /auth/me  ->  the logged-in user, including role (needs the token; Axios adds it)
export const getMe = () => http.get<User>('/auth/me');
