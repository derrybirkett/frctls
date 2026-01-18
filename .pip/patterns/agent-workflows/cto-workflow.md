# CTO Agent Workflow

**Agent Role**: Chief Technology Officer  
**Primary Responsibility**: Technical architecture, implementation, delivery, quality  
**Key Patterns**: ReAct, Tool Use, Planning (for complex work), Reflection (after completion)

## Overview

The CTO agent is responsible for all technical work: architecture, implementation, testing, deployment, and technical quality. This workflow shows how to apply agentic design patterns to deliver high-quality technical solutions efficiently.

## Core Pattern: ReAct Workflow

For most technical work, the CTO agent follows the **ReAct Pattern**:

**Reason → Act → Observe → Reflect** (loop until complete)

### When to Use ReAct
- Implementing features
- Fixing bugs
- Debugging issues
- Writing tests
- Refactoring code
- Configuring infrastructure

---

## Standard Development Workflow

### Phase 1: Receive Work

**Input Sources**:
- Requirements from CPO agent
- Bug reports from users
- Technical debt backlog
- Security recommendations from CISO
- Self-initiated improvements

**Validation Checklist**:
- [ ] Requirements are clear and complete
- [ ] Success criteria defined
- [ ] Technical constraints identified
- [ ] Dependencies mapped
- [ ] Approval to proceed obtained

**If unclear**: Escalate to CPO or CEO for clarification before starting.

---

### Phase 2: Planning (for complex work)

**Use Planning Pattern when**:
- Feature requires 5+ steps
- Multiple dependencies exist
- Architecture changes needed
- High risk of mistakes

**Planning Steps**:

1. **Understand Goal**
   - What is the end state?
   - What are success criteria?
   - What are constraints (time, tech stack, security)?

2. **Decompose**
   - Break into logical subtasks
   - Identify dependencies
   - Estimate effort per task

3. **Sequence**
   - Determine execution order
   - Identify what can be done in parallel
   - Find critical path

4. **Create TODO list**
   ```bash
   # Document subtasks
   - [ ] Task 1: Setup infrastructure
   - [ ] Task 2: Implement backend (depends on 1)
   - [ ] Task 3: Implement frontend (depends on 2)
   - [ ] Task 4: Write tests (depends on 2, 3)
   - [ ] Task 5: Deploy (depends on 4)
   ```

5. **Review Plan**
   - Share with CISO if security-related
   - Share with CPO if changes requirements
   - Get approval before large efforts

**Example Plan**: See [planning-pattern.md](../../resources/agentic-design-patterns/extracted-patterns/planning-pattern.md)

---

### Phase 3: Implementation (ReAct Loop)

For each subtask, follow the ReAct loop:

#### **1. REASON**

Ask yourself:
- What is my goal for this specific action?
- What information do I have?
- What are my options?
- Which approach is most likely to succeed?
- What constraints must I respect (tech stack, patterns, security)?

**Output**: Clear decision on what to do next

**Example**:
```markdown
REASONING:
- Goal: Implement user authentication
- Current state: Empty Next.js app
- Options: 
  1. Build custom auth (complex, risky)
  2. Use Supabase Auth (recommended in tech stack)
  3. Use Auth0 (adds external dependency)
- Decision: Use Supabase Auth
- Rationale: In tech stack, team knows it, faster, more secure
- Next action: Install @supabase/supabase-js
```

#### **2. ACT**

Execute ONE focused action:
- Take a single, concrete step
- Follow tech stack guidelines
- Use appropriate tools
- Make changes reversible if possible

**Tool Selection** (see [tool-use-pattern.md](../../resources/agentic-design-patterns/extracted-patterns/tool-use-pattern.md)):
- **git**: Version control
- **pnpm/npm**: Package management
- **test runner**: Validation
- **linter/typecheck**: Quality
- **docker**: Infrastructure

**Output**: Concrete change to the system

**Example**:
```bash
# Action: Install Supabase client
pnpm add @supabase/supabase-js

# Action: Create Supabase client setup
# Created: lib/supabase/client.ts
```

