// ─────────────────────────────────────────────────────────────────────────────
// FILE: services/user.service.ts — user API calls (admin).
// ─────────────────────────────────────────────────────────────────────────────

// Our HTTP helper.
import { http } from '@/lib/axios';
// The User shape.
import type { User } from '@/types/user';

// Admin only: every registered user, newest first
// GET /users -> list of users
export const getUsers = () => http.get<User[]>('/users');
