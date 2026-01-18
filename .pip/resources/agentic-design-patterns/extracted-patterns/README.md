# Agentic Design Patterns - Extracted Pattern Library

This directory contains curated agentic design patterns extracted from the source PDF and adapted for use within the `.pip` framework. These patterns provide reusable approaches for AI agents to accomplish complex tasks effectively.

## Overview

Agentic design patterns are structured approaches that enable AI agents to:
- Make better decisions through systematic reasoning
- Break down complex problems into manageable steps
- Learn from experience and improve over time
- Use tools effectively to extend their capabilities
- Collaborate with other agents on large projects

## Core Patterns

### 1. [ReAct Pattern](./react-pattern.md)
**Type**: Core Agentic Workflow Pattern  
**Purpose**: Alternating between reasoning and action in a continuous feedback loop

**When to use**:
- Problem-solving with uncertainty
- Debugging and troubleshooting
- Iterative refinement workflows
- Situations requiring adaptation based on feedback

**Key steps**: Reason → Act → Observe → Reflect (loop)

**Applied in .pip**:
- CTO agent for code writing and debugging
- CPO agent for validating product hypotheses
- COO agent for process improvements

---

### 2. [Planning Pattern](./planning-pattern.md)
**Type**: Task Decomposition Pattern  
**Purpose**: Breaking down complex tasks into structured, sequenced subtasks

**When to use**:
- Complex scope (5+ steps)
- Dependencies between tasks
- Multiple agents coordinating
- High-stakes changes requiring validation

**Key steps**: Understand Goal → Decompose → Sequence → Execute → Validate

**Applied in .pip**:
- CPO agent for feature planning
- CTO agent for architecture and refactors
- COO agent for operational workflows

---

### 3. [Reflection Pattern](./reflection-pattern.md)
**Type**: Learning & Improvement Pattern  
**Purpose**: Examining past actions to identify and apply improvements

**When to use**:
- After project completion
- Recurring issues appearing
- Process changes needing evaluation
- Performance gaps to address
- Regular retrospectives (weekly, monthly, quarterly)

**Key steps**: Collect → Analyze → Identify → Document → Apply

**Applied in .pip**:
- All agents after features
- Scheduled retrospectives
- Continuous improvement (Kaizen)

---

### 4. [Tool Use Pattern](./tool-use-pattern.md)
**Type**: Action Execution Pattern  
**Purpose**: Selecting and using specialized tools to extend agent capabilities

**When to use**:
- External system interaction needed
- Specialized capability required
- Efficiency matters
- Tool is more reliable than manual approach

**Key steps**: Identify Need → Select Tool → Configure → Execute → Validate → Chain

**Applied in .pip**:
- CTO agent for git, testing, building
- All agents for file operations
- COO agent for Linear API
- CMO agent for content tools

---

### 5. [Multi-Agent Collaboration Pattern](./multi-agent-collaboration-pattern.md)
**Type**: Coordination & Orchestration Pattern  
**Purpose**: Multiple specialized agents working together on complex projects

**When to use**:
- Diverse expertise needed
- Clear specialization boundaries
- Parallel execution possible
- Quality requires specialization

**Key steps**: Decompose → Route → Execute → Coordinate → Integrate

**Applied in .pip**:
- Feature delivery: CPO → CTO → CISO → COO → CMO
- All cross-functional workflows
- Handoff protocols and coordination mechanisms

---

## Pattern Relationships

### Complementary Patterns
These patterns work together:

```
Planning Pattern
    ↓
Multi-Agent Collaboration
    ↓
Each agent uses:
    - ReAct Pattern (for execution)
    - Tool Use Pattern (for capabilities)
    - Reflection Pattern (for learning)
```

### Pattern Selection Guide

**For individual agent work**:
- Simple task → **ReAct Pattern**
- Complex task → **Planning Pattern** then **ReAct Pattern**
- After completion → **Reflection Pattern**
- Need external systems → **Tool Use Pattern**

**For multi-agent work**:
- Always use → **Multi-Agent Collaboration Pattern**
- Each agent still uses individual patterns above

## Pattern Integration in .pip

### Agent Workflows
Patterns are embedded in agent-specific workflows:

```
ia/agents/
├── cto/
│   ├── workflows/
│   │   ├── feature-implementation-workflow.md  (Planning + ReAct + Tool Use)
│   │   ├── debugging-workflow.md               (ReAct + Tool Use)
│   │   └── architecture-workflow.md            (Planning + Reflection)
│
├── cpo/
│   ├── workflows/
│   │   ├── feature-planning-workflow.md        (Planning + Multi-Agent)
│   │   └── validation-workflow.md              (ReAct + Reflection)
│
└── coo/
    ├── workflows/
    │   ├── launch-workflow.md                  (Multi-Agent + Tool Use)
    │   └── process-improvement-workflow.md     (Reflection + Planning)
```

### Decision Frameworks
Patterns inform decision-making:

