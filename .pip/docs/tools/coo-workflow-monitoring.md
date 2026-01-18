# COO Workflow Monitoring - Quick Reference

## Overview
The COO agent now has comprehensive CI/CD monitoring capabilities with proactive health checks and automatic remediation of common workflow failures.

## Key Components

### 1. Workflow Health Check (Proactive)
**Script**: `.github/agents/workflow-health-check.js`

Manually run health diagnostics:
```bash
cd .github/agents
node workflow-health-check.js
```

**Output**: Comprehensive health report with metrics, issues, and recommendations.

### 2. Workflow Health Monitor (Automated)
**Workflow**: `.github/workflows/workflow-health-monitor.yml`

**Runs**:
- Every 4 hours (scheduled)
- On workflow file changes (push to main)
- Manually via `workflow_dispatch`

**Features**:
- Automatic health checks
- Stale branch cleanup
- YAML validation
- Dependency updates
- Failed workflow retries
- Issue creation for critical problems

### 3. COO Workflow Monitor (Reactive)
**Workflow**: `.github/workflows/coo-workflow-monitor.yml`
**Script**: `.github/agents/coo-workflow-monitor.js`

**Triggers**: Automatically on any workflow failure

**Features**:
- AI-powered failure classification
- Root cause analysis
- Auto-remediation attempts
- Smart escalation to appropriate agents
- Detailed triage reports

## Health Status Levels

| Status | Icon | Success Rate | Action |
|--------|------|--------------|--------|
| Healthy | ✅ | >80% | Monitor normally |
| Warning | ⚠️ | 60-80% | Review failures |
| Degraded | 🔶 | 40-60% | Investigate patterns |
| Critical | 🔴 | <40% | Immediate action |

## Auto-Remediation Capabilities

### Handled Automatically
- ✅ Branch conflicts (deletes stale automated branches)
- ✅ Stale dependency warnings
- ✅ Workflow YAML syntax errors (detection)
- ✅ Transient infrastructure failures (retry)
- ✅ Missing dependencies (auto-install)

### Escalated to Agents
- 🧪 **Test failures** → CTO
- 🔒 **Security scans** → CISO
- 📦 **Breaking dependency changes** → CTO
- 🔑 **Authentication failures** → CISO
- 🎯 **Product decisions** → CPO
- 🚨 **Critical incidents** → CEO

## Common Commands

### Check Workflow Status
```bash
# List all workflows
gh workflow list

# View recent runs
gh run list --limit 10

# Check specific workflow
gh run list --workflow="Workflow Name"
```

### Investigate Failures
```bash
# View run details
gh run view <run-id>

# Show failed logs only
gh run view <run-id> --log-failed

# Download all logs
gh run view <run-id> --log > logs.txt
```

### Manual Remediation
```bash
# Re-run failed jobs
gh run rerun <run-id> --failed

# Re-run entire workflow
gh run rerun <run-id>

# Cancel a run
gh run cancel <run-id>
```

### Run Health Check Manually
```bash
# In repo root
cd .github/agents
npm install  # First time only
node workflow-health-check.js
```

## Workflow Files Location
```
.github/
├── agents/
│   ├── coo-workflow-monitor.js      # Reactive failure handler
│   ├── workflow-health-check.js     # Proactive health diagnostics
│   ├── package.json                 # Node dependencies
│   └── ...
└── workflows/
    ├── coo-workflow-monitor.yml     # Reactive monitoring
    ├── workflow-health-monitor.yml  # Proactive monitoring
    └── ...
```

## Monitoring Dashboard

Access health status:
1. Go to GitHub Actions tab
2. Click "Workflow Health Monitor"
3. View latest run
4. Download artifacts for detailed reports

## Troubleshooting

### Health Check Fails
1. Verify GitHub CLI is installed: `gh --version`
2. Check authentication: `gh auth status`
3. Review workflow permissions in `.github/workflows/`

### Auto-Remediation Not Working
1. Check workflow has required permissions:
   - `contents: write`
   - `issues: write`
   - `actions: read`
2. Verify `OPENAI` secret is configured (for AI triage)
3. Review workflow logs for specific errors

### No Issues Created for Failures
1. Check `create_issues` input is not set to `false`
2. Verify issue creation permissions
3. Check if failures are below critical threshold

## Best Practices

### Daily
- ✅ Review workflow health dashboard
- ✅ Address any warnings or degraded status
- ✅ Check for recurring failure patterns

### Weekly
- ✅ Run manual health check: `node workflow-health-check.js`
- ✅ Review escalation accuracy
- ✅ Update remediation playbooks if needed

### Monthly
- ✅ Review workflow success rates (target: >95%)
- ✅ Analyze MTTR trends (target: <30 minutes)
- ✅ Update documentation based on new failure types
- ✅ Clean up stale workflows

## Escalation Priority

| Priority | Response Time | Examples |
|----------|---------------|----------|
| **P0** (Critical) | Immediate | Production down, deployment blocked |
| **P1** (High) | <1 hour | Test failures blocking PRs, security issues |
| **P2** (Medium) | <4 hours | Flaky tests, dependency warnings |
| **P3** (Low) | <24 hours | Documentation updates, optimization opportunities |

## Support

- **Documentation**: `ia/agents/coo/workflow-monitoring-playbook.md`
- **Agent Manifest**: `ia/agent_manifest.yml`
- **Issues**: Label with `agent:coo` and appropriate priority

## Quick Links

- [COO Role Definition](../../../ia/agents/coo/role.md)
- [COO Responsibilities](../../../ia/agents/coo/responsibilities.md)
- [Full Monitoring Playbook](../../../ia/agents/coo/workflow-monitoring-playbook.md)
- [Wrap-Up Process](../../processes/wrap-up-checklist.md)
