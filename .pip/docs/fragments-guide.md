# Fragments Guide

Fragments are reusable project scaffolds that provide consistent infrastructure patterns across all your projects.

## Context: The Genome/Organism Model

Fragments are designed to work with `.pip` as an **immutable submodule** (genome):
- **`.pip/` = Genome** → Contains fragment templates (never modify)
- **Your project = Organism** → Receives fragment files (customize freely)

Fragments are applied **once** from `.pip/` to your project, then owned by your project.

[Learn more about the genome/organism model →](./using-pip-as-genome.md)

## What Are Fragments?

Fragments are pre-configured code and config templates that you can inject into new projects. They provide:
- Consistent development environments
- Battle-tested configurations
- Quick project bootstrapping
- Standardized infrastructure patterns

## Available Fragments

### nx-dev-infra
Containerized Nx development environment with Postgres and n8n.

**Provides:**
- Docker development container (Node 22 + pnpm + Nx)
- PostgreSQL 16 database
- n8n workflow automation
- Nx targets for container management

**When to use:** Starting any new Nx-based project (web, mobile, API, etc.)

[Full documentation →](../fragments/nx-dev-infra/README.md)

### nx-product-surfaces
Scaffolds a complete SaaS application with mission-driven content.

**Provides:**
- `apps/marketing` — Landing page with hero section (auto-populated from mission)
- `apps/app` — Dashboard with sidebar nav, dashboard page, user profile
- `libs/auth` — Provider-swappable auth boundary (Supabase/Clerk/WorkOS ready)
- `docs/graph/*` templates copied into your organism
- Tailwind CSS + React Router configured
- Mission data injection from `docs/mission.md`

**When to use:** Starting any SaaS-style product that needs marketing + app + auth.

**Key Features:**
- Hero section populated from bootstrap mission data
- Working dashboard layout with navigation
- User profile page with edit form
- Auth context ready for provider integration
- Dark mode support built-in

[Full documentation →](../fragments/nx-product-surfaces/README.md)

### nx-webapp-starter
Scaffolds a single Next.js app in an Nx workspace that works out-of-the-box.

**Provides:**
- `/` simple marketing landing page
- `/login` dummy but working auth
- `/app` protected app surface with navbar
- `/profile` user profile page

**When to use:** You want one web surface that ships fast with login + profile + app shell.

[Full documentation →](../fragments/nx-webapp-starter/README.md)

### astro-blog
Fast, SEO-friendly blog powered by Astro with Tailwind CSS.

**Provides:**
- Astro 4 static site generator
- Tailwind CSS styling with dark mode
- TypeScript support
- Content Collections for type-safe markdown
- RSS feed generation
- Nx integration with serve/build/preview targets

**When to use:** Content marketing, technical blogging, documentation sites

[Full documentation →](../fragments/astro-blog/README.md)

## Using Fragments

### Basic Usage

```bash
# In your project directory
./.pip/bin/apply-<fragment-name>.sh
```

### Example: New Project Setup

```bash
# Create new project
mkdir my-app
cd my-app
git init

# Add .pip as submodule
git submodule add git@github.com:derrybirkett/pip.git .pip

# Apply infrastructure fragment
./.pip/bin/apply-nx-dev-infra.sh

# Start development
nx run infra:up
docker exec -it monospace-dev bash
```

## How Fragments Work

1. **Discovery**: Fragment files live in `.pip/fragments/<name>/files/`
2. **Application**: Apply script copies files to your project
3. **Ownership**: After applying, you own the files and can customize
4. **No updates**: Fragments are "apply once" - no automatic updates

### Directory Structure

```
.pip/
├── fragments/
│   └── nx-dev-infra/
│       ├── README.md          # Fragment documentation
│       └── files/             # Files to copy
│           ├── Dockerfile.dev
│           ├── docker-compose.yml
│           └── tools/
│               └── infra/
│                   └── project.json
└── bin/
    └── apply-nx-dev-infra.sh  # Apply script
```

## Creating New Fragments

### 1. Create Fragment Directory

```bash
mkdir -p fragments/<fragment-name>/files
```

### 2. Add Files

Place all files that should be copied in the `files/` directory, maintaining the desired directory structure.

### 3. Create Apply Script

```bash
# bin/apply-<fragment-name>.sh
#!/usr/bin/env bash
set -e

PIP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRAGMENT_DIR="$PIP_DIR/fragments/<fragment-name>/files"
TARGET_DIR="$(pwd)"

# Copy files with checks to avoid overwriting
if [ -f "$TARGET_DIR/some-file" ]; then
  echo "⚠️  some-file already exists, skipping"
else
  cp "$FRAGMENT_DIR/some-file" "$TARGET_DIR/some-file"
  echo "✅ Created some-file"
fi
```

