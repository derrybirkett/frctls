# pip Framework Recommendations
## Based on frctls Autonomous Agent Experience

**Date**: 2026-01-17  
**Context**: After discovering and fixing duplicate PR issue in frctls

---

## Critical Bug: Duplicate PR Prevention Missing

### Problem
The autonomous agent in both frctls and pip framework creates duplicate PRs when:
- Running on schedule (every 6 hours)
- No checks for existing open automated PRs
- No per-issue PR validation

### Impact
- 22 open PRs accumulated in frctls over ~4 days
- Manual cleanup required
- PR noise reduces signal for important reviews
- Potential GitHub API rate limiting

### Solution Implemented in frctls
Two-part approach:

#### 1. Prevention (`autonomous-agent.js`)
```javascript
// Check before creating any new PRs
function hasExistingAutomatedPRs() {
  const prs = exec('gh pr list --label automated --label roadmap --state open');
  return prs.length > 0;
}

// Check per-issue before picking it up
function hasExistingPRForIssue(issueNumber) {
  const prs = exec(`gh pr list --search "#${issueNumber}" --state open`);
  return prs.length > 0;
}

// In main(): Exit early if PRs exist
if (!issueNumber && hasExistingAutomatedPRs()) {
  console.log('Existing automated PRs need review first');
  return;
}
```

#### 2. Cleanup (`cleanup-duplicate-prs.js`)
- Groups PRs by issue number
- Keeps most recent PR per issue
- Closes duplicates with explanatory comment
- Reports PRs without clear issue links

---

## Recommendations for pip Framework

### 1. Add to `.pip/.github/agents/autonomous-agent.js`

**Priority**: 🔴 Critical

```javascript
// Add these functions before getNextRoadmapIssue()
function hasExistingAutomatedPRs() { ... }
function hasExistingPRForIssue(issueNumber) { ... }

// Modify getNextRoadmapIssue() to filter issues with existing PRs
const unassigned = approvedIssues.filter(issue => {
  if (issue.assignees.length > 0) return false;
  return !hasExistingPRForIssue(issue.number);
});

// Add early exit in main()
if (!issueNumber && hasExistingAutomatedPRs()) {
  console.log('⏸️  Existing automated PRs need review first');
  return;
}
```

### 2. Add Cleanup Tool

**Priority**: 🟡 High

Create `.pip/.github/agents/cleanup-duplicate-prs.js`:
- Reusable across all organisms
- Safe defaults (keeps most recent)
- Dry-run mode for testing

### 3. Update Configuration Schema

**Priority**: 🟡 High

Add to `.pip/.github/agents/config.json`:
```json
{
  "duplicate_prevention": {
    "enabled": true,
    "max_concurrent_automated_prs": 5,
    "check_per_issue": true,
    "skip_if_prs_exist": true
  }
}
```

### 4. Workflow Guardrails

**Priority**: 🟢 Medium

Add to `.pip/.github/workflows/autonomous-roadmap-agent.yml`:
```yaml
- name: Check PR threshold
  run: |
    PR_COUNT=$(gh pr list --label automated --json number --jq 'length')
    echo "Current automated PRs: $PR_COUNT"
    if [ "$PR_COUNT" -gt 10 ]; then
      echo "⚠️  Warning: $PR_COUNT automated PRs open"
      echo "Consider reviewing before creating more"
    fi
```

### 5. Documentation Updates

**Priority**: 🟢 Medium

#### Update `.pip/docs/agent-adoption-guide.md`

Add section: **"Preventing Duplicate PRs"**
```markdown
## Preventing Duplicate PRs

The agent includes safeguards to prevent duplicate work:

1. **Global Check**: Skips run if automated PRs exist
2. **Per-Issue Check**: Won't pick issues with existing PRs
3. **Manual Override**: Use `issue_number` input to force specific issue

### Monitoring
Check for buildup regularly:
```bash
gh pr list --label automated --state open
```

If you see >5 automated PRs, investigate:
- Are reviews happening?
- Are PRs getting stuck?
- Need to adjust schedule frequency?
```

