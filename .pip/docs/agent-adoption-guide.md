# Agent Adoption Guide for Organisms

This guide shows how organisms (projects using `.pip` as submodule) can adopt the autonomous agent system.

## Overview

The autonomous agent system automates roadmap implementation through:
- **Autonomous Agent** - Implements tasks from GitHub Issues
- **Review Agents** - CTO (technical) and CISO (security) reviews
- **CPO Triage** - Human approval gate for agent suggestions
- **Auto-merge** - Conditional merge for approved PRs

**Cost**: ~$2-5/month (OpenAI API + GitHub Actions free tier)  
**Velocity**: Up to 4 tasks/day (runs every 6 hours)

## Prerequisites

Before adopting, your organism needs:

- ✅ GitHub repository with Issues enabled
- ✅ GitHub Actions enabled
- ✅ OpenAI account with GPT-4 access
- ✅ GitHub personal access token with project permissions
- ✅ `.pip` submodule at `./.pip/`

## Adoption Steps

### 1. Copy Agent Files

From your organism root:

```bash
# Copy agent scripts
mkdir -p .github/agents
cp .pip/.github/agents/*.js .github/agents/
cp .pip/.github/agents/*.sh .github/agents/
cp .pip/.github/agents/package.json .github/agents/
cp .pip/.github/agents/config.json .github/agents/

# Copy workflows
mkdir -p .github/workflows
cp .pip/.github/workflows/autonomous-roadmap-agent.yml .github/workflows/
cp .pip/.github/workflows/pr-review-agents.yml .github/workflows/
cp .pip/.github/workflows/project-automation.yml .github/workflows/
cp .pip/.github/workflows/cpo-triage-reminder.yml .github/workflows/

# Copy issue template
mkdir -p .github/ISSUE_TEMPLATE
cp .pip/.github/ISSUE_TEMPLATE/roadmap-item.md .github/ISSUE_TEMPLATE/

# Make scripts executable
chmod +x .github/agents/*.js .github/agents/*.sh
```

### 2. Customize Configuration

Edit `.github/agents/config.json` for your organism:

```json
{
  "ai_provider": {
    "type": "openai",
    "model": "gpt-4-turbo-preview",
    "temperature": {
      "implementation": 0.3,
      "cto_review": 0.2,
      "ciso_review": 0.1
    }
  },
  "pip_patterns": {
    "file_types": ["ts", "tsx", "js", "jsx", "md", "json"],
    "key_directories": [
      "src/",
      "docs/",
      "apps/",
      "libs/"
    ],
    "code_style": {
      "typescript": "strict mode",
      "react": "functional components with hooks",
      "line_length": 100
    }
  },
  "roadmap_integration": {
    "issue_query": {
      "required_labels": ["roadmap"],
      "priority_order": ["priority-p0", "priority-p1", "priority-p2"],
      "exclude_labels": ["needs-approval", "blocked"]
    },
    "auto_assign": false,
    "branch_pattern": "automated/{issue-number}-{slug}"
  },
  "review_agents": {
    "cto": {
      "enabled": true,
      "focus_areas": [
        "TypeScript type safety",
        "React best practices",
        "performance optimization",
        "test coverage"
      ],
      "create_issues_for": ["major", "critical"]
    },
    "ciso": {
      "enabled": true,
      "scan_for": [
        "hardcoded secrets",
        "XSS vulnerabilities",
        "SQL injection risks",
        "insecure dependencies"
      ],
      "block_on": "critical"
    }
  }
}
```

**Key customizations**:
- `file_types`: Your project's languages
- `key_directories`: Where your code lives
- `code_style`: Your team's conventions
- `focus_areas`: Review priorities

### 3. Configure Secrets

Add required secrets to your repository:

```bash
# OpenAI API key
gh secret set OPENAI --body "sk-..."

# GitHub project token (for board automation)
gh secret set GH_PROJECT_TOKEN --body "ghp_..."
```

**Token scopes needed**:
- `repo` - Full control of repositories
- `project` - Full control of projects
- `workflow` - Update GitHub Actions workflows

### 4. Create Labels

Create the required labels:

```bash
# Priority labels
gh label create priority-p0 --description "Critical (blocking)" --color "d73a4a"
gh label create priority-p1 --description "High priority" --color "e99695"
gh label create priority-p2 --description "Medium priority" --color "fbca04"
gh label create priority-p3 --description "Low priority" --color "0e8a16"

# Agent role labels
gh label create agent-cto --description "CTO agent responsibility" --color "fbca04"
gh label create agent-cpo --description "CPO agent responsibility" --color "fbca04"
gh label create agent-ciso --description "CISO agent responsibility" --color "fbca04"

# Status labels
gh label create roadmap --description "Roadmap item" --color "d4c5f9"
gh label create automated --description "Created by autonomous agent" --color "128A0C"
gh label create agent-suggestion --description "Agent suggestion" --color "ededed"
gh label create needs-approval --description "Needs CPO approval" --color "fbca04"
gh label create blocked --description "Blocked by dependency" --color "d93f0b"
```

