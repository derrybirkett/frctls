# Technology Stack

## Build System
- **Nx Workspace**: Monorepo management and build orchestration (v22.2.0)
- **Package Manager**: pnpm (v10.15.1)
- **Node.js**: Modern JavaScript/TypeScript development

## Frontend Stack
- **Astro**: Static site generation for blog (v5.16.5)
- **MDX**: Markdown with JSX components for content
- **Sharp**: Image optimization

## Infrastructure
- **Docker**: Containerized development environment
- **PostgreSQL**: Database (v16)
- **n8n**: Workflow automation and integration platform

## Development Environment
The project uses a containerized development setup with Docker Compose:

```bash
# Start development environment
nx run infra:up

# Stop environment  
nx run infra:down

# View logs
nx run infra:logs
```

## Common Commands

### Project Setup
```bash
# Install dependencies
pnpm install

# Initialize Nx workspace (if needed)
npx nx@latest init --integrated
```

### Development
```bash
# Start blog development server
cd apps/blog && pnpm dev

# Build blog for production
cd apps/blog && pnpm build

# Preview blog build
cd apps/blog && pnpm preview
```

### Infrastructure Management
```bash
# Start all services (dev container, database, n8n)
nx run infra:up

# Stop all services
nx run infra:down

# View service logs
nx run infra:logs
```

## Architecture Patterns
- **Monorepo**: Nx workspace with apps and tools separation
- **Containerization**: Docker-based development environment
- **Static Generation**: Astro for performant blog/content delivery
- **Automation**: n8n for workflow orchestration

## Code Organization
- Use TypeScript for type safety
- Follow Nx project structure conventions
- Separate apps from shared tools/infrastructure