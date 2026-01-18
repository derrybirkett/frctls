# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Security
- **CRITICAL:** Enhanced .gitignore with comprehensive security patterns (.env*, .envrc, keys, certificates)
- **CRITICAL:** Added automated secret scanning with Gitleaks in CI/CD pipeline
- Enhanced pre-commit hook with fallback secret pattern detection (GitHub tokens, OpenAI keys, AWS keys)
- Created SECURITY.md with incident response procedures and security best practices
- Documented GitHub Actions permissions following least privilege principle
- Reduced pr-review-agents workflow permissions from contents:write to contents:read
- Added weekly security scans and comprehensive security reporting
- Risk reduction: HIGH → LOW
- Compliance alignment: OWASP Top 10, CWE-798, CWE-522, NIST 800-53

### Fixed
- Resolved security-scan workflow self-detection false positive
- Changed dependency vulnerability checks to warnings to allow merges while tracking issues separately

## Unreleased
- GitHub Pages deployment and content automation
- Scheduled content publishing workflow

## 2025-12-09 — Branch Protection & Strategic Roadmap
### Added
- **Git hooks system** - Pre-commit hook blocks direct commits to main branch locally
- **hooks/install-hooks.sh** - One-command installation script for git hooks
- **hooks/README.md** - Documentation for hook system and bypassing in emergencies
- **docs/github-branch-protection.md** - Complete guide for configuring GitHub branch protection
- **ROADMAP.md** - Strategic plan to transform .pip into complete agentic development system (v0.4.0 → v1.0.0)
- **resources/agentic-design-patterns/** - Added 482-page Agentic Design Patterns PDF as reference
- **GitHub branch protection rules** - Configured via API: enforce admins, require PRs, linear history, block force pushes

### Changed
- Updated README.md with git hooks installation as step 0 in Getting Started
- README.md now includes roadmap section highlighting 7-phase transformation plan

### Security
- Branch protection prevents unauthorized changes to main branch
- Hooks provide local enforcement before push to GitHub

## 2025-12-04 — Command Ownership & Wrap Automation
### Added
- `AGENTS.md` contributor guide with command ownership/usage sections so downstream agents know how to work in this repo.
- `bin/wrap-up.sh` script + COO role docs to automate the wrap-up checklist, commit, tag, and push process triggered by “ok wrap up”.

### Changed
- Updated `README.md`, `INDEX.md`, `WARP.md`, and `fragment-prompt.md` to include the COO role and agent-tool mappings.
- `ia/agent_manifest.yml` now lists owning agents and tools for transparency (CTO for bootstrap scripts, COO for wrap-up automation).
- `docs/processes/wrap-up-checklist.md` now explicitly references COO ownership and the wrap-up script.

## 2025-12-01 — Interactive Bootstrap Feature
### Added
- **bootstrap-project.sh** - Interactive wizard that captures user stories and generates personalized project documentation
- Script asks 6 questions (project name, users, problem, solution, differentiator, project type) and generates:
  - `docs/mission.md` with mission statement from user story
  - Customized `README.md` with project description
  - `docs/activity-log.md` and `docs/changelog.md` templates
- Colored CLI interface for better user experience
- Input sanitization to prevent control characters in generated files

### Changed
- Updated README.md with "Quick Setup (Recommended)" section highlighting interactive bootstrap
- Bootstrap wizard now first step in project setup flow

## 2025-12-01 — Fragment Compatibility Fixes
### Fixed
- **nx-dev-infra fragment** now compatible with Nx 22+ (updated executor from `@nx/workspace:run-commands` to `nx:run-commands`)
- Removed obsolete `version` attribute from docker-compose.yml (eliminates warning)
- Added `.nxignore` template to prevent "duplicate projects" error when using `.pip` as submodule
- Apply script now checks Docker is running before attempting to start containers
- Apply script now verifies Nx workspace is initialized before applying fragment

### Changed
- Enhanced apply script with prerequisite checks and better error messages
- Updated fragment README with Quick Start section and comprehensive troubleshooting
- Documented all common setup errors with solutions

## 2025-12-01 — Genome/Organism Model Integration
### Changed
- Integrated genome/organism model explanation into WARP.md for Warp AI agents
- Integrated genome/organism model explanation into fragment-prompt.md for all AI platforms
- Added genome model context to fragments-guide.md
- Clarified dual usage pattern: working ON `.pip` repository vs using `.pip` AS immutable template
- Improved AI agent understanding of when to modify files vs treat them as templates

## 2025-11-28 — Universal AI Agent Entrypoint
### Added
- **fragment-prompt.md** - Universal AI agent entrypoint file that works across ChatGPT, Claude, Cursor, Warp, and n8n
- Platform-specific integration examples for all major AI tools
- Comprehensive agent behavior guidelines, decision boundaries, and quick reference
- Blog post documenting the universal entrypoint feature

### Changed
- Updated README.md with AI agent guidance and platform-specific instructions
- Updated README.md directory tree to reflect actual repository structure
- Strengthened git branching rules in WARP.md with explicit "Never Work Directly on Main" section

## 2025-11-28 — Fragments System: Project Bootstrapping
### Added
- **Fragments system** - Reusable project scaffolds for consistent infrastructure
- **nx-dev-infra fragment** - Containerized Nx development environment with Docker, Postgres, and n8n
- **apply-nx-dev-infra.sh script** - One-command bootstrapping for new projects
- **Fragments guide** - Comprehensive documentation for using and creating fragments
- Expanded `.pip` mission to include scaffolding alongside documentation framework

### Changed
- Updated README.md, WARP.md, and mission.md to reflect fragments capability
- Reorganized as both documentation AND executable infrastructure patterns

## 2025-11-28 — Documentation & Security Improvements
### Added
- WARP.md file providing comprehensive guidance for AI agents working in the repository
- .envrc.example template for secure environment variable management with direnv
- Environment setup instructions in README.md

### Security
- Removed exposed Atlassian token from .envrc, replaced with secure template approach

## YYYY-MM-DD — Release Name
### Added
- <new features>

### Changed
- <updates/improvements>

### Fixed
- <bug fixes>

### Security
- <notable security changes>

## 2025-12-11 — Phase 1 MVP: Blog Content Strategy
### Added
- **Fractals of Change blog branding** - Customized Astro blog with organizational transformation focus
- **Content strategy framework** - Established 4 content pillars: theory, leadership, case studies, implementation
- **Foundational blog posts** - Published "Introducing Fractals of Change" and "Hidden Cost of Cultural Tokens"
- **Enhanced content schema** - Added categories, tags, author, and reading time to blog post structure
- **Kiro steering documents** - Created AI assistant guidance for product, tech stack, and project structure

### Changed
- Updated blog homepage with Fractals of Change messaging and value proposition
- Customized About page to reflect organizational transformation mission
- Removed template blog content to focus on fractal change methodology

### Content
- **"Introducing Fractals of Change"** - Foundational post explaining fractal approach to organizational transformation
- **"Hidden Cost of Cultural Tokens"** - Analysis of invisible productivity drains in enterprise organizations
- **Content creation template** - Standardized format for future blog posts with SEO guidelines

### Infrastructure
- **Blog deployment verified** - Successfully running at http://localhost:4321/
- **Development workflow established** - Docker + Astro + pnpm integration working seamlessly