### 5. Enable Branch Protection

Protect your main branch:

1. Go to Settings → Branches → Add rule
2. Branch name pattern: `main` (or `master`)
3. Enable:
   - ✅ Require pull request reviews (1 approval)
   - ✅ Require status checks: `CTO Technical Review`, `CISO Security Review`
   - ✅ Require conversation resolution
   - ✅ Do not allow bypassing settings
4. Save changes

### 6. Enable GitHub Actions Permissions

Settings → Actions → General:

1. Workflow permissions:
   - ✅ Read and write permissions
   - ✅ Allow GitHub Actions to create PRs
2. Save changes

### 7. Create GitHub Project (Optional)

For project board automation:

1. Go to Projects → New project
2. Choose "Board" template
3. Add custom fields:
   - Priority (Single select: P0, P1, P2, P3)
   - Effort (Single select: XS, S, M, L, XL)
   - Agent Role (Single select: CTO, CPO, CISO, CMO, COO)
4. Update workflow file with your project URL

### 8. Create Test Issue

Verify the setup with a test issue:

```bash
gh issue create \
  --title "[Test] Add contributing guidelines" \
  --label "roadmap,agent-cto,priority-p1" \
  --body "## 📋 Description

Create CONTRIBUTING.md with guidelines for contributors.

## 📁 Files to Modify

- \`CONTRIBUTING.md\` (create new)

## ✅ Acceptance Criteria

- [ ] Include setup instructions
- [ ] Define PR process
- [ ] Add code style guidelines
- [ ] Include testing requirements

## 🧪 Test Plan

1. Read the generated CONTRIBUTING.md
2. Verify all sections are present
3. Test that instructions are accurate

## 📊 Estimated Effort

S (2-4 hours)"
```

### 9. Trigger Agent Manually

Test the agent with your test issue:

```bash
# Get the issue number from previous command
gh workflow run autonomous-roadmap-agent.yml -f priority=p1 -f issue_number=<NUMBER>

# Watch the run
gh run watch
```

**Expected**:
- Agent picks up issue
- Creates file via OpenAI
- Pushes to branch `automated/implement-<NUMBER>`
- Creates PR with label `automated`
- Review agents run automatically
- Auto-merge if reviews pass

### 10. Enable Scheduled Runs

The workflow is already configured to run every 6 hours. No additional configuration needed!

Check the schedule:
```bash
cat .github/workflows/autonomous-roadmap-agent.yml | grep -A 2 "schedule:"
```

## Customization Options

### Adjust Schedule Frequency

Edit `.github/workflows/autonomous-roadmap-agent.yml`:

```yaml
schedule:
  - cron: '0 */12 * * *'  # Every 12 hours (less aggressive)
  # or
  - cron: '0 */3 * * *'   # Every 3 hours (more aggressive)
```

### Change Priority Filter

By default, agents pick up `priority-p1` issues. To change:

```yaml
env:
  PRIORITY_FILTER: ${{ inputs.priority || 'p0' }}  # Focus on critical only
```

### Disable Auto-Merge

Edit `.github/workflows/pr-review-agents.yml`, remove or comment out the `auto-merge` job:

```yaml
# auto-merge:
#   name: Auto-Merge (Conditional)
#   ...
```

### Add Custom Review Criteria

Edit `.github/agents/config.json`, add to `focus_areas`:

```json
{
  "review_agents": {
    "cto": {
      "focus_areas": [
        "accessibility (WCAG 2.1)",
        "mobile responsiveness",
        "internationalization (i18n)",
        "your custom criteria here"
      ]
    }
  }
}
```

## Monitoring

### View Agent Activity

```bash
# Recent workflow runs
gh run list --workflow=autonomous-roadmap-agent.yml --limit 10

# Agent-created PRs
gh pr list --label automated --state all

# Issues needing CPO approval
gh issue list --label needs-approval
```

### Duplicate PR Prevention

The autonomous agent includes built-in duplicate prevention to avoid creating multiple PRs for the same issue:

**Automatic Prevention:**
- Checks for existing automated PRs before starting work
- Validates that no PR already exists for a specific issue
- Skips work if duplicates are detected

**Configuration:**
The prevention is enabled by default in `.github/agents/config.json`:
```json
{
  "roadmap_integration": {
    "duplicate_prevention": {
      "enabled": true,
      "check_existing_automated_prs": true,
      "check_issue_specific_prs": true
    }
  }
}
```

**Cleanup Tool:**
If you have existing duplicate PRs (from before prevention was implemented), use the cleanup tool:

```bash
# Dry run to see what would be closed
node .github/agents/cleanup-duplicate-prs.js --dry-run

# Actually close duplicates (keeps newest by default)
node .github/agents/cleanup-duplicate-prs.js

# Keep oldest PR instead of newest
node .github/agents/cleanup-duplicate-prs.js --keep-oldest
```

The cleanup tool:
- Finds all automated PRs
- Groups them by issue number
- Identifies duplicates (multiple PRs for same issue)
- Closes duplicates, keeping one PR per issue
- Provides dry-run mode for safety

**Monitoring for Duplicates:**
```bash
# Check for multiple PRs mentioning the same issue
gh pr list --label automated --state open --json number,title,body | \
  jq -r '.[] | select(.body | test("#\\d+")) | "\(.number): \(.body)"'
```

### Track Costs

Monitor OpenAI usage:
```bash
open "https://platform.openai.com/usage"
```

**Typical costs**:
- Small organism (1-2 issues/day): $3-6/month
- Medium organism (3-4 issues/day): $10-15/month
- Large organism (10+ issues/day): $30-50/month

### CPO Weekly Triage

Use the helper script for quick approvals:

```bash
.github/agents/cpo-triage-helper.sh
```

Or manually:
```bash
# View suggestions
gh issue list --label needs-approval

# Approve
gh issue edit <N> --add-label roadmap --remove-label needs-approval

# Reject
gh issue close <N> --reason "not planned"
```

## Best Practices

### Writing Agent-Friendly Issues

✅ **Good issue structure**:
- Clear, specific description
- Concrete acceptance criteria
- Explicit file paths
- Testable outcomes

❌ **Avoid**:
- Vague descriptions ("improve performance")
- Multiple unrelated tasks
- Missing acceptance criteria
- Subjective requirements ("make it look better")

### Incremental Adoption

**Phase 1: Observation (Week 1)**
- Deploy workflows, keep agent disabled
- Run review agents on human PRs only
- Learn from review suggestions

**Phase 2: Manual Trigger (Week 2-3)**
- Trigger agent manually for small tasks
- Review all PRs carefully
- Tune configuration based on results

**Phase 3: Scheduled (Week 4+)**
- Enable automatic runs
- Monitor daily for first 2 weeks
- Adjust priority thresholds as needed

**Phase 4: Full Automation (Month 2+)**
- Trust agent for routine tasks
- Weekly CPO triage instead of per-PR review
- Scale to multiple concurrent issues

### Security Considerations

🔒 **Always**:
- Review agent PRs before merge (don't blindly auto-merge)
- Keep CISO agent enabled
- Monitor for hardcoded secrets
- Audit agent access periodically

⚠️ **Never**:
- Let agents modify security configs
- Skip human review for critical paths
- Ignore CISO warnings
- Commit secrets (agents should use env vars)

## Troubleshooting

### Agent Not Running

**Check**:
```bash
gh run list --workflow=autonomous-roadmap-agent.yml
gh secret list  # Verify OPENAI exists
```

**Common issues**:
- Missing `OPENAI` secret
- No eligible issues (check labels)
- Workflow disabled in Actions settings

### Review Agents Failing

**Check PR logs**:
```bash
gh pr checks <NUMBER>
gh run view <RUN_ID> --log
```

**Common issues**:
- OpenAI rate limit exceeded
- Invalid JSON in agent script
- GitHub token insufficient permissions

### Files Created in Wrong Location

The agent runs from `.github/agents/` directory. To fix:

1. Use absolute paths in issues: `/src/file.ts` instead of `src/file.ts`
2. Or update agent to run from repo root (see issue #72 in pip repo)

### High Costs

**Reduce costs**:
- Use `gpt-3.5-turbo` instead of `gpt-4` (cheaper, lower quality)
- Increase schedule interval (12 hours instead of 6)
- Filter by priority (only p0/p1)
- Set OpenAI spending limits

## Support

### Getting Help

- **Agent issues**: Create issue with label `agent-enhancement`
- **pip framework**: https://github.com/derrybirkett/pip/issues
- **Original implementation**: https://github.com/derrybirkett/frctls/pull/25

### Contributing Improvements

If you improve the agent system for your organism:

1. Test thoroughly in your project
2. Document the improvement
3. Submit PR to pip genome
4. Other organisms can benefit!

## Related Documentation

- [Agent README](.github/agents/README.md) - Complete agent documentation
- [Roadmap Guide](docs/roadmap-guide.md) - Using GitHub roadmap
- [pip WARP.md](WARP.md) - pip framework guidance
- [frctls PR #25](https://github.com/derrybirkett/frctls/pull/25) - Original implementation

---

**Version**: 1.0.0  
**Last Updated**: 2026-01-11  
**Maintained by**: CTO
