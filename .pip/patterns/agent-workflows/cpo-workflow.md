# CPO Agent Workflow

**Agent Role**: Chief Product Officer  
**Primary Responsibility**: Product strategy, roadmap, discovery, scope decisions  
**Key Patterns**: Planning, Reflection, Multi-Agent Collaboration

## Overview

The CPO agent owns product strategy, roadmap, and discovery. The CPO defines **what** to build and **why**, while the CTO determines **how** to build it. This workflow shows how to apply agentic design patterns to deliver high-value products efficiently.

## Core Pattern: Planning + Reflection

The CPO primarily uses:
- **Planning Pattern**: Breaking down product vision into executable features
- **Reflection Pattern**: Learning from user feedback and metrics
- **Multi-Agent Collaboration**: Working with CTO, CEO, CMO, CRO

---

## Standard Product Workflow

### Phase 1: Discover (Problem Definition)

**Goal**: Understand user problems before proposing solutions

#### **Discovery Process**

1. **Identify Problem**
   - User feedback
   - Support tickets
   - Usage analytics
   - Competitive analysis
   - Strategic initiatives from CEO

2. **Validate Problem**
   - How many users affected?
   - How severe is the pain?
   - What's the current workaround?
   - What's the business impact?

3. **Frame Opportunity**
   ```markdown
   ## Opportunity: [Name]
   
   ### Problem Statement
   Users can't [do something] which causes [pain]
   
   ### Evidence
   - 40% of users report this issue (survey)
   - #2 feature request (120 votes)
   - 15% churn attributed to this gap
   
   ### Impact if Solved
   - Reduce churn by 5%
   - Increase activation by 10%
   - Enable upsell to enterprise tier
   
   ### Target Users
   - Segment: Power users
   - Personas: Developer, Ops Engineer
   ```

**Use Reflection Pattern**: Review past opportunities to identify patterns

---

### Phase 2: Define (Requirements & Scope)

**Goal**: Define solution scope and success criteria

#### **Requirements Process**

1. **Solution Exploration**
   - Brainstorm potential solutions
   - Sketch user flows
   - Identify technical constraints (consult CTO)
   - Consider build vs. buy

2. **Scope Definition**
   ```markdown
   ## Feature: [Name]
   
   ### User Story
   As a [user type]
   I want to [action]
   So that I can [benefit]
   
   ### Success Criteria
   - [ ] User can complete [action] in <2 mins
   - [ ] 80% task success rate
   - [ ] 10% increase in feature adoption
   
   ### In Scope
   - Core user flow: [describe]
   - Basic settings: [list]
   - Error handling: [specify]
   
   ### Out of Scope (for v1)
   - Advanced settings (defer to v2)
   - Integrations (separate epic)
   - Mobile support (web only)
   
   ### Acceptance Criteria
   - [ ] Given [context] When [action] Then [result]
   - [ ] Given [context] When [action] Then [result]
   ```

3. **Prioritization**
   
   **Use Planning Pattern** to break down into phases:
   
   **Framework: RICE Scoring**
   - **Reach**: How many users affected? (users/quarter)
   - **Impact**: How much impact? (0.25=minimal, 3=massive)
   - **Confidence**: How certain? (0-100%)
   - **Effort**: How much work? (person-weeks)
   
   **Score = (Reach × Impact × Confidence) / Effort**
   
   **Example**:
   ```
   Feature: Authentication
   - Reach: 1000 users/quarter
   - Impact: 3 (massive - enables paid tier)
   - Confidence: 80% (proven solution)
   - Effort: 2 weeks
   
   Score = (1000 × 3 × 0.8) / 2 = 1200
   ```

4. **Handoff to CTO**
   ```markdown
   FROM: CPO
   TO: CTO
   TASK: Implement authentication feature
   
   REQUIREMENTS: [link to requirements doc]
   
   CONTEXT:
   - Strategic priority: Enable paid tier
   - Target users: All new signups
   - Timeline: 2 weeks preferred, 3 weeks max
   
   SUCCESS CRITERIA:
   - User can sign up with email/password
   - User can sign in and stay logged in
   - User sees error messages for invalid input
   
   ACCEPTANCE TESTS:
   - [ ] Happy path: Sign up → Sign in → See dashboard
   - [ ] Error case: Invalid email → See error
   - [ ] Error case: Wrong password → See error
   
   OPEN QUESTIONS:
   - Should we support social auth (Google/GitHub)?
   - Password requirements: min 8 chars sufficient?
   ```