```
patterns/decision-frameworks/
├── architecture-decisions.md     (Uses: Planning, Reflection)
├── prioritization-framework.md   (Uses: Planning, Multi-Agent)
├── risk-assessment.md           (Uses: ReAct, Reflection)
└── scope-definition.md          (Uses: Planning, Multi-Agent)
```

### Quality Metrics
Patterns have measurable outcomes:

```
patterns/quality-metrics/
├── cto-quality-metrics.md       (ReAct cycles, Test coverage, Build time)
├── cpo-quality-metrics.md       (Planning accuracy, Feature adoption)
└── coo-quality-metrics.md       (Reflection frequency, Process efficiency)
```

## Automation & Tooling

Each pattern includes automation opportunities:

### ReAct Pattern
- `bin/react-cycle.sh` - Interactive ReAct loop
- Auto-run tests after actions
- Reflection prompts

### Planning Pattern
- `bin/create-plan.sh` - Planning assistant
- Auto-generate TODO lists from plans
- Timeline estimation

### Reflection Pattern
- `bin/reflect.sh` - Retrospective assistant
- Auto-collect activity logs and metrics
- Pattern detection

### Tool Use Pattern
- `bin/discover-tools.sh` - List available tools
- `bin/safe-tool.sh` - Wrapper for tool execution
- `bin/run-chain.sh` - Tool chain orchestrator

### Multi-Agent Collaboration
- `bin/route-task.sh` - Agent routing
- `bin/handoff.sh` - Handoff notifications
- `bin/coordination-status.sh` - Dashboard

## Usage Examples

### Example 1: CTO Implementing a Feature

```markdown
1. PLANNING PATTERN
   - Decompose feature into subtasks
   - Sequence with dependencies
   - Estimate timeline

2. REACT PATTERN (for each subtask)
   - Reason: What to build next?
   - Act: Write code
   - Observe: Run tests
   - Reflect: Tests pass? Continue or iterate

3. TOOL USE PATTERN (throughout)
   - git for version control
   - pnpm test for testing
   - Linear API for updates

4. MULTI-AGENT COLLABORATION (handoffs)
   - Receive requirements from CPO
   - Hand to CISO for security review
   - Hand to COO for deployment

5. REFLECTION PATTERN (after completion)
   - Collect metrics (timeline, bugs, coverage)
   - Analyze what went well/wrong
   - Document lessons learned
   - Apply improvements next time
```

### Example 2: COO Improving a Process

```markdown
1. REFLECTION PATTERN (start here)
   - Collect data on current process
   - Analyze inefficiencies
   - Identify improvements

2. PLANNING PATTERN
   - Decompose process changes
   - Sequence rollout
   - Define success criteria

3. MULTI-AGENT COLLABORATION
   - Get CTO input on technical changes
   - Get CMO input on communication
   - Coordinate implementation

4. REACT PATTERN (for implementation)
   - Reason: Test new process with small group
   - Act: Roll out to pilot group
   - Observe: Collect feedback
   - Reflect: Iterate or scale

5. REFLECTION PATTERN (validate)
   - Collect post-implementation data
   - Confirm improvements achieved
   - Document for future reference
```

## Pattern Evolution

These patterns are living documents that will evolve based on:

1. **Usage experience**: Real-world application in `.pip` projects
2. **PDF deep-dive**: Adding specific page references and advanced variations
3. **Community feedback**: Insights from organism projects using `.pip`
4. **Research updates**: New agentic design pattern publications

## Source Material

These patterns are extracted from:
- **Primary source**: `resources/agentic-design-patterns/Agentic_Design_Patterns.pdf` (482 pages)
- **Initial extraction**: December 17, 2025
- **Status**: Core patterns documented, detailed page references pending
- **Next**: Deep analysis of PDF for advanced variations and specific examples

## Contributing

When updating or adding patterns:

1. **Follow template**: Overview, When to Use, How it Works, Example, Benefits, Limitations, Related Patterns
2. **Be concrete**: Include executable examples, not just theory
3. **Show integration**: How does it work within `.pip`?
4. **Add automation**: What scripts or tools support this pattern?
5. **Reference source**: Include page numbers from PDF when available

## Further Reading

### Within `.pip`
- `ia/agents/` - Agent roles and responsibilities
- `patterns/` - Decision frameworks and workflows
- `docs/processes/` - Operational processes using patterns
- `bin/` - Automation scripts for patterns

### External Resources
- **ReAct**: [ReAct Paper](https://arxiv.org/abs/2210.03629)
- **Planning**: [Tree of Thoughts](https://arxiv.org/abs/2305.10601)
- **Tool Use**: [Toolformer](https://arxiv.org/abs/2302.04761)
- **Multi-Agent**: [Communicating Agents](https://arxiv.org/abs/2305.11740)
- **Reflection**: [Agile Retrospectives](https://www.amazon.com/Agile-Retrospectives-Making-Teams-Great/dp/0977616649)

---

**Pattern Library Version**: 1.0.0  
**Last Updated**: December 17, 2025  
**Maintainer**: CTO Agent  
**Status**: Active - Core patterns documented
