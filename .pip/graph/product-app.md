# Product App

## Auto-Generated Structure

When using the `nx-product-surfaces` fragment, a basic dashboard app is automatically created:
- Sidebar navigation with Dashboard, Profile, Settings
- Dashboard page with placeholder metrics widgets
- User profile page with display and edit form
- Auth boundary ready for provider integration
- Responsive mobile menu
- Dark mode support

See: `apps/app/src/components/DashboardLayout.tsx`, `apps/app/src/pages/Dashboard.tsx`, `apps/app/src/pages/Profile.tsx`

## Core Flows

### Auth: Login & Signup
- Signup inputs: <email, password, name> (+ SSO providers)
- Verification: <email verification | magic link>
- Login: <password | SSO | magic link>
- Recovery: <reset password>, lockout policy
- Security: rate limit, device/session management, MFA (phase?)

### Logged-in App: Key Journeys
- Onboarding: welcome, checklist, sample data
- Primary job-to-be-done 1: <describe steps/end state>
  - Entry points: <nav/button/API>
  - Success criteria: <time to value, task completion>
  - Key surfaces: <pages/components>

- Primary job-to-be-done 2: <describe>
  - Entry points: <…>
  - Success criteria: <…>
  - Key surfaces: <…>

### Main Sections
- Dashboard (overview, alerts, quick actions)
- Data/Models (browse, create, import)
- Workflows (run, history, status)
- Settings (profile, billing, team, security)

## Accessibility & Performance
- A11y: keyboard nav, contrast, ARIA, focus order
- Perf: TTI, LCP, FID budgets, code-splitting

## Telemetry
- Events: auth, onboarding milestones, feature usage
- Dashboards: activation, retention, funnel drop-off