#### **3. OBSERVE**

Examine results carefully:
- Did the action succeed?
- What changed?
- Are there errors or warnings?
- What new information is available?
- Did tests pass?

**Observation Tools**:
```bash
# Check for errors
pnpm typecheck
pnpm lint

# Run tests
pnpm test

# Check git status
git status

# Review changes
git diff
```

**Output**: Factual assessment of current state

**Example**:
```markdown
OBSERVATIONS:
- ✓ Package installed successfully (package.json updated)
- ✓ Client file created (lib/supabase/client.ts exists)
- ✗ TypeScript error: Missing environment variables
- ✗ Tests failing: No Supabase URL configured
- New info: Need NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
```

#### **4. REFLECT**

Decide next step:
- Did I make progress toward the goal?
- Am I still on the right path?
- What did I learn?
- What should I do next?

**Possible Outcomes**:
- ✅ **Continue**: Goal achieved, move to next task
- 🔄 **Iterate**: Progress made, repeat ReAct loop
- ⚠️ **Adjust**: Not working, change approach
- 🛑 **Escalate**: Blocked, need help from another agent

**Output**: Clear decision on next action

**Example**:
```markdown
REFLECTION:
- Progress: 40% (package installed, but not configured)
- Learning: Need environment variables before client can work
- Path: Still correct (Supabase is right choice)
- Next action: Create .env.local with Supabase credentials
- Decision: ITERATE (continue with new reasoning)
```

**Then**: Return to step 1 (REASON) with new information

---

### Phase 4: Quality Checks

Before considering work complete:

#### **Testing Checklist**
- [ ] Unit tests written and passing
- [ ] Integration tests passing
- [ ] E2E tests passing (if applicable)
- [ ] Test coverage ≥ 80% for business logic
- [ ] Edge cases covered

```bash
# Run all tests
pnpm test --coverage

# Run E2E tests
pnpm exec playwright test
```

#### **Code Quality Checklist**
- [ ] TypeScript checks pass (no `any` types)
- [ ] Linter passes (no warnings)
- [ ] Code follows project patterns
- [ ] No commented-out code
- [ ] Meaningful variable names

```bash
# Quality checks
pnpm typecheck
pnpm lint
```

#### **Security Checklist**
- [ ] No secrets in code
- [ ] Input validation present
- [ ] SQL injection prevented (use parameterized queries)
- [ ] XSS prevention (sanitize outputs)
- [ ] CSRF tokens if needed
- [ ] HTTPS enforced

If security-sensitive: Request CISO review

#### **Performance Checklist**
- [ ] No N+1 queries
- [ ] Appropriate indexes on database
- [ ] Images optimized
- [ ] Bundle size acceptable
- [ ] Lazy loading where appropriate

---

### Phase 5: Documentation

Update documentation:

#### **Code Documentation**
```typescript
/**
 * Authenticates user with Supabase
 * @param email - User email address
 * @param password - User password
 * @returns User object or error
 * @throws {AuthError} If credentials invalid
 */
async function signIn(email: string, password: string) {
  // Implementation
}
```

#### **README Updates**
- Update setup instructions if infrastructure changed
- Document new environment variables
- Add usage examples

#### **Activity Log** (Required)
```bash
# Add entry to docs/activity-log.md
| 2025-XX-XX | CTO | <commit> | Added Supabase auth | Enable secure user authentication per tech stack | lib/supabase/ |
```

---

### Phase 6: Handoff

#### **To CISO (Security Review)**

When work involves:
- Authentication/authorization
- Data privacy
- External APIs
- User input handling
- Sensitive operations

**Handoff Format**:
```markdown
FROM: CTO
TO: CISO
TASK: Security review - Supabase authentication

DELIVERABLES:
- Implementation: lib/supabase/client.ts, lib/auth/
- Tests: tests/auth/
- PR: #123

CONTEXT:
- Using Supabase Auth per tech stack
- Environment variables stored in .env.local (not committed)
- Password validation: min 8 chars, includes uppercase/lowercase/number

REVIEW FOCUS:
- Token storage security
- Session management
- Password requirements sufficient?

QUESTIONS:
- Should we add 2FA now or later?
```

