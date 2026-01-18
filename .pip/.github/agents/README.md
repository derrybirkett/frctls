# AI Agent Automation System

This directory contains AI-powered agents that automate roadmap implementation and code review for the pip framework.

## Overview

The agent system consists of:
- **Autonomous Agent** - Implements roadmap tasks automatically
- **CTO Review Agent** - Reviews PRs for technical quality
- **CISO Review Agent** - Reviews PRs for security vulnerabilities
- **CPO Triage Helper** - Streamlines approval workflow
- **COO Workflow Monitor** - Triages CI/CD failures and auto-remediates when possible

## Architecture

```
GitHub Roadmap Issues (labeled: roadmap, priority-p1)
        ↓
Autonomous Agent (scheduled: every 6 hours)
  - Queries for unassigned roadmap issues
  - Generates implementation via OpenAI
  - Creates PR with code changes
        ↓
Review Agents (on PR creation)
  ├─ CTO Review (technical quality)
  └─ CISO Review (security scan)
        ↓
CPO Triage (manual approval gate)
  - Reviews agent suggestions
  - Approves or rejects
        ↓
Auto-Merge (conditional)
  - Merges PRs from automated/* branches
  - Only if reviews pass
        ↓
COO Workflow Monitor (on workflow failure)
  - Analyzes failure logs via OpenAI
  - Classifies failure type
  - Auto-remediates (branch conflicts, retries)
  - Escalates to CTO/CISO/CPO/CEO as needed
```

## Setup

### 1. Prerequisites

- Node.js 20+
- GitHub CLI (`gh`)
- OpenAI API key
- GitHub Personal Access Token with project permissions

### 2. Install Dependencies

```bash
cd .github/agents
npm install
```

### 3. Configure Secrets

Add these secrets to your repository:

```bash
# Required
gh secret set OPENAI --body "sk-..."
gh secret set GH_PROJECT_TOKEN --body "ghp_..."

# Optional (for notifications)
gh secret set SLACK_WEBHOOK_URL --body "https://..."
```

**Secret requirements:**
- `OPENAI`: OpenAI API key with GPT-4 access
- `GH_PROJECT_TOKEN`: GitHub PAT with `repo`, `project`, `workflow` scopes
- `SLACK_WEBHOOK_URL`: (Optional) For agent notifications

### 4. Configure Repository Settings

**Enable Actions:**
1. Go to Settings → Actions → General
2. Allow all actions and reusable workflows
3. Grant read and write permissions
4. Allow workflows to create PRs

**Branch Protection (main):**
1. Settings → Branches → Add rule for `main`
2. ✅ Require pull request reviews (1 approval)
3. ✅ Require status checks: `CTO Technical Review`, `CISO Security Review`
4. ✅ Allow auto-merge

## Configuration

Agent behavior is controlled via `config.json`:

```json
{
  "ai_provider": {
    "model": "gpt-4-turbo-preview",
    "temperature": {
      "implementation": 0.3,  // Higher = more creative
      "cto_review": 0.2,
      "ciso_review": 0.1      // Lower = more conservative
    }
  },
  "roadmap_integration": {
    "issue_query": {
      "required_labels": ["roadmap"],
      "priority_order": ["priority-p0", "priority-p1", "priority-p2"],
      "exclude_labels": ["needs-approval", "blocked"]
    },
    "branch_pattern": "automated/{issue-number}-{slug}"
  },
  "review_agents": {
    "cto": {
      "focus_areas": [
        "documentation clarity",
        "consistency with .pip principles",
        "shell script best practices"
      ]
    },
    "ciso": {
      "scan_for": [
        "hardcoded secrets",
        "insecure file permissions",
        "unsafe shell commands"
      ],
      "block_on": "critical"
    }
  }
}
```

## Usage

### Autonomous Implementation

**Scheduled (automatic):**
- Runs every 6 hours
- Picks highest priority unassigned roadmap issue
- Implements and creates PR

**Manual trigger:**
```bash
# Trigger via GitHub UI
# Go to Actions → Autonomous Roadmap Agent → Run workflow

# Or via CLI
gh workflow run autonomous-roadmap-agent.yml

# With specific issue
gh workflow run autonomous-roadmap-agent.yml -f issue_number=123

# With priority filter
gh workflow run autonomous-roadmap-agent.yml -f priority=p1
```

### Review Agents

