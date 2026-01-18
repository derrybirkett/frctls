# ReAct Pattern: Reason + Act

**Pattern Type**: Agent Workflow
**Primary Users**: CTO, CISO (Technical agents)
**Purpose**: Structured problem-solving with explicit reasoning, action, observation, and reflection loops

## Overview

The **ReAct pattern** combines **Rea**soning and **Act**ing in an interleaved manner,
creating a systematic approach to technical problem-solving. Instead of jumping straight
to solutions, agents explicitly reason about the problem, take action, observe results,
and reflect on what was learned.

## The Four-Step Loop

```text
┌─────────────┐
│   REASON    │ ← Why is this happening? What should I try?
└──────┬──────┘
       ↓
┌─────────────┐
│     ACT     │ ← Execute the reasoned action
└──────┬──────┘
       ↓
┌─────────────┐
│   OBSERVE   │ ← What happened? What changed?
└──────┬──────┘
       ↓
┌─────────────┐
│   REFLECT   │ ← What did I learn? Should I iterate or conclude?
└──────┬──────┘
       ↓
   (Repeat or Exit)
```

## When to Use

### Use ReAct For

- **Debugging** - Diagnosing and fixing bugs
- **Performance optimization** - Identifying and resolving bottlenecks
- **Security incidents** - Investigating and remediating vulnerabilities
- **Technical architecture** - Evaluating design alternatives
- **Code review** - Systematically analyzing pull requests
- **Infrastructure issues** - Troubleshooting deployment or scaling problems

### Don't Use ReAct For

- **Simple tasks** - Straightforward implementations with clear requirements
- **Time-critical emergencies** - When speed trumps thoroughness (revert first, analyze later)
- **Non-technical decisions** - Product prioritization, business strategy (use Planning pattern instead)

## Detailed Steps

### 1. REASON

**Ask**: What's the problem? What do I know? What hypotheses can I form?

**Actions**:

- State the problem clearly
- List known facts and constraints
- Form 2-3 hypotheses about root cause or solution approach
- Identify which hypothesis to test first (highest probability or easiest to validate)

**Output**: A clear reasoning statement documenting your thought process

**Example**:

```text
REASON: Test suite is failing on CI but passing locally.
Known facts:
- Tests pass on macOS (local)
- Tests fail on Ubuntu (CI)
- Error: "Module 'X' not found"
Hypotheses:
1. Missing dependency in CI environment (most likely)
2. Path resolution differs between OS (possible)
3. Race condition in async tests (less likely)
Testing hypothesis #1 first.
```

### 2. ACT

**Ask**: What specific action will test my hypothesis?

**Actions**:

- Execute a concrete, measurable action
- Use tools (run tests, check logs, query databases, read code)
- Make changes (code edits, config updates, environment tweaks)
- Document what you're doing

**Output**: The action taken and expected outcome

**Example**:

```text
ACT: Checking CI environment's installed packages
Command: docker exec ci-container pip list | grep module-x
Expected: If hypothesis #1 is correct, module-x won't appear
```

### 3. OBSERVE

**Ask**: What actually happened? Does it match expectations?

**Actions**:

- Record the actual results
- Compare to expected results
- Note any surprises or new information
- Collect relevant data (logs, error messages, metrics)

**Output**: Objective observation of results

**Example**:

```text
OBSERVE: Command output shows:
- module-x: NOT FOUND in pip list
- 15 other packages present
Result matches expectation - hypothesis #1 confirmed.
```

### 4. REFLECT

**Ask**: What did I learn? Should I continue, iterate, or conclude?

**Actions**:

- Evaluate if hypothesis was confirmed or rejected
- Decide next steps: fix the issue, test another hypothesis, or gather more data
- Document insights for future reference
- Consider if pattern is repeatable (could happen again?)

**Output**: Learning statement and decision

**Example**:

```text
REFLECT: Hypothesis confirmed - module-x missing from CI.
Learning: requirements.txt not being installed correctly in CI pipeline.
Decision: Fix Dockerfile to install requirements before tests.
Next: Implement fix and verify.
```

