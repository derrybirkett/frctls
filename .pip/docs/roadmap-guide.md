# Roadmap Navigation Guide

This guide explains how to use the GitHub-based roadmap for the pip framework.

## Overview

The pip roadmap is managed through GitHub Issues and Projects, providing:
- ✅ Trackable progress with visual boards
- ✅ Milestone tracking with completion percentages
- ✅ Community collaboration and transparency
- ✅ Integration with PRs and agent workflows

**Main Roadmap**: [pip Roadmap v2.0 Project](https://github.com/users/derrybirkett/projects/4)

## Quick Access

### Key Links
- **[Project Board](https://github.com/users/derrybirkett/projects/4)** - Visual Kanban board
- **[All Roadmap Issues](https://github.com/derrybirkett/pip/issues?q=is%3Aissue+label%3Aroadmap)** - Complete list
- **[Milestones](https://github.com/derrybirkett/pip/milestones)** - Version tracking
- **[ROADMAP.md](../ROADMAP.md)** - Strategic context and vision

### Strategic Initiatives
- **[Initiative 1: Agentic System](https://github.com/derrybirkett/pip/issues/59)** - Transform pip into complete agentic development system
- **[Initiative 2: Fragments](https://github.com/derrybirkett/pip/issues/60)** - Add web and mobile application fragments

## Project Structure

### Issue Hierarchy
```
Epic Issues (2)
  ├── Initiative 1: Agentic System (#59)
  └── Initiative 2: Fragments (#60)
      ↓
Milestone Issues (9)
  ├── v1.1.0: Foundation
  ├── v1.2.0: Memory System
  ├── v1.3.0: Agent Enhancement
  └── ... (and others)
      ↓
Task Issues (Many)
  ├── Individual deliverables
  └── Specific work items
```

### Labels

**Initiative Labels:**
- `initiative-1-agentic` - Complete Agentic Development System
- `initiative-2-fragments` - Application Fragments

**Type Labels:**
- `epic` - Strategic initiative (top-level)
- `milestone` - Version milestone
- `feature` - New functionality
- `documentation` - Docs and guides
- `research` - Investigation and learning
- `tooling` - Developer tools and automation

**Agent Labels:**
- `agent-cto` - Technical architecture and implementation
- `agent-cpo` - Product planning and prioritization
- `agent-coo` - Operations and release management
- `agent-ciso` - Security review and compliance
- `agent-cmo` - Marketing and documentation

**Status Labels:**
- `roadmap` - All roadmap items (required)
- `blocked` - Has unmet dependencies
- `needs-approval` - Requires CPO/CEO approval

**Priority Labels:**
- `priority-p0` - Critical (blocking)
- `priority-p1` - High priority
- `priority-p2` - Medium priority
- `priority-p3` - Low priority

## Using the Project

### Board View (Kanban)

The board has 5 columns:
1. **Backlog** - Approved but not yet ready
2. **Ready** - Ready to start, no blockers
3. **In Progress** - Actively being worked on
4. **Review** - PR created, under review
5. **Done** - Completed and merged

**Workflow:**
```
Backlog → Ready → In Progress → Review → Done
```

### Table View

Use table view for:
- Filtering by multiple criteria
- Bulk editing labels and fields
- Sorting by priority or effort
- Exporting data

### Roadmap View

Visual timeline showing:
- Milestones with due dates
- Issue dependencies
- Progress across versions
- Timeline conflicts

## Finding Work

### As a Contributor

**Find ready tasks:**
```bash
# All unassigned roadmap tasks
gh issue list --label roadmap --assignee ""

# Filter by your skills (e.g., CTO role)
gh issue list --label roadmap --label agent-cto --assignee ""

# Look for specific milestone
gh issue list --milestone "v1.1.0: Foundation"
```

**Check effort level:**
- `XS` - < 2 hours
- `S` - 2-8 hours  
- `M` - 1-3 days
- `L` - 1-2 weeks
- `XL` - 2+ weeks

### As a Product Manager (CPO)

**Weekly triage:**
```bash
# See items needing approval
gh issue list --label needs-approval

# Review by priority
gh issue list --label roadmap --label priority-p1

# Check milestone progress
gh issue list --milestone "v1.1.0: Foundation" --state all
```

### As Operations (COO)

**Monitor health:**
```bash
# Check blocked items
gh issue list --label blocked

# See in-progress work
gh issue list --label roadmap --assignee "*"

# Milestone completion
gh api repos/derrybirkett/pip/milestones --jq '.[] | {title, open_issues, closed_issues}'
```

## Contributing to Roadmap

### Proposing New Items

1. **Create issue** using "Roadmap Item" template
2. **Fill required fields**:
   - Description (what and why)
   - Goals and deliverables
   - Success criteria
   - Estimated effort
   - Agent role assignment
3. **Add labels**: At minimum `roadmap` + initiative/type
4. **Submit** for CPO triage

### CPO Triage Process

**Weekly schedule:** Review `needs-approval` label

**Approval criteria:**
- ✅ Aligns with strategic initiatives
- ✅ Clear value proposition
- ✅ Reasonable effort estimate
- ✅ No conflicting priorities
- ✅ Follows .pip principles

**Actions:**
- **Approve**: Remove `needs-approval`, add to project, assign milestone
- **Reject**: Close with explanation, suggest alternatives
- **Defer**: Add to backlog, revisit next quarter

### Working on Roadmap Items

**Standard workflow:**

1. **Claim the issue**: Self-assign or ask to be assigned
2. **Move to "In Progress"**: Update project board (or it auto-moves)
3. **Create branch**: Follow naming convention `feat/`, `fix/`, etc.
4. **Work and commit**: Reference issue in commits (`#issue-number`)
5. **Create PR**: Link PR to issue in description (`Closes #issue-number`)
6. **Review**: PR moves issue to "Review" column automatically
7. **Merge**: Issue auto-closes and moves to "Done"

**Example workflow:**
```bash
# 1. Pick an issue from project
gh issue view 61

# 2. Assign yourself
gh issue edit 61 --add-assignee @me

# 3. Create branch
git checkout -b feat/pattern-library

# 4. Work and commit
git commit -m "feat: add ReAct pattern documentation

Implements pattern extraction for v1.1.0 milestone

Closes #61"

# 5. Create PR
gh pr create --title "feat: Pattern Library Documentation" --body "Closes #61"

# 6. Issue automatically moves through Review → Done when merged
```

## Agent Integration

### For Autonomous Agents

The roadmap structure supports agent automation (see frctls #25):

**Agent workflow:**
1. Query issues with `roadmap` label
2. Filter by `agent-cto` (or relevant role)
3. Find unassigned issues in "Ready" column
4. Implement and create PR
5. Link PR to issue for auto-tracking

**Example agent query:**
```javascript
// Find next CTO task
const issues = await octokit.issues.listForRepo({
  owner: 'derrybirkett',
  repo: 'pip',
  labels: 'roadmap,agent-cto',
  state: 'open',
  assignee: 'none'
});
```

### For Human-Agent Collaboration

**CPO assigns priority:**
```bash
# Mark as high priority for agent
gh issue edit <number> --add-label priority-p1

# Assign to specific agent role
gh issue edit <number> --add-label agent-cto
```

**Agent picks up and implements:**
- Finds high-priority unassigned issues
- Creates implementation
- Submits PR for human review

## Best Practices

### For Issue Creation
- ✅ Use descriptive titles starting with `[Epic]`, `[Milestone]`, or task name
- ✅ Link to parent issues (epic → milestone → task)
- ✅ Include acceptance criteria
- ✅ Estimate effort realistically
- ✅ Tag appropriate agent role

### For Issue Management
- ✅ Keep issues focused (one deliverable per issue)
- ✅ Update status when blocked
- ✅ Close with comment explaining outcome
- ✅ Link related issues and PRs
- ✅ Use milestones for version tracking

### For Project Hygiene
- ✅ Move issues through columns as they progress
- ✅ Close completed items promptly
- ✅ Update effort estimates if scope changes
- ✅ Review blocked items weekly
- ✅ Archive old milestones after release

## Metrics and Reporting

### Milestone Progress
```bash
# Get milestone completion %
gh api repos/derrybirkett/pip/milestones | jq '.[] | {
  title,
  progress: (.closed_issues / (.open_issues + .closed_issues) * 100)
}'
```

### Issue Velocity
```bash
# Closed issues this week
gh issue list --label roadmap --state closed --search "closed:>=2026-01-05"

# Average time to close
gh issue list --label roadmap --state closed --json closedAt,createdAt
```

### Initiative Health
```bash
# Initiative 1 progress
gh issue list --label initiative-1-agentic --state all --json state | \
  jq 'group_by(.state) | map({state: .[0].state, count: length})'
```

## Troubleshooting

### Issue Not Appearing in Project
- Ensure `roadmap` label is applied
- Check if issue is linked to project
- Verify project URL: https://github.com/users/derrybirkett/projects/4

### Can't Move Issue in Board
- Check if you have write access
- Refresh the page
- Try using `gh project` CLI instead

### Milestone Not Showing Issues
- Verify milestone assignment on issue
- Check milestone name matches exactly
- Use API to debug: `gh api repos/:owner/:repo/milestones/:number`

## Related Documentation

- [ROADMAP.md](../ROADMAP.md) - Strategic vision and context
- [CONTRIBUTING.md](../CONTRIBUTING.md) - General contribution guidelines
- [agent workflows](../patterns/agent-workflows/) - Agent-specific workflows (when created)
- [CPO Triage Guide](../.pip/docs/CPO-TRIAGE.md) - For agentic workflow (when applicable)

## Support

Questions about the roadmap?
- **Process questions**: Ask COO or create discussion
- **Priority questions**: Ask CPO  
- **Strategic questions**: Ask CEO
- **Technical help**: Create issue with `help-wanted` label

---

**Maintained by**: COO  
**Last Updated**: 2026-01-11  
**Feedback**: Open an issue or discussion