**Checkpoint**: CTO reviews for feasibility before work starts

---

### Phase 3: Monitor (During Development)

**Goal**: Unblock CTO and adjust scope as needed

#### **Collaboration with CTO**

1. **Answer Questions**
   - CTO may discover technical constraints
   - Be ready to adjust scope or clarify requirements
   - Use Multi-Agent Collaboration pattern

2. **Review Progress**
   - Daily check-ins (async or sync)
   - Review demos/prototypes
   - Provide feedback on UX/UI

3. **Scope Management**
   
   **When CTO asks for scope reduction**:
   ```markdown
   CTO: "Auth feature is bigger than expected. Can we defer 
         password reset to v2?"
   
   CPO Analysis:
   - Is password reset in acceptance criteria? YES
   - Is it blocking launch? Evaluate:
     - Can users still sign up/in without it? YES
     - What's workaround? Support tickets
     - How many users need it? ~5% in first week
   
   CPO Decision:
   - DEFER to v2
   - Add to backlog as high priority
   - Update acceptance criteria
   - Rationale: Unblocks 95% of value now
   ```
   
   **Use Reflection Pattern**: Learn from scope changes for better estimates

---

### Phase 4: Validate (Post-Launch)

**Goal**: Measure impact and learn

#### **Launch Checklist**

Before declaring feature "done":
- [ ] Feature is live in production
- [ ] Analytics tracking implemented
- [ ] User documentation published
- [ ] Support team trained
- [ ] Announcement published (via CMO)

#### **Measurement Plan**

**Leading Indicators** (first week):
- Feature discovery rate (% who find it)
- Activation rate (% who try it)
- Task success rate (% who complete flow)
- Time to complete task

**Lagging Indicators** (first month):
- Feature adoption (% of active users)
- Retention impact (cohort analysis)
- Satisfaction scores (NPS, CSAT)
- Business metrics (revenue, churn)

**Example Metrics Dashboard**:
```markdown
## Feature: Authentication
Launch: 2025-01-15

### Week 1 Results
- Signups: 120 (vs. 100 goal) ✅
- Task success: 85% (vs. 80% goal) ✅
- Avg time: 1.5 min (vs. 2 min goal) ✅
- Support tickets: 3 (all password reset requests)

### Learning
- Feature met success criteria
- Password reset is needed sooner than expected
- Move to top of backlog for next sprint
```

#### **Reflection Questions**

Use **Reflection Pattern** after every launch:

1. **What went well?**
   - Requirements were clear
   - CTO delivered on time
   - Users adopted quickly

2. **What went wrong?**
   - Underestimated need for password reset
   - Analytics tracking had bugs (delayed insights)

3. **What would I do differently?**
   - Include password reset in v1
   - Test analytics before launch

4. **What did I learn?**
   - Auth features need full flows, not just happy path
   - Users expect password reset immediately

5. **Action items**:
   - [ ] Add password reset to sprint
   - [ ] Update auth requirements template
   - [ ] Add analytics testing to checklist

---

## Special Workflows

### Discovery Sprint (Planning Pattern)

When exploring a new problem space:

**Week 1: Research**
1. User interviews (5-10 users)
2. Support ticket analysis
3. Competitive research
4. Usage data analysis

**Week 2: Synthesis**
1. Identify patterns in feedback
2. Frame opportunities
3. Sketch potential solutions
4. Validate with CTO (technical feasibility)

**Week 3: Planning**
1. Write requirements for top 3 ideas
2. Prioritize using RICE
3. Create roadmap
4. Get CEO approval

**Output**: Validated roadmap for next quarter

---

### Roadmap Planning (Planning + Multi-Agent)

**Quarterly Roadmap Process**:

1. **Gather Input**
   - CEO: Strategic priorities
   - CTO: Technical debt, infrastructure needs
   - CMO: Marketing campaigns, content needs
   - CRO: Revenue opportunities
   - CISO: Security requirements
   - Users: Feature requests, feedback

