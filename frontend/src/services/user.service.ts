// ─────────────────────────────────────────────────────────────────────────────
// FILE: services/user.service.ts — user API calls (admin).
// ─────────────────────────────────────────────────────────────────────────────

// Our HTTP helper.
import { http } from '@/lib/axios';
// The User shape.
import type { Role, User } from '@/types/user';

// Admin only: every registered user, newest first
// GET /users -> list of users
export const getUsers = () => http.get<User[]>('/users');

// Admin only: make someone an admin, or a customer again (the backend refuses your own account)
// PATCH /users/<id>/role { role } -> the user with the new role
export const updateUserRole = (id: string, role: Role) => http.patch<User>(`/users/${id}/role`, { role });
