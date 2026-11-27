// ─────────────────────────────────────────────────────────────────────────────
// FILE: components/layout/auth-buttons.tsx — right side of the header.
// Visitors:  Login / Register.
// Customers: Cart (n), My orders, their name, Sign out.
// Admins:    Admin dashboard, their name with an "Admin" badge, Sign out (no cart: admins don't shop).
// DATA COMES FROM: getCurrentUser() (cookie + GET /auth/me) — a "container" component.
// ─────────────────────────────────────────────────────────────────────────────

// Link to another page of our site.
import Link from 'next/link';
// The Server Action that deletes the cookie.
import { logout } from '@/actions/auth.actions';
// Button looks + the header's link style.
import { buttonClass, navLinkClass } from '@/components/ui/styles';
// Who is logged in (or null).
import { getCurrentUser } from '@/lib/auth';
// Admin URLs.
import { ADMIN_PATHS } from '@/lib/routes';
// "Cart (3)".
import { CartLink } from './cart-link';

// "async" = it waits for data (a Server Component).
export async function AuthButtons() {
  // null for visitors, the user object when logged in.
  const user = await getCurrentUser();

  // Visitor -> Login and Register buttons.
  if (!user) {
    return (
      <nav className="flex items-center gap-2">
        <Link href="/login" className={buttonClass.ghost}>
          Login
        </Link>
        <Link href="/register" className={buttonClass.primary}>
          Register
        </Link>
      </nav>
    );
  }

  // Logged in -> links, avatar letter, name, Sign out.
  return (
    <div className="flex items-center gap-3">
      <nav className="flex items-center gap-3">
        {/* The role comes from the server-side /auth/me call; the browser never stores it */}
        {user.role === 'admin' ? (
          <Link href={ADMIN_PATHS.dashboard} className={navLinkClass}>
            Admin dashboard
          </Link>
        ) : (
          <>
            <CartLink className={navLinkClass} />
            <Link href="/dashboard" className={navLinkClass}>
              My orders
            </Link>
          </>
        )}
      </nav>
      <span className="flex items-center gap-2 font-medium text-slate-700">
        {/* A round badge with the first letter of the username */}
        <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-100 text-sm font-bold uppercase text-brand-700">
          {user.username.charAt(0)}
        </span>
        <span className="hidden sm:inline">{user.username}</span>
        {/* A small badge so it's always clear this is an admin account */}
        {user.role === 'admin' && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">Admin</span>
        )}
      </span>
      {/* a form + Server Action: sign out runs on the server and deletes the cookie */}
      <form action={logout}>
        <button type="submit" className={buttonClass.secondary}>
          Sign out
        </button>
      </form>
    </div>
  );
}
