# Glossary

## System Terms

### .pip
**Project Intelligence & Process**. The operational framework for your project, including mission, methods, agents, and documentation.

### Agent
A role with defined decision rights and responsibilities. Based on C-suite model: CEO, CTO, CPO, CISO, CMO, CRO. Each agent has clear ownership over specific domains and interfaces with other agents.

### Graph
The interconnected surfaces you're building (e.g., product app, marketing website, blog). "Graph" files map key flows, requirements, and structures for each surface.

### Wrap-Up
The process of properly finishing work before moving to the next task. Includes documentation updates, merging code, tagging releases, and communicating changes.

## Documentation

### Activity Log
Historical record of all changes merged to main. Tracks what changed, who changed it, why, and links to related issues/docs. Found at `.pip/docs/activity-log.md`.

### Changelog
User-facing release notes describing new features, improvements, fixes, and security updates. Written from user perspective, not technical implementation. Found at `.pip/docs/changelog.md`.

### Mission
Document defining why the project exists, what problem it solves, and the vision for success. Found at `.pip/mission/mission.md`.

### Method
The delivery methodology from discovery through build to ship. Defines how to approach data models, APIs, UI, and Definition of Done. Found at `.pip/method/delivery-method.md`.

## Roles & Responsibilities

### CEO — Chief Executive Officer
Owns mission, strategy, and cross-functional prioritization. Final decision authority on strategic tradeoffs.

### CTO — Chief Technology Officer
Owns technical architecture, delivery standards, and engineering quality. Decides implementation approach and tooling.

### CPO — Chief Product Officer
Owns product strategy, roadmap, and feature scope. Manages product discovery and prioritizes outcomes.

### CISO — Chief Information Security Officer
Owns security policies, risk management, and compliance. Approves security-relevant changes and exceptions.

### CMO — Chief Marketing Officer
Owns messaging, content strategy, and marketing channels. Approves all public-facing content and campaigns.

### CRO — Chief Revenue Officer
Owns revenue strategy, pricing, and funnel optimization. Manages retention and expansion strategies.

## Process Terms

### Definition of Done (DoD)
Checklist of requirements that must be met before work is considered complete. Includes business, product, engineering, security, and documentation criteria.

### Initiative
A substantial body of work aligned with strategic goals. Typically scoped using a one-pager template defining problem, solution, metrics, and constraints.

### Discovery
Early phase of work focused on understanding the problem, validating assumptions, and defining approach before building.

### Wrap-Up Checklist
Specific list of tasks required to properly complete work: testing, documentation, merging, tagging, and communication. Found at `.pip/docs/processes/wrap-up-checklist.md`.

### PR Template
Standard format for pull requests including goal, scope, testing, risks, and required approvals. Found at `.pip/docs/templates/pr-template.md`.

## Technical Terms

### Testing Pyramid
Testing strategy with many fast unit tests at the base, some integration tests in the middle, and few end-to-end tests at the top.

### Playwright
Preferred browser automation framework for end-to-end testing.

### LEAN Methodology
Product development approach focusing on validated learning, minimum viable products, and build-measure-learn cycles.

### Branch Naming
Standardized git branch naming: `feat/`, `fix/`, `docs/`, `chore/` prefixes with short descriptions.

### Security Scan
Automated checks for vulnerabilities in code and dependencies. Required to pass before merging.

## Artifact Types

### One-Pager
Concise document (1-2 pages) summarizing an initiative: problem, solution, success metrics, risks, and timeline.

### Playbook
Detailed guide for executing specific processes or workflows. Contains step-by-step instructions and best practices.

### Runbook
Operational guide for handling specific scenarios like incidents, deployments, or troubleshooting.

### Tech Stack
Documentation of technology choices, frameworks, libraries, and infrastructure decisions.

## Metrics & Measurement

### North Star Metric
Single most important metric that best captures the core value delivered to customers.

### Leading Indicator
Metric that predicts future outcomes (e.g., signup rate predicts revenue).

### Lagging Indicator
Metric that reflects past results (e.g., revenue is the outcome of earlier activities).

### Activation
Point where a user experiences the "aha moment" and realizes value from the product.

### Churn Rate
Percentage of customers who stop using the product in a given time period.

### LTV (Lifetime Value)
Total revenue expected from a customer over their entire relationship.

### CAC (Customer Acquisition Cost)
Total cost to acquire a new customer, including marketing and sales expenses.

### NRR (Net Revenue Retention)
Percentage of revenue retained from existing customers, including expansions and churn.

## Compliance & Security

### GDPR
General Data Protection Regulation — EU privacy law requiring data protection and user rights.

### CCPA
California Consumer Privacy Act — California privacy law with similar protections to GDPR.

### SOC 2
Security and availability framework for service organizations handling customer data.

### MFA (Multi-Factor Authentication)
Security mechanism requiring multiple forms of verification to access systems.

### RBAC (Role-Based Access Control)
Access control approach where permissions are assigned to roles, not individuals.

### PII (Personally Identifiable Information)
Any data that can identify an individual (email, name, address, etc.).

## Development Terms

### CI/CD
Continuous Integration / Continuous Deployment — automated pipeline for testing and deploying code.

### Linting
Automated checking of code for style, formatting, and common errors.

### Type Checking
Verifying that variables and functions use correct data types (TypeScript, mypy, etc.).

### Code Coverage
Percentage of code executed by automated tests.

### Integration Test
Test verifying that multiple components work together correctly.

### E2E Test (End-to-End)
Test simulating real user flows through the entire application.

### Staging Environment
Production-like environment for final testing before deployment.

## AI & Automation

### MCP (Model Context Protocol)
Protocol for providing context to AI models. Used with Context7 for documentation.

### Context7
Service providing up-to-date documentation and code snippets via MCP.

### Agent Mode
AI-assisted development environment (like Warp Agent Mode).

### Shadow Repository
Private git repository acting as second brain for personal/professional operations.

## Project Management

### Linear
Issue tracking and project management tool. Integrations may reference Linear tickets.

### Epic
Large body of work broken down into multiple issues or tasks.

### Spike
Time-boxed investigation to answer a question or reduce uncertainty.

### Blocker
Issue preventing progress on other work.

### Tech Debt
Code quality issues, outdated dependencies, or architectural limitations that should be addressed.
