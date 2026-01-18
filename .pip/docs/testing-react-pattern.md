# Testing the ReAct Pattern (v1.1.0-alpha)

Quick guide for testing the ReAct pattern in organism projects.

## Setup

### Option 1: Update Existing Organism

If you already have a project using `.pip` as a submodule:

```bash
cd your-organism-project
cd .pip
git fetch --tags
git checkout v1.1.0-alpha
cd ..
git add .pip
git commit -m "chore: update .pip to v1.1.0-alpha (ReAct pattern)"
```

### Option 2: New Organism Project

```bash
mkdir test-organism
cd test-organism
git init
git submodule add https://github.com/derrybirkett/pip.git .pip
cd .pip
git checkout v1.1.0-alpha
cd ..
```

## Test Scenario: Use ReAct for a Bug Fix

Pick a real bug or issue in your project and follow the ReAct pattern:

### 1. Read the Pattern

```bash
cat .pip/patterns/agent-workflows/react-pattern.md
```

Or view online: https://github.com/derrybirkett/pip/blob/v1.1.0-alpha/patterns/agent-workflows/react-pattern.md

### 2. Apply the Pattern

Create a document tracking your ReAct loops:

```bash
# In your project root (not .pip/)
cat > docs/react-test-$(date +%Y%m%d).md << 'EOF'
# ReAct Pattern Test - Bug Fix

## REASON
Problem: [describe the bug]
Known facts:
- [fact 1]
- [fact 2]
Hypotheses:
1. [most likely cause]
2. [possible cause]
3. [unlikely but possible]
Testing #1 first because: [rationale]

## ACT
Action: [what you're doing to test hypothesis]
Expected outcome: [what should happen]

## OBSERVE
Actual outcome: [what actually happened]
Matches expectation: [yes/no]
New information: [anything surprising]

## REFLECT
Hypothesis [confirmed/rejected]
Learning: [what did you learn]
Next steps: [continue/iterate/escalate]
EOF
```

### 3. Work Through the Bug

Follow the four-step loop:
1. **REASON** - Form hypotheses about the cause
2. **ACT** - Test your hypothesis (run code, check logs, etc.)
3. **OBSERVE** - Record what actually happened
4. **REFLECT** - Decide next steps

Document each iteration in your markdown file.

### 4. Gather Feedback

After completing the bug fix, evaluate the pattern:

**Useful?**
- Did explicit reasoning help you avoid thrashing?
- Did documenting observations clarify thinking?
- Did reflection help you learn?

**Improvements needed?**
- Too detailed? Too prescriptive?
- Missing important steps?
- Examples not clear enough?
- Template too rigid?

## Feedback Template

```markdown
## ReAct Pattern Feedback

**Bug/Issue**: [brief description]
**Time spent**: [duration]
**Iterations**: [how many REASON-ACT-OBSERVE-REFLECT loops]

### What Worked
- [what was helpful]

### What Didn't Work
- [what was confusing or unhelpful]

### Suggestions
- [ideas for improvement]

### Would Use Again?
[yes/no and why]
```

## Share Feedback

Post feedback in:
1. GitHub issue on pip repo
2. Comment on PR #14
3. Update this testing doc with learnings

## Expected Outcomes

**Success criteria**:
- ✅ Pattern helped avoid trial-and-error debugging
- ✅ Documentation made it easier to pick up later
- ✅ Reflection step captured learnings
- ✅ Template was useful (not burdensome)

**Failure criteria** (means we need to iterate):
- ❌ Pattern felt like busywork
- ❌ Too much overhead for simple bugs
- ❌ Didn't provide value over ad-hoc approach
- ❌ Hard to follow or understand

## Next Steps After Testing

Based on feedback:
1. **If successful** → Build Planning pattern (v1.1.1) for CPO agents
2. **If needs work** → Iterate on ReAct before adding more patterns
3. **If mixed** → Identify specific improvements, ship v1.1.0-beta

---

**Current Status**: v1.1.0-alpha released, awaiting feedback  
**Updated**: 2025-12-11
