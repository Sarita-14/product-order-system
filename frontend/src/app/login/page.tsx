import { Suspense } from 'react';
import LoginForm from './login-form';

type Params = Promise<{ registered?: string; expired?: string; from?: string }>;

// /login?registered=1   -> just signed up
// /login?expired=1      -> token expired / invalid
// /login?from=/orders   -> go back there after login (set by proxy.ts)
export default function LoginPage({ searchParams }: { searchParams: Params }) {
  return (
    <main style={{ maxWidth: 360, margin: '80px auto' }}>
      <h1>Welcome back</h1>
      {/* searchParams is request data -> must be read inside <Suspense> (cacheComponents) */}
      <Suspense fallback={null}>
        <LoginContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function LoginContent({ searchParams }: { searchParams: Params }) {
  const { registered, expired, from } = await searchParams;
  return (
    <>
      {registered && <p style={{ color: 'limegreen' }}>Account created. Please log in.</p>}
      {expired && <p style={{ color: 'orange' }}>Your session expired. Please log in again.</p>}
      <LoginForm from={from} />
    </>
  );
}