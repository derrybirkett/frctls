# Multi-Agent Collaboration Pattern

**Type**: Coordination & Orchestration Pattern  
**Source**: Agentic Design Patterns (Page references TBD after detailed extraction)  
**Agent Roles**: All agents (system-wide pattern)

## Overview

The Multi-Agent Collaboration Pattern involves multiple specialized agents working together to accomplish tasks that exceed the capability of any single agent. Rather than one agent doing everything, work is decomposed and distributed to agents with relevant expertise.

The pattern follows:
**Decompose → Route → Execute → Coordinate → Integrate**

This pattern is particularly effective for:
- Complex projects requiring diverse expertise
- Tasks spanning multiple domains (product + technical + operations)
- Workflows with clear specialization boundaries
- Systems needing clear ownership and accountability

## When to Use

### Use Multi-Agent Collaboration when:
- **Diverse expertise needed**: Task requires skills from multiple domains
- **Clear boundaries exist**: Work naturally divides by specialization
- **Parallel execution possible**: Multiple agents can work simultaneously
- **Quality requires specialization**: Generalist approach insufficient
- **Accountability matters**: Need clear ownership per domain

### Examples:
- Feature delivery: CPO defines requirements → CTO implements → COO manages launch
- Security audit: CTO provides codebase → CISO reviews security → CTO fixes issues
- Product launch: CPO validates readiness → CMO writes blog → COO coordinates rollout
- Infrastructure change: CTO proposes architecture → CISO reviews security → COO updates runbooks

## How It Works

### 1. DECOMPOSE
**Purpose**: Break work into agent-appropriate subtasks

**Decomposition principles**:
- **Domain alignment**: Match subtask to agent expertise
- **Clear interfaces**: Define inputs/outputs between agents
- **Minimize coupling**: Reduce dependencies where possible
- **Explicit handoffs**: Make transitions between agents obvious

**Output**: Task breakdown with agent assignments

**Example (Feature: User Profile Customization)**:
```markdown
DECOMPOSITION:

Task: Implement user profile customization feature

Agent Assignments:

1. CPO (Product)
   - Define user stories and acceptance criteria
   - Create wireframes for profile UI
   - Specify success metrics
   - INPUT: User research, feature requests
   - OUTPUT: Product requirements document

2. CTO (Technical)
   - Design database schema for profile fields
   - Implement backend APIs
   - Build frontend UI components
   - Write tests
   - INPUT: Product requirements from CPO
   - OUTPUT: Working feature, test coverage report

3. CISO (Security)
   - Review data privacy implications
   - Audit image upload security
   - Verify input validation
   - INPUT: Implementation from CTO
   - OUTPUT: Security approval or issues list

4. COO (Operations)
   - Plan staged rollout
   - Monitor launch metrics
   - Update documentation
   - Coordinate wrap-up process
   - INPUT: Approved feature from CISO
   - OUTPUT: Launched feature, updated docs

5. CMO (Marketing)
   - Write blog post announcement
   - Create user-facing documentation
   - Plan email communication
   - INPUT: Feature details from CPO + CTO
   - OUTPUT: Marketing materials
```

### 2. ROUTE
**Purpose**: Direct work to the appropriate agent

**Routing strategies**:
- **Explicit assignment**: Task clearly labeled for specific agent
- **Capability matching**: Route based on required skills
- **Load balancing**: Consider agent availability
- **Escalation paths**: Handle blocked or unclear cases

**Output**: Task in correct agent's queue

**Example (Routing decision)**:
```markdown
ROUTING DECISION:

Incoming request: "Add dark mode to dashboard"

Analysis:
- Requires UI changes (CTO)
- Needs product decision on default theme (CPO)
- May need brand guidelines (CMO)
- Will need deployment (COO)

Primary agent: CPO (product decision first)
Route to: CPO queue

CPO will:
1. Define dark mode requirements
2. Hand off to CTO for implementation
3. Coordinate with CMO on branding
4. Hand off to COO for launch

ROUTING: Incoming → CPO (start)
```

