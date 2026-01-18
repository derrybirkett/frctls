import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser, getEnvDemoCredentials } from '../../lib/auth';
import { loginAction } from './actions';

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  const user = getCurrentUser();
  if (user) {
    redirect('/app');
  }

  const demo = getEnvDemoCredentials();
  const error = searchParams?.error;

  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 420 }}>
      <h1 style={{ margin: 0 }}>Log in</h1>

      {error ? (
        <p style={{ margin: 0, color: '#b91c1c' }}>Invalid email or password.</p>
      ) : null}

      <form action={loginAction} style={{ display: 'grid', gap: 12 }}>
        <label style={{ display: 'grid', gap: 6 }}>
          <span>Email</span>
          <input name="email" type="email" defaultValue={demo.email} required />
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span>Password</span>
          <input
            name="password"
            type="password"
            defaultValue={demo.password}
            required
          />
        </label>

        <button type="submit">Continue</button>
      </form>

      <p style={{ margin: 0 }}>
        Back to <Link href="/">home</Link>.
      </p>
    </div>
  );
}
