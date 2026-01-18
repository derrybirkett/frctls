# .pip — Project Intelligence & Process

This directory contains the operational system for your project: mission, methods, agents, and documentation.

## What is .pip?

`.pip` is a lightweight framework for AI-assisted development that provides:
- **Clear mission and method** for consistent decision-making
- **Agent-based governance** with defined roles and responsibilities
- **Autonomous agent system** for AI-powered roadmap implementation
- **Process templates** for delivery, documentation, and collaboration
- **Project graphs** mapping key surfaces and flows
- **Reusable fragments** for bootstrapping new projects with consistent infrastructure

## v2 Breaking Change: Site Extracted

As of v2 development, the public website/blog has been extracted into a separate **organism** repo (recommended name: `pip-blog`).

This repo is now focused on the `.pip` kernel (genome): governance, patterns, fragments, scripts, and documentation.

## Directory Structure

```
.pip/
├── README.md                  # This file
├── CONTRIBUTING.md            # How to contribute and collaborate
├── fragment-prompt.md         # Universal AI agent entrypoint
├── WARP.md                   # Warp-specific AI agent guidance
├── mission/                   # Why this project exists
│   └── mission.md            # Problem, solution, vision, outcomes
├── method/                    # How we deliver
│   └── delivery-method.md    # Discovery → build → ship process
├── graph/                     # What we're building
│   ├── product-app.md        # Core product flows
│   ├── marketing-website.md  # Marketing site structure
│   └── blog.md               # Blog purpose and strategy
├── ia/                        # Information architecture
│   ├── agent_manifest.yml    # Agent roles summary
│   └── agents/               # Detailed agent documentation
│       ├── ceo/
│       ├── cto/
│       ├── cpo/
│       ├── ciso/
│       ├── cmo/
│       ├── cro/
│       └── coo/
├── fragments/                 # Reusable project scaffolds
│   └── nx-dev-infra/         # Nx + Docker + Postgres + n8n
│       ├── README.md         # Fragment documentation
│       └── files/            # Files to copy into projects
├── bin/                       # Apply scripts for fragments
│   ├── bootstrap-project.sh       # Interactive project setup
│   ├── apply-agentic-framework.sh # Script to apply agentic framework
│   └── apply-nx-dev-infra.sh      # Script to apply nx-dev-infra
└── docs/                      # Living documentation
    ├── activity-log.md       # Historical record of changes
    ├── changelog.md          # User-facing release notes
    ├── fragments-guide.md    # How to use fragments system
    ├── glossary.md           # Terms and definitions
    ├── blog/                 # Blog posts and content
    ├── processes/            # Workflow guides
    ├── policies/             # Governance and compliance
    ├── templates/            # Reusable templates
    └── tools/                # Tool guides and integrations
```

## The Genome/Organism Model

**Important:** Think of `.pip` as **DNA/genome** — an immutable template that provides instructions.

Your project is the **organism** that expresses those instructions:
- **`.pip/` (Genome)** = Immutable template (DO NOT MODIFY)
- **`docs/` in your project** = Your actual documentation (modify freely)

### Quick Setup (Recommended)

**Interactive Bootstrap** - Answer a few questions and get personalized documentation:

```bash
# In your new project
git init
git submodule add https://github.com/derrybirkett/pip.git .pip

# Run interactive bootstrap
./.pip/bin/bootstrap-project.sh
```

The script will ask about your project and generate:
- Mission statement based on your user story
- README with your project description  
- Activity log and changelog templates
- Agentic workflow playbook (how to use agents with a human in the loop)
- All customized for your specific project

### Manual Setup (Advanced)

If you prefer to set up manually:

```bash
# Add .pip as submodule
git submodule add https://github.com/derrybirkett/pip.git .pip

# Bootstrap your documentation
mkdir -p docs
cp .pip/docs/templates/organism-activity-log.md docs/activity-log.md
cp .pip/docs/templates/organism-changelog.md docs/changelog.md
cp .pip/docs/templates/organism-agentic.md docs/agentic.md
cp .pip/mission/mission.md docs/mission.md

# Edit these files for YOUR project
```

