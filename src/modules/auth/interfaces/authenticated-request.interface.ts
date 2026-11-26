// ─────────────────────────────────────────────────────────────────────────────
// FILE: authenticated-request.interface.ts
// An Express request after JwtAuthGuard ran: the token's content is stored in req.user.
// Defined ONCE here and used by both guards and @CurrentUser() (no repeating).
//
// CONCEPT — "Express request": the object holding everything about one incoming
//   HTTP call (URL, headers, body...). NestJS runs on top of Express.
// ─────────────────────────────────────────────────────────────────────────────

// The normal Express request type.
import { Request } from 'express';
// The shape of the token content (sub, email, username, role).
import { JwtPayload } from './jwt-payload.interface';

// "type X = A & B" means "an object that is A AND also has B".
// So: a normal request that ALSO has a "user" field holding the token's content.
export type AuthenticatedRequest = Request & { user: JwtPayload };
