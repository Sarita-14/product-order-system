// ─────────────────────────────────────────────────────────────────────────────
// FILE: src/proxy.ts — Runs BEFORE every page request (Next 16 "proxy", formerly middleware).
// A quick, optimistic check: no "token" cookie on a private page -> /login.
// The real checks still happen on the server (requireUser / requireAdmin) and in the API.
// ─────────────────────────────────────────────────────────────────────────────

// NextResponse = build the answer (continue or redirect). NextRequest = the incoming request.
import { NextResponse, type NextRequest } from 'next/server';
// Is this URL one of the private pages?
import { isPrivatePath } from '@/lib/routes';
// The cookie's name ('token').
import { TOKEN_COOKIE } from '@/lib/session';

// Next calls this for every request that matches `config.matcher` below.
export function proxy(request: NextRequest) {
  // pathname = "/checkout"; search = "?productId=abc"
  const { pathname, search } = request.nextUrl;
  // Public page, OR the visitor has a token cookie -> carry on normally.
  if (!isPrivatePath(pathname) || request.cookies.has(TOKEN_COOKIE)) {
    return NextResponse.next();
  }

  // Remember where they wanted to go: /login?from=/checkout?productId=...
  const login = new URL('/login', request.url);
  login.searchParams.set('from', pathname + search);
  // Send the browser to the login page.
  return NextResponse.redirect(login);
}

// Skip Next's own files (JS/CSS bundles, images, favicon)
// The pattern means: "every URL EXCEPT those starting with _next/static, _next/image or favicon.ico".
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
