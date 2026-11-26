// Server Component: calls a PROTECTED endpoint (/auth/me) with the token
// and shows who is logged in, plus a logout button.
import { logout } from '@/app/actions/auth';
import { apiFetch } from '@/lib/server-api';
import { getToken } from '@/lib/session';

type Me = { username: string; email: string };

export default async function UserMenu() {
  if (!(await getToken())) return null; // login / register pages

  const me = await apiFetch<Me>('/auth/me');
  return (
    <form action={logout} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <span>Hi, {me.username}</span>
      <button type="submit">Logout</button>
    </form>
  );
}