**Automatic on PR creation:**
- CTO agent reviews technical quality
- CISO agent scans for security issues
- Both post review comments
- Critical issues block merge

**Manual trigger:**
```bash
# Run CTO review on specific PR
PR_NUMBER=123 node .github/agents/cto-review-agent.js

# Run CISO review
PR_NUMBER=123 node .github/agents/ciso-review-agent.js
```

### CPO Triage

**Interactive helper:**
```bash
# From repo root
.github/agents/cpo-triage-helper.sh
```

**Manual commands:**
```bash
# List pending approvals
gh issue list --label needs-approval

# Approve
gh issue edit 123 --add-label roadmap --remove-label needs-approval

# Reject
gh issue close 123 --reason "not planned"
```

## Workflows

### 1. Autonomous Roadmap Agent

**File:** `.github/workflows/autonomous-roadmap-agent.yml`

**Schedule:** Every 6 hours
**Trigger:** Manual dispatch or schedule

**What it does:**
1. Queries for unassigned roadmap issues (priority-p1)
2. Reads issue body and relevant files
3. Generates implementation via OpenAI
4. Creates branch: `automated/123-issue-slug`
5. Commits changes
6. Creates PR with `Closes #123`

**Environment variables:**
- `GITHUB_TOKEN`: Auto-provided by Actions
- `OPENAI_API_KEY`: From secrets.OPENAI
- `PRIORITY_FILTER`: From workflow input (default: p1)
- `ISSUE_NUMBER`: From workflow input (optional)

### 2. PR Review Agents

**File:** `.github/workflows/pr-review-agents.yml`

**Trigger:** PR opened/synchronized/reopened

**What it does:**
1. **CTO Review**:
   - Analyzes code quality
   - Checks .pip principles adherence
   - Creates improvement suggestions
   - Posts review comment
2. **CISO Review**:
   - Scans for security vulnerabilities
   - Checks for hardcoded secrets
   - Blocks critical issues
   - Posts security report
3. **Auto-Merge** (conditional):
   - Only for `automated/*` branches
   - Only if both reviews pass
   - Squash merges with co-author attribution

### 3. Project Board Automation

**File:** `.github/workflows/project-automation.yml`

**Trigger:** Issue opened/assigned/closed

**What it does:**
- Adds roadmap issues to project board
- Moves to "In Progress" when assigned
- Moves to "Done" when closed

### 4. CPO Triage Reminder

**File:** `.github/workflows/cpo-triage-reminder.yml`

**Schedule:** Monday 9 AM UTC
**Trigger:** Manual dispatch or schedule

**What it does:**
- Counts pending approvals
- Creates triage issue with links
- Includes helper commands
- Tags CPO for review

### 5. COO Workflow Monitor

**File:** `.github/workflows/coo-workflow-monitor.yml`

**Trigger:** Any workflow failure (workflow_run completion)

**What it does:**
1. Detects workflow failures automatically
2. Fetches failure logs and analyzes with OpenAI
3. Classifies failure type (branch conflict, test failure, dependency, security, infrastructure, auth)
4. Determines if auto-remediation is possible
5. Executes remediation (e.g., delete conflicting branch, retry)
6. Escalates to CTO/CISO/CPO/CEO if needed
7. Posts triage report and creates issues

**Environment variables:**
- `GITHUB_TOKEN`: Auto-provided by Actions
- `OPENAI_API_KEY`: From secrets.OPENAI
- `WORKFLOW_RUN_ID`: Auto-provided by workflow_run event
- `WORKFLOW_NAME`: Failed workflow name
- `WORKFLOW_CONCLUSION`: failure/cancelled
- `WORKFLOW_URL`: Link to failed run
- `WORKFLOW_BRANCH`: Branch that failed

## Agent Scripts

### autonomous-agent.js

**Purpose:** Implements roadmap tasks autonomously

**Key functions:**
- `getNextRoadmapIssue()` - Finds unassigned high-priority issues
- `parseIssueBody()` - Extracts task details from issue
- `generateImplementation()` - Uses OpenAI to create code
- `createPR()` - Commits changes and opens PR

**OpenAI prompt includes:**
- Issue description and acceptance criteria
- Current file contents
- .pip framework principles
- Code style guidelines

**Output:**
- New branch with implementation
- PR linked to issue
- Test plan in PR description

### cto-review-agent.js

**Purpose:** Reviews PRs for technical quality