### 3. EXECUTE
**Purpose**: Each agent performs their specialized work

**Execution guidelines**:
- **Stay in lane**: Focus on your domain expertise
- **Use established patterns**: Apply ReAct, Planning, etc.
- **Document decisions**: Record rationale for future reference
- **Signal progress**: Keep other agents informed
- **Request help**: Escalate when blocked

**Output**: Agent-specific deliverable

**Example (CTO executing implementation)**:
```markdown
CTO EXECUTION:

Task: Implement user profile customization
Input from CPO: Requirements document, wireframes
Status: IN PROGRESS

Day 1-2: Database Schema
- Created migration for profile_fields table
- Added columns: display_name, bio, avatar_url
- Applied and tested migration
- DELIVERABLE: Schema v2.1.0

Day 3-5: Backend API
- Implemented GET /profile endpoint
- Implemented PUT /profile endpoint
- Implemented POST /profile/avatar (image upload)
- Added input validation and error handling
- DELIVERABLE: API implementation + tests

Day 6-8: Frontend UI
- Built ProfileEditForm component
- Implemented image upload with preview
- Connected to backend APIs
- Added loading and error states
- DELIVERABLE: UI implementation + tests

Day 9: Integration & Testing
- End-to-end tests passing
- Test coverage: 89%
- Performance: <2s for all operations
- DELIVERABLE: Complete implementation

HANDOFF TO: CISO for security review
DELIVERABLE: Working feature with test suite
```

### 4. COORDINATE
**Purpose**: Synchronize work across agents

**Coordination mechanisms**:
- **Handoff protocols**: Clear process for passing work
- **Status updates**: Regular progress communication
- **Blocking issues**: Surface dependencies immediately
- **Shared artifacts**: Documents, tickets, commits
- **Checkpoints**: Synchronization points (reviews, approvals)

**Output**: Synchronized agent progress

**Example (Coordination protocol)**:
```markdown
COORDINATION: Profile Feature

Status Meeting (Every 2 Days):

Day 2:
- CPO: ✓ Requirements complete, wireframes done
- CTO: 🔄 Database schema in progress
- CISO: ⏸ Waiting for implementation
- COO: ⏸ Waiting for feature
- CMO: 🔄 Blog post drafted (needs review)
- BLOCKERS: None

Day 4:
- CPO: ✓ All deliverables complete
- CTO: 🔄 Backend API done, starting frontend
- CISO: ⏸ Waiting for implementation
- COO: ⏸ Waiting for feature
- CMO: ✓ Blog post approved by CPO
- BLOCKERS: None

Day 6:
- CPO: ✓ Available for questions
- CTO: 🔄 Frontend 80% complete
- CISO: ⏸ Ready to start security review
- COO: 📝 Planning rollout strategy
- CMO: ✓ Blog ready to publish
- BLOCKERS: None

Day 8:
- CPO: ✓ Feature meets requirements
- CTO: ✓ Implementation complete, handed to CISO
- CISO: 🔄 Security review in progress
- COO: 📝 Rollout plan ready
- CMO: ✓ Waiting for launch date
- BLOCKERS: None

Day 9:
- CPO: ✓ Approved for launch
- CTO: ✓ Fixed security issues from CISO
- CISO: ✓ Security approved
- COO: 🔄 Starting staged rollout
- CMO: 📝 Scheduled blog for launch day
- BLOCKERS: None
```

### 5. INTEGRATE
**Purpose**: Combine agent deliverables into cohesive result

**Integration activities**:
- **Merge work**: Combine code, docs, configs
- **Validate completeness**: All requirements met?
- **Test end-to-end**: Full workflow works?
- **Document learnings**: Retrospective and lessons
- **Celebrate success**: Acknowledge contributions

**Output**: Complete, integrated deliverable