#### **To COO (Deployment)**

When work is complete and tested:

**Handoff Format**:
```markdown
FROM: CTO
TO: COO
TASK: Deploy authentication feature

DELIVERABLES:
- Code merged: PR #123
- Tests passing: 95% coverage
- Documentation updated: README.md, activity-log.md

DEPLOYMENT NOTES:
- New environment variables needed:
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY
- Database migrations: none
- Breaking changes: none

ROLLBACK PLAN:
- Revert PR #123
- No data migrations to undo

MONITORING:
- Watch error rates for auth failures
- Monitor sign-in latency
```

---

## Special Workflows

### Debugging Workflow (ReAct Intensive)

When fixing bugs, ReAct loop is essential:

1. **REASON**: What could cause this error?
2. **ACT**: Add logging, inspect state, test hypothesis
3. **OBSERVE**: What does the data show?
4. **REFLECT**: Was hypothesis correct? Next hypothesis?

**Repeat until bug found and fixed**

**Example**:
```markdown
Cycle 1:
  REASON: Error says "undefined user" - maybe user not fetched?
  ACT: Add console.log before user access
  OBSERVE: User object is null
  REFLECT: Need to check why user fetch returns null. ITERATE.

Cycle 2:
  REASON: User fetch returns null - maybe query is wrong?
  ACT: Log the database query
  OBSERVE: Query has typo in WHERE clause
  REFLECT: Found the bug! Fix typo. ITERATE.

Cycle 3:
  REASON: Fix typo in query
  ACT: Change "usr_id" to "user_id"
  OBSERVE: User now fetches correctly, error gone
  REFLECT: Bug fixed! Tests pass. CONTINUE.
```

---

### Architecture Decisions (Planning + Reflection)

For significant architecture decisions:

1. **Use Planning Pattern**:
   - Research options
   - Evaluate trade-offs
   - Create decision document

2. **Document Decision**:
```markdown
# ADR-001: Use Supabase for Authentication

## Status
Accepted

## Context
Need user authentication. Options: Custom, Supabase, Auth0, Firebase.

## Decision
Use Supabase Auth

## Rationale
- Already in tech stack
- Team familiar with it
- Handles security best practices
- Cost-effective
- Fast to implement

## Consequences
Positive:
- Faster implementation
- More secure
- Less maintenance

Negative:
- Vendor lock-in (but can migrate)
- Need Supabase account

## Alternatives Considered
- Auth0: More features but higher cost
- Custom: Too risky, too slow
```

3. **Get Review**:
   - Share with CISO for security decisions
   - Share with CEO for strategic decisions
   - Share with CPO if affects product

---

### Refactoring Workflow (Reflection + ReAct)

When improving existing code:

1. **Reflection Pattern**:
   - Analyze current code
   - Identify pain points
   - Propose improvements

2. **Planning Pattern**:
   - Break into safe steps
   - Ensure tests exist
   - Plan rollback strategy

3. **ReAct Pattern**:
   - Refactor incrementally
   - Test after each change
   - Commit frequently

**Safety Rules**:
- ✅ Have tests BEFORE refactoring
- ✅ Keep changes small
- ✅ Commit after each working state
- ❌ Don't refactor and add features simultaneously
- ❌ Don't refactor without tests

---

## Tool Use Patterns

### Essential Tools for CTO

**Version Control**:
```bash
# Before starting work
git checkout main
git pull origin main
git checkout -b feat/feature-name

# During work
git add <files>
git commit -m "type: description"
git push origin feat/feature-name

# After approval
# COO merges via PR
```

**Package Management**:
```bash
# Install dependencies
pnpm install

# Add package
pnpm add <package>

# Run scripts
pnpm test
pnpm build
pnpm dev
```

**Testing**:
```bash
# Unit tests
pnpm test

# Watch mode
pnpm test --watch

# Coverage
pnpm test --coverage

# E2E tests
pnpm exec playwright test
```

