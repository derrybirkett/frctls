# .pip Agentic Workflow - Architecture

Technical architecture and design decisions for the AI-powered autonomous development system.

## System Overview

The .pip Agentic Workflow is a multi-agent system that automates software development while maintaining human oversight through a Product-led approval gate.

```
┌──────────────────────────────────────────────────────────────────┐
│                        GitHub Repository                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Roadmap Issues                                           │   │
│  │  • Labeled: roadmap, priority-*                          │   │
│  │  • Approved by CPO                                       │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ↓                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Autonomous Agent (Scheduled: Every 6 hours)            │   │
│  │  • Finds next unassigned issue                          │   │
│  │  • Generates implementation via GPT-4                   │   │
│  │  • Creates branch + PR                                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ↓                                    │
│  ┌─────────────────────┬────────────────────────────────────┐   │
│  │  CTO Agent          │  CISO Agent                        │   │
│  │  • Code review      │  • Security scan                   │   │
│  │  • Architecture     │  • Vulnerability detection         │   │
│  │  • Testing          │  • Compliance check                │   │
│  │  • Creates issues   │  • Creates issues                  │   │
│  └─────────────────────┴────────────────────────────────────┘   │
│                              ↓                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Product Triage (Human CPO - Weekly)                    │   │
│  │  • Reviews agent suggestions                            │   │
│  │  • Approves → adds to roadmap                           │   │
│  │  • Rejects → closes with rationale                      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ↓                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Auto-Merge (Conditional)                               │   │
│  │  • Only automated/* branches                            │   │
│  │  • Only if reviews pass                                 │   │
│  │  • Only if checks pass                                  │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

## Components

### 1. Autonomous Implementation Agent

**Purpose:** Automatically implement approved roadmap tasks

**Technology:**
- Runtime: Node.js 20+
- AI Model: GPT-4 Turbo Preview
- Temperature: 0.3 (balance creativity and consistency)
- Context: Full repository + issue description

**Algorithm:**
```javascript
async function runAutonomousAgent() {
  // 1. Find next task
  const issue = await getNextRoadmapIssue({
    labels: ['roadmap', 'priority-high'],
    excludeLabels: ['agent-suggestion', 'needs-approval'],
    state: 'open',
    assignee: null
  });
  
  if (!issue) return;
  
  // 2. Gather context
  const context = await gatherContext({
    relatedFiles: await findRelatedFiles(issue),
    dependencies: await getDependencies(),
    tests: await findTestPatterns()
  });
  
  // 3. Generate implementation
  const implementation = await generateImplementation({
    issue,
    context,
    model: 'gpt-4-turbo-preview',
    temperature: 0.3
  });
  
  // 4. Create branch and commit
  await createBranch(`automated/${issue.number}-${slugify(issue.title)}`);
  await applyChanges(implementation.changes);
  await commit(`feat: ${issue.title}\n\nFixes #${issue.number}`);
  
  // 5. Create PR
  const pr = await createPullRequest({
    title: issue.title,
    body: generatePRBody(issue, implementation),
    base: 'main',
    labels: ['automated']
  });
  
  // 6. Link to issue
  await linkPRToIssue(pr.number, issue.number);
}
```

**Key Features:**
- Self-assignment prevention (fixed bug)
- JSON file handling (fixed bug)
- Null output handling (fixed bug)
- Comprehensive error logging
- Rate limiting (OpenAI API)

### 2. CTO Review Agent

**Purpose:** Technical code review

**Technology:**
- Runtime: Node.js 20+
- AI Model: GPT-4 Turbo Preview
- Temperature: 0.2 (more consistent than implementation)
- Context: PR diff + file contents

**Review Criteria:**
1. **Code Quality**
   - Readability
   - Maintainability
   - Code smells
   - Best practices

2. **Architecture**
   - Design patterns
   - Component structure
   - Dependencies
   - Technical debt

3. **Testing**
   - Test coverage
   - Test quality
   - Missing tests
   - Edge cases

4. **Documentation**
   - Code comments
   - README updates
   - API documentation
   - Examples

**Algorithm:**
```javascript
async function performCTOReview(pr) {
  // 1. Get PR context
  const diff = await getPRDiff(pr.number);
  const files = await getChangedFiles(pr.number);
  
  // 2. AI review
  const review = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    temperature: 0.2,
    messages: [
      { role: 'system', content: CTO_SYSTEM_PROMPT },
      { role: 'user', content: formatReviewRequest(pr, diff, files) }
    ]
  });
  
  // 3. Parse response
  const analysis = JSON.parse(review.choices[0].message.content);
  
  // 4. Create issues for suggestions
  for (const suggestion of analysis.suggestions) {
    await createIssue({
      title: `[CTO Suggestion] ${suggestion.title}`,
      body: formatSuggestion(suggestion, pr),
      labels: ['agent-suggestion', 'needs-approval', `severity-${suggestion.severity}`]
    });
  }
  
  // 5. Comment on PR
  await commentOnPR(pr.number, formatReviewComment(analysis));
  
  // 6. Set output
  return {
    should_block: analysis.critical_issues.length > 0,
    issues_created: analysis.suggestions.length
  };
}
```

**Decision: Create Issues vs Comments**

Originally, we considered only commenting on PRs. We chose to create issues because:

✅ **Pros:**
- Trackable in backlog
- Can be prioritized by CPO
- Doesn't block implementation
- Creates audit trail
- Enables product-led workflow

❌ **Cons:**
- More GitHub notifications
- Could create noise

**Trade-off:** Accepted increased notifications for better product control.

### 3. CISO Security Agent

**Purpose:** Security vulnerability detection

**Technology:**
- Runtime: Node.js 20+
- AI Model: GPT-4 Turbo Preview
- Temperature: 0.1 (most consistent - security is critical)
- Context: PR diff + security patterns

**Scan Patterns:**
- SQL injection
- XSS vulnerabilities
- Authentication bypasses
- Secret leakage
- Dependency vulnerabilities
- OWASP Top 10

**Algorithm:**
```javascript
async function performCISOReview(pr) {
  // 1. Get security context
  const diff = await getPRDiff(pr.number);
  const files = await getChangedFiles(pr.number);
  const dependencies = await getDependencyChanges(pr.number);
  
  // 2. AI security scan
  const scan = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    temperature: 0.1,  // Very consistent for security
    messages: [
      { role: 'system', content: CISO_SYSTEM_PROMPT },
      { role: 'user', content: formatSecurityRequest(pr, diff, files, dependencies) }
    ]
  });
  
  // 3. Parse vulnerabilities
  const analysis = JSON.parse(scan.choices[0].message.content);
  
  // 4. Create issues by severity
  for (const vuln of analysis.vulnerabilities) {
    await createIssue({
      title: `[Security] ${vuln.title}`,
      body: formatVulnerability(vuln, pr),
      labels: ['security', `severity-${vuln.severity}`]
    });
    
    // Critical vulnerabilities block immediately
    if (vuln.severity === 'critical') {
      await requestChanges(pr.number, `Critical security issue: ${vuln.title}`);
    }
  }
  
  // 5. Comment with summary
  await commentOnPR(pr.number, formatSecuritySummary(analysis));
  
  // 6. Set output
  return {
    should_block: analysis.vulnerabilities.some(v => v.severity === 'critical'),
    vulnerabilities_found: analysis.vulnerabilities.length
  };
}
```

**Severity Levels:**
- **Critical**: Block merge immediately, requires fix
- **High**: Create issue, needs approval to proceed
- **Medium**: Create issue, agent can implement if approved
- **Low**: Create issue, optional improvement

### 4. Product-Led Triage Workflow

**Purpose:** Maintain human control over priorities

**Process:**
```
Agent Suggestion (Issue Created)
        ↓
    [needs-approval]
        ↓
