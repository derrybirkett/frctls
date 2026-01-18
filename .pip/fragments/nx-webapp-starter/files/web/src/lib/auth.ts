import { cookies as nextCookies } from 'next/headers';

const SESSION_COOKIE = 'pip_demo_session';

export type DemoUser = {
  email: string;
  name: string;
};

export function getEnvDemoCredentials(): { email: string; password: string } {
  return {
    email: process.env.DEMO_USER_EMAIL ?? 'demo@example.com',
    password: process.env.DEMO_USER_PASSWORD ?? 'demo',
  };
}

export function encodeUser(user: DemoUser): string {
  const json = JSON.stringify(user);
  return Buffer.from(json, 'utf8').toString('base64url');
}

export function decodeUser(value: string): DemoUser | null {
  try {
    const json = Buffer.from(value, 'base64url').toString('utf8');
    const parsed = JSON.parse(json) as Partial<DemoUser>;
    if (!parsed.email || !parsed.name) return null;
    return { email: String(parsed.email), name: String(parsed.name) };
  } catch {
    return null;
  }
}

export function getDemoUserFromCookie(cookieValue: string | undefined): DemoUser | null {
  if (!cookieValue) return null;
  return decodeUser(cookieValue);
}

export function getCurrentUser(): DemoUser | null {
  const store = nextCookies();
  const value = store.get(SESSION_COOKIE)?.value;
  return getDemoUserFromCookie(value);
}

export function setSessionCookie(user: DemoUser) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error('AUTH_SECRET is required');
  }

  const value = encodeUser(user);

  nextCookies().set(SESSION_COOKIE, value, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });
}

export function clearSessionCookie() {
  nextCookies().delete(SESSION_COOKIE);
}
