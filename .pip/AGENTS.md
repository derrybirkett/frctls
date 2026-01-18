# Repository Guidelines

## Project Structure & Module Organization
`.pip/` is the template genome—treat it as read-only when embedded elsewhere, but in this repo we keep it authoritative. Mission and delivery intent live in `mission/` and `method/`. Product surfaces are described in `graph/`, while `ia/` and its `agents/` subtree define decision rights. Living documents sit in `docs/` (activity log, changelog, processes, templates, tools). Use `fragments/` for reusable scaffolds (see `fragments/nx-dev-infra/`) and `bin/` for helper scripts. Store new assets next to the doc or fragment they refine so agents can find them through `README.md` and the `docs/` tree.

## Build, Test, and Development Commands
Run `bin/bootstrap.sh` from a downstream project root to scaffold `.pip` with guided prompts (owned by the CTO). Apply the Nx/Docker/Postgres fragment with `bin/apply-nx-dev-infra.sh <target-dir>`; it copies files from `fragments/nx-dev-infra/files`. Validate onboarding via `bin/test-bootstrap.sh`, which feeds canned answers into the bootstrapper; tweak it whenever prompt text changes. For mission/story creation, use `bin/bootstrap-project.sh`. Scripts assume POSIX shell plus direnv configured via `.envrc`/`.envrc.example`.

## Coding Style & Naming Conventions
Documentation is Markdown-first: headings increment by level, wrap prose at ~100 chars, and keep tables simple. YAML/JSON files are two-space indented; shell scripts are formatted with `bash -n` + `shellcheck` before committing. Use imperative voice (“Add agent manifest”) for commits and prefer lowercase dashed filenames (`docs/processes/wrap-up-checklist.md`). Branch names follow `feat/`, `fix/`, `docs/`, or `chore/` prefixes per `CONTRIBUTING.md`.

## Testing Guidelines
This repo mostly exercises processes, so test changes by running the affected script plus `bin/test-bootstrap.sh` when prompt logic changes. When editing fragment code, add or update the downstream project tests the fragment mentions (Jest, Vitest, pytest, Go test—see `ia/agents/cto/tech-stack/testing-strategy.md`). Record manual verification in the PR template’s test plan and tick the wrap-up checklist in `docs/processes/wrap-up-checklist.md` before merging.

## Commit & Pull Request Guidelines
Each PR should cite the goal, scope, risks, tests, and linked issues using `docs/templates/pr-template.md`. Update both `docs/activity-log.md` and `docs/changelog.md` alongside substantive changes so downstream consumers inherit context. Keep commits atomic with imperative subjects and reference IDs when relevant. Route reviewers based on scope (CEO for mission, CTO/CISO for technical or security, etc.) using `ia/agent_manifest.yml`, and attach screenshots or command transcripts for UX or script updates.

## Security & Configuration Tips
Secrets belong in `.envrc`, never in repo files. Follow `ia/agents/ciso/security-policies.md` for dependency review, access control, and penetration-testing cadence. Before publishing new fragments or scripts, verify they fail fast when required tools are missing and document configuration steps in `docs/tools/` or the fragment README so other agents can reproduce environments safely.

## Command Ownership
- **CTO**: `bin/bootstrap-project.sh`, `bin/bootstrap.sh`, `bin/test-bootstrap.sh`, `bin/apply-nx-dev-infra.sh` — automation for bootstrapping genomes and applying infra fragments.
- **COO**: `bin/wrap-up.sh` — enforces release hygiene, docs, commits, tags, and pushes.

## Command Glossary
- **ok wrap up** — (COO-owned) Run `bin/wrap-up.sh` to walk through the wrap process: confirm `docs/processes/wrap-up-checklist.md`, update the activity log and changelog, stage everything, prompt for a commit message, optionally tag (e.g., `v0.4.0`), and push code + tags back to GitHub.


<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- You have access to the Nx MCP server and its tools, use them to help the user
- When answering questions about the repository, use the `nx_workspace` tool first to gain an understanding of the workspace architecture where applicable.
- When working in individual projects, use the `nx_project_details` mcp tool to analyze and understand the specific project structure and dependencies
- For questions around nx configuration, best practices or if you're unsure, use the `nx_docs` tool to get relevant, up-to-date docs. Always use this instead of assuming things about nx configuration
- If the user needs help with an Nx configuration or project graph error, use the `nx_workspace` tool to get any errors

<!-- nx configuration end-->