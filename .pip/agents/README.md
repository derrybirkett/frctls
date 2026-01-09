# .pip Agentic Workflow - Upstream Contribution Package

## Overview

This package provides an AI-powered autonomous development workflow for .pip framework projects. It implements:

- **Autonomous Implementation Agent** - Automatically implements roadmap tasks
- **CTO Review Agent** - Reviews PRs for code quality, architecture, performance
- **CISO Review Agent** - Reviews PRs for security vulnerabilities
- **Product-Led Triage** - CPO approval gate for agent suggestions
- **Auto-Merge** - Merges approved PRs automatically

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Autonomous Agent (scheduled)                                │
│  • Finds approved roadmap issues                             │
│  • Generates implementation via AI                           │
│  • Creates PR                                                │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────┬──────────────────────────────────────┐
│  CTO Review Agent     │  CISO Review Agent                   │
│  • Code quality       │  • Security scan                     │
│  • Architecture       │  • Vulnerability detection           │
│  • Creates issues     │  • Creates issues                    │
└──────────────────────┴──────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  Product Triage (human CPO)                                  │
│  • Reviews agent suggestions                                 │
│  • Approves → adds to roadmap                                │
│  • Rejects → closes with rationale                           │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  Auto-Merge                                                  │
│  • Merges if reviews pass                                    │
│  • Closes linked issues                                      │
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
.pip/
├── agents/
│   ├── config.template.json         # Configuration template
│   ├── autonomous-agent.js          # Implementation agent
│   ├── cto-review-agent.js          # Technical review agent
│   ├── ciso-review-agent.js         # Security review agent
│   ├── package.json                 # Node.js dependencies
│   └── README.md                    # This file
├── workflows/
│   ├── autonomous-roadmap-agent.yml # GitHub Actions workflow
│   ├── pr-review-agents.yml         # PR review workflow
│   └── README.md                    # Workflow documentation
└── docs/
    ├── SETUP.md                     # Installation guide
    ├── CPO-TRIAGE.md                # Product triage guide
    └── ARCHITECTURE.md              # System architecture
```

## Prerequisites

### Required
- GitHub repository with Actions enabled
- OpenAI API key (or compatible provider)
- Node.js 20+ installed in CI/CD
- pnpm 8+ (or adapt to npm/yarn)

### Optional
- Git hooks for branch enforcement
- Issue templates for roadmap tasks

## Quick Start

### 1. Configuration

Copy and customize the configuration:

```bash
cp .pip/agents/config.template.json .pip/agents/config.json
```

Edit `config.json` with your settings.

### 2. Set GitHub Secrets

In your repository settings, add:

```
OPENAI_API_KEY=sk-...
GITHUB_TOKEN=(automatically provided by GitHub Actions)
```

### 3. Install Workflows

Copy workflows to your repository:

```bash
cp .pip/workflows/*.yml .github/workflows/
```

### 4. Create Labels

Create required GitHub labels:

```bash
gh label create roadmap --description "Approved roadmap tasks"
gh label create agent-suggestion --description "Agent-generated suggestions"
gh label create needs-approval --description "Requires CPO approval"
gh label create priority-high --color ff0000
gh label create priority-medium --color ffaa00
gh label create priority-low --color 00ff00
```

### 5. Bootstrap Dependencies

Install agent dependencies:

```bash
cd .pip/agents
pnpm install
```

## Usage

### For Product (CPO)

**Weekly Triage:**
```bash
# View pending suggestions
gh issue list --label "needs-approval"

# Approve a suggestion
gh issue edit <number> --add-label "roadmap" --remove-label "needs-approval"

# Reject a suggestion
gh issue close <number> --reason "not planned"
```

### For Developers

**Manual Trigger:**
```bash
# Trigger autonomous agent manually
gh workflow run autonomous-roadmap-agent.yml -f priority=high
```

**Check Status:**
```bash
# See recent runs
gh run list --workflow="autonomous-roadmap-agent.yml" --limit 5

# Watch a specific run
gh run watch <run-id>
```

### For Repository Setup

The autonomous agent runs automatically every 6 hours (configurable). It:
1. Finds the next unassigned roadmap issue
2. Generates implementation via AI
3. Creates a PR
4. Review agents automatically review
5. Auto-merges if approved

## Configuration Options

See `config.template.json` for all available options.

### Key Settings

**AI Provider:**
```json
"ai_provider": {
  "type": "openai",
  "model": "gpt-4-turbo-preview",
  "api_key_env": "OPENAI_API_KEY"
}
```

**Review Agents:**
```json
"review_agents": {
  "cto": { "enabled": true },
  "ciso": { "enabled": true }
}
```

**Autonomous Schedule:**
```json
"autonomous_agent": {
  "schedule": "0 */6 * * *",  # Every 6 hours
  "priority_filter": "high"    # high, medium, low, or all
}
```

## Customization

### Adding Custom Review Agents

Create a new agent script following the pattern:

```javascript
// .pip/agents/custom-review-agent.js
async function performReview(pr) {
  // Your review logic
  return {
    decision: 'APPROVE|COMMENT|REQUEST_CHANGES',
    issues: [...]
  };
}
```

Add to workflow:

```yaml
custom-review:
  name: Custom Review
  runs-on: ubuntu-latest
  steps:
    - run: node .pip/agents/custom-review-agent.js
```

### Adapting to Other Platforms

The scripts use `gh` CLI commands. To adapt:

1. Replace `gh` commands with platform-specific CLI or API calls
2. Update workflow files for your CI/CD platform
3. Adjust authentication mechanisms

## Cost Considerations

**OpenAI API Costs (approximate):**
- Implementation: $0.05-0.20 per task
- Reviews: $0.02-0.05 per PR
- Monthly estimate: $5-20 for typical usage

**GitHub Actions:**
- Free tier: 2,000 minutes/month
- Agent runs: ~5 minutes per cycle
- Typical usage: well within free tier

## Troubleshooting

### Agent Not Picking Up Issues

Check:
```bash
# Are there approved roadmap issues?
gh issue list --label "roadmap" --label "priority-high"

# Are they unassigned?
gh issue view <number>
```

### Reviews Not Triggering

Verify:
- Workflow file in `.github/workflows/`
- Secrets configured (`OPENAI_API_KEY`)
- PR is from a non-fork branch

### Auto-Merge Not Working

Check:
- PR is from `automated/*` branch pattern
- Both review agents approved
- All checks passing

## License

MIT License - See LICENSE file

## Contributing

This package is designed for upstream contribution to .pip framework.

To contribute improvements:
1. Test changes in your repository
2. Submit PR to .pip framework repository
3. Include before/after metrics

## Support

- Documentation: `.pip/docs/`
- Issues: GitHub Issues
- Discussions: GitHub Discussions

## Acknowledgments

Developed as part of the .pip framework enhancement initiative to enable AI-powered autonomous development workflows while maintaining human oversight and product control.