**Review criteria:**
- Code quality and maintainability
- Architecture alignment
- Performance implications
- Test coverage
- Documentation needs

**Severity levels:**
- `critical` - Must fix before merge - blocks security/functionality/data integrity
- `major` - Should fix before merge - significant technical debt or maintainability issue
- `minor` - Should fix soon but doesn't block - small improvements that reduce risk
- `suggestion` - Nice-to-have enhancement - best practices, optimizations, future improvements

**Actions:**
- Posts review comment with findings
- Creates enhancement issues **only** for `suggestion` and `minor` severity items
- Labels issues as `enhancement`, `from-cto-review`, `needs-cpo-triage`
- Links created issues back to PR review comment
- Major and critical issues should be addressed in the PR itself

**Enhancement Issue Workflow:**
1. CTO review identifies non-blocking improvements
2. Auto-creates GitHub issues with structured content
3. Issues tagged with `needs-cpo-triage` for CPO review
4. CPO approves (adds `approved-for-roadmap`) or declines (closes)
5. Approved issues can be picked up by autonomous agent or manually
6. Implementation PR links back to enhancement issue

### ciso-review-agent.js

**Purpose:** Reviews PRs for security vulnerabilities

**Security checklist:**
1. Hardcoded credentials/API keys
2. SQL injection risks
3. XSS vulnerabilities
4. Authentication bypasses
5. Insecure dependencies
6. Insecure configurations
7. Data exposure
8. SSRF risks
9. Insecure file operations
10. Input validation issues

**Risk levels:**
- `critical` - Blocks merge immediately
- `high` - Must be fixed before merge
- `medium` - Should be addressed
- `low` - Minor security improvement

**Actions:**
- Posts security review with risk level
- Creates security issues for tracking
- Blocks merge if critical vulnerabilities found

### coo-workflow-monitor.js

**Purpose:** Intelligent CI/CD failure triage and auto-remediation

**Failure types:**
1. **Branch Conflict** - Remote has commits not in local (auto-remediate: delete branch)
2. **Test Failure** - Code breaks tests (escalate to CTO)
3. **Dependency Issue** - Package install fails (auto-remediate or escalate)
4. **Security Scan** - Vulnerabilities detected (escalate to CISO)
5. **Infrastructure** - Timeouts, runner issues (retry or escalate to CEO)
6. **Authentication** - Expired credentials (escalate to CISO)

**Key functions:**
- `loadPlaybook()` - Loads COO workflow monitoring playbook for context
- `getWorkflowDetails()` - Fetches failed workflow logs via GitHub CLI
- `performTriage()` - Uses OpenAI to classify failure and determine remediation
- `executeRemediation()` - Runs auto-remediation commands
- `createEscalationIssue()` - Creates issue for CTO/CISO/CPO/CEO when needed

**OpenAI prompt includes:**
- Workflow failure logs (up to 6000 chars)
- COO playbook context (4000 chars)
- Failure classification criteria
- Auto-remediation decision tree
- Escalation guidelines

**Output:**
- Triage report with classification and root cause
- Auto-remediation execution (if applicable)
- Escalation issue (if needed)
- Artifact: `/tmp/coo-triage-report.md`

## Cost Management

**Expected costs:**
- Implementation: $0.10/task
- CTO review: $0.02/PR
- CISO review: $0.02/PR
- COO workflow monitor: $0.03/failure
- **Total: ~$2-7/month** (10 tasks + 20 reviews + 10 failures)

**Cost controls:**
1. Set OpenAI spending limit: $20/month
2. Monitor usage: https://platform.openai.com/usage
3. Use scheduled runs (not per-commit)
4. Limit autonomous agent to high-priority items

**Check usage:**
```bash
# OpenAI API usage
curl https://api.openai.com/v1/usage \
  -H "Authorization: Bearer $OPENAI_API_KEY"

# GitHub Actions minutes
gh api /repos/:owner/:repo/actions/cache/usage
```

## Troubleshooting

### Agent Not Running

**Check workflow status:**
```bash
gh run list --workflow=autonomous-roadmap-agent.yml
```

**View logs:**
```bash
gh run view <run-id> --log
```

**Common issues:**
- Missing `OPENAI` secret
- Insufficient GitHub token permissions
- No eligible roadmap issues found
- OpenAI rate limit exceeded

### Review Not Posting

