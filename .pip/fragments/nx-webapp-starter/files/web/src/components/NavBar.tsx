import Link from 'next/link';
import { getCurrentUser } from '../lib/auth';
import { logoutAction } from '../app/logout/actions';

export function NavBar() {
  const user = getCurrentUser();

  return (
    <header style={{ borderBottom: '1px solid #e5e7eb' }}>
      <div
        style={{
          maxWidth: 960,
          margin: '0 auto',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        <nav style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/" style={{ fontWeight: 600 }}>
            Home
          </Link>
          {user ? <Link href="/app">App</Link> : <Link href="/login">Log in</Link>}
        </nav>

        {user ? (
          <details style={{ position: 'relative' }}>
            <summary
              style={{
                listStyle: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 999,
                  background: '#111827',
                  display: 'inline-block',
                }}
              />
              <span>{user.name}</span>
            </summary>

            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 8px)',
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                padding: 8,
                minWidth: 180,
              }}
            >
              <div style={{ padding: 8, borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ fontWeight: 600 }}>{user.email}</div>
              </div>
              <div style={{ display: 'grid', gap: 6, padding: 8 }}>
                <Link href="/profile">Profile</Link>
                <form action={logoutAction}>
                  <button type="submit">Log out</button>
                </form>
              </div>
            </div>
          </details>
        ) : null}
      </div>
    </header>
  );
}
