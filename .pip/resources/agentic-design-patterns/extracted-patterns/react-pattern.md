# ReAct Pattern

**Type**: Core Agentic Workflow Pattern  
**Source**: Agentic Design Patterns (Page references TBD after detailed extraction)  
**Agent Roles**: CTO (primary), All agents (applicable)

## Overview

ReAct (Reason + Act) is a fundamental pattern where agents alternate between reasoning about their task and taking actions, then observing the results and reflecting on whether to continue or adjust their approach.

The pattern creates a continuous cycle:
**Reason → Act → Observe → Reflect** (loop until goal achieved)

This pattern is particularly effective for:
- Problem-solving tasks with uncertainty
- Debugging and troubleshooting
- Iterative refinement workflows
- Situations requiring adaptation based on feedback

## When to Use

### Use ReAct when:
- **Uncertain outcomes**: The correct approach isn't immediately clear
- **Iterative refinement**: Solution quality improves through multiple passes
- **Feedback-driven work**: Results inform next steps
- **Error recovery**: Need to detect and correct mistakes
- **Learning from attempts**: Each action provides information

### Examples:
- CTO writing code with testing feedback
- CISO investigating security vulnerabilities
- CTO debugging production issues
- CPO validating product hypotheses with user feedback

## How It Works

### 1. REASON (Think)
**Purpose**: Plan the next action based on current state and goal

**Questions to answer**:
- What is my current goal?
- What information do I have?
- What are my options?
- What action is most likely to succeed?
- What constraints must I respect?

**Output**: Clear action plan with rationale

**Example (CTO coding)**:
```markdown
REASONING:
- Goal: Implement user authentication
- Current state: Empty codebase
- Options: Build from scratch vs use library
- Decision: Use Supabase Auth (per tech stack)
- Rationale: Faster, more secure, team knows it
- Next action: Install Supabase client
```

### 2. ACT (Do)
**Purpose**: Execute the planned action

**Guidelines**:
- Take ONE focused action at a time
- Follow established patterns and best practices
- Document what you're doing
- Make action reversible if possible

**Output**: Concrete change to the system

**Example (CTO coding)**:
```bash
# Action: Install Supabase client
pnpm add @supabase/supabase-js

# Action: Create Supabase client setup
# (creates lib/supabase/client.ts)
```

### 3. OBSERVE (Check)
**Purpose**: Examine the results of your action

**What to observe**:
- Did the action succeed?
- What changed?
- What new information is available?
- Are there errors or warnings?
- What metrics changed?

**Output**: Facts about current state

**Example (CTO coding)**:
```markdown
OBSERVATIONS:
- ✓ Package installed successfully
- ✓ Client file created
- ✗ TypeScript error: Missing env variables
- ✗ Tests failing: No Supabase URL configured
- New info: Need to setup environment vars
```

### 4. REFLECT (Learn)
**Purpose**: Decide whether to continue, adjust, or stop

**Questions to answer**:
- Did I make progress toward the goal?
- Am I still on the right path?
- What did I learn from this action?
- What should I do next?
- Should I continue or change approach?

**Possible outcomes**:
- ✅ **Continue**: Goal achieved, move to next task
- 🔄 **Iterate**: Progress made, repeat cycle with new reasoning
- ⚠️ **Adjust**: Not working, change approach
- 🛑 **Escalate**: Blocked, need help from another agent

**Output**: Decision on next step

**Example (CTO coding)**:
```markdown
REFLECTION:
- Progress: 30% (setup started but incomplete)
- Learning: Environment vars needed before testing
- Path: Still correct (Supabase is right choice)
- Next: Setup environment variables
- Status: ITERATE (continue with new reasoning)
```

### The Loop
After reflecting, return to step 1 (REASON) with new information and repeat until goal is achieved or escalation is needed.

## Example: Full ReAct Cycle

**Scenario**: CTO implementing authentication

### Cycle 1
```markdown
1. REASON: Need authentication. Use Supabase per tech stack.
2. ACT: Install @supabase/supabase-js
3. OBSERVE: Installed successfully, but TypeScript errors
4. REFLECT: Progress made. Need env vars. ITERATE.
```

### Cycle 2
```markdown
1. REASON: Need env vars for Supabase connection
2. ACT: Create .env.local with Supabase URL and keys
3. OBSERVE: TypeScript errors cleared, but tests still fail
4. REFLECT: Progress made. Need to create client instance. ITERATE.
```

