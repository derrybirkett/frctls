# Autonomous Agent Automation Plan

**Created**: 2026-01-09  
**Status**: Planning Phase  
**Goal**: Enable automated agents to work through code review recommendations and create PRs

---

## 🎯 Overview

Create a GitHub Actions workflow that:
1. Runs on a schedule (e.g., daily or weekly)
2. Reads the recommendations document
3. Selects the next high-priority unimplemented item
4. Uses an AI agent (GitHub Copilot, Claude, etc.) to implement the changes
5. Runs tests and validation
6. Creates a PR for human review
7. Tracks progress to avoid duplicate work

---

## 🏗️ Architecture

### Components

```
┌─────────────────────────────────────────────────────┐
│  GitHub Actions Workflow (scheduled)                │
│  - Triggers: cron schedule + manual dispatch        │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  Recommendation Parser                               │
│  - Reads code-review-recommendations.md             │
│  - Identifies next incomplete high-priority item    │
│  - Checks for existing branches/PRs                 │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  AI Agent Orchestrator                              │
│  - Calls LLM API (OpenAI, Anthropic, etc.)         │
│  - Provides context: repo structure, files, task   │
│  - Requests implementation plan + code changes      │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  Change Implementer                                  │
│  - Creates feature branch                           │
│  - Applies file changes from AI response            │
│  - Runs formatters and linters                      │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  Validation & Testing                               │
│  - Runs test suite (nx test:all)                   │
│  - Validates build (nx build)                       │
│  - Checks for errors                                │
│  - Generates validation report                      │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  PR Creator                                          │
│  - Creates pull request if validation passes        │
│  - Links to recommendation item                     │
│  - Adds validation report                           │
│  - Requests human review                            │
│  - Updates tracking state                           │
└─────────────────────────────────────────────────────┘
```

---

## 📋 Implementation Plan

### Phase 1: Foundation (Week 1)

#### 1.1 Create Tracking System
**File**: `docs/recommendation-tracking.json`
```json
{
  "last_updated": "2026-01-09T00:00:00Z",
  "items": {
    "HP-1": {
      "id": "HP-1",
      "status": "pending",
      "branch": null,
      "pr_number": null,
      "last_attempt": null,
      "attempt_count": 0,
      "completed_date": null
    }
  }
}
```

**Purpose**: Track which items are in progress, prevent duplicate work

#### 1.2 Create Recommendation Parser Script
**File**: `.github/scripts/parse-recommendations.js`
```javascript
const fs = require('fs').promises;
const path = require('path');

async function parseRecommendations() {
  // Read markdown file
  // Extract all recommendation IDs and metadata
  // Match with tracking.json
  // Return next item to work on
  // Consider priority order: HP -> MP -> LP
}

async function getNextTask() {
  const tracking = await loadTracking();
  const recommendations = await parseRecommendations();
  
  // Find first HP item not completed or in progress
  const nextTask = recommendations.find(rec => 
    rec.priority === 'HP' && 
    tracking.items[rec.id].status === 'pending'
  );
  
  return nextTask;
}
```

#### 1.3 Create Basic Workflow
**File**: `.github/workflows/autonomous-improvements.yml`
```yaml
name: Autonomous Code Improvements

on:
  schedule:
    # Run every Monday at 3 AM UTC
    - cron: '0 3 * * 1'
  workflow_dispatch:
    inputs:
      recommendation_id:
        description: 'Specific recommendation to implement (e.g., HP-1)'
        required: false
        type: string
      dry_run:
        description: 'Dry run (no PR creation)'
        required: false
        type: boolean
        default: false

permissions:
  contents: write
  pull-requests: write
  issues: write

jobs:
  select-task:
    runs-on: ubuntu-latest
    outputs:
      task_id: ${{ steps.select.outputs.task_id }}
      task_title: ${{ steps.select.outputs.task_title }}
      has_task: ${{ steps.select.outputs.has_task }}
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Select next task
        id: select
        run: |
          cd .github/scripts
          npm install
          node parse-recommendations.js
```

### Phase 2: AI Integration (Week 2)

#### 2.1 AI Agent Implementation Script
**File**: `.github/scripts/ai-agent-implementer.js`