2. **Apply Planning Pattern**
   
   **Step 1: List all opportunities**
   ```
   - Authentication (RICE: 1200)
   - Dashboard widgets (RICE: 800)
   - API access (RICE: 600)
   - Mobile app (RICE: 400)
   - Dark mode (RICE: 200)
   - Security audit (CISO requirement)
   - Tech debt cleanup (CTO requirement)
   ```

   **Step 2: Categorize**
   - Must have (strategic, security, blocking)
   - Should have (high RICE, user demand)
   - Nice to have (low RICE, opportunistic)

   **Step 3: Sequence**
   - Consider dependencies
   - Balance quick wins with long-term bets
   - Leave 20% capacity for surprises

   **Step 4: Create timeline**
   ```
   Q1 2025 Roadmap
   
   January:
   - Authentication (2 weeks) - CTO
   - Security audit (1 week) - CISO + CTO
   
   February:
   - Dashboard widgets (3 weeks) - CTO
   - API docs (1 week) - CMO + CTO
   
   March:
   - API access (2 weeks) - CTO
   - Buffer (1 week) - Reserve for issues
   ```

3. **Review with Agents**
   - CEO: Aligns with strategy?
   - CTO: Technically feasible?
   - CMO: Supports marketing plan?
   - CRO: Revenue impact acceptable?
   - CISO: Security risks addressed?

4. **Publish Roadmap**
   - Internal: Share with all agents
   - External: Public roadmap (via CMO)
   - Living document: Update monthly

---

### Scope Negotiation (Multi-Agent Collaboration)

When CTO says "this is too big":

**Framework**:

1. **Understand Constraint**
   ```
   CTO: "Dashboard widgets will take 6 weeks, not 3"
   
   CPO: "What's driving the extra time?"
   CTO: "Need to build widget framework + 5 widgets"
   ```

2. **Explore Options**
   
   **Option A: Reduce scope**
   ```
   Build framework + 2 widgets (3 weeks)
   Defer 3 widgets to later
   ```
   
   **Option B: Extend timeline**
   ```
   Keep all 5 widgets (6 weeks)
   Push API access to Q2
   ```
   
   **Option C: Change approach**
   ```
   Use existing framework (3 weeks)
   Build all 5 widgets
   ```

3. **Evaluate Impact**
   
   For each option:
   - How much value do we deliver?
   - What's the user impact?
   - What's the strategic cost?
   
   **Example**:
   ```
   Option A: 60% of value (2 most important widgets)
   Option B: 100% of value, but delays API (strategic)
   Option C: 100% of value, but technical debt concern
   ```

4. **Decide**
   
   **Decision Framework**:
   - If value ≥ 80%, accept reduction (Option A)
   - If strategic cost high, extend timeline (Option B)
   - If technical risk low, change approach (Option C)
   - If unclear, escalate to CEO

5. **Document Decision**
   ```markdown
   DECISION: Option A (Reduce scope)
   
   RATIONALE:
   - 2 widgets deliver 60% of value
   - Unblocks Q2 API work (strategic priority)
   - Can add 3 widgets later (no technical blocker)
   
   TRADE-OFFS:
   - Accepted: Delayed value for 3 widgets
   - Mitigated: Top 2 widgets chosen by user demand
   
   NEXT STEPS:
   - [ ] Update requirements doc
   - [ ] Update roadmap
   - [ ] Communicate to stakeholders
   ```

---

## Quality Metrics

Track these to improve product decisions:

### Discovery Quality
- Time from idea to validated opportunity
- % of opportunities backed by data
- User interview completion rate

### Requirements Quality
- % of features requiring scope changes
- % of features meeting success criteria
- CTO rework rate (requirements unclear)

### Delivery Quality
- Cycle time: Requirements → Launch
- % of features launched on time
- % of features adopted by users

### Outcome Quality
- Feature adoption rate (target 40%+)
- Task success rate (target 80%+)
- Impact on retention (measure per feature)
- User satisfaction (NPS trend)

---

## Decision Frameworks

### Prioritization: RICE

**Reach × Impact × Confidence / Effort**

When to use:
- Comparing multiple features
- Building quarterly roadmap
- Justifying decisions to CEO

### Build vs. Buy

**Decision matrix**:
```
Should we build or buy?

BUILD if:
- Core differentiation (strategic advantage)
- Unique requirements (no good options)
- Low cost to build (<2 weeks)

BUY if:
- Commodity feature (table stakes)
- Good options exist (proven solutions)
- High cost to build (>4 weeks)
- High cost to maintain (security, compliance)

INTEGRATE if:
- Medium strategic value
- Good API available
- Build thin wrapper
```

**Example**:
```
Auth: BUY (Supabase)
- Commodity feature
- Excellent solution exists
- High security risk if custom
- Fast time to market

Dashboard: BUILD
- Core differentiation
- Unique to our use case
- Reasonable effort (3 weeks)
```

