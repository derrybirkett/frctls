# 2025-11-28 — Universal AI Agent Entrypoint

## What Shipped

- **fragment-prompt.md** — Universal AI agent entrypoint file that works across all major AI platforms
- Platform-agnostic guidance for agent behavior, git workflow, and decision boundaries
- Integration examples for ChatGPT Projects, Claude Projects, Cursor Composer, n8n workflows
- Comprehensive reference covering:
  - What .pip is and how it works
  - Agent behavior guidelines (LEAN, git workflow, security)
  - Folder structure and navigation
  - Fragment scaffolding instructions
  - C-suite agent decision boundaries
  - Quick commands and checklists

## Why It Matters

### Before
- **WARP.md** was Warp-specific — other AI platforms had no clear entrypoint
- Each AI tool required custom configuration to understand .pip
- Inconsistent agent behavior across different platforms
- No single source of truth for AI agent instructions

### After
- **One file works everywhere** — ChatGPT, Claude, Cursor, Warp, n8n
- Consistent agent behavior regardless of AI platform
- Simple integration: just reference `fragment-prompt.md` in project instructions
- Reduced onboarding time for new AI tools

### Real-World Impact

**ChatGPT Users**: Add to Project Instructions:
```
Read .pip/fragment-prompt.md for repository structure and agent behavior guidelines.
```

**Cursor Users**: Add to `.cursorrules`:
```
Follow guidelines in .pip/fragment-prompt.md
Always work on feature branches, never main
```

**Claude Users**: Add to project knowledge:
```
Repository follows .pip framework documented in fragment-prompt.md
```

**n8n Workflows**: Add "Read File" node pointing to `.pip/fragment-prompt.md` before agent tasks

## What's Inside

### 1. Repository Overview
Clear explanation of what .pip provides:
- Documentation framework with agent-based governance
- Process templates for discovery and delivery
- Reusable infrastructure fragments
- Product graphs for planning

### 2. Agent Behavior Guidelines
- LEAN methodology principles
- Git workflow (always feature branches, never main)
- Commit message format
- Security rules (never commit secrets)

### 3. Folder Navigation
Organized by purpose:
- **Critical files**: activity log, changelog, wrap-up checklist
- **Agent docs**: CEO, CTO, CPO, CISO, CMO, CRO roles
- **Fragments**: reusable project scaffolds
- **Processes**: workflow guides and templates

### 4. Decision Boundaries
Clear scope for each C-suite agent:
- **CEO**: Mission, strategy, cross-functional decisions
- **CTO**: Architecture, tech stack, delivery standards
- **CPO**: Roadmap, feature scope, acceptance criteria
- **CISO**: Security, risk, compliance
- **CMO**: Messaging, content strategy
- **CRO**: Pricing, packaging, revenue

### 5. Fragment Scaffolding
How to apply and create infrastructure fragments:
- What fragments are (reusable project scaffolds)
- Available fragments (nx-dev-infra currently)
- How to apply fragments with one command
- How to create new fragments

### 6. Platform Integration
Specific examples for each AI tool showing exactly how to integrate fragment-prompt.md into your workflow.

## The Bigger Picture

This addresses a key insight from ChatGPT: `.pip` needed a universal AI entrypoint that transcends any single platform. Now:

✅ **Works everywhere** — One file, all AI platforms  
✅ **Consistent behavior** — Same rules, same outcomes  
✅ **Easy adoption** — Clear integration examples  
✅ **Comprehensive** — Everything an AI agent needs to know  
✅ **Maintainable** — Single source of truth to update

As AI tooling evolves, you can confidently onboard new platforms by pointing them to `fragment-prompt.md`.

## What's Next

We're exploring:
- Additional fragments (Next.js, Expo, agent services, GraphQL APIs)
- Fragment versioning and dependency management
- Interactive fragment customization
- CLI tool for fragment management

The universal entrypoint unlocks these future capabilities across all AI platforms simultaneously.

## Links

- **New File**: [fragment-prompt.md](../../fragment-prompt.md)
- **Updated**: [README.md](../../README.md) — Added AI agent section
- **PR**: [#5](https://github.com/derrybirkett/pip/pull/5)
- **Changelog**: [docs/changelog.md](../changelog.md)
- **Related**: [WARP.md](../../WARP.md) — Warp-specific guidance
- **Fragments Guide**: [docs/fragments-guide.md](../fragments-guide.md)

---

**Feedback**: This release was directly inspired by ChatGPT user feedback identifying the need for a universal AI entrypoint. Thank you for helping us improve .pip for all AI platforms!