**Example (Integration checklist)**:
```markdown
INTEGRATION: Profile Feature Launch

Technical Integration:
✓ CTO code merged to main branch
✓ Database migrations applied to production
✓ E2E tests passing on staging
✓ Performance benchmarks met

Security Integration:
✓ CISO security audit passed
✓ No high or critical vulnerabilities
✓ Privacy review complete
✓ Input validation verified

Product Integration:
✓ CPO acceptance criteria met
✓ All user stories implemented
✓ Success metrics defined and tracked
✓ Feature flags configured

Operational Integration:
✓ COO rollout plan approved
✓ Monitoring dashboards updated
✓ Runbooks updated with new feature
✓ Support team trained

Marketing Integration:
✓ CMO blog post ready
✓ User documentation complete
✓ Email announcement prepared
✓ Social media posts scheduled

RESULT: Feature ready for launch ✓
LAUNCH DATE: 2025-12-20 10:00 AM
```

## Example: Full Multi-Agent Workflow

**Scenario**: Implementing password reset feature

### 1. Decompose
```markdown
TASK: Password reset functionality

AGENT ASSIGNMENTS:

CPO:
- Define password reset flow (email link vs code)
- Specify security requirements (expiry, one-time use)
- Create acceptance criteria

CTO:
- Implement reset token generation
- Build email sending integration
- Create reset form UI
- Write tests

CISO:
- Review token security (randomness, expiry)
- Audit email content for phishing prevention
- Verify rate limiting to prevent abuse

COO:
- Monitor email delivery rates
- Update user-facing support docs
- Coordinate launch

CMO:
- Write help article on password reset
- Create email template text
```

### 2. Route
```markdown
ROUTING:

Start: CPO (defines requirements)
Then: CTO (implementation)
Then: CISO (security review)
Then: COO (launch coordination)
Parallel: CMO (documentation during CTO implementation)
```

### 3. Execute
```markdown
CPO EXECUTION (Day 1):
✓ Defined flow: Email link with one-time token
✓ Security reqs: 1-hour expiry, HTTPS only, rate limited
✓ Acceptance criteria: 5 user stories defined
HANDOFF: Requirements document to CTO

CTO EXECUTION (Day 2-4):
✓ Token generation: Cryptographically secure random
✓ Email integration: Supabase Auth email templates
✓ Reset form: New password + confirmation
✓ Tests: 15 tests, 95% coverage
HANDOFF: Implementation to CISO

CISO EXECUTION (Day 5):
✓ Token security: Uses crypto.randomBytes (approved)
✓ Email content: Clear sender, no suspicious links
✓ Rate limiting: 3 attempts per hour (approved)
✓ APPROVED with 2 minor recommendations
HANDOFF: Approval + recommendations to CTO

CTO EXECUTION (Day 6):
✓ Implemented CISO recommendations
✓ Re-tested, all passing
HANDOFF: Final implementation to COO

COO EXECUTION (Day 7):
✓ Deployed to staging, tested manually
✓ Updated support docs
✓ Monitored email delivery (99.2% delivered)
HANDOFF: Ready for production

CMO EXECUTION (Day 2-6, parallel):
✓ Help article written and reviewed
✓ Email templates created
✓ User-facing language approved by CPO
HANDOFF: Documentation to COO for publishing
```

### 4. Coordinate
```markdown
COORDINATION TOUCHPOINTS:

Day 1 Handoff:
- CPO → CTO: Requirements doc via Linear comment
- CTO acknowledged, started implementation

Day 4 Handoff:
- CTO → CISO: PR #456 + request for security review
- CISO acknowledged, will review by EOD Day 5

Day 5 Review:
- CISO → CTO: Approved with 2 recommendations (Linear comment)
- CTO acknowledged, implementing today

Day 6 Checkpoint:
- CTO → COO: Recommendations complete, ready for staging
- COO acknowledged, deploying to staging

Day 7 Launch:
- COO: Feature live in production
- CMO: Help article published
- All: Launch successful, monitoring metrics
```

### 5. Integrate
```markdown
INTEGRATION VALIDATION:

Technical: ✓
- Code merged: PR #456
- Tests passing: 15/15
- Deployed: Production v2.3.0

Security: ✓
- CISO approved
- Recommendations implemented
- No vulnerabilities

Product: ✓
- All 5 user stories complete
- CPO acceptance criteria met
- Success metrics tracking

Operations: ✓
- Docs updated
- Support team notified
- Monitoring in place

Marketing: ✓
- Help article live
- Email templates published

RESULT: Password reset feature launched ✓
TEAM: CPO, CTO, CISO, COO, CMO - excellent collaboration!
```

