# .pip — AI Agent Entrypoint

> Universal instruction file for ChatGPT, Claude, Cursor, Warp, and n8n agents

## What This Repo Is

`.pip` (Project Intelligence & Process) is a lightweight framework for AI-assisted development that provides:

1. **Documentation Framework** — Agent-based governance with C-suite roles (CEO, CTO, CPO, CISO, CMO, CRO)
2. **Process Templates** — Discovery, delivery, and wrap-up workflows
3. **Project Scaffolds** — Reusable infrastructure fragments (Nx, Docker, Postgres, n8n)
4. **Product Graphs** — Maps of key surfaces and flows

**Repository Type**: Documentation + Infrastructure Scaffolds (Markdown + shell scripts + Docker configs)

## The Genome/Organism Model

**Critical Concept**: `.pip` is designed as an **immutable template** (genome) when used in projects.

### Two Usage Modes:

#### 1. Working ON `.pip` Repo (You're Here)
When contributing to `.pip` itself:
- These docs ARE the actual `.pip` project documentation
- You can modify files (on feature branches)
- Follow all git workflow rules in this guide

#### 2. Using `.pip` AS Template (Most Common)
When `.pip` is added as a git submodule to YOUR project:
- **`.pip/` = Genome** → Immutable template (NEVER MODIFY)
- **`your-project/docs/` = Organism** → Your actual documentation (modify freely)
- Bootstrap your docs by copying templates from `.pip/docs/` to `your-project/docs/`
- `.pip/` stays pristine as reference

### Quick Example:
```bash
# In your project
my-project/
├── .pip/                    # ✔️ Immutable submodule (genome)
│   └── docs/
│       ├── activity-log.md  # Template/example
│       └── changelog.md     # Template/example
└── docs/                    # ✔️ Your actual docs (organism)
    ├── activity-log.md      # Your project's real history
    └── changelog.md         # Your project's real releases
```

**See [Using .pip as Genome](.pip/docs/using-pip-as-genome.md) for detailed setup guide.**

---

The rest of this guide assumes you're working ON the `.pip` repository itself or understand the genome/organism pattern.

## How Agents Should Behave

### Core Principles
- **LEAN Methodology**: Small validated steps, Build-Measure-Learn cycles, minimize waste
- **Feature Branches Only**: NEVER work directly on main — always create a feature branch first
- **Documentation First**: Update activity log before every merge to main
- **Agent Autonomy**: Each C-suite agent has defined decision boundaries (see below)

### Git Workflow
```bash
# ALWAYS start work on a feature branch
git checkout main && git pull origin main
git checkout -b feat/your-feature

# Make changes, then wrap up
# 1. Update docs/activity-log.md (required)
# 2. Update docs/changelog.md (if user-facing)
# 3. Write blog post (if new feature)
# 4. Commit and push
git add . && git commit -m "feat: description"
git push origin feat/your-feature

# 5. Create PR, get approval, merge (squash merge)
```

### Commit Message Format
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`
- Format: `<type>: <subject>` (imperative mood, ≤50 chars)
- Example: `feat: add nx-dev-infra fragment`

### Security Rules
- **NEVER commit secrets** — use environment variables
- Use `direnv` for local secrets (`.envrc` is gitignored)
- Follow `ia/agents/ciso/security-policies.md`

## Where to Look in the Folders

### Critical Files (Always Check)
```
.pip/
├── fragment-prompt.md           ← You are here (AI entrypoint)
├── WARP.md                      ← Detailed Warp-specific guidance
├── mission/mission.md           ← Project purpose and vision
├── docs/activity-log.md         ← REQUIRED: Update before merge
├── docs/changelog.md            ← User-facing release notes
└── docs/processes/wrap-up-checklist.md  ← Pre-merge checklist
```

### Agent Documentation
```
ia/agents/
├── ceo/                         ← Mission, strategy, cross-functional
├── cto/                         ← Architecture, delivery, quality
│   └── tech-stack/             ← Technical standards
├── cpo/                         ← Roadmap, discovery, acceptance
├── ciso/                        ← Security, risk, compliance
├── cmo/                         ← Messaging, content, marketing
└── cro/                         ← Pricing, packaging, revenue
```

### Fragments (Project Scaffolds)
```
fragments/
└── nx-dev-infra/               ← Nx + Docker + Postgres + n8n
    ├── README.md               ← Fragment documentation
    └── files/                  ← Files to copy into projects

bin/
└── apply-nx-dev-infra.sh       ← Script to apply fragment
```

### Process & Templates
```
docs/
├── processes/                  ← Workflow guides
├── templates/                  ← Reusable templates
├── blog/                       ← Blog posts for releases
└── fragments-guide.md          ← How to use/create fragments
```

### Product Graphs
```
graph/
├── product-app.md              ← Core product flows
├── marketing-website.md        ← Marketing site structure
└── blog.md                     ← Content strategy
```

## How to Apply the Tech Stack

### Testing Strategy
- **E2E Tests**: Playwright (user preference)
- **Unit Tests**: 80%+ coverage for business logic
- **Integration Tests**: Critical paths
- **Security**: Run scans before merge

### Delivery Method
See `method/delivery-method.md` for full process:
1. **Discovery** → Define problem, validate assumptions
2. **Build** → Small iterations, feature branches
3. **Ship** → Wrap-up checklist, merge, tag release

### Wrap-Up Process (Before Merge)
1. ✅ Update `docs/activity-log.md` (REQUIRED)
2. ✅ Update `docs/changelog.md` (if user-facing)
3. ✅ Write blog post (if new feature)
4. ✅ Run tests and security scans
5. ✅ Create PR, get approval
6. ✅ Merge (squash and merge)
7. ✅ Tag release (if applicable)

## How to Scaffold Code Using Fragments

### What Are Fragments?
Reusable project scaffolds that provide consistent infrastructure patterns. Apply once, then owned by the target project.

### Available Fragments
- **nx-dev-infra**: Containerized Nx development environment
  - Node 22 + pnpm + Nx
  - Docker Compose with dev container, Postgres, n8n
  - Nx targets for `infra:up`, `infra:down`, `infra:logs`

### How to Apply a Fragment
```bash
# In your new project
git init my-app && cd my-app

