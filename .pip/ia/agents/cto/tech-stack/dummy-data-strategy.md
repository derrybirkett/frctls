# Dummy Data Strategy

Use dummy data for all DB functionality initially, including dummy login users.

## Goals
- Enable end-to-end flows without live data.
- Stable, deterministic seeds for tests and demos.

## Approach
- Seed scripts to populate core entities.
- Feature-flag switch between dummy and live data.
- Auth: provide dummy users with roles and test tokens.

## Hygiene
- Never mix dummy credentials with production secrets.
- Reset and reseed between test runs.
- Clearly mark dummy UIs and endpoints.

