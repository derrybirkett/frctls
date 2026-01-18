# Linear Tasks - Local Backup

This file serves as a local backup of all Linear tasks for the PIP Framework project. If Linear connection is lost, this file provides continuity.

**Last Updated**: 2025-12-16  
**Linear Project**: [PIP Framework](https://linear.app/mnspc/project/pip-framework-9e570802c050)

## Active Epics

### MSTUDIO-55: [EPIC] v1.1.0: Foundation - Pattern Library & Resources
**Status**: Planned  
**Priority**: High  
**Timeline**: 2 weeks  
**Assignee**: You

**Goals**:
- Establish knowledge base with agentic design patterns
- Create pattern library for agent workflows
- Document decision frameworks and quality metrics

**Deliverables**:
- [ ] Resources directory with Agentic Design Patterns PDF
- [ ] 5-10 extracted patterns in markdown (ReAct, Planning, Reflection, Tool Use, Multi-agent)
- [ ] Patterns directory structure
- [ ] Agent workflow documentation (CTO, CPO, CISO, CMO, COO)
- [ ] Decision frameworks (architecture, prioritization, risk, scope)
- [ ] Quality metrics definitions (CTO, CPO, COO)
- [ ] Blog post: "Integrating Agentic Design Patterns"

**Related**: [ROADMAP.md](../ROADMAP.md#v110-foundation---pattern-library--resources)

---

### [PENDING] [EPIC] Application Fragments - Web & Mobile Scaffolds
**Status**: Planned  
**Priority**: High  
**Timeline**: 3 weeks  
**Assignee**: You

**Goals**:
- Provide production-ready fragments for web apps with Supabase auth
- Provide mobile app scaffold using Expo
- Enable rapid full-stack development

**Success Metrics**:
- Setup time: <10 minutes from git clone to running app
- Coverage: 90% of common web/mobile patterns
- Adoption: 3+ real projects within first month

**Related**: [ROADMAP.md](../ROADMAP.md#initiative-2-application-fragments---web--mobile-scaffolds), [Plan](../plans/)

---

## Active Tasks

### MSTUDIO-56: Extract and document agentic design patterns
**Parent**: MSTUDIO-55  
**Status**: Planned  
**Priority**: High  
**Labels**: patterns, documentation, v1.1.0  
**Assignee**: You

**Description**:
Extract and document 5-10 key agentic design patterns from the Agentic Design Patterns PDF (482 pages).

**Priority Patterns**:
1. **ReAct** - Reason, Act, Observe, Reflect cycle
2. **Planning** - Decompose, validate, execute
3. **Reflection** - Self-evaluation and learning
4. **Tool Use** - When and how agents select tools
5. **Multi-Agent Collaboration** - Coordination and handoffs

**Deliverables**:
- [ ] `resources/agentic-design-patterns/extracted-patterns/` directory
- [ ] Individual markdown files for each pattern
- [ ] Pattern template with Overview, When to Use, How it Works, Example, Benefits, Limitations
- [ ] README.md with pattern catalog

**Acceptance Criteria**:
- At least 5 patterns documented
- Each pattern follows template structure
- Examples are concrete and actionable
- Patterns reference page numbers from source PDF

---

### [PENDING] Create Supabase Auth App fragment (v1.7.0)
**Parent**: Application Fragments Epic  
**Status**: Planned  
**Priority**: High  
**Labels**: fragments, v1.7.0  
**Timeline**: 1 week  
**Assignee**: You

**Deliverables**:
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

**Tech Stack**:
- Next.js 14+ with App Router
- ShadCN UI + Tailwind CSS
- Supabase Auth + Postgres
- TypeScript

**Files**:
- `fragments/supabase-auth-app/README.md`
- `fragments/supabase-auth-app/files/` (Next.js app structure)
- `bin/apply-supabase-auth-app.sh`
- `docs/fragments-guide.md` (updated)

---

### [PENDING] Create Expo Mobile fragment (v1.8.0)
**Parent**: Application Fragments Epic  
**Status**: Planned  
**Priority**: High  
**Labels**: fragments, v1.8.0, mobile  
**Timeline**: 1 week  
**Assignee**: You

**Deliverables**:
- [ ] `fragments/expo-mobile/` directory structure
- [ ] Expo SDK 50+ with Expo Router
- [ ] Onboarding and auth screens
- [ ] Tab navigation (Home, Profile, Settings)
- [ ] Biometric authentication support
- [ ] Supabase client for React Native
- [ ] Secure token storage with Expo SecureStore
- [ ] Offline support with AsyncStorage
- [ ] `bin/apply-expo-mobile.sh` script
- [ ] Fragment README with deployment guide
- [ ] Blog post: "Mobile Development with Expo and .pip"

**Tech Stack**:
- Expo SDK 50+
- Expo Router (file-based routing)
- React Native Paper or NativeBase
- TypeScript

**Files**:
- `fragments/expo-mobile/README.md`
- `fragments/expo-mobile/files/` (Expo app structure)
- `bin/apply-expo-mobile.sh`
- `docs/fragments-guide.md` (updated)
- `ia/agents/cto/tech-stack/tech-stack.md` (updated)

---

### [PENDING] Replace Next.js with vanilla React for security
**Status**: Planned  
**Priority**: Medium  
**Labels**: security, technical-debt  
**Assignee**: You

**Description**:
Evaluate and replace Next.js with vanilla React setup to reduce attack surface and improve security posture.

**Context**:
Next.js introduces additional complexity and potential security vectors. Consider replacing with:
- Vite + React for web apps
- Vanilla React with custom server setup
- Maintain ShadCN UI and Tailwind compatibility

**Tasks**:
- [ ] Research vanilla React alternatives to Next.js App Router
- [ ] Evaluate Vite + React Router as replacement
- [ ] Assess migration path for existing fragments
- [ ] Document security benefits vs trade-offs
- [ ] Create POC implementation
- [ ] Update tech stack documentation

**Success Criteria**:
- Reduced bundle size and dependencies
- Improved security posture
- Maintains developer experience
- Compatible with existing fragment patterns
- Performance is equal or better

**Related**: [Tech Stack](../ia/agents/cto/tech-stack/tech-stack.md)

---

## Backlog

### [PENDING] Institutionalize Linear project management
**Status**: Planned  
**Priority**: High  
**Labels**: infrastructure, processes  
**Timeline**: 2 weeks

**Description**:
Make Linear a first-class citizen in .pip framework with agent role ownership, automation scripts, templates, and reusable fragments.

**Phases**:
1. Core scripts (linear-start-task.sh, linear-complete-task.sh, linear-sync.sh)
2. Process documentation
3. Agent manifest updates
4. Templates and conventions
5. Fragment creation
6. Validation with real usage

**Success Metrics**:
- 100% pip work tracked in Linear
- 80% automation of updates
- 100% commits reference tickets
- <30min organism adoption

**Related**: [Plan](../plans/), [docs/linear-integration.md](./linear-integration.md)

---

## Completed Tasks

_(None yet - tasks will move here when completed)_

---

## Sync Instructions

### Manual Sync
When Linear connection is lost, update this file manually:
1. Copy task details from Linear web interface
2. Update task status and progress
3. Commit changes to git
4. Resume syncing when Linear connection is restored

### Automated Sync (Future)
Once `bin/linear-sync.sh` is implemented:
```bash
# Sync Linear tasks to local file
./bin/linear-sync.sh --export docs/linear-tasks.md

# Import local tasks to Linear
./bin/linear-sync.sh --import docs/linear-tasks.md
```

### Format Guidelines
- Use `[PENDING]` prefix for tasks not yet created in Linear
- Include Linear ticket ID once created (e.g., MSTUDIO-XX)
- Keep status, priority, assignee up to date
- Update "Last Updated" date at top of file
- Link to related ROADMAP.md sections and plans

---

## Notes

- This file serves as **backup** - ROADMAP.md is still source of truth for initiatives
- Linear is the **working system** - sync this file regularly
- If Linear is unavailable, work from this file and sync later
- Use activity log for completed work tracking
