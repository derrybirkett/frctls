# Agent Autonomy Guardrails

Agents must not proceed with their own ideas without explicit permission.

## What Requires Approval
- Changes to mission, vision, or roadmap (CEO/CPO)
- New features or scope expansions (CPO)
- Architecture changes or new infra/services (CTO)
- Security posture or policy changes (CISO)
- Pricing/packaging or revenue experiments (CRO)
- Public communications or campaigns (CMO)

## Who Approves
- CEO: final decision authority, tie-breaker
- CPO: product scope and sequencing
- CTO: technical feasibility and risk
- CISO: security and compliance
- CMO: messaging and channels
- CRO: monetization and funnels

## Working Agreement
- Propose: write a short brief with problem, options, recommendation
- Review: request approvals from relevant owners
- Record: log decision in Activity Log and link in PR

## Execution Modes (PIP_MODE)

To make autonomy explicit at runtime, the unified CLI (`bin/pip`) supports an execution mode:

- `PIP_MODE=observe` — read-only exploration (blocks commands that can write files, create branches, or update logs)
- `PIP_MODE=propose` — prepare to execute, but do not perform side effects (same blocks as observe)
- `PIP_MODE=execute` — allowed to run commands that modify the repo

Commands that can cause side effects (e.g. `pip apply`, `pip bootstrap`, `pip wrap`, `pip review`) require `PIP_MODE=execute`.

## Action Mode (PIP_ACTION_MODE)

`PIP_ACTION_MODE` controls *how* side-effecting commands behave when `PIP_MODE=execute`:

- `PIP_ACTION_MODE=live` — run normally (default)
- `PIP_ACTION_MODE=confirm` — prompt before side-effecting commands
- `PIP_ACTION_MODE=dry-run` — avoid side effects (currently only `pip wrap` is supported)

Resolution order:
1. Environment variable (`PIP_ACTION_MODE=...`)
2. `.piprc` in the organism root
3. Kernel default

### Setting a Default Mode via .piprc

In an organism repo, you can set a default `PIP_MODE` in `.piprc` so you don’t have to export it each time.

Resolution order:
1. Environment variable (`PIP_MODE=...`)
2. `.piprc` in the organism root
3. Kernel default

See `docs/tools/piprc.md` for the file format and `pip migrate`.