**See [Using .pip as Genome](./docs/using-pip-as-genome.md) for detailed guidance.**

## Getting Started

### 0. Install Git Hooks (Required)
**First thing after cloning**: Install git hooks to prevent direct commits to main:
```bash
./hooks/install-hooks.sh
```

This installs a pre-commit hook that blocks commits to `main` branch, enforcing the feature branch workflow.

### 1. Execution Modes (New in v2)

`.pip` v2 introduces explicit execution modes to control agent behavior and ensure safe operation:

#### PIP_MODE: Execution Permission
Controls whether side-effecting operations are permitted:

- **`observe`** - Read-only mode; all side effects blocked
- **`propose`** - Suggest changes without executing them  
- **`execute`** - Permit side-effecting operations (apply, bootstrap, wrap, review)

#### PIP_ACTION_MODE: Execution Strategy
Controls how side effects are executed when `PIP_MODE=execute`:

- **`live`** - Execute immediately (default)
- **`confirm`** - Prompt before each side effect
- **`dry-run`** - Block side effects, show what would happen

#### Examples

```bash
# Safe exploration (read-only)
PIP_MODE=observe pip review

# Execute with confirmation prompts
PIP_MODE=execute PIP_ACTION_MODE=confirm pip apply nx-dev-infra

# Preview wrap-up without executing
PIP_MODE=execute PIP_ACTION_MODE=dry-run pip wrap

# Configure default mode for your organism
pip migrate  # Creates/upgrades .piprc
pip mode     # Shows resolved modes
```

#### Setting Defaults with .piprc

Create a `.piprc` file in your organism to set default modes:

```bash
# Create .piprc with defaults
pip migrate
```

Example `.piprc`:
```bash
PIP_MODE=execute
PIP_ACTION_MODE=confirm
```

See the [migration guide](./docs/migrating-v1-to-v2.md) for complete v2 documentation.

