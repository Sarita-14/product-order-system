// ─────────────────────────────────────────────────────────────────────────────
// FILE: types/user.ts — what a user looks like in the frontend.
// DATA COMES FROM: GET /auth/me, POST /auth/login, GET /users (backend).
// (What an interface is: a description of an object's shape; see types/api.ts.)
// ─────────────────────────────────────────────────────────────────────────────

// The two roles; same values as the backend Role enum.
// "type Role = 'customer' | 'admin'" = Role can only be one of these two texts.
export type Role = 'customer' | 'admin';

// A user as the NestJS API sends it (the password is never included).
export interface User {
  id: string; // unique id: a long random code like 4f1c2b8d-...
  username: string;
  email: string;
  phoneNumber: string;
  role: Role; // decides if the "Admin" link and /admin pages are available
  createdAt: string; // date as text, e.g. "2026-11-26T07:30:00.000Z"
}

// What POST /auth/login returns inside `data`
export interface LoginResponse {
  accessToken: string; // the login token (we store it in a cookie)
  user: User; // who logged in
}

// What the register form sends to POST /auth/register (role is never sent)
// Pick<User, 'a' | 'b'> = "only fields a and b of User". "& { password }" = plus a password.
export type RegisterInput = Pick<User, 'username' | 'email' | 'phoneNumber'> & { password: string };
