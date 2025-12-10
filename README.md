# fractalsofchange

Refactor organisational structure through managed changes to affect larger changes

## Problem

Fixing cultural tokens to improve productivity

## Solution

Web application that refactor organisational structure through managed changes to affect larger changes

**What makes it different**: Small changes work

## Documentation

This project uses `.pip` as an immutable template (genome):
- `.pip/` - Framework templates and guides (DO NOT MODIFY)
- `docs/` - This project's actual documentation

### Project Documentation
- [Mission](./docs/mission.md) - Project purpose and vision
- [Activity Log](./docs/activity-log.md) - Historical record of changes
- [Changelog](./docs/changelog.md) - User-facing release notes

### Framework Documentation  
- [.pip Framework](./.pip/README.md) - Framework overview
- [Using .pip as Genome](./.pip/docs/using-pip-as-genome.md) - Detailed usage guide
- [Fragment System](./.pip/docs/fragments-guide.md) - Infrastructure scaffolding

## Getting Started

```bash
# Initialize Nx workspace
npx nx@latest init --integrated
pnpm init
pnpm add -D nx @nx/workspace

# Apply infrastructure fragment
./.pip/bin/apply-nx-dev-infra.sh

# Start development environment
nx run infra:up
```

## Status

🚧 **In Development** - Project bootstrapped 2025-12-09

---

**Primary User**: Large enterprise directors  
**Project Type**: Web application
