// ─────────────────────────────────────────────────────────────────────────────
// FILE: jwt-payload.interface.ts — what is written INSIDE the login token.
//
// CONCEPT — "JWT" (JSON Web Token): after login the backend gives the browser
//   a long signed text (the token). It contains a small JSON object, the
//   "payload". Because it is SIGNED with our secret (JWT_SECRET), nobody can
//   change it without us noticing. On every request the token comes back,
//   and we read the payload to know WHO is calling, without asking the database.
//
// CONCEPT — "interface": describes the SHAPE of an object (which fields, which
//   types). It produces no code; it only lets TypeScript check our work.
//
// FILLED IN BY: login.usecase.ts.  READ BY: jwt-auth.guard.ts, roles.guard.ts, @CurrentUser().
// ─────────────────────────────────────────────────────────────────────────────

// The list of roles, so "role" below can only be 'customer' or 'admin'.
import { Role } from '../../users/enums/role.enum';

// "export interface JwtPayload" = the shape of the token's content.
export interface JwtPayload {
  // sub ("subject") is the standard JWT field for "who this token belongs to".
  sub: string; // user id
  email: string; // the user's email
  username: string; // the user's username
  role: Role; // read by RolesGuard on every request (no DB lookup needed)
}
