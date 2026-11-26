// ─────────────────────────────────────────────────────────────────────────────
// FILE: public.decorator.ts — the @Public() label.
//
// The JWT guard runs on EVERY route (registered globally in AuthModule).
// Put @Public() on a route (or a whole controller) to let it through without a token.
//
// CONCEPT — "metadata": a hidden sticky note attached to a route. @Public()
//   sticks the note "isPublic = true"; JwtAuthGuard later reads the note.
// ─────────────────────────────────────────────────────────────────────────────

// SetMetadata = Nest helper that creates a decorator which attaches a sticky note.
import { SetMetadata } from '@nestjs/common';

// The name of the sticky note. Exported so JwtAuthGuard reads the SAME name.
export const IS_PUBLIC_KEY = 'isPublic';
// Public() returns a decorator that writes "isPublic = true" on the route.
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
