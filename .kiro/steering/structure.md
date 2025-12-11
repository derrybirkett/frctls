# Project Structure

## Root Level Organization
```
fractals/
├── .pip/                    # Framework template (DO NOT MODIFY)
├── apps/                    # Application code
├── tools/                   # Infrastructure and tooling
├── docs/                    # Project-specific documentation
├── docker-compose.yml       # Development environment
└── nx.json                  # Nx workspace configuration
```

## Key Directories

### `.pip/` - Framework Template (Immutable)
- **DO NOT MODIFY** - This is the project genome/template
- Contains mission, methods, agents, and reusable fragments
- Provides consistent project structure and processes
- Use as reference, customize in your own `docs/` directory

### `apps/` - Applications
- **`apps/blog/`** - Astro-based blog application
  - Static site generation for content and thought leadership
  - Uses MDX for rich content authoring
  - Independent package.json and build process

### `tools/` - Infrastructure & Tooling
- **`tools/infra/`** - Infrastructure management
  - Nx project for Docker Compose orchestration
  - Targets: `up`, `down`, `logs` for environment management

### `docs/` - Project Documentation
- **Your actual documentation** (modify freely)
- `mission.md` - Project purpose and vision
- `activity-log.md` - Historical record of changes
- `changelog.md` - User-facing release notes

## Nx Workspace Conventions
- Each app/tool has its own `project.json` for Nx configuration
- Use `nx run <project>:<target>` for executing tasks
- Shared dependencies managed at workspace root
- Individual apps can have their own package.json for specific dependencies

## File Naming Conventions
- Use kebab-case for directories and files
- TypeScript files use `.ts` extension
- Configuration files follow tool conventions (e.g., `astro.config.mjs`)

## Development Workflow
1. **Environment**: Start with `nx run infra:up`
2. **Apps**: Navigate to specific app directory for development
3. **Documentation**: Update in `docs/` directory, not `.pip/`
4. **Infrastructure**: Manage through `tools/infra` Nx targets

## Important Rules
- **Never modify `.pip/`** - It's the immutable template
- **Use `docs/` for project documentation** - Not `.pip/docs/`
- **Follow Nx project structure** - Apps in `apps/`, tools in `tools/`
- **Containerize development** - Use Docker Compose for consistent environment