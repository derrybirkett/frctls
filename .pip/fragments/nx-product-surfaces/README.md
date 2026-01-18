# nx-product-surfaces (Nx Product Surfaces Scaffold)

Scaffolds a complete SaaS application structure with:

- `apps/marketing` — Landing page with mission-driven hero section
- `apps/app` — Dashboard with sidebar navigation, dashboard page, and user profile
- `libs/auth` — Provider-swappable auth boundary (Supabase/Clerk/WorkOS ready)
- `docs/graph/*` — Product and marketing graph templates

## What's Included

### Marketing Landing Page
- Hero component with mission placeholders (`{{PROJECT_NAME}}`, `{{SOLUTION}}`)
- Responsive design with Tailwind CSS
- Dark mode support
- Clean, minimal single-section layout
- Automatically populated from `docs/mission.md` if present

### Product App Dashboard
- Sidebar navigation (Dashboard, Profile, Settings)
- Responsive mobile menu
- Dashboard page with placeholder metrics widgets
- User profile page with display and edit form
- Dark mode support
- React Router setup for navigation

### Auth Boundary
- `AuthProvider` React context
- `useAuth()` hook for consuming auth state
- `ProtectedRoute` component
- TypeScript types for User, AuthState
- Placeholder implementation with clear TODOs for real provider integration
- Security notes and best practices in comments

## Why this exists

Most SaaS products need:
1. A marketing surface to convert visitors
2. A logged-in app surface with navigation
3. Authentication to protect the app

This fragment provides a working MVP structure that you can customize, rather than starting from blank Nx generators.

## Usage

### Quick Start

```bash
# 1. Bootstrap your project (optional but recommended)
./.pip/bin/bootstrap-project.sh

# 2. Initialize Nx
npx nx@latest init --integrated

# 3. Apply product surfaces
./.pip/bin/apply-nx-product-surfaces.sh

# 4. (Optional) Scaffold a single Next.js webapp that works OOTB
./.pip/bin/apply-nx-webapp-starter.sh

# 5. Start apps
nx serve marketing  # Port 4201
nx serve app        # Port 4200
```

### Mission-Driven Content

If you ran `bootstrap-project.sh` first, your mission data is automatically injected:
- Project name appears in marketing hero
- Solution description becomes the tagline
- All placeholders replaced automatically

To manually inject mission data:
```bash
./.pip/bin/inject-mission.sh
```

## What Gets Created

### File Structure
```
organism/
├── apps/
│   ├── marketing/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── app.tsx (landing page)
│   │   │   │   └── app.css (Tailwind imports)
│   │   │   └── components/
│   │   │       └── Hero.tsx
│   │   ├── tailwind.config.js
│   │   └── postcss.config.js
│   └── app/
│       ├── src/
│       │   ├── app/
│       │   │   ├── app.tsx (routing + layout)
│       │   │   └── app.css
│       │   ├── components/
│       │   │   └── DashboardLayout.tsx
│       │   └── pages/
│       │       ├── Dashboard.tsx
│       │       └── Profile.tsx
│       ├── tailwind.config.js
│       └── postcss.config.js
├── libs/
│   └── auth/
│       └── src/
│           ├── index.ts
│           └── lib/
│               ├── auth.tsx (context + hooks)
│               └── types.ts
└── docs/
    └── graph/
        ├── product-app.md
        └── marketing-website.md
```

### Dependencies Installed
- `tailwindcss`, `postcss`, `autoprefixer` (styling)
- `react-router-dom` (app navigation)
- `@nx/react`, `@nx/vite` (Nx tooling)

## Customization

### Marketing Landing Page

Edit `apps/marketing/src/app/app.tsx` to:
- Change CTA button text/link
- Add more sections (features, pricing, testimonials)
- Update styling in `Hero.tsx`

### Dashboard Layout

Edit `apps/app/src/components/DashboardLayout.tsx` to:
- Add/remove navigation items
- Change sidebar branding
- Customize user menu
- Adjust responsive breakpoints

### Auth Integration

Edit `libs/auth/src/lib/auth.tsx` to integrate real auth:

**Supabase Example:**
```tsx
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  setState({ user: data.user, isLoading: false, isAuthenticated: true })
}
```

**Clerk Example:**
```tsx
import { useClerk } from '@clerk/clerk-react'

// Wrap app with <ClerkProvider>
// Use Clerk's hooks in auth.tsx
```

## Security Notes

⚠️ **Important**: The auth boundary is a placeholder. Before production:

1. Implement real authentication (Supabase/Clerk/WorkOS)
2. Add CSRF protection
3. Use secure, httpOnly cookies for sessions
4. Rate limit login/signup endpoints
5. Add MFA support
6. Never store passwords in frontend code
7. Implement proper redirect logic in `ProtectedRoute`

See comments in `libs/auth/src/lib/auth.tsx` for detailed guidance.

## Tech Stack

- **Framework**: React 18+ with Vite
- **Styling**: Tailwind CSS with ShadCN-compatible theme
- **Routing**: React Router v6
- **Build**: Nx with Vite bundler
- **Testing**: Vitest (unit), Playwright (E2E recommended)

## LEAN Approach

This fragment follows LEAN principles:
- Minimal viable surfaces (hero-only landing, basic dashboard)
- No unnecessary features or dependencies
- Clear extension points for growth
- Fast to scaffold, fast to customize
- Real working code, not empty templates

Start simple, iterate based on user feedback.

## Troubleshooting

### Tailwind not working
```bash
# Reinstall dependencies
npm install

# Restart dev server
nx serve marketing
```

### React Router errors
Make sure `react-router-dom` is installed:
```bash
npm list react-router-dom
# If missing:
npm install react-router-dom
```

### Mission placeholders not replaced
Run the injection script manually:
```bash
./.pip/bin/inject-mission.sh
```

## Next Steps

1. Customize marketing hero copy and CTA
2. Add real data to dashboard widgets
3. Implement auth provider integration
4. Add more pages (Settings, Billing, etc.)
5. Connect to backend API
6. Add form validation libraries
7. Set up E2E tests with Playwright

## Related

- [Bootstrap Guide](../../README.md#quick-setup-recommended)
- [Mission Injection Script](../../bin/inject-mission.sh)
- [Tech Stack](../../ia/agents/cto/tech-stack/tech-stack.md)
- [nx-dev-infra Fragment](../nx-dev-infra/README.md)