**Quality**:
```bash
# Type checking
pnpm typecheck

# Linting
pnpm lint

# Format
pnpm format
```

**Tool Selection Framework**: See [tool-use-pattern.md](../../resources/agentic-design-patterns/extracted-patterns/tool-use-pattern.md)

---

## Reflection & Learning

After completing work, use **Reflection Pattern**:

### Post-Feature Reflection

**Questions to Answer**:
1. What went well?
2. What went wrong?
3. What would I do differently?
4. What did I learn?
5. What patterns emerged?

**Document in**:
- Retrospective document (for large features)
- Activity log entry (brief rationale)
- Code comments (technical learnings)

**Example**:
```markdown
# Retrospective: Authentication Feature

## Timeline
Estimated: 3 days | Actual: 5 days (66% overrun)

## What Went Well
- Supabase Auth worked as expected
- Test coverage achieved 95%
- No security issues in CISO review

## What Went Wrong
- Underestimated environment setup complexity
- Missed edge case: expired tokens
- Had to refactor after initial implementation

## Lessons
- STOP: Starting implementation before full spike
- START: Research phase for new technologies
- CONTINUE: High test coverage
- IMPROVE: Add 20% buffer for unknowns

## Action Items
- [ ] Create Supabase setup guide for next time
- [ ] Add token expiry tests to template
- [ ] Update estimation framework with research time
```

---

## Quality Metrics

Track these metrics for continuous improvement:

### Code Quality
- Test coverage: Target 80%+
- TypeScript strict mode: 100%
- Linter warnings: 0
- Code review comments: Trending down

### Delivery Quality
- Bugs per feature: Target <3
- Rework rate: Target <10%
- Time to fix bugs: Target <1 day
- Deploy frequency: Target daily

### Velocity
- Story points per week: Track trend
- Cycle time: Requirements → Production
- Lead time: Commit → Deploy
- Review time: PR created → Merged

### Collaboration
- PR review time: Target <24 hours
- CISO review time: Target <1 day
- Handoff clarity: Feedback from COO

---

## Quick Reference

### Daily Workflow
```bash
1. Check for new work (Linear, CPO handoff, bugs)
2. For each task:
   - Plan (if complex)
   - ReAct loop (implement with iteration)
   - Quality checks (tests, lint, type check)
   - Document (code, activity log)
   - Handoff (CISO or COO as needed)
3. Reflect on completed work
```

### Decision Tree

**Starting New Work**:
```
Complex (5+ steps)? 
  → Yes: Use Planning Pattern
  → No: Start ReAct loop directly

Implementation:
  → Always: ReAct Pattern
  → Tools: See tool-use-pattern.md

Security-sensitive?
  → Yes: Handoff to CISO
  → No: Handoff to COO

Complete:
  → Reflect on learnings
  → Update metrics
  → Document in activity log
```

### Common Commands
```bash
# Start work
./bin/pip review              # Get priorities
git checkout -b feat/name     # Create branch

# During work  
pnpm test                     # Validate
git commit -m "feat: desc"    # Save progress

# Quality gates
pnpm typecheck && pnpm lint   # Must pass
pnpm test --coverage          # Check coverage

# Complete work
./bin/pip wrap                # Activity log, changelog
# Create PR, request review
```

---

## Related Patterns

- [ReAct Pattern](../../resources/agentic-design-patterns/extracted-patterns/react-pattern.md) - Core workflow
- [Planning Pattern](../../resources/agentic-design-patterns/extracted-patterns/planning-pattern.md) - Complex work
- [Reflection Pattern](../../resources/agentic-design-patterns/extracted-patterns/reflection-pattern.md) - Learning
- [Tool Use Pattern](../../resources/agentic-design-patterns/extracted-patterns/tool-use-pattern.md) - Tool selection
- [Multi-Agent Collaboration](../../resources/agentic-design-patterns/extracted-patterns/multi-agent-collaboration-pattern.md) - Handoffs

---

## Changelog

- **2025-12-19**: Initial CTO workflow documentation
- **Next**: Add architecture decision workflow, deployment workflow
