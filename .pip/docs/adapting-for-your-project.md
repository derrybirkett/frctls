# Adapting .pip for Your Project

This guide helps you customize the .pip template for different types of projects.

## Quick Start

1. Copy the `.pip/` directory to your project root
2. Follow the customization steps for your project type below
3. Remove sections marked "Remove" and complete sections marked "Customize"
4. Delete this file once you've adapted the template

## Project Type Adaptations

### SaaS Product
**Keep everything** — this template is designed primarily for SaaS products.

**Customize:**
- `mission/mission.md` — Define your target users and value proposition
- `graph/product-app.md` — Map your product flows and features
- `graph/marketing-website.md` — Define your marketing site structure
- `graph/blog.md` — Plan your content strategy
- `ia/agent_manifest.yml` — Assign owners to all roles

**Optional:**
- Remove CRO if you don't have revenue/monetization yet
- Remove CMO if you're pre-marketing (but add it back before launch)

---

### Open Source Library/Framework
**Keep:**
- Mission, method, agents (CEO, CTO, CISO)
- Testing strategy, security policies
- Activity log, changelog, contributing guide

**Remove:**
- `graph/marketing-website.md` (unless you have a docs site)
- `graph/product-app.md` (no product app)
- CMO and CRO agent directories
- Blog graph (unless you have a project blog)

**Customize:**
- `mission/mission.md` — Focus on developer users and use cases
- Create `graph/library-api.md` to document your API surface
- Update `CONTRIBUTING.md` with OSS-specific guidelines (CLA, DCO, etc.)

---

### Internal Tool/Service
**Keep:**
- Mission, method, agents (CEO, CTO, CISO)
- Testing strategy, security policies
- Activity log, changelog

**Remove:**
- `graph/marketing-website.md` (no public marketing)
- `graph/blog.md` (no public blog)
- CMO and CRO directories (no marketing/revenue)

**Customize:**
- `mission/mission.md` — Define internal users and business value
- `graph/product-app.md` — Rename to match your tool (e.g., `admin-portal.md`)
- Simplify agent structure if you have a small team (maybe just CTO)

---

### Mobile App
**Keep:**
- Everything except potentially marketing website

**Customize:**
- `graph/product-app.md` — Rename to `mobile-app.md` and adapt for mobile flows
- Add platform-specific considerations (iOS, Android, or both)
- Update testing strategy to include device testing and app store guidelines
- Consider adding app store optimization to CMO responsibilities

**Remove:**
- `graph/marketing-website.md` if you only have an app store presence (or adapt for landing page)

---

### API/Backend Service
**Keep:**
- Mission, method, core agents (CEO, CTO, CISO)
- Testing strategy, security policies

**Remove:**
- `graph/product-app.md` (no UI)
- `graph/marketing-website.md` (unless you have a developer portal)
- `graph/blog.md` (unless you publish content)
- CMO (unless you have developer relations/content)

**Customize:**
- Create `graph/api-surface.md` to document endpoints and data models
- Focus testing strategy on API testing and integration tests
- Emphasize security policies for API authentication and authorization
- Consider keeping CMO if you have API documentation and developer content

---

### Marketing Website Only
**Keep:**
- Mission, CMO, CEO
- Marketing website graph
- Blog graph (if you have one)

**Remove:**
- `graph/product-app.md` (no product yet)
- CTO responsibilities (keep CTO role for technical infra, but simplified)
- CISO (unless handling sensitive data)
- CRO (unless you have revenue/leads)

**Customize:**
- Simplify agent structure significantly
- Focus on content creation and publishing workflows
- Emphasize SEO and analytics in CMO responsibilities

---

### Monorepo/Platform
**Keep everything**, but adapt:

**Customize:**
- Create separate graph files for each major surface (e.g., `graph/admin-app.md`, `graph/customer-app.md`, `graph/api.md`)
- Consider per-surface activity logs if teams are independent
- Update agent responsibilities to clarify cross-surface concerns
- May need multiple CPOs or product leads for different surfaces

---

## Minimal Configuration

If you want the bare minimum to get started:

**Must Keep:**
1. `README.md` — Explains what .pip is
2. `mission/mission.md` — Why your project exists
3. `CONTRIBUTING.md` — How to contribute
4. `docs/activity-log.md` — Track changes
5. `docs/changelog.md` — User-facing notes

**Can Add Later:**
- Agent structure as your team grows
- Graph files as your product evolves
- Processes and templates as needed

---

## Agent Structure Simplification

### Solo Developer
Keep: CEO role only (you wear all hats)

Files needed:
- `ia/agents/ceo/role.md`
- `ia/agents/ceo/responsibilities.md`

Remove all other agent directories.

### Small Team (2-5 people)
Keep: CEO, CTO, CPO (distribute among team)

Files needed:
- CEO: mission and strategy
- CTO: technical decisions
- CPO: product decisions

Remove: CISO, CMO, CRO, COO (team members handle these as needed without formal roles)

### Growing Team (5-15 people)
Keep: CEO, CTO, CPO, CISO

Add back: CMO when you start marketing actively, CRO when you have revenue, COO when release cadence needs explicit ownership

### Mature Organization (15+ people)
Keep: All agent roles (CEO, CTO, CPO, CISO, CMO, CRO, COO)

Each role should have a dedicated owner or small team.

---

## Common Customizations

### Adding New Graph Files
Create `graph/[surface-name].md` for any major surface:
- Admin portal: `graph/admin-portal.md`
- API: `graph/api.md`
- Mobile app: `graph/mobile-app.md`
- CLI tool: `graph/cli.md`
- Chrome extension: `graph/extension.md`

Use existing graph files as templates.

### Adding New Agent Roles
If you need specialized roles:
- VP Engineering (under CTO)
- Product Manager (under CPO)
- DevOps Lead (under CTO)
- Growth Lead (under CRO)

Create subdirectories like:
```
ia/agents/cto/
  ├── role.md
  ├── vp-engineering/
  │   ├── role.md
  │   └── responsibilities.md
```

### Multi-Region/Multi-Product
For complex organizations:
- Keep one `.pip/` at root for overall mission and cross-cutting concerns
- Consider per-product activity logs and changelogs
- Use agent manifest to clarify decision authority across products

---

## What NOT to Remove

Even if customizing heavily, keep these core concepts:
1. **Mission** — Every project needs a "why"
2. **Activity Log** — Historical context is invaluable
3. **Changelog** — If you have users, they need to know what changed
4. **Contributing Guide** — Clear contribution process
5. **Security Policies** — If you handle any data or deployment

---

## After Customization

Once you've adapted the template:

1. **Delete unused files** — Don't leave template placeholders
2. **Fill in mission.md** — This is the foundation everything else builds on
3. **Update agent owners** — Assign real people to roles
4. **Remove this file** — Once you're done adapting, delete this guide
5. **Start using it** — Begin updating activity log and following the wrap-up process

---

## Getting Help

If you're unsure what to keep or remove:
- Start minimal and add as needed
- "When in doubt, keep it" — easier to ignore extra docs than recreate them
- Focus on what provides value for your specific context
- Remember: this is a template, not a rigid framework

The goal is to have just enough process to move fast with confidence, not to create bureaucracy.
