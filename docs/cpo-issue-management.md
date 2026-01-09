# CPO Guide: Managing Roadmap via GitHub Issues

**Role**: Chief Product Officer (CPO)  
**Purpose**: Track and prioritize code improvements using GitHub Issues  
**Last Updated**: 2026-01-09

---

## 🎯 Overview

The CPO uses GitHub Issues to manage the implementation roadmap from [code-review-recommendations.md](./code-review-recommendations.md). This provides:
- **Visibility**: Team can see what's being worked on
- **Tracking**: Progress is visible in one place
- **Prioritization**: Labels make priorities clear
- **Collaboration**: Discussions happen in context
- **Automation**: Can trigger automated agent workflows

---

## 📋 Creating Roadmap Tasks

### Step 1: Use the Issue Template

1. Go to [GitHub Issues](../../issues/new/choose)
2. Select **"🎯 Roadmap Task"**
3. Fill in the template fields

### Step 2: Fill Required Fields

**Task ID**: Use the ID from recommendations (e.g., `HP-1`, `MP-2`, `LP-3`)
```
HP-1 (High Priority #1)
MP-2 (Medium Priority #2)
LP-3 (Low Priority #3)
```

**Priority Level**: Select from dropdown
- 🔴 High Priority (HP) - Blocking issues, security, critical tech debt
- 🟡 Medium Priority (MP) - Quality improvements, testing, docs
- 🟢 Low Priority (LP) - Enhancements, features, nice-to-haves

**Effort Estimate**: From recommendations document
```
10 minutes
30 minutes
1 hour
4-6 hours
```

**Description**: Copy from recommendations, add context as needed

**Acceptance Criteria**: Define "done"
```markdown
- [ ] Tests pass (pnpm test:all)
- [ ] Configuration is correct
- [ ] Documentation is updated
- [ ] Activity log is updated
```

### Step 3: Add Labels

GitHub will auto-add `roadmap` label. Manually add:
- Priority: `priority-high`, `priority-medium`, `priority-low`
- Type: `config`, `testing`, `security`, `documentation`, `performance`
- Status: `ready`, `in-progress`, `blocked`, `needs-review`

### Step 4: Link Dependencies

If task depends on others or blocks others:
```markdown
**Depends on**: #12, #13
**Blocks**: #15, #16
```

---

## 🏷️ Label System

### Priority Labels
- `priority-high` - 🔴 High Priority (HP-1 through HP-4)
- `priority-medium` - 🟡 Medium Priority (MP-1 through MP-5)
- `priority-low` - 🟢 Low Priority (LP-1 through LP-4)

### Type Labels
- `security` - Security-related changes
- `config` - Configuration changes
- `testing` - Test additions/improvements
- `documentation` - Docs updates
- `performance` - Performance optimizations
- `dx` - Developer experience improvements

### Status Labels
- `ready` - Ready to start (all dependencies met)
- `in-progress` - Currently being worked on
- `blocked` - Waiting on something
- `needs-review` - In PR review
- `completed` - Done and merged

### Workflow Labels
- `roadmap` - From code review recommendations
- `automated` - Can be handled by automation
- `needs-human` - Requires human judgment
- `quick-win` - Can be completed in <30 minutes

---

## 📊 Creating Issues from Recommendations

### High Priority Issues (Create First)

**HP-1: Fix GitHub URLs Configuration**
```bash
gh issue create \
  --title "HP-1: Fix GitHub URLs configuration in astro.config.mjs" \
  --label "roadmap,priority-high,config,quick-win" \
  --body-file .github/templates/hp-1.md
```

**HP-2: Replace Hardcoded Credentials**
```bash
gh issue create \
  --title "HP-2: Replace hardcoded database credentials with environment variables" \
  --label "roadmap,priority-high,security" \
  --body-file .github/templates/hp-2.md
```

**HP-3: Enhance Root package.json**
```bash
gh issue create \
  --title "HP-3: Enhance root package.json with workspace scripts" \
  --label "roadmap,priority-high,config,dx" \
  --body-file .github/templates/hp-3.md
```