## Complete Example: Debugging a Memory Leak

### Iteration 1

**REASON**: Production server memory usage growing unbounded. Hypothesis: Memory leak in request handler not releasing resources.

**ACT**: Added memory profiling to production logs. Deployed monitoring for 1 hour.

**OBSERVE**: Memory increases 50MB per 1000 requests. Heap dump shows 10,000+ cached responses objects.

**REFLECT**: Hypothesis confirmed. Cache isn't evicting old entries. Need to add TTL or size limit.

### Iteration 2

**REASON**: Cache needs eviction policy. Hypothesis: LRU cache with 1000 entry limit
will prevent leak while maintaining performance.

**ACT**: Implemented LRU cache with max_size=1000. Deployed to staging.

**OBSERVE**: Memory stays flat at ~200MB even under load. Cache hit rate 85% (acceptable).

**REFLECT**: Solution works. Ready for production. Document cache configuration for future reference.

**RESULT**: Memory leak fixed. Pattern documented in decision records.

## Integration with Other Patterns

- **With Reflection Pattern**: Use Reflection at project/sprint boundaries;
  use ReAct during execution
- **With Tool Use Pattern**: ReAct ACT step leverages Tool Use guidelines
- **With Multi-agent Pattern**: Share ReAct reasoning with next agent in handoff

## Best Practices

### Do

- ✅ **Document each step** - Helps with handoffs and future debugging
- ✅ **Limit iterations** - If stuck after 3-4 loops, escalate or pivot approach
- ✅ **Test one variable** - Change one thing at a time to isolate cause
- ✅ **Be specific** - "Check logs" → "Check error logs from 14:00-14:15 UTC"
- ✅ **Update memory** - Store learnings in decision records (Phase 2)

### Don't

- ❌ **Skip reasoning** - Jumping to action leads to thrashing
- ❌ **Ignore observations** - If results surprise you, investigate why
- ❌ **Forget to reflect** - Reflection turns experience into knowledge
- ❌ **Get stuck in loops** - Set iteration limit, then change approach
- ❌ **Work in isolation** - Share reasoning with team/agents when helpful

## Measuring Success

### Individual Task Level

- Problem solved within 5 ReAct iterations: ✅ Good
- Required escalation after 5 iterations: 🟡 Acceptable (complex problem)
- Solved without reasoning documented: ❌ Pattern not followed

### Agent Performance Level (Phase 5)

- % of bugs fixed on first attempt (good reasoning)
- Average iterations per issue (efficiency)
- % of issues requiring escalation (complexity gauge)

## Tools for ReAct

Common tools used in ACT step:

- `grep` / `codebase_semantic_search` - Finding relevant code
- `read_files` - Understanding context
- `run_shell_command` - Testing hypotheses
- `edit_files` - Implementing fixes
- Git commands - Checking history, blame, diffs

## Templates

### Bug Fix Template

```markdown
## REASON
Problem: [describe bug]
Known facts: [list facts]
Hypotheses:
1. [most likely]
2. [possible]
3. [unlikely]
Testing #[X] first because [rationale]

## ACT
Action: [specific action]
Expected outcome: [what should happen]

## OBSERVE
Actual outcome: [what happened]
Matches expectation: [yes/no]
New information: [anything surprising]

## REFLECT
Hypothesis [confirmed/rejected]
Learning: [insight gained]
Next steps: [continue/iterate/escalate]
```

## Related Patterns

- [Planning Pattern](./planning-pattern.md) - For product/feature work
- [Reflection Pattern](./reflection-pattern.md) - For periodic self-evaluation
- [Tool Use Pattern](./tool-use-pattern.md) - Guidelines for ACT step
- [Multi-agent Pattern](./multi-agent-pattern.md) - Handoff protocols

## Further Reading

- Agentic Design Patterns PDF - Section on ReAct (resources/agentic-design-patterns/)
- [Yao et al. 2023 - ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)

---

**Pattern Version**: 1.0  
**Last Updated**: 2025-12-11  
**Maintained by**: CTO Agent
