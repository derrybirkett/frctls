# Planning Pattern

**Type**: Task Decomposition Pattern  
**Source**: Agentic Design Patterns (Page references TBD after detailed extraction)  
**Agent Roles**: CPO (primary), CTO, COO (applicable)

## Overview

The Planning Pattern involves breaking down complex tasks into smaller, manageable subtasks that can be executed sequentially or in parallel. Agents create a structured plan before taking action, improving success rates for multi-step problems.

The pattern follows:
**Understand Goal → Decompose → Sequence → Execute → Validate** 

This pattern is particularly effective for:
- Large, complex features or refactors
- Projects with multiple dependencies
- Coordinating work across multiple agents
- High-stakes changes requiring validation

## When to Use

### Use Planning when:
- **Complex scope**: Task involves 5+ distinct steps
- **Dependencies exist**: Some work must complete before others
- **Multiple agents**: Coordination required across roles
- **Uncertainty about approach**: Need to explore options before committing
- **High risk**: Mistakes would be costly to fix
- **User approval needed**: Plan must be reviewed before execution

### Examples:
- CPO planning a new feature with UX, backend, and testing requirements
- CTO architecting a major refactor across multiple services
- COO designing a new operational workflow
- CISO implementing security controls across infrastructure

## How It Works

### 1. UNDERSTAND GOAL
**Purpose**: Clearly define what success looks like

**Questions to answer**:
- What is the end goal?
- Who are the stakeholders?
- What are the constraints?
- What are the success criteria?
- What is out of scope?

**Output**: Clear problem statement

**Example (CPO planning feature)**:
```markdown
GOAL: Add user profile customization

STAKEHOLDERS:
- Users: Want to personalize their dashboard
- Marketing: Need to showcase feature in demo
- Support: Need minimal additional support burden

CONSTRAINTS:
- Must launch in 2 weeks (hard deadline)
- Cannot break existing profile functionality
- Must work on mobile and web

SUCCESS CRITERIA:
- Users can upload profile image
- Users can set display name and bio
- Changes save and persist across sessions
- 95%+ uptime maintained
- No increase in support tickets

OUT OF SCOPE:
- Theme customization (future feature)
- Profile privacy controls (separate project)
```

### 2. DECOMPOSE
**Purpose**: Break the goal into concrete subtasks

**Techniques**:
- **Top-down**: Start with high-level components, drill down
- **Bottom-up**: Identify atomic tasks, group into larger chunks
- **Dependency mapping**: What must happen before what?
- **Agent assignment**: Which role handles each task?

**Output**: List of subtasks with dependencies

**Example (CPO feature planning)**:
```markdown
SUBTASKS:

1. Design Phase (CPO lead)
   1.1 Create wireframes for profile edit UI
   1.2 Define image upload requirements (size, format)
   1.3 Write user stories and acceptance criteria
   1.4 Get stakeholder approval

2. Backend Phase (CTO lead)
   2.1 Design database schema for profile fields
   2.2 Implement image upload to storage (Supabase)
   2.3 Create API endpoints for profile CRUD
   2.4 Add validation and security checks (CISO review)
   2.5 Write backend tests

3. Frontend Phase (CTO lead)
   3.1 Build profile edit form component
   3.2 Implement image upload UI with preview
   3.3 Connect to backend APIs
   3.4 Add form validation
   3.5 Write frontend tests

4. Integration Phase (CTO + COO)
   4.1 End-to-end testing
   4.2 Performance testing
   4.3 Security audit (CISO)
   4.4 Documentation updates

5. Launch Phase (COO + CMO)
   5.1 Staged rollout (10% → 50% → 100%)
   5.2 Monitor metrics and errors
   5.3 Blog post and user communication
   5.4 Update changelog and activity log
```

### 3. SEQUENCE
**Purpose**: Determine execution order and parallelization

**Considerations**:
- **Critical path**: Which tasks block others?
- **Parallel work**: What can happen simultaneously?
- **Resource constraints**: How many agents available?
- **Risk management**: Do risky tasks early (fail fast)

**Output**: Ordered task list with dependencies

