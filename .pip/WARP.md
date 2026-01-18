# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Repository Overview

`.pip` (Project Intelligence & Process) is a lightweight documentation framework for AI-assisted development. It provides:
- Agent-based governance with C-suite roles (CEO, CTO, CPO, CISO, CMO, CRO)
- Process templates for discovery, delivery, and collaboration
- Product graphs mapping key surfaces and flows
- Reusable infrastructure fragments (Nx, Docker, Postgres, n8n)
- Activity logging and changelog management

## The Genome/Organism Model

**Important Context**: `.pip` can be used in two ways:

### 1. Working ON `.pip` Repository Itself
When you're contributing to the `.pip` project:
- This is a **documentation + scaffolding repository**
- Markdown files + shell scripts + Docker configs
- The docs here ARE the actual `.pip` project documentation
- Follow all git workflow rules below

### 2. Using `.pip` AS a Template (Most Common)
When `.pip` is a submodule in your project:
- **`.pip` = Genome** (immutable template, DO NOT MODIFY)
- **Your project = Organism** (living implementation with its own docs)
- Your project has its own `docs/` directory for actual documentation
- `.pip/` stays pristine as reference and templates

**See [Using .pip as Genome](./docs/using-pip-as-genome.md) for complete guide.**

This guide assumes you're working ON the `.pip` repository itself.

## Key Concepts

### Agent Roles
Each agent has defined decision rights and responsibilities:
- **CEO**: Mission, strategy, cross-functional decisions
- **CTO**: Technical architecture, delivery standards, quality
- **CPO**: Product roadmap, discovery, acceptance criteria
- **CISO**: Security policies, risk management, compliance
- **CMO**: Messaging, content strategy, marketing channels
- **CRO**: Pricing, packaging, revenue optimization

Agent documentation lives in `ia/agents/<role>/` with role.md and responsibilities.md files.

### Critical Files

#### Activity Log (`docs/activity-log.md`)
Historical record of changes. **MUST be updated before merging to main.**
Format: Date | Agent | Commit/PR | What changed | Why | Links

#### Changelog (`docs/changelog.md`)
User-facing release notes. Update for any user-impacting changes.
Categories: Added, Changed, Fixed, Security

#### Wrap-Up Checklist (`docs/processes/wrap-up-checklist.md`)
Pre-merge checklist covering testing, documentation, blog posts, and communication.

### Directory Structure

```
.pip/
├── mission/mission.md          # Project purpose and vision
├── method/delivery-method.md   # Discovery → build → ship process
├── graph/                      # Product surface maps
│   ├── product-app.md
│   ├── marketing-website.md
│   └── blog.md
├── ia/                         # Information architecture
│   ├── agent_manifest.yml      # All agents summary
│   └── agents/                 # Per-agent documentation
│       └── <role>/
│           ├── role.md
│           ├── responsibilities.md
│           └── tech-stack/     # (for CTO only)
├── fragments/                  # Reusable project scaffolds
│   └── nx-dev-infra/          # Nx + Docker + Postgres + n8n
│       ├── README.md
│       └── files/
├── bin/                        # Apply scripts for fragments
│   └── apply-nx-dev-infra.sh
└── docs/                       # Living documentation
    ├── activity-log.md         # Required for all changes
    ├── changelog.md            # Required for user-facing changes
    ├── fragments-guide.md      # How to use fragments
    ├── processes/
    └── templates/
```

## Git Workflow

### Critical Rule: Never Work Directly on Main
**IMPORTANT**: All changes MUST be made on feature branches. NEVER commit directly to main, even for small documentation updates.

When working as an AI agent:
- Always create a feature branch before making ANY edits
- If you accidentally make changes on main, stash them and move to a feature branch immediately
- This rule applies to all changes: code, docs, configs, everything

### Branching Strategy
Trunk-based development with short-lived feature branches (1-3 days max):
- `feat/<desc>` — New features
- `fix/<desc>` — Bug fixes
- `docs/<area>` — Documentation updates
- `chore/<task>` — Maintenance

**Always branch from main:**
```bash
git checkout main
git pull origin main
git checkout -b feat/your-feature
```

### Commit Message Format
```
<type>: <subject>

<body>

<footer>
```

Types: feat, fix, docs, style, refactor, perf, test, chore
- Imperative mood ("add" not "added")
- 50 chars or less for subject
- Reference issues in footer: `Closes #123`

### Merge Strategy
Default: Squash and merge to keep main history clean

### Protected Main Branch
- Requires PR approval
- All checks must pass
- No direct commits
- No force pushes

## Required Process

### Before Every Merge

1. **Update Activity Log** (`docs/activity-log.md`)
   - Add row with date, agent, commit/PR, what changed, why, links
   - Keep rationale concise and actionable

2. **Update Changelog** (`docs/changelog.md`) — if user-facing
   - Add to "Unreleased" or new dated section
   - Write from user perspective

3. **Write Blog Post** — if new feature
   - CMO owns blog post requirements (see user rules)
   - Link to changelog and docs

4. **Review Wrap-Up Checklist** (`docs/processes/wrap-up-checklist.md`)
   - Verify all items complete
   - Small changes: minimum activity log + tests
   - Features: activity log + changelog + blog
   - Major releases: full wrap-up

