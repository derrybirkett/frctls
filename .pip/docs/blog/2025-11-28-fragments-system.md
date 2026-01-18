# 2025-11-28 — Fragments System: Bootstrap Projects in Minutes

## What Shipped

- **Fragments system** - Reusable project scaffolds for consistent infrastructure
- **nx-dev-infra fragment** - Containerized Nx development environment (Node 22 + pnpm + Nx + Postgres + n8n)
- **apply-nx-dev-infra.sh** - One-command bootstrapping script
- **Fragments guide** - Comprehensive 270-line documentation
- **Expanded mission** - `.pip` now provides docs AND executable scaffolding

## Why It Matters

### The Problem
Every time you start a new project (web app, mobile app, API, service), you spend hours setting up the same infrastructure:
- Nx monorepo configuration
- Docker development environment
- PostgreSQL database
- n8n workflow automation
- Project structure and tooling

This repetitive work wastes time and leads to inconsistencies across projects.

### The Solution
Fragments let you bootstrap any project type with **one command**:

```bash
# In your new project
git submodule add git@github.com:derrybirkett/pip.git .pip
./.pip/bin/apply-nx-dev-infra.sh

# 30 seconds later...
nx run infra:up
docker exec -it monospace-dev bash
```

### The Impact
- ⚡ **10x faster** - Minutes instead of hours to working environment
- 🔄 **Consistent** - Same patterns across all projects
- 📦 **Portable** - Works on any machine with Docker
- 🎯 **Focused** - Spend time building features, not infrastructure

## How It Works

### Fragments are Scaffolds
A fragment is a collection of files that get copied into your project:
- `Dockerfile.dev` - Development container config
- `docker-compose.yml` - Multi-service orchestration
- `tools/infra/project.json` - Nx targets for container management

### Apply Once, Own Forever
When you apply a fragment:
1. Files are copied to your project
2. You own them and can customize
3. No automatic updates (intentional)
4. Simple, predictable, no magic

### Example: nx-dev-infra Fragment

**What you get:**
- **Dev container** - Node 22, pnpm, Nx pre-installed
- **PostgreSQL 16** - Database ready at `localhost:5432`
- **n8n** - Workflow automation at `localhost:5678`
- **Nx targets** - `infra:up`, `infra:down`, `infra:logs`

**Usage:**
```bash
# Start everything
nx run infra:up

# Enter dev container
docker exec -it monospace-dev bash

# Inside container, you have full Nx workspace
pnpm install
nx serve web
nx run api:serve
nx run mobile:start
```

## Architecture Decisions

### Why Fragments Over Templates?
- **Simpler** - Just bash scripts and file copying
- **Transparent** - See exactly what files you're getting
- **Flexible** - Edit after applying, no framework lock-in
- **Composable** - Apply multiple fragments to same project

### Why in .pip Repo?
- **Single source** - Documentation + executable patterns together
- **Consistent** - Fragments implement patterns docs describe
- **Convenient** - One git submodule gets you everything

### Why "Apply Once"?
- **Clear ownership** - Files belong to your project after applying
- **No surprises** - No automatic updates breaking your customizations
- **Simple mental model** - Copy files, done

## What's Coming Next

### Planned Fragments
Based on common app patterns, we'll add:
- **next-web** - Next.js web app with ShadCN UI
- **expo-mobile** - Expo mobile app (iOS + Android)
- **api-graphql** - GraphQL API service
- **agent-service** - AI agent microservice

### Future Enhancements
- **pip CLI tool** - `pip apply nx-dev-infra` instead of path to script
- **Fragment versioning** - Choose which version to apply
- **Template variables** - Customize project names, ports, etc.
- **Fragment composition** - Dependencies between fragments

## Real-World Example

**Before fragments:**
```bash
# Day 1: Research and setup
- Find Docker + Nx guides
- Configure Dockerfile
- Set up docker-compose
- Install Nx
- Configure Postgres
- Set up n8n
- Debug connection issues
- Document for team

# Result: 1-2 days lost, inconsistent across projects
```

**With fragments:**
```bash
# Day 1: Build features
git init my-app && cd my-app
git submodule add git@github.com:derrybirkett/pip.git .pip
./.pip/bin/apply-nx-dev-infra.sh
nx run infra:up

# 5 minutes later: coding actual features
nx g @nx/next:app web
nx serve web
```

## Try It Now

### Quick Start
```bash
mkdir my-new-app
cd my-new-app
git init
git submodule add git@github.com:derrybirkett/pip.git .pip
./.pip/bin/apply-nx-dev-infra.sh
nx run infra:up
```

### Learn More
- [Fragments Guide](../fragments-guide.md) - Complete documentation
- [nx-dev-infra README](../../fragments/nx-dev-infra/README.md) - Fragment details
- [WARP.md](../../WARP.md) - Repository overview

## Feedback Welcome

This is the MVP - one fragment, simple bash script. We want to learn:
- Which fragments would be most valuable?
- What customizations do you need?
- Should we build the generic `pip` CLI tool?
- What other pain points can we solve?

## Links

- Changelog: [../changelog.md](../changelog.md)
- Fragments Guide: [../fragments-guide.md](../fragments-guide.md)
- nx-dev-infra Fragment: [../../fragments/nx-dev-infra/README.md](../../fragments/nx-dev-infra/README.md)
- Apply Script: [../../bin/apply-nx-dev-infra.sh](../../bin/apply-nx-dev-infra.sh)
- Plan Document: Plan ID 633fd28f-f4ce-4fe3-8163-2f594e39cc0b
