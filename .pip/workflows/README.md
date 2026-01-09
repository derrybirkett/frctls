# .pip Agentic Workflows

GitHub Actions workflows for autonomous development and AI-powered code review.

## Overview

This directory contains two workflows that power the .pip agentic development system:

1. **autonomous-roadmap-agent.yml** - Implements roadmap tasks automatically
2. **pr-review-agents.yml** - Reviews PRs with CTO and CISO agents, auto-merges

## Files

### autonomous-roadmap-agent.yml

**Trigger:** 
- Schedule: Every 6 hours (configurable)
- Manual: Via workflow_dispatch

**What it does:**
1. Finds next unassigned roadmap issue
2. Generates implementation using AI
3. Creates feature branch
4. Creates pull request
5. Links PR to issue

**Configuration:**
```yaml
schedule:
  - cron: '0 */6 * * *'  # Change frequency here
```

**Workflow Inputs:**
- `priority`: Filter by priority (high, medium, low, all)

**Required Secrets:**
- `OPENAI_API_KEY`: OpenAI API key for code generation
- `GITHUB_TOKEN`: Automatically provided by GitHub Actions

### pr-review-agents.yml

**Trigger:**
- Pull request opened
- Pull request synchronized (new commits)
- Pull request reopened

**What it does:**
1. CTO Review: Analyzes code quality, architecture, testing
2. CISO Review: Scans for security vulnerabilities
3. Creates issues for suggestions/vulnerabilities
4. Auto-merges if approved (automated/* branches only)

**Jobs:**
1. `cto-review` - Technical review
2. `ciso-review` - Security review
3. `auto-merge` - Conditional merge

**Required Secrets:**
- `OPENAI_API_KEY`: OpenAI API key for reviews
- `GITHUB_TOKEN`: Automatically provided

**Outputs:**
- `cto_should_block`: true if critical issues found
- `ciso_should_block`: true if critical vulnerabilities

## Installation

### 1. Copy to Repository

```bash
cp .pip/workflows/*.yml .github/workflows/
```

### 2. Set Secrets

In your GitHub repository:
- Settings → Secrets and variables → Actions
- Add `OPENAI_API_KEY` with your API key

### 3. Verify Installation

```bash
# List workflows
gh workflow list

# Check status
gh workflow view autonomous-roadmap-agent.yml
gh workflow view pr-review-agents.yml
```

## Customization

### Change Schedule

Edit `autonomous-roadmap-agent.yml`:

```yaml
schedule:
  - cron: '0 */12 * * *'  # Every 12 hours
  - cron: '0 9 * * 1-5'    # 9am weekdays only
```

### Disable Auto-Merge

Edit `pr-review-agents.yml`:

```yaml
auto-merge:
  if: false  # Disable auto-merge
```

### Add Custom Review Agent

Add a new job in `pr-review-agents.yml`:

```yaml
jobs:
  custom-review:
    name: Custom Review
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run custom review
        run: node .pip/agents/custom-review-agent.js
```

### Change Branch Pattern

By default, auto-merge only works for `automated/*` branches. To change:

```yaml
auto-merge:
  if: |
    startsWith(github.head_ref, 'bot/') ||
    startsWith(github.head_ref, 'agent/')
```

## Usage

### Manual Trigger

Trigger autonomous agent manually:

```bash
# Default (all priorities)
gh workflow run autonomous-roadmap-agent.yml

# High priority only
gh workflow run autonomous-roadmap-agent.yml -f priority=high

# Medium priority
gh workflow run autonomous-roadmap-agent.yml -f priority=medium
```

### Monitor Runs

```bash
# List recent runs
gh run list --workflow="autonomous-roadmap-agent.yml"

# Watch a run
gh run watch <run-id>

# View logs
gh run view <run-id> --log
```

### Disable/Enable

```bash
# Disable a workflow
gh workflow disable autonomous-roadmap-agent.yml

# Enable it again
gh workflow enable autonomous-roadmap-agent.yml
```

## Workflow Permissions

Required permissions in `autonomous-roadmap-agent.yml`:

```yaml
permissions:
  contents: write      # Create branches, push code
  pull-requests: write # Create PRs
  issues: write        # Update issues
```

Required permissions in `pr-review-agents.yml`:

```yaml
permissions:
  contents: write      # Merge PRs
  pull-requests: write # Comment, approve
  issues: write        # Create issues for suggestions
```

## Troubleshooting

### Workflow Not Running

Check:
```bash
# Is workflow enabled?
gh workflow view autonomous-roadmap-agent.yml

# Recent errors?
gh run list --workflow="autonomous-roadmap-agent.yml" --status failure
```

### Permission Errors

Verify repository settings:
- Settings → Actions → General
- Workflow permissions: "Read and write permissions"
- Check "Allow GitHub Actions to create and approve pull requests"

### No Issues Found

The autonomous agent requires:
- Issues labeled with `roadmap`
- Issues with priority label (`priority-high`, `priority-medium`, `priority-low`)
- Issues not assigned
- Issues open

Check:
```bash
gh issue list --label "roadmap" --label "priority-high"
```

### Auto-Merge Not Working

Verify:
1. PR branch starts with `automated/`
2. Both review agents approved
3. All required checks passing
4. Repository allows auto-merge (Settings → General → Pull Requests)

## Cost Considerations

**GitHub Actions Minutes:**
- Autonomous agent: ~5 minutes per run
- Review agents: ~2 minutes per PR
- Free tier: 2,000 minutes/month

**Typical Usage:**
- 4 runs/day × 30 days = 120 runs/month = 600 minutes
- 10 PRs/month = 20 minutes
- **Total: ~620 minutes/month** (within free tier)

## Security

### Protecting Main Branch

Add branch protection rules:
- Settings → Branches → Add rule
- Branch name pattern: `main`
- Require status checks: `cto-review`, `ciso-review`
- Require pull request reviews
- Dismiss stale reviews

### Secret Scanning

Enable:
- Settings → Security → Code security and analysis
- Enable "Secret scanning"
- Enable "Push protection"

### Review Permissions

The workflows only access:
- Repository code (read)
- Issues (write)
- PRs (write)

They do NOT access:
- Organization secrets
- Other repositories
- Deployment environments (unless explicitly configured)

## Best Practices

1. **Start Conservative**: Begin with low-frequency runs (every 12-24 hours)
2. **Monitor Costs**: Track OpenAI API usage in first month
3. **Test First**: Run workflows manually before enabling schedule
4. **Branch Protection**: Require reviews for production branches
5. **Label Strategy**: Use consistent labels across projects
6. **Incremental Rollout**: Start with one agent, add others gradually

## Integration with .pip Bootstrap

To integrate with .pip bootstrap process, add to `bootstrap.sh`:

```bash
# Install agentic workflows
if [ -d ".pip/workflows" ]; then
  echo "📦 Installing agentic workflows..."
  cp .pip/workflows/*.yml .github/workflows/
  
  # Prompt for OpenAI key
  read -p "Enter OpenAI API key (or press Enter to skip): " openai_key
  if [ -n "$openai_key" ]; then
    gh secret set OPENAI_API_KEY --body "$openai_key"
  fi
fi
```

## License

MIT License - See LICENSE file

## Contributing

To contribute workflow improvements:
1. Test in your repository
2. Document changes
3. Submit PR with before/after metrics

## Support

- Documentation: `.pip/docs/`
- Issues: GitHub Issues
- Examples: See source repository for working examples
