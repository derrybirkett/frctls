# COO — Workflow Monitoring Playbook

## Overview

This playbook defines how the COO agent monitors, triages, and remediates CI/CD workflow failures to maintain operational excellence and delivery velocity.

## Monitoring Scope

### GitHub Actions Workflows
- **Build workflows**: Compilation, linting, type checking
- **Test workflows**: Unit, integration, E2E tests
- **Deployment workflows**: Staging, production releases
- **Automation workflows**: Scheduled jobs, dependency updates, security scans
- **Release workflows**: Tagging, changelog generation, artifact publishing

### Key Metrics
- Workflow success/failure rate
- Build duration and trends
- Queue time and concurrency limits
- Flaky test patterns
- Dependency vulnerability scan results

## Failure Triage Process

### 1. Detection
Monitor for workflow failures via:
- GitHub Actions UI (workflow run status)
- GitHub webhook events (workflow_run completed with failure)
- Scheduled polling of workflow status
- Email/Slack notifications

### 2. Classification
Categorize failures by type:

**A. Branch Conflicts** (Most Common)
- Symptom: `git push` fails with "Updates were rejected"
- Root cause: Remote branch has commits not present locally
- Remediation: COO-handled (see playbook below)

**B. Test Failures**
- Symptom: Test suite exits with non-zero code
- Root cause: Code changes break existing tests OR flaky tests
- Remediation: CTO-escalated (requires code fix or test stabilization)

**C. Dependency Issues**
- Symptom: `npm install`, `pip install`, or similar fails
- Root cause: Broken upstream dependencies, version conflicts
- Remediation: COO-handled for updates; CTO-escalated for lock file conflicts

**D. Security Scan Failures**
- Symptom: Vulnerability scanner finds CVEs above threshold
- Root cause: Known vulnerabilities in dependencies or code
- Remediation: CISO-escalated (security review required)

**E. Infrastructure/Platform Issues**
- Symptom: Timeouts, runner unavailability, rate limits
- Root cause: GitHub Actions platform issues or quota limits
- Remediation: COO-handled (retry, adjust concurrency) or CEO-escalated (budget/plan upgrade)

**F. Authentication/Secrets**
- Symptom: 401/403 errors, expired tokens
- Root cause: Expired credentials, missing secrets, permission changes
- Remediation: CISO-escalated (credential rotation)

### 3. Remediation Decision Tree

```
Workflow Failed
    ↓
Can auto-remediate? (COO decision)
    ↓
YES → Auto-remediate → Monitor → Success? → Close
    ↓                                ↓
    |                               NO → Escalate
    ↓
NO → Escalate to appropriate agent
    ↓
CTO: Code/test/tooling issues
CISO: Security/auth/compliance
CPO: Product rollback decisions
CEO: Critical business impact
```

## Auto-Remediation Playbooks

### Branch Conflict Resolution

**Scenario**: `git push` fails with "Updates were rejected"

**Steps**:
1. Fetch latest remote refs: `git fetch origin`
2. Check if remote branch exists: `git branch -r | grep <branch-name>`
3. **Option A**: Delete remote branch (if automation retry)
   ```bash
   git push origin --delete <branch-name>
   ```
4. **Option B**: Pull and merge (if preserving remote commits)
   ```bash
   git checkout <branch-name>
   git pull origin <branch-name>
   git push origin <branch-name>
   ```
5. **Option C**: Force push (⚠️ destructive - use with caution)
   ```bash
   git push -f origin <branch-name>
   ```

**Default for automation workflows**: Option A (delete and retry)

**When to escalate**: If branch contains important commits from another source

### Stale Dependency Updates

**Scenario**: Scheduled dependency update workflow fails

**Steps**:
1. Review failure logs for specific dependency causing issue
2. Check if dependency version is yanked/broken upstream
3. Pin to last known good version temporarily
4. Create issue for CTO to investigate and resolve
5. Notify CPO if feature timeline affected

**When to escalate**: Lock file conflicts, breaking API changes

### Flaky Test Detection

**Scenario**: Test passes locally but fails intermittently in CI