### 2. Environment Setup
This repository uses [direnv](https://direnv.net/) for environment variable management:
```bash
# Install direnv (if not already installed)
brew install direnv  # macOS

# Copy the example env file
cp .envrc.example .envrc  # or: cp docs/templates/organism-envrc.example .envrc

# Add your secrets to .envrc (it's gitignored)
vim .envrc

# Allow direnv to load the environment
direnv allow
```

## Testing

```bash
# Bootstrap regression test (runs bootstrap into a temp directory)
./bin/test-bootstrap.sh

# Validate pattern library structure
./bin/validate-patterns.sh

# Fragment smoke test (creates a temp Nx workspace and applies fragments)
./bin/test-fragments.sh
```

### 2. Customize Mission
Edit `mission/mission.md` to define:
- Who you're serving
- What problem you're solving
- Your unique solution and vision

### 3. Configure Agents
Review `ia/agent_manifest.yml` and update:
- Owner assignments
- Responsibility boundaries
- Documentation paths

### 4. Define Your Product
Update the graph files:
- `graph/product-app.md` — Core product flows
- `graph/marketing-website.md` — Marketing structure
- `graph/blog.md` — Content strategy

### 5. Set Up Processes
Customize `method/delivery-method.md` for your delivery approach.

### 6. Use Fragments (Optional)
Bootstrap new projects with reusable infrastructure scaffolds:
```bash
# In your new project
git submodule add git@github.com:derrybirkett/pip.git .pip

# Apply agentic framework (AI-first development with agent collaboration)
./.pip/bin/apply-agentic-framework.sh

# Apply Nx + Docker + Postgres development environment
./.pip/bin/apply-nx-dev-infra.sh

# Scaffold common product surfaces (app + marketing + auth boundary)
./.pip/bin/apply-nx-product-surfaces.sh
```

See [Fragments Guide](./docs/fragments-guide.md) for more.

## Key Concepts

### Agents
This system uses a C-suite agent model:
- **CEO**: Mission, strategy, cross-functional decisions
- **CTO**: Technical architecture, developer tooling, automation
- **CPO**: Product roadmap and outcomes
- **CISO**: Security, risk, compliance
- **CMO**: Messaging, content, marketing
- **CRO**: Revenue, pricing, growth
- **COO**: Delivery operations, wrap-up governance, release hygiene

Each agent has defined decision rights and interfaces.

### Autonomous Agent System

`.pip` includes an **AI-powered autonomous agent system** that automates roadmap implementation:

**What it does**:
- 🤖 Picks up unassigned roadmap issues automatically (every 6 hours)
- 📝 Generates implementations via OpenAI GPT-4
- 🔀 Creates PRs with automated code/documentation
- 👀 Reviews PRs with CTO (technical) and CISO (security) agents
- ✅ Auto-merges when reviews pass
- 💰 Cost: ~$2-5/month

**For pip genome** (this repo):
- Already enabled and running
- Monitoring: `gh run list --workflow=autonomous-roadmap-agent.yml`
- View PRs: `gh pr list --label automated`

**For organisms** (your projects using `.pip` as submodule):
- See [Agent Adoption Guide](./docs/agent-adoption-guide.md)
- Copy agent files from `.pip/.github/agents/`
- Configure secrets (OPENAI, GH_PROJECT_TOKEN)
- Enable scheduled runs for automatic implementation

The system is production-tested and ready for adoption!

### Activity Log
`docs/activity-log.md` tracks what changed, when, and why. Update it before merging to main.

### Changelog
`docs/changelog.md` is user-facing release notes. Update it as part of your wrap-up process.

### Graph
"Graph" refers to the interconnected surfaces you're building (product, marketing, blog). Each graph file maps key flows and requirements.

### Fragments
Fragments are reusable project scaffolds (Docker configs, Nx setups, etc.) that you can inject into new projects for consistent infrastructure.

## Roadmap: v1.0 → v2.0 Agentic Transformation

`.pip` is evolving from a documentation framework (v1.x) into a **complete agentic development system** (v2.0) with formal patterns, persistent memory, and multi-agent coordination.

**Why?** See [Benefits of Agentic Development](./docs/agentic-benefits.md) for:
- 7 core benefits (persistent memory, formal patterns, multi-agent collaboration)
- Quantifiable metrics (90% memory persistence, 20% quality improvement)
- What becomes possible (instant decision retrieval, pattern suggestions, quality trends)

**How?** See [ROADMAP.md](./ROADMAP.md) for:
- Strategic vision (v0.4.0 → v1.0.0 → v2.0)
- 7 phases over 13 weeks
- Vector database memory integration
- ReAct/Planning/Reflection patterns
- Agent quality metrics and self-evaluation

**Current**: v1.0.0 (Foundation complete)  
**Next**: v2.0 development starting with Phase 1 (Pattern Library)

## Contributing

See `CONTRIBUTING.md` for:
- Branch naming conventions
- PR requirements and approvals
- Code standards and automation

## Using with AI Agents

This structure is optimized for AI-assisted development across multiple AI platforms:

**Quick Start**: Point your AI agent to `fragment-prompt.md` — a universal entrypoint file that works with:
- ChatGPT Projects
- Claude Projects
- Cursor Composer
- Warp Agent Mode
- n8n workflows

### How It Works
1. AI agents can reference role docs to understand decision authority
2. Templates provide consistent formats for discovery and delivery
3. Activity logs help agents understand project history
4. Process docs guide agents through workflows

### Platform-Specific Guidance
- **Warp**: Automatically reads `WARP.md`
- **Cursor**: Copy `.cursorrules.example` to project root as `.cursorrules` (bootstrap script does this automatically)
- **ChatGPT/Claude**: Reference `fragment-prompt.md` in project instructions
- **n8n**: Add "Read File" node pointing to `fragment-prompt.md`

## Adapting for Your Project

This is a template. Remove what you don't need:
- Working on a library, not a product? Remove `graph/product-app.md`
- No marketing site? Remove `graph/marketing-website.md`
- Don't need all C-suite roles? Remove unused agent directories

Keep what provides value for your specific context.