# Add .pip as submodule
git submodule add git@github.com:derrybirkett/pip.git .pip

# Apply fragment
./.pip/bin/apply-nx-dev-infra.sh

# Use infrastructure
nx run infra:up
docker exec -it <project>-dev bash
```

### Creating New Fragments
See `docs/fragments-guide.md` for detailed instructions:
1. Create `fragments/<name>/` directory
2. Add `README.md` documenting the fragment
3. Add `files/` directory with files to copy
4. Create `bin/apply-<name>.sh` script
5. Test in isolated project
6. Update documentation

## Decision Boundaries for C-Suite Agents

### CEO — Chief Executive Officer
**Decision Rights**: Mission, strategy, cross-functional prioritization
**Approval Required For**:
- Major scope changes
- Cross-functional initiatives
- Budget/resource allocation
**Docs**: `ia/agents/ceo/`

### CTO — Chief Technology Officer
**Decision Rights**: Architecture, tech stack, delivery standards, quality
**Approval Required For**:
- Technical architecture changes
- Infrastructure/tooling decisions
- Security/performance trade-offs
**Docs**: `ia/agents/cto/`, `ia/agents/cto/tech-stack/`

### CPO — Chief Product Officer
**Decision Rights**: Roadmap, feature scope, acceptance criteria
**Approval Required For**:
- New features or product changes
- User-facing functionality
- Product strategy shifts
**Docs**: `ia/agents/cpo/`

### CISO — Chief Information Security Officer
**Decision Rights**: Security policies, risk management, compliance
**Approval Required For**:
- Security-impacting changes
- Authentication/authorization
- Data handling/privacy
**Docs**: `ia/agents/ciso/`

### CMO — Chief Marketing Officer
**Decision Rights**: Messaging, content strategy, marketing channels
**Approval Required For**:
- Public-facing content
- Marketing campaigns
- Blog posts and announcements
**Docs**: `ia/agents/cmo/`

### CRO — Chief Revenue Officer
**Decision Rights**: Pricing, packaging, funnel optimization
**Approval Required For**:
- Pricing changes
- Monetization strategy
- Revenue model shifts
**Docs**: `ia/agents/cro/`

### COO — Chief Operating Officer
**Decision Rights**: Delivery operations, wrap-up governance, release hygiene
**Approval Required For**:
- Changes to wrap-up checklist or automation
- Release/tag cadence adjustments
- Exceptions to documentation/publishing standards
**Docs**: `ia/agents/coo/`

## Quick Commands Reference

### Git
```bash
# Start new work (ALWAYS use feature branch)
git checkout main && git pull && git checkout -b feat/new-feature

# Commit
git add . && git commit -m "feat: description"

# Push and create PR
git push -u origin feat/new-feature
```

### Fragments
```bash
# Apply nx-dev-infra fragment
./.pip/bin/apply-nx-dev-infra.sh

# Start infrastructure
nx run infra:up

# View logs
nx run infra:logs

# Stop infrastructure
nx run infra:down
```

### Testing
```bash
# Run tests (depends on project)
npm test               # or
pnpm test             # or
nx test               # or
playwright test
```

## Integration Examples

### ChatGPT Projects
Add this file to your project's "Project Instructions" or reference it in conversations:
```
Read .pip/fragment-prompt.md for repository structure and agent behavior guidelines.
```

### Cursor Composer
Add to `.cursorrules`:
```
# .pip Framework
Follow guidelines in .pip/fragment-prompt.md
Always work on feature branches, never main
Update activity log before merging
```

### Claude Projects
Add to project knowledge:
```
Repository follows .pip framework documented in fragment-prompt.md
Key principles: feature branches, LEAN methodology, agent-based governance
```

### Warp Agent Mode
Warp reads `WARP.md` automatically. This file (`fragment-prompt.md`) provides a universal alternative for other AI platforms.

### n8n Agent Workflows
Add "Read File" node pointing to `.pip/fragment-prompt.md` before agent tasks to load context.

## Quick Checklist for Any Task

- [ ] Working on a feature branch (not main)
- [ ] Understand which agent role applies (CEO/CTO/CPO/CISO/CMO/CRO)
- [ ] Follow LEAN principles (small steps, validate assumptions)
- [ ] Update activity log before merge
- [ ] Update changelog if user-facing
- [ ] Run tests and security scans
- [ ] Get appropriate agent approval for PR
- [ ] Use squash merge to keep history clean

## Need More Details?

- **Full repository guidance**: `WARP.md`
- **Contributing guidelines**: `CONTRIBUTING.md`
- **Getting started**: `README.md`
- **Living docs**: `docs/` (processes, templates, tools)
- **Fragments deep-dive**: `docs/fragments-guide.md`
- **Delivery process**: `method/delivery-method.md`
- **Agent roles**: `ia/agent_manifest.yml` + `ia/agents/<role>/`

---

**Last Updated**: 2025-11-28  
**Version**: 1.0  
**Maintainer**: CTO