**Check PR status:**
```bash
gh pr view <number> --json statusCheckRollup
```

**Common issues:**
- Review agent workflow failed (check logs)
- GitHub token lacks write permission
- OpenAI API error (check quota)
- PR from fork (workflows don't run)

### Auto-Merge Not Triggering

**Requirements:**
- Branch must start with `automated/`
- Both CTO and CISO reviews must pass
- No required checks failing

**Debug:**
```bash
gh pr view <number> --json mergeStateStatus,mergeable
```

### OpenAI Rate Limits

**Error:** "Rate limit exceeded"

**Solutions:**
1. Wait 60 seconds and retry
2. Reduce autonomous agent frequency
3. Upgrade OpenAI plan (if needed)
4. Use lower-tier model (gpt-3.5-turbo)

### Project Board Not Updating

**Check token permissions:**
```bash
gh auth status
```

**Required scopes:**
- `repo`
- `project`
- `workflow`

**Regenerate token:**
1. https://github.com/settings/tokens
2. Generate new token with scopes
3. Update `GH_PROJECT_TOKEN` secret

## Best Practices

### For Agent-Generated Code

✅ **Do:**
- Review all agent PRs before merging
- Test generated code locally
- Add comments for complex logic
- Update tests as needed

❌ **Don't:**
- Blindly auto-merge everything
- Skip human review for critical changes
- Ignore security warnings
- Let agents modify secrets/credentials

### For Issue Creation

✅ **Do:**
- Use detailed acceptance criteria
- Include test plan
- List specific files to modify
- Provide context and examples

❌ **Don't:**
- Create vague issues ("improve docs")
- Skip acceptance criteria
- Assign multiple unrelated tasks
- Omit priority labels

### For CPO Triage

✅ **Do:**
- Review suggestions weekly
- Provide clear rejection reasons
- Assign milestones when approving
- Track agent performance

❌ **Don't:**
- Auto-approve without review
- Let approval queue grow >10
- Reject without explanation
- Ignore agent feedback patterns

## Advanced Configuration

### Custom Agent Prompts

Edit agent scripts to customize prompts:

```javascript
// In autonomous-agent.js
const prompt = `You are implementing: ${issue.title}

Custom instructions:
- Use TypeScript for new files
- Follow Airbnb style guide
- Write Jest tests for all functions
...
`;
```

### Notification Integration

Add Slack notifications:

```yaml
# In workflow after agent runs
- name: Notify Slack
  if: success()
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
    payload: |
      {
        "text": "Agent created PR: ${{ steps.pr.outputs.url }}"
      }
```

### Custom Review Criteria

Modify `config.json` to add specific checks:

```json
{
  "review_agents": {
    "cto": {
      "focus_areas": [
        "documentation clarity",
        "TypeScript type safety",
        "React hooks best practices"
      ]
    }
  }
}
```

## Monitoring

### Agent Performance

**Track metrics:**
- PRs created per week
- Review pass rate
- Average time to merge
- Cost per task

**Dashboard query:**
```bash
# PRs created by agent
gh pr list --author github-actions --state all --json number,title,mergedAt

# Average merge time
gh pr list --author github-actions --state merged --json createdAt,mergedAt
```

### Quality Metrics

**Review effectiveness:**
- Issues found per review
- False positive rate
- Critical issues caught
- Developer satisfaction

**Audit trail:**
```bash
# All agent comments
gh api graphql -f query='
  query {
    repository(owner:"derrybirkett", name:"pip") {
      pullRequests(first:10) {
        nodes {
          comments(first:10) {
            nodes {
              author { login }
              body
            }
          }
        }
      }
    }
  }
'
```

## Support

**Questions or issues?**
- **Agent failures**: Check workflow logs, create issue
- **Configuration help**: See `config.json` comments
- **Feature requests**: Create issue with `agent-enhancement` label
- **Security concerns**: Email security@pip.dev

## Related Documentation

- [Roadmap Guide](../../docs/roadmap-guide.md) - Using GitHub roadmap
- [frctls PR #25](https://github.com/derrybirkett/frctls/pull/25) - Original implementation
- [ROADMAP.md](../../ROADMAP.md) - Strategic vision
- [LEAN Design Principles](../../ROADMAP.md#lean-methodology) - Development philosophy

---

**Maintained by**: CTO
**Last Updated**: 2026-01-11
**Version**: 1.0.0