#### Create `.pip/docs/troubleshooting/duplicate-prs.md`
- Symptoms and detection
- Root causes
- Cleanup procedures
- Prevention best practices

### 6. Testing Additions

**Priority**: 🟢 Medium

Add to `.pip/bin/test-agents.sh`:
```bash
# Test duplicate prevention
test_duplicate_prevention() {
  # Create mock PRs
  # Run agent
  # Verify it skips
}
```

---

## Architecture Comparison

### frctls (Before pip adoption)
```
.github/
├── scripts/          # Custom automation
│   ├── autonomous-agent.js
│   └── cleanup-duplicate-prs.js
└── workflows/        # GitHub Actions
    └── autonomous-roadmap-agent.yml
```

**Pros**: 
- Simple, self-contained
- Easy to customize per-project

**Cons**:
- Changes don't propagate to other projects
- Each project reinvents solutions

### pip Framework (Current)
```
.pip/                 # Genome (template)
├── .github/
│   ├── agents/      # Reusable scripts
│   │   ├── autonomous-agent.js
│   │   ├── config.json
│   │   └── README.md
│   └── workflows/   # Workflow templates
└── docs/            # Comprehensive guides

organism/            # Your project
├── .github/
│   ├── agents/      # Copied from .pip
│   └── workflows/   # Copied from .pip
└── docs/
```

**Pros**:
- Improvements propagate to all organisms
- Consistent patterns across projects
- Better documentation

**Cons**:
- More complex setup
- Need to sync updates from genome

### Recommended: Hybrid Approach

Keep pip's reusability but add:
1. **Versioning** for agent scripts (e.g., `v1.2.3`)
2. **Migration guides** when breaking changes occur
3. **Update notifications** when genome improves
4. **Local overrides** in organism config

```json
// organism/.github/agents/config.json
{
  "pip_version": "1.2.0",
  "overrides": {
    "duplicate_prevention": {
      "max_concurrent_automated_prs": 3  // Stricter than genome default
    }
  }
}
```

---

## Learnings for Other Organisms

### If You're Experiencing Duplicate PRs

1. **Immediate**: Run cleanup script
   ```bash
   node .github/scripts/cleanup-duplicate-prs.js
   ```

2. **Short-term**: Add PR checks to agent
   - Copy prevention logic from frctls
   - Test with manual workflow runs

3. **Long-term**: Wait for pip genome update
   - Monitor pip releases
   - Apply updated agent scripts

### Monitoring Best Practices

```bash
# Daily check (add to cron or GitHub Action)
PR_COUNT=$(gh pr list --label automated --state open --json number --jq 'length')
if [ "$PR_COUNT" -gt 5 ]; then
  echo "⚠️  $PR_COUNT automated PRs open - investigate!"
  # Send notification (email, Slack, etc.)
fi
```

### Tuning Schedule Frequency

If you get duplicates often:
- **Reduce frequency**: Every 12h instead of 6h
- **Add PR threshold**: Max 3 concurrent automated PRs
- **Enable human review**: Don't auto-merge until reviewed

---

## Cost-Benefit Analysis

### Bug Impact
- **Severity**: Medium (doesn't break functionality, causes noise)
- **Frequency**: High (happens every scheduled run if PRs exist)
- **Effort to Fix**: Low (~100 lines of code)
- **Benefit**: High (prevents PR buildup across all organisms)

### Recommended Priority
**Merge this fix into pip genome in next release (v2.0 or v1.1)**

---

## Next Steps

1. [ ] Review this document
2. [ ] Create issue in pip repo: "Add duplicate PR prevention"
3. [ ] Submit PR with:
   - Updated `autonomous-agent.js`
   - New `cleanup-duplicate-prs.js`
   - Updated documentation
   - Tests for prevention logic
4. [ ] Add to pip ROADMAP.md under "Quality & Reliability"
5. [ ] Notify organism maintainers of update

---

**Prepared by**: CTO Agent (via Warp)  
**Related PR**: frctls#50  
**Related Files**:
- `.github/scripts/autonomous-agent.js`
- `.github/scripts/cleanup-duplicate-prs.js`
