// ─────────────────────────────────────────────────────────────────────────────
// FILE: current-user.decorator.ts — the @CurrentUser() helper.
//
// Usage in a controller:  me(@CurrentUser() user: JwtPayload)
// Gives you the logged-in user that JwtAuthGuard put on the request.
//
// CONCEPT — "param decorator": a decorator placed in front of a method
//   PARAMETER. Nest calls it before the method and passes its result in.
// ─────────────────────────────────────────────────────────────────────────────

// createParamDecorator = builds a decorator that fills in a method's input. ExecutionContext = info about the current call.
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// A request that has req.user (see authenticated-request.interface.ts).
import { AuthenticatedRequest } from '../interfaces/authenticated-request.interface';
// The shape of req.user.
import { JwtPayload } from '../interfaces/jwt-payload.interface';

// CurrentUser = our decorator. The arrow function runs on every call of a route that uses it.
export const CurrentUser = createParamDecorator(
  // _data = an optional argument we don't use (the "_" says "unused on purpose").
  // ctx = the current call. The function returns the token's content (who is logged in).
  (_data: unknown, ctx: ExecutionContext): JwtPayload =>
    // switchToHttp().getRequest() = get the Express request; .user = what JwtAuthGuard stored.
    ctx.switchToHttp().getRequest<AuthenticatedRequest>().user,
);