**Steps**:
1. Re-run workflow up to 3 times to confirm flakiness
2. If passes on retry: Mark as flaky, create issue for CTO
3. If consistently fails: Escalate to CTO immediately (real failure)
4. Track flaky test patterns for engineering team review

**When to escalate**: Always (CTO owns test quality)

### Infrastructure Timeouts

**Scenario**: Workflow times out after max duration

**Steps**:
1. Check GitHub Actions status page for platform issues
2. Review recent workflow duration trends (gradual vs. sudden)
3. If platform issue: Retry once after 15 minutes
4. If gradual trend: Create issue for CTO (optimization needed)
5. If sudden spike: Escalate to CTO (investigate code change)

**When to escalate**: Persistent timeouts, suspected code issue

## Escalation Guidelines

### When to Escalate to CTO
- Test failures requiring code changes
- Build failures from compilation/linting errors
- Architecture/tooling decisions needed
- Performance optimization required
- Flaky test patterns (for prioritization)

### When to Escalate to CISO
- Security scan failures (CVE detection)
- Authentication/credential failures
- Compliance gate failures
- Suspicious activity in workflow logs

### When to Escalate to CPO
- Feature rollback decisions
- Release timeline impact assessment
- Acceptance criteria validation needed

### When to Escalate to CEO
- Critical production incident
- Multi-hour delivery blockage
- Budget/plan limitations (runner minutes, quotas)
- Cross-functional decision needed

### When to Escalate to CMO
- Release communication delays
- Blog post publication issues
- Changelog generation failures

## Communication Templates

### Failure Alert (to relevant agent)
```
🚨 Workflow Failure Alert

Workflow: [workflow name]
Run: [link to GitHub Actions run]
Branch: [branch name]
Failure Type: [classification]
Root Cause: [brief diagnosis]

Action Required: [specific ask]
Impact: [delivery timeline, feature affected]
Priority: [P0-Critical | P1-High | P2-Medium | P3-Low]
```

### Resolution Update (to stakeholders)
```
✅ Workflow Restored

Workflow: [workflow name]
Failure Duration: [time from failure to resolution]
Remediation: [what was done]
Prevention: [follow-up actions to prevent recurrence]

Next Steps: [any outstanding work items]
```

### Incident Escalation (to CEO)
```
🔴 Critical Incident

Impact: [delivery blocked, production down, etc.]
Duration: [time since incident start]
Affected Systems: [workflows, environments, features]
Attempted Remediations: [what's been tried]

Recommendation: [course of action, resource needs, timeline]
```

## Monitoring Dashboard (Recommended)

### Real-Time Metrics
- Workflow run status (success/failure/in-progress)
- Current queue depth and wait times
- Active incidents and escalations
- Runner availability and utilization

### Historical Trends
- 30-day workflow success rate
- MTTD and MTTR by failure type
- Auto-remediation success rate
- Escalation frequency by agent

### Proactive Alerts
- Success rate drops below 95%
- MTTR exceeds 30 minutes
- Same workflow fails 3+ times in 24 hours
- Dependency vulnerability count increases
- Runner quota approaching limits

## Continuous Improvement

### Weekly Review
- Analyze failure patterns and root causes
- Identify candidates for new auto-remediation playbooks
- Review escalation accuracy (right agent, right priority)
- Update runbooks based on new failure types

### Monthly Retrospective
- Review KPIs vs. targets
- Collect feedback from CTO, CISO, CPO on escalation quality
- Identify process improvements
- Update workflow monitoring tooling and automation

### Quarterly Planning
- Roadmap for workflow reliability improvements
- Budget planning for GitHub Actions runners/plans
- Training for new failure types and remediation techniques
- Alignment with CTO on infrastructure investments

## COO Workflow Automation Tools

### Proactive Health Monitoring

#### Workflow Health Check Script
**Location**: `.github/agents/workflow-health-check.js`

**Purpose**: Proactive CI/CD monitoring and diagnostics. Scans all workflows for failures, calculates health metrics, and detects configuration issues.

**Usage**:
```bash
cd .github/agents
node workflow-health-check.js
```

