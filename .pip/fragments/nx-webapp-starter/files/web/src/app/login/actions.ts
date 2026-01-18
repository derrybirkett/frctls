'use server';

import { redirect } from 'next/navigation';
import { getCurrentUser, getEnvDemoCredentials, setSessionCookie } from '../../lib/auth';

export async function loginAction(formData: FormData) {
  if (getCurrentUser()) {
    redirect('/app');
  }

  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  const expected = getEnvDemoCredentials();

  if (email !== expected.email || password !== expected.password) {
    redirect('/login?error=invalid');
  }

  setSessionCookie({ email, name: 'Demo User' });
  redirect('/app');
}