**Key responsibilities**:
1. Read the selected recommendation in detail
2. Gather necessary context (file contents, related code)
3. Call LLM API with structured prompt
4. Parse AI response for file changes
5. Apply changes to working directory
6. Handle edge cases (file not found, syntax errors)

**Prompt structure**:
```javascript
const prompt = `
You are an expert software engineer implementing code improvements.

REPOSITORY CONTEXT:
- Project: Fractals of Change blog (Astro + Nx monorepo)
- Current task: ${taskId} - ${taskTitle}

TASK DESCRIPTION:
${taskDescription}

FILES TO MODIFY:
${filesToModify}

CURRENT CODE:
${currentCode}

REQUIREMENTS:
1. Follow .pip principles (small, incremental changes)
2. Maintain test coverage
3. Follow existing code style
4. Update documentation if needed

Provide your response in the following JSON format:
{
  "plan": "Brief description of changes",
  "files": [
    {
      "path": "relative/path/to/file",
      "action": "create|modify|delete",
      "content": "full file content after changes"
    }
  ],
  "tests": "Description of how to test the changes",
  "docs_updates": ["List of docs to update"]
}
`;
```

#### 2.2 API Integration Options

**Option A: OpenAI GPT-4** (Recommended for start)
- Pro: Good at code generation, already have API key
- Con: Cost ($0.03/1K tokens), rate limits
- Setup: Add API calls to existing generate-content.js pattern

**Option B: GitHub Copilot API** (If available)
- Pro: Integrated with GitHub, understands repo context
- Con: May require enterprise license
- Setup: Use @github/copilot-agent or similar

**Option C: Anthropic Claude** (Alternative)
- Pro: Large context window (200K tokens), good at following instructions
- Con: Additional API key needed, cost
- Setup: Similar to OpenAI integration

**Recommendation**: Start with OpenAI GPT-4, reuse existing OPENAI_API_KEY

### Phase 3: Safety & Validation (Week 2-3)

#### 3.1 Pre-Implementation Checks
```javascript
async function validateBeforeImplementation(task) {
  // Check if branch already exists
  // Check if PR already exists
  // Verify no merge conflicts
  // Ensure tests are passing on main
  // Check rate limits
  return { canProceed: true, reasons: [] };
}
```

#### 3.2 Post-Implementation Validation
```yaml
- name: Run validation suite
  run: |
    # Install dependencies
    pnpm install
    
    # Run linters
    pnpm format:check || echo "::warning::Format check failed"
    
    # Run tests
    pnpm test:all
    
    # Try to build
    cd apps/blog
    pnpm build
    
    # Check for new errors
    if [ $? -ne 0 ]; then
      echo "::error::Build or tests failed"
      exit 1
    fi
```

