// ─────────────────────────────────────────────────────────────────────────────
// FILE: roles.guard.ts — checks the user's ROLE (customer/admin).
// (What a guard is: see jwt-auth.guard.ts.)
//
// Runs AFTER JwtAuthGuard (both are APP_GUARDs in AuthModule, in that order),
// so req.user is already filled in from the token.
// 1. route has no @Roles(...)        -> let it through
// 2. user's role is in the list     -> let it through
// 3. otherwise                       -> 403 Forbidden
//
// 401 vs 403: 401 = "we don't know who you are"; 403 = "we know you, but you may not do this".
// ─────────────────────────────────────────────────────────────────────────────

// CanActivate = guard shape; ExecutionContext = this call; ForbiddenException = a 403 error.
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
// Reflector = reads the sticky notes left by @Roles().
import { Reflector } from '@nestjs/core';
// The list of roles (for the type).
import { Role } from '../../users/enums/role.enum';
// The name of the @Roles() sticky note.
import { ROLES_KEY } from '../decorators/roles.decorator';
// A request that has req.user.
import { AuthenticatedRequest } from '../interfaces/authenticated-request.interface';

@Injectable() // Nest may create it for us and hand it the Reflector
export class RolesGuard implements CanActivate {
  // Ask Nest for the Reflector.
  constructor(private readonly reflector: Reflector) {}

  // Called for every request. Returns true to let it in, or stops the request with a 403 error.
  canActivate(context: ExecutionContext): boolean {
    // Read the @Roles list from the method, or else from the controller class.
    // It is an array like ['admin'], or undefined when the route has no @Roles.
    const roles = this.reflector.getAllAndOverride<Role[] | undefined>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    // "!roles?.length" = no list, or an empty list -> nothing to check, let it in.
    if (!roles?.length) return true;

    // Take "user" out of the request (JwtAuthGuard put it there from the token).
    const { user } = context.switchToHttp().getRequest<AuthenticatedRequest>();
    // Is the user's role one of the allowed roles? If not -> 403.
    if (!roles.includes(user?.role)) {
      throw new ForbiddenException('You are not allowed to do this');
    }
    // Allowed.
    return true;
  }
}
