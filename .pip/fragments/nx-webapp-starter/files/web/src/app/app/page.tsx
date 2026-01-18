import Link from 'next/link';
import { getCurrentUser } from '../../lib/auth';

export default function AppHomePage() {
  const user = getCurrentUser();

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <h1 style={{ margin: 0 }}>App</h1>
      <p style={{ margin: 0 }}>You are logged in as {user?.email ?? 'unknown'}.</p>
      <Link href="/profile">Go to profile</Link>
    </div>
  );
}
