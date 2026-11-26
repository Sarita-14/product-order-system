// ─────────────────────────────────────────────────────────────────────────────
// FILE: jwt-auth.guard.ts — checks the login token on every request.
//
// CONCEPT — "guard": a gatekeeper Nest runs BEFORE a controller method.
//   It returns true (let the request in) or throws an error (stop it).
//
// Runs before every controller method (registered as APP_GUARD in AuthModule).
// 1. @Public() route?            -> let it through
// 2. no "Authorization: Bearer <token>" header -> 401
// 3. token bad / expired         -> 401
// 4. token ok                    -> put the token's content on req.user and continue
// ─────────────────────────────────────────────────────────────────────────────

// CanActivate = the shape of a guard. ExecutionContext = info about this call.
// Injectable = Nest may create this class for us and hand it out. UnauthorizedException = a 401 error.
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
// Reflector = reads the sticky notes (metadata) put by decorators like @Public().
import { Reflector } from '@nestjs/core';
// JwtService = checks and creates tokens using JWT_SECRET from .env.
import { JwtService } from '@nestjs/jwt';
// The name of the @Public() sticky note.
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
// A request that has req.user.
import { AuthenticatedRequest } from '../interfaces/authenticated-request.interface';
// The shape of the token content.
import { JwtPayload } from '../interfaces/jwt-payload.interface';

// @Injectable() = Nest can create this guard and give it what the constructor asks for.
@Injectable()
export class JwtAuthGuard implements CanActivate {
  // Nest hands us the two helpers we need (we never create them ourselves).
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  // canActivate = Nest calls this for every request. "async" because checking the token takes a moment.
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Look for the "isPublic" sticky note, first on the method, then on the controller class.
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(), // the method
      context.getClass(), // the controller
    ]);
    // Public route -> no token needed, let it in.
    if (isPublic) return true;

    // Get the Express request of this call.
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    // Read the token from the "Authorization" header (helper method below).
    const token = this.extractToken(request);
    // No token at all -> answer 401.
    if (!token) throw new UnauthorizedException('Missing access token');

    // try { ... } catch { ... } = "try this; if it throws an error, run the catch part instead".
    try {
      // checks the token's secret stamp (made with JWT_SECRET) and that it hasn't expired
      // If fine, it returns the token's content; we store it on the request for later (req.user).
      request.user = await this.jwtService.verifyAsync<JwtPayload>(token);
    } catch {
      // Fake, changed or expired token -> 401.
      throw new UnauthorizedException('Invalid or expired access token');
    }
    // Everything ok -> let the request continue (next: RolesGuard, then the controller).
    return true;
  }

  // "private" = only this class uses it. Pulls the token out of "Authorization: Bearer <token>".
  private extractToken(request: AuthenticatedRequest): string | undefined {
    // split(' ') turns "Bearer abc" into ["Bearer", "abc"]; [type, token] takes the two parts.
    // "?." = if there's no header, don't crash, give undefined; "?? []" = then use an empty list.
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    // Only accept the "Bearer" kind; otherwise there is no token.
    return type === 'Bearer' ? token : undefined;
  }
}