**Features**:
- Analyzes last 10 runs of each workflow
- Calculates success/failure rates
- Detects configuration issues in YAML files
- Generates health report with recommendations
- Exit codes: 0 (healthy), 1 (critical issues)

**Health Status Levels**:
- ✅ **Healthy**: Success rate >80%, no recent failures
- ⚠️ **Warning**: 1-2 recent failures, success rate 60-80%
- 🔶 **Degraded**: Failure rate 20-50%, consistent issues
- 🔴 **Critical**: Failure rate >50%, immediate action required

**When to Use**:
- Before major releases
- After infrastructure changes
- Weekly operational reviews
- Incident investigation
- Performance audits

#### Workflow Health Monitor (Automated)
**Location**: `.github/workflows/workflow-health-monitor.yml`

**Triggers**:
- Schedule: Every 4 hours
- Push: On workflow file changes
- Manual: `workflow_dispatch` with options

**Capabilities**:
- Runs health check automatically
- Cleans up stale automated branches
- Validates workflow YAML syntax
- Updates agent dependencies
- Retries recent failed workflows
- Creates GitHub issues for critical failures

**Inputs** (manual trigger):
- `auto_fix`: Attempt automatic remediation (default: true)
- `create_issues`: Create issues for problems (default: true)

**Outputs**:
- Health report artifact
- GitHub issue (if critical failures detected)
- Auto-remediation summary

### Reactive Monitoring

#### COO Workflow Monitor
**Location**: `.github/agents/coo-workflow-monitor.js`

**Trigger**: `workflow_run` event (any workflow completion with failure)

**Workflow**: `.github/workflows/coo-workflow-monitor.yml`

**Capabilities**:
- AI-powered failure triage using OpenAI
- Classifies failure types automatically
- Determines auto-remediation vs. escalation
- Executes remediation commands safely
- Creates escalation issues with context
- Generates detailed triage reports

**Failure Types Detected**:
- Branch conflicts
- Test failures
- Dependency issues
- Security scans
- Infrastructure problems
- Authentication errors

**Auto-Remediation**:
- Deletes stale automated branches
- Retries transient failures
- Updates dependencies
- Cleans up workflow artifacts

**Escalation Logic**:
- Test failures → CTO
- Security issues → CISO
- Product decisions → CPO
- Critical incidents → CEO
- Release comms → CMO

### Manual Tools

#### GitHub CLI (`gh`)
Essential for manual workflow management:
```bash
# List all workflows
gh workflow list

# View recent runs
gh run list --limit 10

# View specific run details
gh run view <run-id>

# View failure logs
gh run view <run-id> --log-failed

# Re-run failed jobs
gh run rerun <run-id> --failed

# List workflow files
ls .github/workflows/
```

#### Health Check Dashboard
Access via GitHub Actions UI:
- Navigate to Actions tab
- View "Workflow Health Monitor" runs
- Download health report artifacts
- Review auto-remediation logs

## Access Requirements

### Required Permissions
- **GitHub Actions**: `read` (view workflows and runs)
- **Contents**: `write` (branch management, commits)
- **Issues**: `write` (create escalation issues)
- **Pull Requests**: `write` (PR management)

### Required Secrets
- `GITHUB_TOKEN`: Provided automatically by GitHub Actions
- `OPENAI`: OpenAI API key for AI-powered triage (required for COO monitor)

### Optional Integrations
- Notification channels (email, Slack)
- Alert routing (PagerDuty, Opsgenie)
- Incident tracking (Linear, GitHub Issues/Projects)
- Monitoring dashboard (Grafana, Datadog)

## Automation Capabilities

### Currently Implemented
✅ Proactive health checks every 4 hours
✅ Automatic failure triage and classification
✅ Stale branch cleanup
✅ Workflow YAML validation
✅ Dependency synchronization
✅ Failed workflow retry logic
✅ Escalation issue creation
✅ Health report artifacts

### Future Enhancements
- Webhook listeners for real-time notifications
- Slack/Discord integration for team alerts
- Predictive failure detection using ML
- Advanced flaky test detection
- Performance regression detection
- Cost optimization recommendations
- Cross-repository workflow monitoring
