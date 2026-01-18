# .pip Roadmap

> **📋 Active Roadmap:** The roadmap is now managed in [GitHub Issues and Projects](https://github.com/users/derrybirkett/projects/4).
> 
> This document provides strategic context and vision. For detailed tasks, progress tracking, and deliverables, see the GitHub Project.

## Quick Navigation

- **[Project Board](https://github.com/users/derrybirkett/projects/4)** - Kanban view of all roadmap items
- **[All Roadmap Issues](https://github.com/derrybirkett/pip/issues?q=is%3Aissue+label%3Aroadmap)** - Complete list
- **[Initiative 1: Agentic System](https://github.com/derrybirkett/pip/issues/59)** - Epic issue
- **[Initiative 2: Fragments](https://github.com/derrybirkett/pip/issues/60)** - Epic issue
- **[Milestones](https://github.com/derrybirkett/pip/milestones)** - Version tracking

## Vision

Transform `.pip` from a documentation and scaffolding framework (v1.x) into a **complete agentic development system** (v2.0) that enables AI agents to work collaboratively with formal patterns, persistent memory, and quality metrics.

## Versioning Strategy

- **v1.1.0** (Latest tagged stable) - Foundation complete: agent governance, fragments, documentation, processes
- **v2.0.0** (Current development) - Agentic system complete: vector memory, formal patterns, metrics, multi-agent coordination

### v2 Breaking Change (Structural)

The public website/blog has been extracted into a separate `pip-blog` organism repo.
This repo is now focused on the `.pip` kernel (genome).

This roadmap describes the transformation from v1.0 → v2.0 through 7 phases over 13 weeks.

## Current State (v1.1.0)

### What We Have
- ✅ Agent-based governance (CEO, CTO, CPO, CISO, CMO, CRO, COO)
- ✅ Basic agent documentation (`ia/agents/*/role.md`)
- ✅ Infrastructure fragments (nx-dev-infra)
- ✅ Interactive project bootstrap wizard
- ✅ Activity log and changelog tracking
- ✅ Universal AI entrypoint (fragment-prompt.md, WARP.md)
- ✅ Runtime execution modes + organism config (`PIP_MODE`, `PIP_ACTION_MODE`, `.piprc`, `pip migrate`)

### Runtime Modes (First-Class)

`.pip` supports explicit runtime modes in the unified CLI (`bin/pip`) and via `.piprc`:

- **Execution guardrail**: `PIP_MODE` = `observe` | `propose` | `execute`
- **Execution strategy**: `PIP_ACTION_MODE` = `live` | `confirm` | `dry-run`
    - `dry-run` is currently supported for `pip wrap` (wrap-up), and blocks other side-effecting commands.

This provides:
- Safe defaults for organisms (via `.piprc`)
- One-command overrides (via env vars)
- A migration path (`pip migrate`) for upgrading config over time

### What's Missing
- ❌ Formal agentic workflow patterns (ReAct, Planning, Reflection)
- ❌ Memory persistence across sessions (vector database)
- ❌ Agent interaction protocols (collaboration, escalation)
- ❌ Quality metrics and evaluation frameworks
- ❌ Pattern library for common agent tasks
- ❌ Tool integration patterns and templates

---

## Strategic Initiatives

### 🎯 Initiative 1: Complete Agentic Development System (v1.0 → v2.0)

**Goal**: Transform .pip into a complete agentic development system with formal patterns, persistent memory, and multi-agent coordination.

**Timeline**: 13 weeks (~3 months)  
**Status**: 📋 Ready to begin (v1.0.0 tagged)  
**Plan ID**: `c714dce0-85ea-41f3-955b-2e542d915a1d`

#### Problem Statement

`.pip` currently provides agent-based governance documentation and infrastructure fragments, but lacks:
1. Formal agentic design patterns from research
2. Vector database memory for context persistence
3. Standardized agent interaction protocols
4. Agent quality metrics and evaluation frameworks
5. Reusable agent templates and configuration systems

#### Phases Overview

**Phase 1: Foundation (v1.1.0)** - 2 weeks
- Pattern library with ReAct, Planning, Reflection patterns
- Resources directory with Agentic Design Patterns PDF
- Decision frameworks and interaction protocols

**Phase 2: Memory System (v1.2.0)** - 3 weeks
- Vector database integration (Chroma/Qdrant)
- Agent memory architecture with 5 collections
- Embedding and retrieval scripts
- Memory fragment for reuse

**Phase 3: Agent Enhancement (v1.3.0)** - 2 weeks
- ReAct workflow patterns for all agents
- Decision frameworks with weighted criteria
- Quality metrics checklists
- Agent configuration system

**Phase 4: Interaction Protocols (v1.4.0)** - 2 weeks
- Multi-agent collaboration patterns
- PR review protocol with sequential handoffs
- Escalation decision tree
- Conflict resolution framework

**Phase 5: Evaluation Framework (v1.5.0)** - 2 weeks
- Metrics per agent role (CTO, CPO, COO)
- Self-evaluation checklists
- Performance report generation
- Metrics trend analysis

**Phase 6: Template System (v1.6.0)** - 1 week
- Agent template generator (`create-agent.sh`)
- Role templates (technical, product, operations)
- Auto-configuration updates

**Phase 7: Memory Fragment (v2.0.0)** - 1 week
- Package memory system as reusable fragment
- Integration with nx-dev-infra
- Production-ready deployment

#### Key Features

**Memory Collections**:
1. `agent_context` - Recent decisions, active work, current focus
2. `project_knowledge` - Mission, architecture, patterns, standards
3. `interaction_history` - Agent collaboration logs, handoffs
4. `decision_records` - Architecture decisions with rationale
5. `code_patterns` - Reusable code snippets and templates

**Workflow Patterns**:
- **ReAct**: Reason → Act → Observe → Reflect (for CTO delivery)
- **Planning**: Decompose → Validate → Execute (for CPO discovery)
- **Reflection**: Evaluate → Learn → Improve (for agent self-correction)
- **Multi-agent**: Sequential handoffs + parallel collaboration

**Directory Structure**:
```
.pip/
├── resources/              # Reference materials and research
│   ├── agentic-design-patterns/
│   └── memory-systems/
├── patterns/               # Reusable agent patterns
│   ├── agent-workflows/
│   ├── decision-frameworks/
│   ├── interaction-protocols/
│   └── quality-metrics/
├── memory/                 # Vector database system
│   ├── vector-store/
│   ├── schemas/
│   └── scripts/
├── metrics/                # Agent performance tracking
│   ├── dashboards/
│   └── reports/
└── fragments/agent-memory/ # Memory system fragment
```

#### Success Metrics
- **Pattern adoption**: All 7 agent roles use documented workflows
- **Memory persistence**: 90% of decisions stored and retrievable
- **Quality improvement**: 20% reduction in rework/bugs
- **Agent creation time**: New agent setup in <30 minutes
- **Collaboration efficiency**: Multi-agent handoffs complete in <24 hours
- **User adoption**: 10+ projects using agentic system

#### Risk Mitigation
- **Vector DB complexity**: Start with Chroma (simplest), provide Qdrant upgrade path
- **Pattern extraction time**: Start with 3 core patterns, expand incrementally
- **Configuration rigidity**: Support custom workflows alongside standard patterns

#### Dependencies
- Agentic Design Patterns PDF (482 pages)
- Vector database (Chroma recommended for dev, Qdrant for prod)
- Python 3.9+ for embedding scripts
- Existing nx-dev-infra fragment

---

### 🎯 Initiative 2: Application Fragments - Web & Mobile Scaffolds

**Goal**: Provide production-ready fragments for common application patterns (web apps with auth, mobile apps with Expo) to accelerate organism development.

**Timeline**: 3 weeks  
**Status**: 📋 Ready to begin  
**Plan ID**: `b6c8bd58-1fa9-4834-a46e-865fe9eb85ba`

#### Problem Statement

`.pip` currently provides infrastructure fragments (nx-dev-infra, astro-blog) but lacks:
1. Full-stack web application scaffold with authentication
2. Mobile application scaffold using Expo
3. Supabase setup automation and best practices
4. Landing page + authenticated dashboard patterns
5. Cross-platform auth integration (web + mobile)

#### Phases Overview

**Phase 1: Supabase Auth App Fragment** - 1 week
- Next.js 14 web app with Supabase auth
- Marketing landing page
- Complete auth flow (signup, login, password reset)
- Authenticated dashboard with profile/settings/logout
- ShadCN UI + Tailwind CSS

**Phase 2: Expo Mobile Fragment** - 1 week
- React Native app with Expo SDK 50+
- Expo Router for navigation
- Auth screens with biometric support
- Tab navigation (Home, Profile, Settings)
- Supabase integration (optional)

**Phase 3: Integration & Validation** - 1 week
- Cross-fragment testing
- Documentation updates
- Blog posts
- Demo project

#### Key Features

**Supabase Auth App**:
- Marketing landing page with hero and CTAs
- Email/password authentication
- Protected routes with middleware
- Dashboard with profile dropdown
- Profile and settings pages
- Supabase Postgres integration
- Row-level security (RLS) policies

**Expo Mobile**:
- File-based routing with Expo Router
- Onboarding and auth screens
- Biometric authentication (FaceID/TouchID)
- Tab navigation with React Navigation
- Secure token storage with Expo SecureStore
- Offline support with AsyncStorage
- Push notifications setup

**Directory Structure**:
```
.pip/
├── fragments/
│   ├── supabase-auth-app/    # Web app with auth
│   │   ├── files/
│   │   └── README.md
│   └── expo-mobile/          # Mobile app
│       ├── files/
│       └── README.md
└── bin/
    ├── apply-supabase-auth-app.sh
    └── apply-expo-mobile.sh
```

#### Success Metrics
- **Setup Time**: From git clone to running app in <10 minutes
- **Coverage**: 90% of common web/mobile patterns included
- **Adoption**: Used in 3+ real projects within first month
- **Documentation**: Zero questions about basic usage
- **Quality**: No blocking bugs in initial release

#### Risk Mitigation
- **Supabase changes**: Abstract auth layer, provide self-hosted fallback
- **Expo incompatibilities**: Pin SDK version, document upgrade path
- **Too opinionated**: Make fragments customizable, provide ejection path
- **Maintenance burden**: Start with MVP, iterate based on real usage

#### Dependencies
- Existing nx-dev-infra fragment
- Existing astro-blog fragment
- Supabase account (free tier sufficient)
- Expo account (free tier sufficient)

---

### 🎯 Initiative 3: PIP Runtime Adapter - Persistent Execution Environments

**Goal**: Enable agents to work with persistent runtimes (local, Docker, Sprites, or others) through a unified adapter interface for reliable, safe, and flexible execution.

**Timeline**: 4 weeks  
**Status**: 📋 Ready to begin  
**Plan ID**: TBD

#### Problem Statement

`.pip` organisms need to execute commands and manage file systems reliably across different runtime substrates. Currently:
1. No unified interface for different execution environments (local, Docker, Sprites)
2. No persistent checkpointing or rollback capabilities
3. No consistent file system contract across runtimes
4. No safe preview URL generation for deployed applications
5. Missing abstraction for agent-safe command execution

#### Overview

The PIP runtime adapter abstracts over different execution substrates so agents can:
- Persist and read/write files in a `.pip/` workspace
- Execute shell commands safely inside the runtime
- Create and restore checkpoints of the environment
- Serve preview URLs when applicable

#### Runtime Interface

A runtime adapter implements these core functions:

| Function            | Description                                                                        |
| ------------------- | ---------------------------------------------------------------------------------- |
| `create()`          | Initialize the runtime environment if it doesn't exist (e.g. create a container).  |
| `start()`           | Boot up the environment so it's ready to run commands.                             |
| `exec(cmd)`         | Execute a shell command within the runtime.                                        |
| `stop()`            | Gracefully stop the environment.                                                   |
| `destroy()`         | Remove the environment and its data.                                               |
| `checkpoint()`      | Create a checkpoint of the runtime state.                                          |
| `restore(name)`     | Restore a previously created checkpoint.                                           |
| `fs_path()`         | Return the host‑side path to the runtime's persistent file system (for debugging). |
| `preview_url(port)` | Return a URL to access a port running in the runtime (if supported).               |

**Note:** Adapters that do not support preview URLs (e.g. pure local) can return `None` for `preview_url()`.

#### `.pip/` Directory Contract

Each organism's repository includes a `.pip/` folder with structured subfolders to guide agent behavior:

* `.pip/memory/` — persistent notes, decisions, and context files created by agents
* `.pip/tasks/` — queued work unit descriptions (e.g., JSON or Markdown tasks)
* `.pip/output/` — generated artifacts (reports, code files, etc.)
* `.pip/runtime/` — logs, receipts, and the runtime's own state metadata (e.g., last checkpoint name)

The runtime adapter mounts or creates these directories inside the runtime's file system. Agents use simple file primitives (`read`, `write`, `list`, `search`, `delete`) to interact with them.

#### CLI Commands

Runtime actions are exposed through the PIP CLI:

* `pip runtime create --adapter=<local|docker|sprites>`
  Initialize a runtime for the current organism.

* `pip runtime start`
  Boot the runtime environment; runs background processes if needed.

* `pip runtime exec "<shell command>"`
  Execute a shell command within the runtime.

* `pip runtime checkpoint --name=<checkpoint_name>`
  Save a checkpoint of the current runtime state.

* `pip runtime restore --name=<checkpoint_name>`
  Restore the runtime to a checkpoint.

* `pip preview`
  If supported, start the organism's app and return a public preview URL.

* `pip runtime destroy`
  Tear down the runtime and clean up all resources.

#### Adapter Implementations

**Local Adapter**:
- `create/start:` Ensures `.pip/` directories exist on the host
- `exec:` Runs commands in the host shell; no isolation
- `checkpoint/restore:` File system snapshots (if supported) or skipped
- `preview_url:` Not applicable; agents rely on direct host networking

**Docker Adapter**:
- `create/start:` Create a container image and volume to persist `.pip/`
- `exec:` Use `docker exec` to run commands inside the container
- `checkpoint/restore:` Docker's checkpoint/restore features (CRIU on Linux)
- `preview_url:` Port‑map from container to host; no public URL unless integrated with tunneling

**Sprites Adapter**:
- `create/start:` Use Sprites API to create/start a user sandbox with persistent storage
- `exec:` Send commands via the Sprites API
- `checkpoint/restore:` Utilize Sprites' built‑in checkpoint support
- `preview_url:` Use the unique HTTPS endpoint provided per sandbox

#### Phases Overview

**Phase 1: Interface & Local Adapter** - 1 week
- Define runtime adapter interface in TypeScript/Python
- Implement local adapter
- Create `.pip/runtime/` directory structure and logging
- Unit tests for local adapter

**Phase 2: Docker Adapter** - 1 week
- Implement Docker adapter with volume persistence
- Docker image bootstrapping
- Container lifecycle management
- Integration tests

**Phase 3: CLI Integration** - 1 week
- Add `pip runtime` commands to unified CLI
- Command parsing and validation
- Help and examples
- Preview URL integration with `pip preview`

**Phase 4: Sprites Adapter & Production** - 1 week
- Implement Sprites adapter
- Security review and hardening
- Documentation and examples
- Blog post and release

#### Security Considerations

* **Secret Management:** Runtime adapters never expose API tokens to agents. Secrets are managed server‑side and proxied through secure functions.
* **Isolation:** Docker and Sprites provide isolation; local adapter is flagged for lower‑trust scenarios.
* **Resource Limits:** Define CPU/memory/time limits for `exec()` calls to avoid runaway tasks.

#### Success Metrics
- **Adapter coverage**: 3 adapters (local, Docker, Sprites) fully working
- **Checkpoint reliability**: 100% successful create/restore cycles
- **Agent adoption**: All new organisms use runtime adapters by default
- **Setup time**: Adapter initialization in <5 minutes per runtime type
- **Security**: Zero exposed secrets in adapter logs or output

#### Risk Mitigation
- **Docker complexity**: Start with local adapter, provide Docker docs
- **Sprites API changes**: Abstract API calls, pin API version
- **Resource runaway**: Implement timeout and memory limits from day one

#### Dependencies
- Existing `.pip/` directory structure and file system
- Unified CLI infrastructure (`bin/pip`)
- Docker (optional, for Docker adapter)
- Sprites SDK (optional, for Sprites adapter)

---

## Milestone Breakdown

### v1.1.0: Foundation - Pattern Library & Resources
**Target**: 2 weeks from v1.0.0  
**Status**: 📋 Ready to start

#### Goals
- Establish knowledge base with agentic design patterns
- Create pattern library for agent workflows
- Document decision frameworks and quality metrics

#### Deliverables
- [ ] `resources/` directory with Agentic Design Patterns PDF
- [ ] 5-10 extracted patterns in markdown (ReAct, Planning, Reflection, Tool Use, Multi-agent)
- [ ] `patterns/` directory structure
- [ ] Agent workflow documentation (CTO, CPO, CISO, CMO, COO)
- [ ] Decision frameworks (architecture, prioritization, risk, scope)
- [ ] Quality metrics definitions (CTO, CPO, COO)
- ✅ Runtime mode docs + config template upgrades (`PIP_MODE`, `PIP_ACTION_MODE`, `.piprc`, `pip migrate`)
- [ ] Blog post: "Integrating Agentic Design Patterns"

#### Key Files
- `resources/agentic-design-patterns/README.md`
- `resources/agentic-design-patterns/extracted-patterns/*.md`
- `patterns/README.md` (pattern catalog)
- `patterns/agent-workflows/*.md`
- `patterns/decision-frameworks/*.md`
- `patterns/quality-metrics/*.md`

---

### v1.2.0: Memory System - Vector Database Integration
**Target**: 5 weeks from v1.0.0  
**Status**: 📋 Not Started

#### Goals
- Implement persistent agent memory using vector embeddings
- Enable context retrieval across sessions
- Store decisions, patterns, and agent interactions

#### Deliverables
- [ ] Memory architecture design document
- [ ] Chroma vector database integration
- [ ] 5 memory collections (agent_context, project_knowledge, interaction_history, decision_records, code_patterns)
- [ ] Embedding scripts for documentation
- [ ] Query interface for agents
- [ ] Memory initialization in bootstrap scripts
- [ ] WARP.md and fragment-prompt.md integration
- [ ] Memory fragment for reuse
- [ ] Blog post: "Agent Memory with Vector Databases"

#### Key Files
- `memory/README.md`
- `memory/vector-store/collections.yml`
- `memory/schemas/*.json`
- `memory/scripts/*.py`
- `fragments/agent-memory/`

---

### v1.3.0: Agent Enhancement - Workflows & Tools
**Target**: 7 weeks from v1.0.0  
**Status**: 📋 Not Started

#### Goals
- Formalize agent behavior with ReAct patterns
- Add decision frameworks to all agents
- Create quality metrics checklists

#### Deliverables
- [ ] All agent `role.md` files updated with ReAct patterns
- [ ] Decision frameworks with weighted criteria per agent
- [ ] Memory usage patterns per role
- [ ] Quality checklists for each agent
- [ ] Agent configuration system (`ia/agent-config.yml`)
- [ ] Capability modes in `.piprc` (feature toggles like `PIP_FEATURE_*`)
- [ ] Tool configuration templates
- [ ] Blog post: "Formal Agent Workflows"

#### Key Files
- `ia/agents/*/role.md` (enhanced)
- `ia/agents/*/workflows/*.md`
- `ia/agents/*/metrics/*.md`
- `ia/agent-config.yml`

---

### v1.4.0: Interaction Protocols - Multi-Agent Coordination
**Target**: 9 weeks from v1.0.0  
**Status**: 📋 Not Started

#### Goals
- Enable seamless multi-agent collaboration
- Define handoff and escalation protocols
- Implement interaction logging

#### Deliverables
- [ ] Collaboration pattern documentation
- [ ] PR review protocol (sequential handoffs)
- [ ] Escalation decision tree
- [ ] Conflict resolution framework
- [ ] Interaction logging system
- [ ] Memory storage for agent decisions
- [ ] Blog post: "Multi-Agent Coordination"

#### Key Files
- `patterns/interaction-protocols/*.md`
- `logs/agent-interactions.log`
- `logs/decisions.log`

---

### v1.5.0: Evaluation Framework - Agent Quality Metrics
**Target**: 11 weeks from v1.0.0  
**Status**: 📋 Not Started

#### Goals
- Measure and improve agent performance
- Enable self-evaluation before handoffs
- Generate performance reports

#### Deliverables
- [ ] Metrics definitions per agent role
- [ ] Self-evaluation checklists
- [ ] Metrics calculation scripts
- [ ] Weekly performance report generator
- [ ] Metrics trend analysis with vector DB
- [ ] Blog post: "Measuring Agent Quality"

#### Key Files
- `metrics/README.md`
- `metrics/dashboards/*.md`
- `metrics/scripts/*.py`
- `metrics/reports/weekly-agent-performance.md`

---

### v1.6.0: Template System - Agent Bootstrapping
**Target**: 12 weeks from v1.0.0  
**Status**: 📋 Not Started

#### Goals
- Rapidly spin up new agents with best practices
- Provide templates for technical, product, and operations roles
- Auto-update configuration files

#### Deliverables
- [ ] Agent template generator (`bin/create-agent.sh`)
- [ ] Role templates (technical, product, operations, custom)
- [ ] Template customization options
- [ ] Auto-update for `agent_manifest.yml`
- [ ] Blog post: "Creating Custom Agents"

#### Key Files
- `bin/create-agent.sh`
- `templates/agents/*/`

---

### v2.0.0: Memory Fragment - Production Ready
**Target**: 13 weeks from v1.0.0  
**Status**: 📋 Not Started

#### Goals
- Package memory system as reusable fragment
- Enable production deployment
- Complete agentic system transformation

#### Deliverables
- [ ] Memory system fragment
- [ ] `apply-agent-memory.sh` script
- [ ] Integration with nx-dev-infra
- [ ] Production deployment guide
- [ ] Update fragments-guide.md
- [ ] v1.0.0 release blog post

#### Key Files
- `fragments/agent-memory/README.md`
- `fragments/agent-memory/apply-agent-memory.sh`

---

### v1.7.0: Supabase Auth App Fragment
**Target**: Parallel with v1.1-v1.6 development  
**Status**: 📋 Ready to start

#### Goals
- Provide production-ready web app scaffold with authentication
- Enable rapid full-stack development with Supabase
- Create reusable landing page and dashboard patterns

#### Deliverables
- [ ] `fragments/supabase-auth-app/` directory structure
- [ ] Next.js 14 app with App Router
- [ ] Marketing landing page (hero, features, CTAs)
- [ ] Complete auth flow (signup, login, password reset)
- [ ] Authenticated dashboard with profile dropdown
- [ ] Profile and settings pages
- [ ] ShadCN UI component integration
- [ ] Supabase client setup and RLS policies
- [ ] `bin/apply-supabase-auth-app.sh` script
- [ ] Fragment README with examples
- [ ] Blog post: "Building Full-Stack Apps with Supabase and .pip"

#### Key Files
- `fragments/supabase-auth-app/README.md`
- `fragments/supabase-auth-app/files/` (Next.js app structure)
- `bin/apply-supabase-auth-app.sh`
- `docs/fragments-guide.md` (updated)

---

### v1.8.0: Expo Mobile Fragment
**Target**: After v1.7.0  
**Status**: 📋 Not Started

#### Goals
- Provide production-ready mobile app scaffold with Expo
- Enable cross-platform mobile development
- Support Supabase auth integration

#### Deliverables
- [ ] `fragments/expo-mobile/` directory structure
- [ ] Expo SDK 50+ with Expo Router
- [ ] Onboarding and auth screens
- [ ] Tab navigation (Home, Profile, Settings)
- [ ] Biometric authentication support
- [ ] Supabase client for React Native
- [ ] Secure token storage
- [ ] Offline support with AsyncStorage
- [ ] `bin/apply-expo-mobile.sh` script
- [ ] Fragment README with deployment guide
- [ ] Blog post: "Mobile Development with Expo and .pip"

#### Key Files
- `fragments/expo-mobile/README.md`
- `fragments/expo-mobile/files/` (Expo app structure)
- `bin/apply-expo-mobile.sh`
- `docs/fragments-guide.md` (updated)
- `ia/agents/cto/tech-stack/tech-stack.md` (updated)

---

## Future Considerations (Post v2.0.0)

### Enhanced Memory Features
- Multi-modal memory (code + docs + issues + PRs)
- Semantic code search across all projects
- Cross-project pattern detection
- Automatic pattern suggestions

### Advanced Agent Capabilities
- Agent skill progression (junior → senior)
- Dynamic role assignment based on task
- Agent specialization (frontend, backend, DevOps)
- Autonomous agent spawning for subtasks

### Integration & Tooling
- GitHub Copilot integration
- Linear workflow automation
- Slack/Discord agent notifications
- VS Code extension for agent interaction

### Platform Features
- Web UI for memory exploration
- Visual agent interaction graphs
- Real-time collaboration dashboard
- Agent performance analytics

---

## Using the GitHub Roadmap

### How to Navigate

**Project Views:**
- **Board View** - Kanban board showing Backlog → Ready → In Progress → Review → Done
- **Table View** - All fields visible for filtering and bulk operations
- **Roadmap View** - Timeline visualization by milestone
- **By Initiative** - Group issues by strategic initiative

**Finding Work:**
```bash
# See all roadmap issues
gh issue list --label roadmap

# Filter by milestone
gh issue list --milestone "v1.1.0: Foundation"

# Filter by initiative
gh issue list --label initiative-1-agentic

# Find unassigned tasks
gh issue list --label roadmap --assignee ""
```

### Contributing to Roadmap

To propose new roadmap items:

1. **Use the issue template**: Create a new issue using the "Roadmap Item" template
2. **Describe value**: Explain the problem and proposed solution
3. **Estimate effort**: Use XS/S/M/L/XL sizing
4. **Add labels**: Tag with initiative, agent role, and type
5. **CPO triage**: CPO reviews weekly and adds to project if approved
6. **CEO approval**: Strategic initiatives require CEO sign-off

### Working on Roadmap Items

1. **Pick an issue** from the project board (Ready column)
2. **Self-assign** or ask to be assigned
3. **Create PR** referencing the issue number
4. **Link to milestone** if it's part of a version goal
5. **Update project**: Status auto-updates when PR created

For detailed implementation plans, see the Plans section in Warp or create a plan document.

---

**Roadmap Ownership**: COO (process), CPO (priorities), CEO (strategy)  
**Last Updated**: 2026-01-11  
**Next Review**: Weekly roadmap triage