**HP-4: Configure Nx Caching**
```bash
gh issue create \
  --title "HP-4: Configure Nx caching for faster builds" \
  --label "roadmap,priority-high,performance,dx" \
  --body-file .github/templates/hp-4.md
```

### Using the Web UI

Or create via web interface:
1. Click [New Issue](../../issues/new/choose)
2. Select "🎯 Roadmap Task"
3. Copy details from [code-review-recommendations.md](./code-review-recommendations.md)
4. Add appropriate labels
5. Submit

---

## 🔄 Workflow

### 1. Issue Creation (CPO)
- Create issue from roadmap
- Add appropriate labels
- Set priority
- Define acceptance criteria

### 2. Ready State
- Add `ready` label when:
  - All dependencies are resolved
  - Requirements are clear
  - Acceptance criteria defined

### 3. In Progress
- Developer (human or agent) assigns themselves
- Change label to `in-progress`
- Create feature branch
- Reference issue in commits

### 4. PR Creation
- PR automatically links to issue via "Fixes #123"
- Change label to `needs-review`
- CPO or technical lead reviews

### 5. Completion
- After PR merge:
  - Issue automatically closes
  - Add `completed` label
  - Update [activity-log.md](./activity-log.md)
  - Update [recommendation-tracking.json](./recommendation-tracking.json)

---

## 📈 Project Board (Optional)

Create a GitHub Project to visualize progress:

### Columns
1. **📋 Backlog** - Not started
2. **🚀 Ready** - Dependencies met, ready to start
3. **🏗️ In Progress** - Currently being worked on
4. **👀 Review** - In PR review
5. **✅ Done** - Completed and merged

### Automation Rules
- Move to "In Progress" when PR created
- Move to "Review" when PR ready
- Move to "Done" when PR merged

---

## 🤖 Integration with Autonomous Agent

Issues marked with `automated` + `ready` can be picked up by the autonomous agent workflow:

1. Agent runs on schedule (e.g., daily)
2. Queries for issues: `label:automated label:ready label:priority-high`
3. Selects highest priority unassigned issue
4. Creates PR to address the issue
5. References issue with "Fixes #123"
6. PR review required before merge

**See**: [autonomous-agent-automation-plan.md](./autonomous-agent-automation-plan.md)

---

## 📊 Tracking Progress

### View Current Status
```bash
# High priority tasks
gh issue list --label "priority-high,roadmap"

# In progress
gh issue list --label "in-progress"

# Ready to work
gh issue list --label "ready" --state open
```

### Generate Report
```bash
# All roadmap issues by priority
gh issue list --label roadmap --json number,title,labels,state \
  --jq '.[] | "\(.number) | \(.title) | \(.state)"'
```

### Metrics to Track
- Open vs Closed roadmap issues
- Average time to completion
- High priority completion rate
- Agent success rate (for automated issues)

---

## 🎯 Best Practices

### DO:
✅ Create issues from recommendations first (don't skip the roadmap)  
✅ Use consistent labeling  
✅ Define clear acceptance criteria  
✅ Link related issues and PRs  
✅ Update status as work progresses  
✅ Document decisions in issue comments  

### DON'T:
❌ Create duplicate issues for same recommendation  
❌ Skip the issue template (keeps things consistent)  
❌ Start work without `ready` label  
❌ Close issues without merged PR  
❌ Forget to update activity-log.md after completion  

---

## 📝 Quick Reference

### Create Issue
```bash
gh issue create --template roadmap-task.yml
```

### Add Labels
```bash
gh issue edit <number> --add-label "priority-high,security"
```

### Assign Issue
```bash
gh issue edit <number> --add-assignee "@me"
```

### Link to PR
In PR description:
```markdown
Fixes #123
Closes #124
```

### Check Status
```bash
gh issue view <number>
```

---

## 🔗 Related Documents

- [Code Review Recommendations](./code-review-recommendations.md) - Source of all roadmap tasks
- [Autonomous Agent Plan](./autonomous-agent-automation-plan.md) - Automation strategy
- [Activity Log](./activity-log.md) - Historical record
- [AGENTS.md](../AGENTS.md) - Agent guidelines

---

**Questions?** Create a [Discussion](../../discussions) or reach out to the team.