## Execution Modes (PIP_MODE)

When using the unified CLI (`bin/pip`), set `PIP_MODE` explicitly:

- `PIP_MODE=observe` or `PIP_MODE=propose` for exploration and planning
- `PIP_MODE=execute` only after you have explicit approval to run commands that modify files or branches

Side-effecting commands like `pip apply`, `pip bootstrap`, `pip wrap`, and `pip review` are blocked unless `PIP_MODE=execute`.

You can also set a default mode for an organism via `.piprc`:
- Create/upgrade config: `pip migrate`
- Inspect resolved mode: `pip mode`

Optional: set an execution strategy via `PIP_ACTION_MODE`:
- `live` (default), `confirm` (prompt), `dry-run` (wrap-only)

### Testing Strategy
- **Playwright** for E2E testing (user preference from rules)
- Unit tests: 80%+ coverage for business logic
- Integration tests for critical paths
- Security scans must pass

### Security
- **Never commit secrets** — use environment variables
- **direnv setup**: Copy `.envrc.example` to `.envrc` and add your tokens (`.envrc` is gitignored)
- Follow CISO security policies in `ia/agents/ciso/security-policies.md`

## Working with This Repository

### Adding New Agent Documentation
1. Create directory: `ia/agents/<role>/`
2. Add `role.md` (scope, decision rights, interfaces)
3. Add `responsibilities.md` (detailed responsibilities)
4. Update `ia/agent_manifest.yml`

### Updating Product Graphs
Edit files in `graph/` to map:
- Core product flows and features
- Marketing site structure
- Content strategy

### Process Documentation
Templates and processes live in:
- `docs/processes/` — Workflow guides
- `docs/templates/` — Reusable templates

### Customizing for New Projects
When adapting .pip for a new project:
1. Customize `mission/mission.md`
2. Configure `ia/agent_manifest.yml`
3. Update product graphs in `graph/`
4. Remove unused agent directories
5. Adapt `method/delivery-method.md`

### Using Fragments
Bootstrap new projects with reusable infrastructure:
```bash
# In new project directory
git submodule add git@github.com:derrybirkett/pip.git .pip
./.pip/bin/apply-nx-dev-infra.sh
nx run infra:up
```

See `docs/fragments-guide.md` for detailed usage.

## Quick Reference

### Navigation
- **Docs**: `docs/` — Living documentation (processes, templates, tools)
- **Contributing**: `CONTRIBUTING.md` — Branch naming, PR requirements, standards
- **README**: `README.md` — Framework overview and getting started

### Key Agent Documents
- CTO Tech Stack: `ia/agents/cto/tech-stack/tech-stack.md`
- Git Practices: `ia/agents/cto/tech-stack/git-practices.md`
- Testing Strategy: `ia/agents/cto/tech-stack/testing-strategy.md`
- CMO Marketing Strategy: `ia/agents/cmo/marketing-strategy.md`
- CISO Security Policies: `ia/agents/ciso/security-policies.md`
- COO Wrap Ops: `ia/agents/coo/role.md`

### Common Tasks

#### Starting New Work
```bash
git checkout main && git pull origin main
git checkout -b feat/your-feature
# Make changes
```

#### Completing Work
```bash
# 1. Update activity log
vim docs/activity-log.md

# 2. Update changelog (if user-facing)
vim docs/changelog.md

# 3. Commit and push
git add .
git commit -m "feat: description of change"
git push origin feat/your-feature

# 4. Create PR and get approval
# 5. Merge (squash and merge)
```

#### Creating a Release
```bash
# 1. Update changelog
# 2. Commit changelog changes
git add docs/changelog.md
git commit -m "chore: prepare vX.Y.Z release"
git push origin main

# 3. Create and push tag
git tag -a vX.Y.Z -m "Release description"
git push --tags
```

## Important Reminders

### From User Rules
- **GIT branching**: Always use feature branches (never commit directly to main)
- **Activity log**: MUST be updated before merging
- **Blog posts**: CMO agent role maintains blog; write post for each new feature
- **Wrap-up process**: (1) write blog, (2) update activity log, (3) merge and push
- **Context7**: Use Context7 MCP when available for latest docs
- **Security**: Always check for information security issues, especially around keys
- **Linear tickets**: When picking up tasks, explicitly specify ticket number and task
- **LEAN methodology**: Follow LEAN design principles documented in user rules

### Governance
- **PR Approvals**: Required based on scope (see CONTRIBUTING.md)
  - Product scope → CPO
  - Technical/infra → CTO (+ CISO for security)
  - Messaging/marketing → CMO
  - Pricing/packaging → CRO
  - Cross-functional → CEO

### Agent Automation
When working as an AI agent:
- **NEVER work directly on main** — Always create a feature branch first
- Perform wrap-up steps automatically unless told otherwise
- Activity log and changelog are **required** before merge
- Blog posts should be **drafted**, not just outlined
- Tags should be created for releases
- Verify all checklist items before declaring work complete

## Philosophy

This repository follows a **LEAN methodology**:
- Small, validated steps
- Build-Measure-Learn cycles
- Minimize waste
- Validated learning over assumptions
- Continuous improvement (Kaizen)

Keep documentation concise and actionable. Remove sections that don't provide value for your context.
