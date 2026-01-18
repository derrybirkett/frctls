# CPO Agent Suggestion Triage Guide

## Overview

CTO and CISO review agents automatically create GitHub issues when they identify improvement opportunities during PR reviews. These issues are labeled `agent-suggestion` and `needs-approval`, and require **CPO triage** before being added to the roadmap for implementation.

## Product-Led Development Flow

```
┌─────────────────────────────────────────────────────────────┐
│  Developer creates PR                                        │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  CTO/CISO Agents Review                                      │
│  • Approve/Comment/Request Changes                           │
│  • Create issues for suggestions                             │
│  • Label: agent-suggestion, needs-approval                   │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  CPO Triage (YOU ARE HERE)                                   │
│  • Review agent suggestions weekly                           │
│  • Evaluate: value, effort, alignment                        │
│  • Accept → add to roadmap                                   │
│  • Reject → close with rationale                             │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  Autonomous Agent Implements                                 │
│  • Only picks up approved roadmap issues                     │
│  • Skips needs-approval items                                │
└─────────────────────────────────────────────────────────────┘
```

## Finding Agent Suggestions

View all pending agent suggestions:

```bash
gh issue list --label "agent-suggestion" --label "needs-approval"
```

Or filter by type:
```bash
# CTO technical suggestions
gh issue list --label "agent-suggestion" --label "technical-debt"

# CISO security suggestions
gh issue list --label "agent-suggestion" --label "security"
```

## Triage Criteria

When evaluating agent suggestions, consider:

### 1. **Strategic Alignment**
- Does this align with current product priorities?
- Does it support our roadmap goals?
- Is this the right time for this improvement?

### 2. **Value vs. Effort**
- What's the expected ROI?
- Is the effort estimate reasonable?
- Are there dependencies or blockers?

### 3. **Risk Assessment**
- What happens if we don't do this?
- Are there security implications?
- Does this reduce technical debt?

### 4. **.pip Principles**
- Is it small and incremental?
- Can it be measured?
- Is it strategic, not just tactical?

## Approval Process

### To Accept a Suggestion

1. **Review the issue details**
   - Read the agent's description and rationale
   - Check the original PR context
   - Assess priority (high/medium/low)

2. **Add to roadmap**
   ```bash
   # Add roadmap label and remove needs-approval
   gh issue edit <issue-number> \
     --add-label "roadmap" \
     --remove-label "needs-approval"
   ```

3. **Set priority** (if not already set)
   ```bash
   # Adjust priority based on your assessment
   gh issue edit <issue-number> \
     --add-label "priority-high"  # or medium/low
   ```

4. **Add context** (optional but recommended)
   ```bash
   gh issue comment <issue-number> --body "✅ Approved for roadmap.
   
   **CPO Context:** [Why this matters, when to prioritize, etc.]
   **Target:** [Sprint/milestone if known]"
   ```

### To Reject a Suggestion

1. **Add rationale comment**
   ```bash
   gh issue comment <issue-number> --body "❌ Not prioritizing this suggestion.
   
   **Reason:** [Clear explanation]
   **Alternative:** [If applicable]
   **Reconsider:** [Conditions that might change this decision]"
   ```

2. **Close the issue**
   ```bash
   gh issue close <issue-number> --reason "not planned"
   ```

## Common Rejection Reasons

- **Not aligned with current strategy**: Feature doesn't fit roadmap direction
- **Too low ROI**: Effort outweighs benefit at this time
- **Covered by existing work**: Already planned in another issue
- **Premature optimization**: System isn't at scale where this matters
- **Better alternatives exist**: Different approach is preferred

## Review Cadence

**Recommended Schedule:**
- **Weekly triage**: Review new `needs-approval` issues
- **Monthly review**: Re-evaluate rejected items (priorities may change)
- **Quarterly planning**: Consider approved-but-unstarted items

## Metrics to Track

Monitor these metrics to assess the agent suggestion system:

```bash
# Pending suggestions
gh issue list --label "needs-approval" --json number | jq '. | length'

# Approved suggestions
gh issue list --label "roadmap" --label "agent-suggestion" --state open --json number | jq '. | length'

# Implemented suggestions
gh issue list --label "agent-suggestion" --state closed --search "closed:>2026-01-01" --json number | jq '. | length'
```

## Example Triage Session

```bash
# 1. See what's pending
gh issue list --label "needs-approval" --json number,title,labels

# 2. Review a specific suggestion
gh issue view 24

# 3. Approve it
gh issue edit 24 --add-label "roadmap" --remove-label "needs-approval"
gh issue comment 24 --body "✅ Approved. Aligns with Q1 quality goals."

# 4. Prioritize
gh issue edit 24 --add-label "priority-medium"
```

## Tips for Effective Triage

1. **Batch review**: Set aside time weekly rather than reacting to each one
2. **Be decisive**: Don't let suggestions accumulate indefinitely
3. **Document decisions**: Future you (or your team) will thank you
4. **Re-evaluate**: Rejected today doesn't mean rejected forever
5. **Trust the agents**: They're usually right about technical improvements
6. **Balance**: Not every suggestion needs immediate action

## Related Documentation

- [CPO Issue Management](cpo-issue-management.md) - General issue management workflow
- [Code Review Recommendations](code-review-recommendations.md) - Original roadmap
- [Autonomous Agent Plan](autonomous-agent-automation-plan.md) - How agents work together