### Cycle 3
```markdown
1. REASON: Need to instantiate Supabase client
2. ACT: Create lib/supabase/client.ts with configuration
3. OBSERVE: Tests pass, auth flow works in dev
4. REFLECT: Goal achieved! CONTINUE to next task.
```

## Benefits

### For Agents
- **Self-correcting**: Catches mistakes before they compound
- **Explainable**: Clear reasoning trail for debugging
- **Adaptive**: Adjusts to unexpected situations
- **Learning**: Each cycle improves understanding

### For Projects
- **Quality**: Problems caught and fixed in each cycle
- **Transparency**: Decision rationale is documented
- **Resilience**: Adapts to changing requirements
- **Knowledge capture**: Reasoning is explicit and reusable

### For Teams
- **Onboarding**: New agents learn by seeing reasoning
- **Review**: Easy to audit agent decisions
- **Improvement**: Patterns emerge from reflection logs
- **Collaboration**: Shared reasoning framework

## Limitations

### When NOT to Use ReAct
- **Trivial tasks**: Overkill for simple, well-known actions
- **Time-critical**: Reflection adds overhead
- **Perfect information**: When path is completely clear
- **No feedback available**: Can't observe results

### Trade-offs
- **Slower**: More steps than direct action
- **Verbose**: Generates more documentation
- **Overhead**: Requires discipline to follow
- **Tool support needed**: Hard to enforce without automation

### Common Pitfalls
- **Shallow reasoning**: Skipping the thinking step
- **Ignoring observations**: Not checking results carefully
- **Weak reflection**: Not learning from attempts
- **Infinite loops**: Not knowing when to escalate

## Related Patterns

### Complements
- **Planning Pattern**: ReAct handles execution, Planning handles decomposition
- **Reflection Pattern**: Deep reflection after completing a ReAct cycle
- **Tool Use Pattern**: ReAct determines WHICH tools to use
- **Self-Correction Pattern**: ReAct enables correction through observation

### Builds On
- **Chain-of-Thought**: ReAct makes reasoning explicit
- **Decomposition**: Break large problems into ReAct cycles

### Enables
- **Multi-Agent Collaboration**: Agents share reasoning between cycles
- **Memory Persistence**: Store reasonings for future reference
- **Quality Metrics**: Measure cycle efficiency and success rate

## Automation Opportunities

### What Can Be Automated
- **Observation**: Auto-run tests, collect metrics, scan logs
- **Reflection prompts**: Checklist of questions to answer
- **Quality gates**: Block progression if criteria not met
- **Learning capture**: Store reasoning in vector memory

### Example Automation
```bash
# bin/react-cycle.sh

echo "=== REASON ==="
echo "What is your goal for this action?"
read goal

echo "What action will you take?"
read action

echo "=== ACT ==="
eval "$action"
action_status=$?

echo "=== OBSERVE ==="
./run-tests.sh
./check-lint.sh
./check-metrics.sh

echo "=== REFLECT ==="
echo "Action status: $action_status"
echo "Tests: $(cat test-results.txt)"
echo "Metrics: $(cat metrics.txt)"

echo "Did you make progress? (yes/no/blocked)"
read reflection

if [ "$reflection" = "blocked" ]; then
    echo "Escalating to next agent..."
    ./escalate.sh
fi
```

## Implementation in .pip

### For CTO Agent
See: `patterns/agent-workflows/cto-react-workflow.md`
- Apply ReAct for all code writing tasks
- Use for debugging and troubleshooting
- Document reasoning in commit messages

### For CPO Agent
See: `patterns/agent-workflows/cpo-planning-workflow.md`
- Use ReAct for validating product hypotheses
- Apply when gathering user feedback
- Iterate on requirements based on observations

### For COO Agent
See: `patterns/agent-workflows/coo-operations-workflow.md`
- Use ReAct for process improvements
- Apply when fixing operational issues
- Iterate on workflow efficiency

## Further Reading

- Original ReAct paper: [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)
- Agentic Design Patterns PDF: Full context and variations
- `patterns/agent-workflows/`: Agent-specific implementations

## Changelog

- **2025-12-17**: Initial extraction from Agentic Design Patterns PDF
- **Next**: Add specific page references after detailed review
