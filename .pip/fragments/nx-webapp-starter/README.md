# nx-webapp-starter (OOTB Web App Starter)

Scaffolds a single **Next.js** app in an Nx workspace that works out-of-the-box with:

- `/` — simple marketing landing page (tie copy to your `mission/mission.md`)
- `/login` — dummy but working login
- `/app` — logged-in app surface with navbar
- `/profile` — profile page
- Navbar user menu — dropdown with **Profile** + **Logout**

Auth uses a minimal **cookie-based demo session** by default (a single demo user). You can replace it later.

## Usage

From your organism root (Nx workspace):

```bash
./.pip/bin/apply-nx-webapp-starter.sh
```

Then:

```bash
npx nx serve web
```

## Dummy credentials

Defaults (override via env):

- `DEMO_USER_EMAIL` (default: `demo@example.com`)
- `DEMO_USER_PASSWORD` (default: `demo`)

The apply script auto-creates `web/.env.local` with a random `AUTH_SECRET`.

If you prefer to manage env yourself, create `web/.env.local` and set:

- `AUTH_SECRET` (any random string)

## Notes

- This fragment is intentionally minimal and avoids extra pages/features.
- It does not install or configure a database.
