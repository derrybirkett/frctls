# Development

This doc is a starter template. Keep it accurate as you evolve your repo.

## Prerequisites

- Node.js + package manager (pnpm recommended)
- Optional: `direnv` for local environment variables

## Run (recommended)

Prefer Nx targets over running tools directly from subfolders.

```bash
# App
npx nx serve app

# API (if present)
npx nx serve api
```

## Tests

```bash
# Unit tests
npx nx test app

# E2E (if configured)
npx nx e2e app-e2e
```

## Local environment variables

- Copy `.envrc.example` → `.envrc` and fill in values.
- `.envrc` is intentionally gitignored.
