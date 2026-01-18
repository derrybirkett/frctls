# nx-dev-infra Fragment

Provides a containerized Nx development environment with supporting infrastructure.

## What's Included

- **Dockerfile.dev** - Node 22 with pnpm and Nx pre-installed
- **docker-compose.yml** - Multi-container setup:
  - `dev` - Development container with your workspace mounted
  - `db` - PostgreSQL 16 database
  - `n8n` - Workflow automation platform
- **tools/infra/project.json** - Nx targets for managing containers

## Prerequisites

- **Docker Desktop** installed and running
- **Nx workspace** initialized
- **pnpm** (or npm/yarn) installed

## Quick Start

### 1. Initialize Nx Workspace (if not already done)

```bash
# In your project directory
npx nx@latest init --integrated
```

### 2. Apply Fragment

```bash
# In your project root
./.pip/bin/apply-nx-dev-infra.sh
```

The script will check prerequisites and copy the necessary files.

### Start Infrastructure

```bash
# Start all containers
nx run infra:up

# View logs
nx run infra:logs

# Stop containers
nx run infra:down
```

### Develop in Container

```bash
# Enter dev container
docker compose exec dev bash

# Inside container
pnpm install
nx serve web
nx run api:serve
nx run mobile:start
```

## What Gets Created

```
your-project/
├── Dockerfile.dev
├── docker-compose.yml
└── tools/
    └── infra/
        └── project.json
```

## Services

### PostgreSQL (db)
- **Port**: 5432 by default (override with `POSTGRES_PORT`)
- **Database**: nexus
- **User**: nexus
- **Password**: nexus
- **Connection**: `postgresql://nexus:nexus@localhost:${POSTGRES_PORT:-5432}/nexus`

### n8n (workflow automation)
- **Port**: 5678 by default (override with `N8N_PORT`)
- **URL**: http://localhost:5678 (or `http://localhost:$N8N_PORT`)
- **Auth**: Disabled for local dev
- **Database**: Uses PostgreSQL above

## Customization

After applying, you can customize:
- Container names in `docker-compose.yml`
- Database credentials
- Port mappings
- Add additional services

## Troubleshooting

### "Nx workspace not initialized"
**Error**: Script exits with "Nx workspace not initialized"

**Solution**: Initialize Nx first:
```bash
npx nx@latest init --integrated
```

### "Docker is not running"
**Error**: Script exits with "Docker is not running"

**Solution**: Start Docker Desktop:
```bash
open -a Docker  # macOS
# or start Docker Desktop from Applications
```

### "Cannot find executor 'run-commands'"
**Error**: `Unable to resolve @nx/workspace:run-commands`

**Cause**: Using older Nx version or outdated fragment

**Solution**: Ensure you're using the latest fragment (uses `nx:run-commands` executor)

### "Duplicate projects detected: infra"
**Error**: `The following projects are defined in multiple locations: infra`

**Cause**: Nx is detecting both the template in `.pip/fragments/` and your `tools/infra/`

**Solution**: The fragment now creates `.nxignore` automatically. If you applied an older version:
```bash
echo ".pip/" >> .nxignore
```

### Containers won't start
```bash
# Check Docker is running
docker ps

# View container logs
docker compose logs

# Rebuild containers
docker compose up --build -d
```

### Port conflicts
If `5432` is already in use (common if you already have Postgres running), override the port:

```bash
POSTGRES_PORT=5433 nx run infra:up
```

Or edit `docker-compose.yml` and change port mappings:
```yaml
ports:
  - "5433:5432"  # Changed from 5432:5432
```

### "version is obsolete" warning
This warning is harmless. The fragment uses Docker Compose v2 format (no version needed). The warning appears if you're using an older Docker Compose version.

## Next Steps

After applying this fragment, consider adding:
- **next-web** - Next.js web app scaffold
- **expo-mobile** - Expo mobile app scaffold
- **api-graphql** - GraphQL API scaffold