## Benefits

### For Agents
- **Focus on expertise**: Work in your domain
- **Clear accountability**: Know what you own
- **Better quality**: Specialization improves outcomes
- **Learning**: See how other agents work

### For Projects
- **Faster delivery**: Parallel work accelerates timeline
- **Higher quality**: Each aspect handled by expert
- **Risk reduction**: Multiple review points
- **Knowledge distribution**: Not dependent on one agent

### For Organizations
- **Scalability**: Add agents to increase capacity
- **Flexibility**: Route work based on priorities
- **Resilience**: Not blocked by single agent absence
- **Specialization**: Agents develop deep expertise

## Limitations

### When NOT to Use Multi-Agent
- **Simple tasks**: Overhead of coordination not worth it
- **Unclear boundaries**: Can't cleanly divide work
- **Tight coupling**: Too many dependencies between agents
- **Time-critical**: Coordination delays matter more than quality

### Trade-offs
- **Coordination overhead**: More communication required
- **Handoff delays**: Waiting for other agents
- **Context loss**: Information gaps at handoffs
- **Complexity**: More moving parts to manage

### Common Pitfalls
- **Unclear ownership**: Task falls between agents
- **Poor handoffs**: Missing information at transitions
- **Duplicate work**: Agents doing same thing
- **Blocking chains**: Sequential dependencies slow progress
- **Communication gaps**: Agents working in isolation

## Related Patterns

### Complements
- **Planning Pattern**: Plan includes agent assignments
- **ReAct Pattern**: Each agent uses ReAct for their work
- **Tool Use Pattern**: Agents share tool knowledge
- **Reflection Pattern**: Team retrospectives on collaboration

### Builds On
- **Decomposition**: Breaking work into agent-sized chunks
- **Routing**: Directing work to right agent
- **Protocols**: Handoff and communication standards

### Enables
- **Parallel execution**: Multiple agents work simultaneously
- **Quality gates**: Each agent reviews from their perspective
- **Knowledge sharing**: Cross-pollination of expertise

## Agent Roles in .pip

### CEO - Chief Executive Officer
**Scope**: Cross-functional decisions, mission alignment, strategy
**Handoffs**: 
- FROM: Any agent escalating strategic decision
- TO: Appropriate agent with strategic direction

### CTO - Chief Technology Officer
**Scope**: Architecture, implementation, technical quality, delivery
**Handoffs**:
- FROM: CPO with requirements
- TO: CISO for security review, COO for deployment

### CPO - Chief Product Officer
**Scope**: Product vision, requirements, user experience, prioritization
**Handoffs**:
- FROM: CEO with product strategy
- TO: CTO with requirements, CMO with positioning

### CISO - Chief Information Security Officer
**Scope**: Security, privacy, compliance, risk management
**Handoffs**:
- FROM: CTO with implementation
- TO: CTO with security requirements/issues, COO with policies

### CMO - Chief Marketing Officer
**Scope**: Messaging, content, blog posts, user communication
**Handoffs**:
- FROM: CPO with feature details, CTO with technical details
- TO: COO with marketing materials for launch

### COO - Chief Operating Officer
**Scope**: Processes, workflows, operations, launch coordination, wrap-up
**Handoffs**:
- FROM: CTO with deployable code, CMO with marketing materials
- TO: CEO with completed work summary

## Coordination Mechanisms in .pip

### 1. Linear Tasks
Primary coordination system:
- All work tracked in Linear
- Agents assigned to relevant tasks
- Comments for async handoffs
- Status updates for visibility

### 2. Git Workflow
Code coordination:
- Feature branches per agent
- Pull requests for review handoffs
- Comments for technical discussion
- Merges integrate work

