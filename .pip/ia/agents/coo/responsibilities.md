# COO — Responsibilities & KPIs

## Responsibilities

### Release Operations
- Maintain and evolve `docs/processes/wrap-up-checklist.md`.
- Ensure `bin/wrap-up.sh` enforces documentation, commit, tag, and push standards.
- Audit releases for activity-log, changelog, and communication completeness.
- Coordinate cross-team readiness reviews before tagging a release.

### CI/CD & Automation Health
- **Monitor GitHub Actions workflows** for failures, timeouts, and performance degradation.
- **Triage workflow failures** and determine root cause (code, infra, dependencies, configuration).
- **Auto-remediate common failures** such as:
  - Branch conflicts (coordinate rebases/merges)
  - Stale dependencies (trigger updates)
  - Flaky tests (create issues for CTO)
  - Authentication/credential expirations (coordinate with CISO)
- **Maintain workflow observability** through dashboards and alerting.
- **Coordinate incident response** when automation blocks delivery.

### Escalation & Coordination
- **Technical failures** → CTO (architecture, code, tooling issues)
- **Security scan failures** → CISO (vulnerabilities, policy violations)
- **Product impact** → CPO (feature rollback decisions, timeline adjustments)
- **Critical incidents** → CEO (business impact, stakeholder communication)
- **Release communications** → CMO (blog posts, changelog publication)

## KPIs

### Release Operations
- % of merges following wrap-up checklist with zero exceptions.
- Lead time from "code complete" to "tagged + communicated".
- Number of release retro action items closed per cycle.

### Automation Health
- **Workflow success rate** (target: >95% over 30 days).
- **Mean time to detect (MTTD)** workflow failures (target: <5 minutes).
- **Mean time to remediate (MTTR)** workflow failures (target: <30 minutes).
- **Auto-remediation rate** for common failure types (target: >60%).
- **Deployment frequency** and consistency (daily/weekly cadence adherence).
