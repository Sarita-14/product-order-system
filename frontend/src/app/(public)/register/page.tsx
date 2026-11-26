// ─────────────────────────────────────────────────────────────────────────────
// FILE: app/(public)/register/page.tsx — the page "/register".
// ─────────────────────────────────────────────────────────────────────────────

// The centred white box.
import { AuthCard } from '@/components/auth/auth-card';
// The sign-up form.
import { RegisterForm } from '@/components/auth/register-form';
// SEO helper.
import { buildMetadata } from '@/lib/seo';

// SEO: noIndex = Google should not list this page.
export const metadata = buildMetadata({
  title: 'Register',
  description: 'Create an account to order products online.',
  path: '/register',
  noIndex: true,
});

// The page: just the box with the form inside (no data to wait for, so no Suspense).
export default function RegisterPage() {
  return (
    <AuthCard title="Create your account" subtitle="It takes less than a minute.">
      <RegisterForm />
    </AuthCard>
  );
}