CPO Weekly Triage
        ↓
    ┌───────┴───────┐
    ↓               ↓
Approve          Reject
    ↓               ↓
Add [roadmap]   Close issue
Remove [needs-approval]  Add comment
    ↓
Autonomous Agent
Picks Up
    ↓
Implements
```

**Key Decisions:**

1. **Why Weekly Triage?**
   - Batching reduces overhead
   - Gives time for multiple suggestions to accumulate
   - Aligns with sprint planning cycles

2. **Why needs-approval Label?**
   - Clear signal to autonomous agent (skip these)
   - Easy to filter in issue views
   - Explicit approval process

3. **Why Reject Feedback Required?**
   - Trains agents over time (future enhancement)
   - Documents decision rationale
   - Helps team understand priorities

### 5. Auto-Merge System

**Purpose:** Complete automation while maintaining safety

**Conditions:**
```javascript
const shouldAutoMerge = (pr) => {
  return (
    pr.head_ref.startsWith('automated/') &&      // Only agent branches
    pr.reviews.every(r => r.state === 'APPROVED') &&  // All reviews passed
    !pr.reviews.some(r => r.cto_should_block) && // No critical issues
    !pr.reviews.some(r => r.ciso_should_block) && // No critical vulns
    pr.checks.every(c => c.conclusion === 'success') && // All checks pass
    !pr.draft                                     // Not a draft
  );
};
```

**Safety Mechanisms:**
1. Branch pattern restriction (only `automated/*`)
2. Review approval requirement (both CTO and CISO)
3. Check pass requirement (tests, builds, etc.)
4. Manual override (mark as draft to prevent auto-merge)

**Decision: Why automated/* Pattern?**

We considered:
- All branches → Too risky
- Label-based → Easy to forget/abuse
- Branch pattern → Clear, visible, intentional

Chose branch pattern because:
✅ Visible in branch name
✅ Can't be forgotten
✅ Easy to override (use different pattern)
✅ Standard in industry (dependabot/* pattern)

## Data Flow

### Implementation Flow

```
Roadmap Issue
    ↓
[1. Autonomous Agent]
    ↓ queries
GitHub API (issues, files, PRs)
    ↓
[2. OpenAI GPT-4]
    ← sends issue + context
    → returns code changes
    ↓
[3. Git Operations]
    • Create branch
    • Commit changes
    • Push to remote
    ↓
[4. GitHub PR API]
    • Create PR
    • Link to issue
    ↓
Review Agents Triggered
```

### Review Flow

```
PR Created/Updated
    ↓
[1. PR Review Agents Workflow]
    ↓
┌───────────────┴───────────────┐
↓                               ↓
[2a. CTO Agent]           [2b. CISO Agent]
    ↓ gets                      ↓ gets
PR diff + files           PR diff + dependencies
    ↓ sends to                  ↓ sends to
OpenAI GPT-4              OpenAI GPT-4
    ↓ receives                  ↓ receives
Code review               Security scan
    ↓ creates                   ↓ creates
Issues (suggestions)      Issues (vulnerabilities)
    ↓ outputs                   ↓ outputs
should_block flag         should_block flag
    ↓                           ↓
└───────────────┬───────────────┘
                ↓
[3. Auto-Merge Decision]
    IF: !should_block && branch=automated/* && checks pass
    THEN: Merge PR
```

## Scalability Considerations

### Current Limitations

1. **Rate Limits**
   - OpenAI: 10,000 requests/day (tier 1)
   - GitHub Actions: 2,000 minutes/month (free tier)
   - GitHub API: 5,000 requests/hour

2. **Cost**
   - OpenAI: ~$0.10 per implementation
   - ~$0.02 per review
   - Target: <$50/month for 200 tasks

3. **Throughput**
   - 4 runs/day × 30 days = 120 implementations/month
   - Limited by manual triage (weekly)

### Scaling Strategies

**For Higher Volume:**

1. **Increase Schedule Frequency**
   ```yaml
   schedule:
     - cron: '0 */2 * * *'  # Every 2 hours
   ```

2. **Use Cheaper Models**
   ```json
   {
     "model": "gpt-4-turbo-preview",  // Current
     "model": "gpt-3.5-turbo"         // 10x cheaper
   }
   ```

3. **Parallel Processing**
   - Currently sequential (one at a time)
   - Could process multiple issues in parallel
   - Requires coordination to avoid conflicts

4. **Selective Reviews**
   - Only review automated/* PRs
   - Skip reviews for minor changes
   - Cache review results

**For Enterprise:**

1. **Self-Hosted Runners**
   - Unlimited minutes
   - Faster execution
   - Custom hardware

2. **Azure OpenAI**
   - Better rate limits
   - Enterprise SLAs
   - Data residency

3. **Multi-Tenant**
   - Shared agent pool
   - Cross-repository learning
   - Centralized triage

## Security Considerations

### Threats

1. **Prompt Injection**
   - Malicious issue descriptions
   - Crafted PR descriptions
   - Mitigation: Input sanitization, temperature control

2. **Secret Leakage**
   - Agents might include secrets in code
   - Mitigation: Secret scanning, PR templates

3. **Malicious Code**
   - AI generates harmful code
   - Mitigation: Review agents, human approval

4. **API Key Exposure**
   - GitHub Actions logs
   - Mitigation: GitHub Secrets, never log keys

### Mitigations Implemented

✅ **Input Sanitization**
```javascript
function sanitizeInput(text) {
  return text
    .replace(/```/g, '&#96;&#96;&#96;')  // Escape code blocks
    .replace(/\$\{/g, '&#36;&#123;');     // Escape template strings
}
```

✅ **Temperature Control**
- Implementation: 0.3 (creative but controlled)
- CTO Review: 0.2 (consistent)
- CISO Review: 0.1 (most consistent)

✅ **Branch Restrictions**
- Auto-merge only on `automated/*`
- Main branch protected
- Require reviews for main

✅ **Secret Management**
- GitHub Secrets for API keys
- Never log secrets
- Rotate keys regularly

✅ **Rate Limiting**
```javascript
const rateLimiter = new RateLimit({
  windowMs: 60 * 1000,  // 1 minute
  max: 10                // 10 requests
});
```

## Future Enhancements

### Planned

1. **Learning System**
   - Track accepted/rejected suggestions
   - Fine-tune prompts based on feedback
   - Build project-specific knowledge base

2. **Multi-Language Support**
   - Currently assumes JavaScript/TypeScript
   - Add language detection
   - Language-specific prompts

3. **Test Generation**
   - Auto-generate tests for implementations
   - Improve test coverage
   - Reduce manual testing burden

4. **Rollback Mechanism**
   - Automatic revert on production errors
   - Monitoring integration
   - Circuit breaker pattern

### Research

1. **Reinforcement Learning**
   - Learn from merged vs rejected PRs
   - Optimize for acceptance rate
   - Personalize to team preferences

2. **Multi-Agent Collaboration**
   - Agents negotiate solutions
   - Peer review between agents
   - Consensus-based decisions

3. **Self-Improvement**
   - Agents suggest improvements to themselves
   - Meta-agents that optimize other agents
   - Evolutionary algorithm approach

## Decision Log

### 1. Why Node.js?

**Alternatives:** Python, Go, Bash
**Decision:** Node.js
**Rationale:**
- Native JSON handling
- GitHub Actions ecosystem
- OpenAI SDK available
- Async/await for API calls

### 2. Why GPT-4 Turbo?

**Alternatives:** GPT-3.5, Claude, Local models
**Decision:** GPT-4 Turbo Preview
**Rationale:**
- Best code quality (tested)
- Large context window (128K tokens)
- Function calling support
- JSON mode

### 3. Why Create Issues vs Block PRs?

**Decision:** Create issues with product approval
**Rationale:**
- Product maintains control
- Doesn't block progress
- Builds backlog
- Enables prioritization

### 4. Why Separate Agents?

**Alternatives:** Single multi-purpose agent
**Decision:** Separate CTO and CISO agents
**Rationale:**
- Clear responsibilities
- Different prompts/temperatures
- Can enable/disable independently
- Easier to maintain

### 5. Why Weekly Triage?

**Alternatives:** Daily, ad-hoc, automated
**Decision:** Weekly scheduled triage
**Rationale:**
- Batching is efficient
- Aligns with sprint planning
- Gives time for patterns to emerge
- Doesn't overwhelm CPO

## Metrics & Monitoring

### Success Metrics

1. **Implementation Success Rate**
   - Target: >70% of implementations merge
   - Current: ~100% (2 out of 2, early days)

2. **Review Quality**
   - Suggestions accepted: >50%
   - False positives: <20%

3. **Time Savings**
   - Average task time: Manual 4h → Agent 1h
   - Target: 3x faster implementation

4. **Cost Efficiency**
   - Cost per implementation: <$1
   - Cost per review: <$0.10

### Monitoring

**Tracked in GitHub:**
- Workflow run success/failure
- PR merge rate (automated/* branches)
- Issue creation rate (agent suggestions)
- Triage approval rate

**Tracked in OpenAI:**
- Token usage
- API costs
- Response times
- Error rates

**Alerts:**
- Workflow failures
- API rate limits hit
- Cost exceeds budget ($50/month)
- Review quality drops (<50% acceptance)

## License

MIT License - See LICENSE file

## Contributing

See [SETUP.md](SETUP.md) for installation and [CPO-TRIAGE.md](CPO-TRIAGE.md) for workflow.

To contribute architectural improvements:
1. Test changes thoroughly
2. Document design decisions
3. Update this file
4. Submit PR with rationale