### 3. Documentation
Shared knowledge base:
- Activity log: What happened
- Changelog: User-facing changes
- Blog posts: Public communication
- Decision records: Why choices made

### 4. Handoff Protocol
Standard process:
```markdown
HANDOFF TEMPLATE:

FROM: [Agent Name]
TO: [Agent Name]
TASK: [Linear Ticket ID + Description]
STATUS: [Complete/Blocked/Question]

DELIVERABLES:
- [What I'm handing off]
- [Where to find it]

CONTEXT:
- [Key decisions made]
- [Assumptions or constraints]
- [Known issues or questions]

NEXT STEPS:
- [What the next agent should do]
- [Any dependencies to be aware of]

QUESTIONS:
- [Anything unclear or needing clarification]
```

### 5. Wrap-Up Coordination
COO orchestrates:
1. Activity log updated (all agents contribute)
2. Changelog updated (COO coordinates)
3. Blog post written (CMO leads)
4. Retrospective (all agents participate)
5. Merge to main (CTO executes)

## Automation Opportunities

### Agent Routing
```bash
# bin/route-task.sh

TASK_DESCRIPTION=$1

echo "=== AGENT ROUTING ==="
echo "Task: $TASK_DESCRIPTION"
echo ""

# Simple keyword routing (could use AI for smarter routing)
if echo "$TASK_DESCRIPTION" | grep -qi "feature\|requirements\|user story"; then
    echo "PRIMARY AGENT: CPO (product-related)"
elif echo "$TASK_DESCRIPTION" | grep -qi "implement\|code\|bug\|test"; then
    echo "PRIMARY AGENT: CTO (technical)"
elif echo "$TASK_DESCRIPTION" | grep -qi "security\|vulnerability\|privacy"; then
    echo "PRIMARY AGENT: CISO (security)"
elif echo "$TASK_DESCRIPTION" | grep -qi "blog\|content\|announcement"; then
    echo "PRIMARY AGENT: CMO (marketing)"
elif echo "$TASK_DESCRIPTION" | grep -qi "deploy\|launch\|process"; then
    echo "PRIMARY AGENT: COO (operations)"
else
    echo "PRIMARY AGENT: CEO (strategic/unclear)"
fi
```

### Handoff Notification
```bash
# bin/handoff.sh

FROM_AGENT=$1
TO_AGENT=$2
TASK_ID=$3
MESSAGE=$4

echo "=== HANDOFF NOTIFICATION ==="
echo "FROM: $FROM_AGENT"
echo "TO: $TO_AGENT"
echo "TASK: $TASK_ID"
echo "MESSAGE: $MESSAGE"
echo ""

# Create Linear comment with handoff
linear comment $TASK_ID "🔄 HANDOFF: $FROM_AGENT → $TO_AGENT\n\n$MESSAGE"

# Update task assignee
linear issue update $TASK_ID --assignee=$TO_AGENT

echo "✓ Handoff recorded in Linear"
```

### Coordination Dashboard
```bash
# bin/coordination-status.sh

echo "=== MULTI-AGENT COORDINATION STATUS ==="
echo ""

echo "ACTIVE TASKS BY AGENT:"
linear issue list --assignee=CPO --state="In Progress"
linear issue list --assignee=CTO --state="In Progress"
linear issue list --assignee=CISO --state="In Progress"
linear issue list --assignee=COO --state="In Progress"
linear issue list --assignee=CMO --state="In Progress"

echo ""
echo "HANDOFFS WAITING:"
linear issue list --label="awaiting-handoff"

echo ""
echo "BLOCKED TASKS:"
linear issue list --state="Blocked"
```

## Further Reading

- Multi-agent systems: [Communicating Agents](https://arxiv.org/abs/2305.11740)
- Agentic Design Patterns PDF: Advanced coordination techniques
- `ia/agent_manifest.yml`: Agent roles and responsibilities
- `docs/processes/handoff-protocol.md`: Detailed handoff procedures

## Changelog

- **2025-12-17**: Initial extraction from Agentic Design Patterns PDF
- **Next**: Add coordination protocol templates and real examples