Make it executable:
```bash
chmod +x bin/apply-<fragment-name>.sh
```

### 4. Document the Fragment

Create `fragments/<fragment-name>/README.md` with:
- What's included
- Prerequisites
- Usage instructions
- Customization options
- Troubleshooting

## Best Practices

### Fragment Design
- **Keep minimal**: Only essential files and config
- **Document well**: Clear README with examples
- **Pin versions**: Use specific versions in Dockerfiles, package.json
- **Avoid secrets**: Never include tokens, keys, or passwords
- **Test thoroughly**: Validate in fresh project before committing

### Applying Fragments
- **Apply early**: Best to apply fragments to fresh projects
- **One at a time**: Apply and test each fragment before adding more
- **Commit after**: Commit fragment files before customizing
- **Customize freely**: Files are yours after applying

### Maintenance
- **Update quarterly**: Review and update fragment versions
- **Track usage**: Note which fragments are most used
- **Deprecate gracefully**: Document when fragments are outdated
- **Version in git**: Use git tags for fragment releases

## Fragment Composition

Fragments can build on each other:

```bash
# Base infrastructure
./.pip/bin/apply-nx-dev-infra.sh

# Add web app
./.pip/bin/apply-next-web.sh

# Add mobile app
./.pip/bin/apply-expo-mobile.sh
```

Dependencies between fragments should be documented in each fragment's README.

## Troubleshooting

### Files Already Exist
Apply scripts skip existing files to avoid overwriting your customizations. This is intentional.

**Solution**: If you want to re-apply, remove the file first.

### Script Not Found
Make sure `.pip` is added as a git submodule and scripts are executable.

```bash
# Add submodule
git submodule add git@github.com:derrybirkett/pip.git .pip

# Make scripts executable
chmod +x .pip/bin/*.sh
```

### Wrong Directory Structure
Apply scripts copy files relative to your current directory. Make sure you're in your project root.

```bash
# Check current directory
pwd

# Should be in project root, not .pip/
cd /path/to/your/project
./.pip/bin/apply-nx-dev-infra.sh
```

## Future Enhancements

### Planned Features
- Generic `pip` CLI tool for easier fragment management
- Fragment versioning and dependency management
- Interactive customization prompts
- Template variable substitution
- Fragment update/merge capabilities

### Upcoming Fragments
- **next-web** - Next.js web app scaffold
- **expo-mobile** - Expo mobile app scaffold
- **agent-service** - AI agent service scaffold
- **api-graphql** - GraphQL API scaffold
- **prisma-db** - Prisma ORM with migrations scaffold

## Examples

### Example 1: New Web App

```bash
mkdir my-web-app
cd my-web-app
git init
git submodule add git@github.com:derrybirkett/pip.git .pip

# Apply infrastructure
./.pip/bin/apply-nx-dev-infra.sh

# Future: Apply web app scaffold
# ./.pip/bin/apply-next-web.sh

nx run infra:up
docker exec -it monospace-dev bash
```

### Example 2: Content Marketing Blog

```bash
mkdir my-marketing-site
cd my-marketing-site
git init
git submodule add git@github.com:derrybirkett/pip.git .pip

# Apply infrastructure
./.pip/bin/apply-nx-dev-infra.sh

# Add blog
./.pip/bin/apply-astro-blog.sh

# Start blog dev server
nx serve blog
```

### Example 3: New Mobile App

```bash
mkdir my-mobile-app
cd my-mobile-app
git init
git submodule add git@github.com:derrybirkett/pip.git .pip

# Apply infrastructure
./.pip/bin/apply-nx-dev-infra.sh

# Future: Apply mobile scaffold
# ./.pip/bin/apply-expo-mobile.sh

nx run infra:up
docker exec -it monospace-dev bash
```

### Example 4: Full Stack Project with Blog

```bash
mkdir my-fullstack-app
cd my-fullstack-app
git init
git submodule add git@github.com:derrybirkett/pip.git .pip

# Apply all fragments
./.pip/bin/apply-nx-dev-infra.sh
./.pip/bin/apply-astro-blog.sh
# ./.pip/bin/apply-next-web.sh
# ./.pip/bin/apply-expo-mobile.sh
# ./.pip/bin/apply-api-graphql.sh

nx run infra:up
docker exec -it monospace-dev bash

# In container: start blog
nx serve blog
```

## Related Documentation

- [nx-dev-infra Fragment](../fragments/nx-dev-infra/README.md)
- [astro-blog Fragment](../fragments/astro-blog/README.md)
- [Tech Stack Overview](../ia/agents/cto/tech-stack/tech-stack.md)
- [Docker Security Policies](../ia/agents/ciso/security-policies.md)
- [Testing Strategy](../ia/agents/cto/tech-stack/testing-strategy.md)