### MVP Scoping

**Minimum Viable Product framework**:

1. **List all desired features**
2. **Categorize**:
   - **Must have**: Without this, feature doesn't work
   - **Should have**: Important but not critical
   - **Nice to have**: Improves experience
   - **Won't have**: Future versions

3. **MVP = Must have only**

**Example**:
```
Feature: Dashboard widgets

Must have:
- Widget framework
- 2 core widgets (analytics, recent activity)
- Add/remove widgets

Should have:
- 3 more widgets (tasks, calendar, notes)
- Widget settings
- Drag to reorder

Nice to have:
- Custom widgets
- Widget marketplace
- Resize widgets

Won't have (v1):
- Share widgets
- Widget templates
```

---

## Collaboration Patterns

### With CTO

**Handoff Format** (Requirements → Implementation):
```markdown
FROM: CPO
TO: CTO

WHAT: Build authentication feature
WHY: Enable paid tier (strategic priority)

REQUIREMENTS:
- User can sign up with email/password
- User can sign in
- User stays logged in (remember me)

SUCCESS CRITERIA:
- 80% task success rate
- <2 min to complete signup

CONSTRAINTS:
- Must use tech stack (Supabase)
- Must meet CISO security requirements
- Timeline: 2 weeks preferred

OPEN QUESTIONS:
- Password requirements?
- Social auth now or later?

NEXT: CTO provides estimate + plan
```

### With CEO

**Roadmap Review Format**:
```markdown
FROM: CPO
TO: CEO

Q1 2025 Roadmap Proposal

STRATEGIC ALIGNMENT:
- Goal: Enable paid tier
- Supports: Revenue growth OKR

TOP PRIORITIES:
1. Authentication (enables paid tier)
2. Dashboard (core experience)
3. API access (enterprise need)

TRADE-OFFS:
- Deferring mobile app (lower RICE score)
- Prioritizing revenue over engagement

RISKS:
- Tech debt increasing (CTO concern)
- 20% buffer may not be enough

REQUEST: Approval to proceed
```

### With CMO

**Launch Coordination**:
```markdown
FROM: CPO
TO: CMO

Feature: Authentication
Launch: 2025-01-15

KEY MESSAGES:
- Users can now create accounts
- Secure authentication with Supabase
- Enables upcoming paid tier

TARGET AUDIENCE:
- New users (landing page)
- Existing users (email announcement)

DELIVERABLES FROM CPO:
- Feature screenshots
- User documentation
- FAQ answers

NEEDED FROM CMO:
- Launch blog post
- Email announcement
- Social media posts

TIMELINE:
- T-7 days: CMO receives materials
- T-1 day: Final review
- T-0: Launch
```

---

## Quick Reference

### Daily Workflow
```bash
1. Review user feedback and metrics
2. Answer CTO questions (unblock development)
3. Update roadmap based on learnings
4. Validate new opportunities
5. Plan next features
```

### Decision Tree

**New Idea**:
```
Is it validated?
  → No: Run discovery sprint
  → Yes: Score with RICE

High RICE score?
  → Yes: Write requirements
  → No: Defer to backlog

Requirements complete?
  → Yes: Handoff to CTO
  → No: Clarify with users/CEO

CTO says too big?
  → Negotiate scope (see framework)
  → Update roadmap
  → Document decision
```

### Common Commands
```bash
# Review priorities
./bin/pip review

# Check roadmap
cat docs/roadmap.md

# Review metrics
# (project-specific analytics tool)
```

---

## Related Patterns

- [Planning Pattern](../../resources/agentic-design-patterns/extracted-patterns/planning-pattern.md) - Roadmap planning
- [Reflection Pattern](../../resources/agentic-design-patterns/extracted-patterns/reflection-pattern.md) - Learning from launches
- [Multi-Agent Collaboration](../../resources/agentic-design-patterns/extracted-patterns/multi-agent-collaboration-pattern.md) - Working with CTO/CEO/CMO

---

## Related Documents

- [CPO Role](../../ia/agents/cpo/role.md)
- [CPO Responsibilities](../../ia/agents/cpo/responsibilities.md)
- [CTO Workflow](./cto-workflow.md) - Implementation partner
- [Delivery Method](../../method/delivery-method.md) - Overall process

---

## Changelog

- **2025-12-19**: Initial CPO workflow documentation
- **Next**: Add discovery templates, prioritization tools