**Example (CPO feature planning)**:
```markdown
EXECUTION SEQUENCE:

Phase 1 (Sequential - Foundation)
├─ 1.1 Wireframes (CPO) → 1-2 days
├─ 1.2 Upload requirements (CPO) → 1 day
├─ 1.3 User stories (CPO) → 1 day
└─ 1.4 Stakeholder approval (CPO) → 2 days
   ↓
Phase 2 (Parallel - Implementation)
├─ Backend (CTO)
│  ├─ 2.1 Database schema → 1 day
│  ├─ 2.2 Image upload → 2 days
│  ├─ 2.3 API endpoints → 2 days
│  ├─ 2.4 Security (CISO review) → 1 day
│  └─ 2.5 Backend tests → 1 day
│     (Total: 5-6 days)
│
└─ Frontend (CTO)
   ├─ 3.1 Form component → 1 day
   ├─ 3.2 Image upload UI → 2 days
   ├─ 3.3 API integration → 1 day
   ├─ 3.4 Form validation → 1 day
   └─ 3.5 Frontend tests → 1 day
      (Total: 5-6 days)
   ↓
Phase 3 (Sequential - Integration)
├─ 4.1 E2E tests (CTO) → 1 day
├─ 4.2 Performance tests (CTO) → 1 day
├─ 4.3 Security audit (CISO) → 1 day
└─ 4.4 Documentation (COO) → 1 day
   ↓
Phase 4 (Sequential - Launch)
├─ 5.1 Staged rollout (COO) → 2 days
├─ 5.2 Monitoring (CTO + COO) → 1 day
├─ 5.3 Blog post (CMO) → 1 day
└─ 5.4 Wrap-up (COO) → 1 day

TOTAL TIMELINE: ~12-14 days (within 2-week constraint)
CRITICAL PATH: Design → Backend → Integration → Launch
```

### 4. EXECUTE
**Purpose**: Work through the plan, adapting as needed

**Guidelines**:
- Follow the sequence unless new information suggests changes
- Track progress explicitly (use TODO lists)
- Communicate blockers immediately
- Update the plan if assumptions change

**Pattern Integration**: Use **ReAct Pattern** for each subtask execution

**Example (CTO executing task 2.2)**:
```markdown
TASK: 2.2 Implement image upload to storage

EXECUTION (ReAct cycles):
1. REASON: Need to upload to Supabase Storage per tech stack
2. ACT: Configure storage bucket with public read access
3. OBSERVE: Bucket created, but no upload validation
4. REFLECT: Need file type and size validation. ITERATE.

5. REASON: Add validation to prevent abuse
6. ACT: Implement validation (max 5MB, only jpg/png)
7. OBSERVE: Upload works, validation blocks invalid files
8. REFLECT: Working as expected. CONTINUE.

RESULT: Task 2.2 complete ✓
```

### 5. VALIDATE
**Purpose**: Confirm the plan achieved the goal

**Checks**:
- All subtasks completed?
- Success criteria met?
- No regressions or new bugs?
- Documentation updated?
- Stakeholders satisfied?

**Output**: Go/no-go decision for completion

**Example (CPO validating feature)**:
```markdown
VALIDATION CHECKLIST:

Design Phase:
✓ Wireframes approved by stakeholders
✓ Upload requirements documented
✓ User stories complete with acceptance criteria

Implementation:
✓ Backend API functional and tested
✓ Frontend UI matches wireframes
✓ Image uploads work correctly
✓ Security audit passed (CISO sign-off)

Integration:
✓ E2E tests passing
✓ Performance within targets (<2s upload)
✓ Documentation updated

Launch:
✓ Rolled out to 100% of users
✓ No critical errors in 48 hours
✓ Support tickets within normal range
✓ Blog post published
✓ Changelog updated

SUCCESS CRITERIA CHECK:
✓ Users can upload profile image
✓ Users can set display name and bio
✓ Changes save and persist
✓ 99.2% uptime maintained
✓ Support tickets actually decreased (clearer UI)

DECISION: COMPLETE ✅
```

## Example: Full Planning Cycle

**Scenario**: CTO refactoring authentication system

### 1. Understand Goal
```markdown
GOAL: Migrate from custom auth to Supabase Auth

WHY: Current system has security vulnerabilities and high maintenance

CONSTRAINTS:
- Zero downtime
- No user re-login required
- Complete in 1 week

SUCCESS:
- All users migrated to new system
- Old auth code removed
- Security audit passes
```

### 2. Decompose
```markdown
SUBTASKS:
1. Setup Supabase Auth (1 day)
2. Create migration script for existing users (2 days)
3. Implement dual-auth support (1 day)
4. Migrate users in batches (1 day)
5. Remove old auth code (1 day)
6. Security audit (1 day)
```

### 3. Sequence
```markdown
SEQUENTIAL (can't parallelize due to dependencies):
1 → 2 → 3 → 4 → 5 → 6

CRITICAL PATH: User migration (task 4) is highest risk
MITIGATION: Test with 1% of users first
```

### 4. Execute
```markdown
Day 1: Tasks 1-2 complete (Supabase configured, migration script ready)
Day 2: Task 3 complete (dual-auth working in dev)
Day 3: Task 4 started (1% migration successful)
Day 4: Task 4 continued (100% migration complete)
Day 5: Task 5 complete (old code removed)
Day 6: Task 6 complete (CISO audit passed)
```

