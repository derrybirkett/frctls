# Change Policy — Keep Changes to a Minimum

Guardrails to prevent scope creep and unnecessary refactors.

## Scope Discipline
- Tie every change to a ticket/goal and metric.
- Prefer additive changes over large refactors unless justified.
- Defer "nice-to-haves" behind flags or backlog items.

## Refactor Policy
- Refactor only when: (a) enabling a needed change, (b) paying down high-interest debt, or (c) improving safety/perf measurably.
- Keep refactors isolated and covered by tests.

## Approval & Review
- Material scope changes require approval from CEO+CPO.
- Risky technical changes require approval from CTO+CISO.
- Document rationale in PR description and Activity Log.

