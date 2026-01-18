# Agentic Workflow (Seeded by .pip)

This project uses `.pip` as an immutable **genome**.

- `.pip/` is the reference system (templates, patterns, agent roles)
- `docs/` is the **organism** (this project’s living decisions and history)

This document is intentionally short: it gives you a practical starting point for using agents to improve the organism **with a human in the loop**.

## Core idea

Agents are role-based collaborators with defined decision rights:

- **CPO**: defines outcomes and scope
- **CTO**: implements and validates
- **CISO**: reviews security/risk
- **COO**: wraps up and ships (docs + release hygiene)

Read the full agent governance guide: `../.pip/AGENTS.md`.

## Default workflow (recommended)

### 1) Decide “what” (CPO + you)

- Write a small one-pager for the next initiative.
- Define success metrics and explicit non-goals.

Template reference (PRD-lite): `../.pip/ia/agents/cpo/initiative-one-pager.md`.

### 2) Plan delivery increments (CPO → CTO)

- Break the initiative into small increments with a clear Definition of Done.
- If the task is non-trivial, write a short plan before coding.

Method reference: `../.pip/method/delivery-method.md`.

### 3) Implement “how” (CTO)

- Iterate using a tight loop: reason → act → observe → reflect.
- Validate with the project’s tests/build.

Patterns reference:
- `../.pip/blog/2025-12-17-agentic-design-patterns.md`
- `../.pip/blog/2025-12-19-agent-workflow-documents.md`

### 4) Review risk (CISO)

- For auth, payments, secrets, or user data: get a security review before shipping.
- Document any accepted risks.

### 5) Wrap-up + ship (COO)

- Update `docs/activity-log.md` and `docs/changelog.md` alongside substantive changes.
- Tag releases when appropriate.

If available in your `.pip` version, the COO wrap-up helper is: `./.pip/bin/wrap-up.sh`.

## What agents should update in the organism

Keep the organism authoritative by writing decisions and history into `docs/`:

- `docs/mission.md` (your mission, outcomes, non-goals)
- `docs/graph/*` (your product surfaces and flows)
- `docs/activity-log.md` (what changed and why)
- `docs/changelog.md` (user-facing release notes)

Avoid putting project-specific history inside `.pip/`.

## Optional: weekly review + prioritization

If available in your `.pip` version, you can run: `./.pip/bin/review-and-prioritize.sh`.

This is intended to summarize recent progress and propose next steps, but it should not execute work without your explicit approval.
