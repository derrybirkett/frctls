# Contributing

Thanks for helping improve this project. This guide explains how to propose edits.

## Branch Naming
- `feat/<short-desc>` for features
- `fix/<short-desc>` for bug fixes
- `docs/<area>` for documentation
- `chore/<task>` for maintenance

## Pull Requests
- Use the PR template: describe goal, scope, screenshots, test plan, risks
- Link issues and related docs (e.g., `.pip/docs/...`)
- Update `./.pip/docs/changelog.md` and `./.pip/docs/activity-log.md`

## Review & Approvals
- Small, focused PRs are easier to review
- Required approvals depend on scope:
  - Product scope: CPO
  - Technical/infra: CTO (+ CISO for security-impacting)
  - Messaging/marketing: CMO
  - Pricing/packaging: CRO
  - Cross-functional/mission: CEO
  - **Breaking changes: CEO + relevant agent** (must be well-documented)

### Breaking Changes & Major Updates

Breaking changes require extra scrutiny to protect users:

**Required:**
- [ ] CEO approval (strategic impact assessment)
- [ ] Relevant agent approval (CTO for technical, CPO for product, etc.)
- [ ] Migration guide in `docs/` directory
- [ ] Updated changelog with clear "Breaking Change" label
- [ ] Version bump reflecting semver (e.g., v1.x → v2.0)
- [ ] Announcement plan (consider CMO review for messaging)

**Definition:** A breaking change is any modification that:
- Removes or significantly changes existing functionality
- Requires users to update their code or configuration
- Changes the structure of reusable fragments
- Alters the genome/organism contract
- Breaks backward compatibility with previous versions

**Example:** Extracting the website from the kernel repo (v1 → v2) was a breaking change requiring migration documentation.

### Self-Merge Guidelines

While we trust contributors' judgment, consider getting peer review for:
- Changes affecting multiple components or agents
- New patterns or architectural decisions
- Changes to core tooling (bootstrap, wrap-up, fragments)
- Breaking changes (required, not optional)
- Security-sensitive changes

**Safe to self-merge:**
- Documentation fixes and improvements
- Bug fixes with tests
- Minor refactoring within a single component
- Activity log and changelog updates

## Standards
- Code: follow project linters/formatters; add tests where relevant (see [testing strategy](./ia/agents/cto/tech-stack/testing-strategy.md))
- Security: follow [security policies](./ia/agents/ciso/security-policies.md); never commit secrets
- Docs: prefer concise Markdown; include context and links
- Commits: small, atomic; imperative subject; reference issues

## Automation
- PRs can be routed to the right agent via `./ia/agent_manifest.yml`
- CI checks: lint, test, security scans must pass

