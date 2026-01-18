import { getCurrentUser } from '../../lib/auth';

export default function ProfilePage() {
  const user = getCurrentUser();

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <h1 style={{ margin: 0 }}>Profile</h1>
      <dl style={{ margin: 0, display: 'grid', gap: 8 }}>
        <div>
          <dt style={{ fontWeight: 600 }}>Name</dt>
          <dd style={{ margin: 0 }}>{user?.name ?? 'Unknown'}</dd>
        </div>
        <div>
          <dt style={{ fontWeight: 600 }}>Email</dt>
          <dd style={{ margin: 0 }}>{user?.email ?? 'Unknown'}</dd>
        </div>
      </dl>
    </div>
  );
}
