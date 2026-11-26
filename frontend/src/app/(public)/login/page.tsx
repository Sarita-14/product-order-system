// ─────────────────────────────────────────────────────────────────────────────
// FILE: app/(public)/login/page.tsx — the page "/login".
// (Route groups and Suspense: see app/(public)/page.tsx.)
// ─────────────────────────────────────────────────────────────────────────────

// Suspense = wait for the URL's ?query values.
import { Suspense } from 'react';
// The centred white box.
import { AuthCard } from '@/components/auth/auth-card';
// The email + password form.
import { LoginForm } from '@/components/auth/login-form';
// Coloured message box.
import { Alert } from '@/components/ui/alert';
// SEO helper.
import { buildMetadata } from '@/lib/seo';

// SEO: noIndex = Google should not list the login page.
export const metadata = buildMetadata({
  title: 'Login',
  description: 'Log in to place orders and see your order history.',
  path: '/login',
  noIndex: true,
});

// The "?registered=1&from=..." part of the URL. Next gives it as a Promise = a value that arrives a moment later, so we wait for it with await.
type SearchParams = Promise<{ registered?: string; expired?: string; from?: string }>;

// /login?registered=1   -> just signed up
// /login?expired=1      -> token expired / invalid
// /login?from=/checkout -> go back there after login (set by proxy.ts)
export default function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <AuthCard title="Welcome back" subtitle="Log in to continue.">
      {/* searchParams is request data -> must be read inside <Suspense> (cacheComponents) */}
      <Suspense fallback={null}>
        <LoginContent searchParams={searchParams} />
      </Suspense>
    </AuthCard>
  );
}

// Reads the URL values, then shows the right message + the form.
async function LoginContent({ searchParams }: { searchParams: SearchParams }) {
  // Wait for the values and take out the three we care about.
  const { registered, expired, from } = await searchParams;
  return (
    <>
      {registered && <Alert tone="success">Account created. Please log in.</Alert>}
      {expired && <Alert tone="warning">Your session expired. Please log in again.</Alert>}
      <LoginForm from={from} />
    </>
  );
}