### 5. Validate
```markdown
✓ Zero downtime achieved
✓ All users migrated successfully
✓ No re-login required
✓ Security audit passed
✓ Completed in 6 days (1 day ahead of schedule)

DECISION: COMPLETE ✅
```

## Benefits

### For Agents
- **Clarity**: Know exactly what to do next
- **Confidence**: Validated approach reduces uncertainty
- **Coordination**: Multiple agents work without conflicts
- **Progress tracking**: Easy to see what's done and what's left

### For Projects
- **Predictability**: Timeline estimates more accurate
- **Quality**: Fewer surprises and missed requirements
- **Risk management**: Identify problems before they occur
- **Stakeholder trust**: Plans can be reviewed and approved

### For Teams
- **Alignment**: Everyone understands the approach
- **Accountability**: Clear ownership of each subtask
- **Learning**: Plans document decision-making rationale
- **Reusability**: Similar problems can use adapted plans

## Limitations

### When NOT to Use Planning
- **Simple tasks**: Overhead outweighs benefits
- **Exploratory work**: Too much uncertainty for upfront planning
- **Rapid iteration**: Plan would be outdated immediately
- **Emergency response**: Need action, not planning

### Trade-offs
- **Upfront time**: Planning takes time before execution starts
- **Rigidity**: Over-commitment to plan prevents adaptation
- **False confidence**: Plan might be wrong but feel certain
- **Communication overhead**: More coordination required

### Common Pitfalls
- **Over-planning**: Spending more time planning than executing
- **Under-planning**: Skipping critical steps to start faster
- **Ignoring reality**: Not updating plan when assumptions fail
- **Solo planning**: Not getting input from relevant agents
- **No validation**: Assuming plan is correct without testing

## Related Patterns

### Complements
- **ReAct Pattern**: Use for executing each planned subtask
- **Reflection Pattern**: Review plan effectiveness after completion
- **Multi-Agent Collaboration**: Coordinate agent handoffs in plan
- **Tool Use Pattern**: Plan which tools needed for each step

### Builds On
- **Decomposition**: Core technique for breaking down work
- **Dependency Analysis**: Understanding what blocks what

### Enables
- **Quality Gates**: Define checkpoints in plan for validation
- **Risk Management**: Identify and mitigate risks upfront
- **Parallel Execution**: Multiple agents work simultaneously

## Automation Opportunities

### What Can Be Automated
- **Task breakdown prompts**: Checklist of decomposition questions
- **Dependency detection**: Analyze which tasks block others
- **Timeline estimation**: Historical data on similar tasks
- **Progress tracking**: Auto-update TODO lists as tasks complete
- **Validation checklists**: Auto-generate based on success criteria

### Example Automation
```bash
# bin/create-plan.sh

echo "=== PLANNING ASSISTANT ==="
echo "What is the goal of this work?"
read goal

echo "What are the success criteria?"
read success_criteria

echo "What are the constraints?"
read constraints

echo "Analyzing goal and suggesting subtasks..."
# Could use AI to suggest decomposition
./ai-decompose.sh "$goal"

echo "Review suggested plan:"
cat suggested-plan.md

echo "Does this look good? (yes/edit/regenerate)"
read response

if [ "$response" = "yes" ]; then
    ./create-todo-from-plan.sh suggested-plan.md
    echo "TODO list created. Ready to execute!"
fi
```

## Implementation in .pip

### For CPO Agent
Primary pattern for product planning:
- Use for all new features and enhancements
- Create plans BEFORE implementation starts
- Get stakeholder approval on plan
- Track execution against plan

### For CTO Agent
Use for technical planning:
- Major refactors or architectural changes
- Infrastructure migrations
- Complex bug fixes affecting multiple components

### For COO Agent
Use for operational planning:
- New workflow implementation
- Process improvements
- Tool rollouts

### Planning Template
See: `docs/templates/planning-template.md`
```markdown
# Plan: [Goal]

## Goal
[Clear statement of what we're trying to achieve]

## Success Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Constraints
- Timeline:
- Resources:
- Technical:

## Subtasks
1. [Phase 1 Name]
   1.1 [Subtask]
   1.2 [Subtask]
2. [Phase 2 Name]
   2.1 [Subtask]

## Execution Sequence
[Timeline with dependencies]

## Risks & Mitigation
- Risk 1 → Mitigation
- Risk 2 → Mitigation

## Validation Plan
How will we know we're done?
```

## Further Reading

- Planning in AI agents: [Tree of Thoughts](https://arxiv.org/abs/2305.10601)
- Agentic Design Patterns PDF: Advanced planning techniques
- `docs/processes/discovery-process.md`: CPO planning workflow
- `patterns/decision-frameworks/`: Frameworks for planning decisions

## Changelog

- **2025-12-17**: Initial extraction from Agentic Design Patterns PDF
- **Next**: Add specific page references and advanced planning variations