#### 3.3 Safety Limits
- **Max 1 PR per day** - Prevents overwhelming reviewers
- **Max 3 retry attempts** - If implementation fails, mark as needs-human
- **Test requirement** - Must pass existing tests (don't skip)
- **Size limits** - Max 10 files changed, max 500 lines changed
- **Manual approval** - All PRs require human review before merge

### Phase 4: PR Creation & Tracking (Week 3)

#### 4.1 PR Template
```markdown
## 🤖 Autonomous Implementation

**Recommendation**: {taskId} - {taskTitle}  
**Priority**: {priority}  
**Automated by**: GitHub Actions Agent

### Changes Made

{aiPlan}

### Files Modified

- `{file1}` - {description}
- `{file2}` - {description}

### Validation Results

✅ Tests passed: {testResults}  
✅ Build successful: {buildResults}  
✅ Linting passed: {lintResults}

### Human Review Checklist

- [ ] Code follows .pip principles (small, incremental)
- [ ] Changes match the recommendation intent
- [ ] Tests are adequate
- [ ] Documentation is updated
- [ ] No unintended side effects

### Testing Instructions

{testInstructions}

---

**Related**: [Recommendation HP-1](../docs/code-review-recommendations.md#hp-1)  
**Tracking**: See [recommendation-tracking.json](../docs/recommendation-tracking.json)
```

#### 4.2 Update Tracking
```javascript
async function updateTracking(taskId, status, metadata) {
  const tracking = await loadTracking();
  tracking.items[taskId] = {
    ...tracking.items[taskId],
    status, // 'pending', 'in_progress', 'pr_created', 'completed', 'failed'
    ...metadata,
    last_updated: new Date().toISOString()
  };
  await saveTracking(tracking);
}
```

### Phase 5: Monitoring & Iteration (Week 4)

#### 5.1 Success Metrics Dashboard
Create a GitHub Issue to track:
- PRs created vs merged
- Success rate (merged without major changes)
- Time to review/merge
- Cost per PR (API usage)
- Human intervention rate

#### 5.2 Feedback Loop
- Analyze failed PRs to improve prompts
- Add common patterns to AI context
- Refine validation rules
- Update recommendation quality

#### 5.3 Notifications
```yaml
- name: Notify on completion
  if: steps.create-pr.outputs.pull-request-number
  run: |
    echo "✅ Created PR #${{ steps.create-pr.outputs.pull-request-number }}"
    # Optional: Send Slack notification, email, etc.
```

---

## 🔒 Safety Considerations

### 1. Rate Limiting
- **OpenAI**: Tier-based (default: 10K TPM, 500 RPM)
- **GitHub**: 5000 requests/hour
- **Strategy**: Add exponential backoff, cache API responses

### 2. Cost Management
- **Estimate**: ~$2-5 per PR with GPT-4
- **Budget**: Set monthly limit in workflow (e.g., max 10 PRs)
- **Monitoring**: Log token usage, implement cost alerts

### 3. Security
- **API Keys**: Store in GitHub Secrets, rotate regularly
- **Code Review**: Never auto-merge, always require human approval
- **Blast Radius**: Limit to low-risk changes initially (docs, configs)
- **Rollback**: Easy revert if issues detected

### 4. Quality Control
- **Test Coverage**: Require tests pass
- **Human Review**: Mandatory for all PRs
- **Iteration Limit**: Max 3 attempts per recommendation
- **Escalation**: Mark complex items for human implementation

---

## 📊 Rollout Strategy

### Week 1-2: Proof of Concept
- Implement foundation (tracking, parser)
- Manual trigger only (no cron schedule)
- Test with HP-1 (simple config change)
- Validate end-to-end flow

### Week 3-4: Limited Automation
- Enable cron schedule (1x per week)
- Limit to HP items only
- Monitor success rate
- Gather feedback

### Month 2: Expand Scope
- Increase frequency (2x per week)
- Include MP items
- Refine prompts based on results
- Add more validation

### Month 3: Full Automation
- Daily runs (if success rate >70%)
- Include LP items
- Optimize costs
- Consider multiple PRs per run

---

## 🎯 Success Criteria

**Minimum Viable Product (MVP)**:
- ✅ Workflow can select next task automatically
- ✅ AI can implement simple config changes (HP-1, HP-3)
- ✅ Creates valid PR with description
- ✅ Tests pass before PR creation
- ✅ Tracking prevents duplicate work

**Full Success**:
- 70%+ of PRs merged without major changes
- <$50/month in API costs
- Average 2-3 PRs per week
- Human review time <15 min per PR
- All HP items completed within 4 weeks

---

## 🚧 Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| AI generates broken code | High | Medium | Extensive validation, tests required |
| High API costs | Medium | High | Budget limits, usage monitoring |
| Poor PR quality | Medium | Medium | Iterate on prompts, start simple |
| Overwhelming reviewers | Low | High | Max 1 PR/day, pause if backlog |
| Security vulnerabilities | Low | Critical | Never auto-merge, security scanning |

---

## 📝 Next Steps

1. **Review & Approve Plan** - Stakeholder sign-off
2. **Create Tracking System** - recommendation-tracking.json
3. **Implement Parser** - parse-recommendations.js
4. **Build Basic Workflow** - autonomous-improvements.yml (manual trigger)
5. **Test with HP-1** - Dry run, validate output
6. **Iterate on Prompts** - Refine based on HP-1 results
7. **Enable Scheduling** - Add cron after successful manual tests
8. **Monitor & Optimize** - Track metrics, improve over time

---

## 🔗 Related Documents

- [Code Review Recommendations](./code-review-recommendations.md) - Source of tasks
- [Activity Log](./activity-log.md) - Track completed work
- [AI Content Setup](./ai-content-setup.md) - Similar automation pattern

---

**Questions or Concerns**: Discuss in [GitHub Discussions](../../discussions) or create an issue.
