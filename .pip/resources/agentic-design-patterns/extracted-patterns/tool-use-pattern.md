# Tool Use Pattern

**Type**: Action Execution Pattern  
**Source**: Agentic Design Patterns (Page references TBD after detailed extraction)  
**Agent Roles**: All agents (especially CTO)

## Overview

The Tool Use Pattern involves agents determining which tools to use, how to use them, and when to combine multiple tools to accomplish a task. Rather than agents attempting everything directly, they leverage specialized tools that extend their capabilities.

The pattern follows:
**Identify Need → Select Tool → Configure → Execute → Validate → Chain (if needed)**

This pattern is particularly effective for:
- Interacting with external systems (APIs, databases, CLIs)
- Performing specialized operations (code execution, file manipulation, data processing)
- Extending agent capabilities beyond core reasoning
- Composing complex workflows from simpler tools

## When to Use

### Use Tool Use when:
- **External interaction needed**: Access systems beyond agent's direct control
- **Specialized capability required**: Task needs domain-specific functionality
- **Efficiency matters**: Tool is faster/better than agent doing it manually
- **Reliability important**: Tool has error handling and validation
- **Composition beneficial**: Multiple tools can be chained together

### Examples:
- CTO using `git` CLI to manage version control
- CTO using `pnpm test` to run test suites
- COO using Linear API to track tasks
- CISO using security scanning tools
- Any agent using file system operations

## How It Works

### 1. IDENTIFY NEED
**Purpose**: Recognize what capability is required

**Questions to answer**:
- What do I need to accomplish?
- Can I do this directly or do I need a tool?
- What constraints exist (permissions, environment)?
- What's the expected output?

**Output**: Clear statement of required capability

**Example (CTO needs to run tests)**:
```markdown
NEED IDENTIFICATION:

Goal: Verify code changes don't break existing functionality
Capability needed: Execute test suite
Constraints:
- Must run all unit and E2E tests
- Need to see pass/fail for each test
- Should happen before committing
Current state: Changes made to auth module

CONCLUSION: Need test execution tool
```

### 2. SELECT TOOL
**Purpose**: Choose the right tool for the job

**Selection criteria**:
- **Availability**: Is the tool installed/accessible?
- **Capability match**: Does it do exactly what's needed?
- **Reliability**: Is it well-tested and stable?
- **Tech stack alignment**: Preferred tool per project standards?
- **Experience**: Have we used it successfully before?

**Output**: Chosen tool with rationale

**Example (CTO selecting test tool)**:
```markdown
TOOL SELECTION:

Options:
1. `pnpm test` - Project's configured test runner
2. `nx test` - Nx workspace test runner (if using Nx)
3. `vitest` - Direct test framework invocation
4. Manual testing - Click through app

Evaluation:
- pnpm test: ✓ Configured, ✓ Reliable, ✓ Recommended in tech stack
- nx test: ✓ Available (if Nx), ✓ Good for monorepo
- vitest: ✓ Available but bypasses npm scripts
- Manual: ✗ Slow, ✗ Not repeatable, ✗ Misses edge cases

DECISION: Use `pnpm test`
RATIONALE: Standard approach per project conventions
```

### 3. CONFIGURE
**Purpose**: Set up tool parameters and environment

**Configuration aspects**:
- **Arguments**: What flags and parameters to pass?
- **Environment**: What variables or setup needed?
- **Context**: What directory or state required?
- **Output format**: How should results be returned?

**Output**: Configured tool invocation

**Example (CTO configuring test run)**:
```markdown
CONFIGURATION:

Command: pnpm test
Arguments:
- `--run` - Don't watch, exit after running
- `--coverage` - Generate coverage report
- `--reporter=verbose` - Detailed output

Environment:
- Working directory: /Users/dbrktt/Sites/project
- NODE_ENV: test
- CI: false (running locally)

Expected output:
- Exit code: 0 (success) or 1 (failure)
- STDOUT: Test results with pass/fail per test
- Coverage report: coverage/index.html

FULL COMMAND: pnpm test --run --coverage --reporter=verbose
```

### 4. EXECUTE
**Purpose**: Run the tool and capture results

**Execution considerations**:
- **Error handling**: What if tool fails?
- **Timeout**: How long should it run?
- **Output capture**: Save STDOUT/STDERR?
- **Side effects**: What might this change?

**Output**: Tool execution results

**Example (CTO running tests)**:
```markdown
EXECUTION:

$ pnpm test --run --coverage --reporter=verbose

[TOOL OUTPUT]
✓ src/auth/login.test.ts (3 tests) 234ms
  ✓ should authenticate valid user
  ✓ should reject invalid password
  ✓ should handle network errors

✓ src/auth/signup.test.ts (2 tests) 187ms
  ✓ should create new user
  ✓ should validate email format

✗ src/auth/session.test.ts (2 tests) 145ms
  ✓ should create session token
  ✗ should expire old sessions
    Expected: 401 Unauthorized
    Received: 200 OK

Test Suites: 2 passed, 1 failed, 3 total
Tests: 5 passed, 1 failed, 6 total
Coverage: 87.3% statements, 82.1% branches

EXIT CODE: 1 (FAILED)
```

### 5. VALIDATE
**Purpose**: Confirm tool produced expected results

**Validation checks**:
- **Success indicator**: Did tool complete successfully?
- **Output correctness**: Is output in expected format?
- **Side effects**: Did intended changes occur?
- **Error cases**: If failed, why?

**Output**: Success/failure determination with next steps

**Example (CTO validating test results)**:
```markdown
VALIDATION:

Exit code: 1 (FAILED) ✗
- Tool executed successfully (not a tool error)
- Results are in expected format ✓
- Problem: 1 test failing (session expiry test)

Analysis:
- 5/6 tests passing (83.3%)
- Failure in src/auth/session.test.ts
- Issue: Session expiry not working correctly
- NOT a test framework problem
- IS a code bug needing fix

CONCLUSION: Tool worked correctly, revealed real bug
NEXT STEP: Fix session expiry logic, re-run tests
```

### 6. CHAIN (if needed)
**Purpose**: Combine multiple tools to accomplish complex tasks

**Chaining strategies**:
- **Sequential**: Output of tool A feeds into tool B
- **Conditional**: Use tool B only if tool A succeeds/fails
- **Parallel**: Run multiple tools simultaneously
- **Iterative**: Repeat tool until condition met

**Output**: Orchestrated tool workflow

**Example (CTO chaining tools for deployment)**:
```markdown
TOOL CHAIN: Deploy to Production

1. VALIDATE CODE
   Tool: pnpm test
   Condition: Must pass (exit 0)
   On failure: STOP, fix tests

2. BUILD ARTIFACTS
   Tool: pnpm build
   Condition: After tests pass
   On failure: STOP, fix build

3. SECURITY SCAN
   Tool: pnpm audit
   Condition: After build complete
   On failure: STOP, fix vulnerabilities

4. DEPLOY
   Tool: ./bin/deploy.sh production
   Condition: After security scan passes
   On failure: ROLLBACK

5. SMOKE TEST
   Tool: curl https://app.com/health
   Condition: After deploy complete
   On failure: ROLLBACK

6. NOTIFY
   Tool: Linear API - update ticket status
   Condition: After smoke test passes
   On failure: Alert team

EXECUTION:
1. pnpm test → ✓ PASS
2. pnpm build → ✓ PASS
3. pnpm audit → ✓ PASS
4. ./bin/deploy.sh production → ✓ PASS
5. curl health endpoint → ✓ 200 OK
6. Update Linear MSTUDIO-56 → ✓ Complete

RESULT: Deployment successful ✓
```

## Example: Full Tool Use Cycle

**Scenario**: CTO needs to check git status before committing

### 1. Identify Need
```markdown
NEED: Know which files changed before committing
CAPABILITY: View git working directory status
```

### 2. Select Tool
```markdown
OPTIONS: git status, git diff, ls -la
CHOICE: git status
RATIONALE: Standard tool for this exact use case
```

### 3. Configure
```markdown
COMMAND: git status --short --branch
FLAGS:
- --short: Compact output
- --branch: Show branch info
```

### 4. Execute
```markdown
$ git status --short --branch

## main...origin/main [ahead 1]
 M src/auth.ts
 M tests/auth.test.ts
?? docs/auth-readme.md
```

### 5. Validate
```markdown
OUTPUT: ✓ Shows 2 modified, 1 untracked file
CONCLUSION: Ready to stage and commit these changes
```

### 6. Chain (next tools)
```markdown
1. git add src/auth.ts tests/auth.test.ts docs/auth-readme.md
2. git commit -m "feat: add session expiry"
3. git push origin main
```

## Benefits

### For Agents
- **Extended capabilities**: Do things beyond core reasoning
- **Efficiency**: Tools faster than manual approaches
- **Reliability**: Tools have built-in error handling
- **Standardization**: Consistent way to accomplish tasks

### For Projects
- **Automation**: Chain tools into complex workflows
- **Repeatability**: Same tools = same results
- **Integration**: Connect to external systems
- **Productivity**: Agents accomplish more with tools

### For Teams
- **Shared tooling**: Common tools across agents
- **Knowledge capture**: Tool usage patterns documented
- **Onboarding**: New agents learn tool repertoire
- **Consistency**: Same approach to common tasks

## Limitations

### When NOT to Use Tools
- **Simple reasoning**: Direct answer faster than tool invocation
- **Tool unavailable**: Not installed or accessible
- **Excessive overhead**: Tool setup more work than manual approach
- **Unclear results**: Tool output ambiguous or unreliable

### Trade-offs
- **Dependencies**: Tools must be installed and maintained
- **Learning curve**: Each tool has its own interface
- **Version drift**: Tool updates can break workflows
- **Abstraction leaks**: Tool failures need debugging

### Common Pitfalls
- **Wrong tool**: Using hammer when need screwdriver
- **Unconfigured tool**: Missing required parameters
- **Ignoring errors**: Tool fails silently
- **Over-chaining**: Complex workflows hard to debug
- **Security risks**: Running untrusted tools with sensitive data

## Related Patterns

### Complements
- **ReAct Pattern**: Reasoning determines which tool to use
- **Planning Pattern**: Plan includes which tools needed when
- **Multi-Agent Collaboration**: Agents share tool knowledge

### Builds On
- **Command execution**: Basic ability to run commands
- **API interaction**: Calling external services

### Enables
- **Workflow automation**: Tools combined into pipelines
- **External integration**: Connect agents to systems
- **Specialized capabilities**: Domain-specific functionality

## Tool Categories

### 1. Version Control
```bash
# Git - Code versioning
git status
git add <files>
git commit -m "message"
git push origin <branch>
git checkout -b <branch>
```

### 2. Package Management
```bash
# pnpm - Node.js packages
pnpm install
pnpm add <package>
pnpm test
pnpm build

# pip - Python packages
pip install <package>
pip list
```

### 3. Testing
```bash
# Vitest - Unit testing
pnpm test
pnpm test:coverage
pnpm test --watch

# Playwright - E2E testing
pnpm exec playwright test
pnpm exec playwright codegen
```

### 4. Build & Deploy
```bash
# Build tools
pnpm build
nx build <project>

# Deployment
./bin/deploy.sh <environment>
docker build -t <image> .
docker compose up -d
```

### 5. Code Quality
```bash
# Linting
pnpm lint
eslint <file>

# Type checking
tsc --noEmit
pnpm typecheck

# Security
pnpm audit
npm audit fix
```

### 6. File Operations
```bash
# Reading
cat <file>
head -n 20 <file>
tail -n 50 <file>

# Searching
grep -r "pattern" <dir>
find . -name "*.ts"

# Manipulation
mkdir -p <dir>
cp <source> <dest>
mv <source> <dest>
rm <file>
```

### 7. APIs & External Services
```bash
# HTTP requests
curl -X GET https://api.example.com/resource
curl -X POST -H "Content-Type: application/json" -d '{"key":"value"}' https://api.example.com

# Linear CLI (if available)
linear issue create --title "Bug" --description "Details"
linear issue update ISSUE-123 --state "Done"

# GitHub CLI
gh pr create --title "Feature" --body "Description"
gh issue list --state open
```

### 8. Database
```bash
# Supabase CLI
supabase db push
supabase db reset
supabase gen types typescript

# PostgreSQL
psql -d database -c "SELECT * FROM users"
pg_dump database > backup.sql
```

### 9. Monitoring & Logs
```bash
# Process monitoring
ps aux | grep node
top
htop

# Logs
tail -f /var/log/app.log
docker logs <container>
```

### 10. Custom Project Scripts
```bash
# Project-specific automation
./bin/setup.sh
./bin/linear-sync.sh
./bin/wrap-up.sh
./bin/react-cycle.sh
```

## Automation Opportunities

### Tool Discovery
```bash
# bin/discover-tools.sh

echo "=== AVAILABLE TOOLS ==="

echo "Version Control:"
command -v git && echo "  ✓ git $(git --version)"

echo "Package Managers:"
command -v pnpm && echo "  ✓ pnpm $(pnpm --version)"
command -v npm && echo "  ✓ npm $(npm --version)"

echo "Testing:"
command -v playwright && echo "  ✓ playwright"

echo "Database:"
command -v supabase && echo "  ✓ supabase $(supabase --version)"
command -v psql && echo "  ✓ psql"

echo "APIs:"
command -v gh && echo "  ✓ GitHub CLI"
command -v linear && echo "  ✓ Linear CLI"
```

### Tool Wrapper
```bash
# bin/safe-tool.sh

TOOL=$1
shift
ARGS=$@

echo "=== EXECUTING TOOL ==="
echo "Tool: $TOOL"
echo "Args: $ARGS"
echo "Working dir: $(pwd)"
echo ""

# Dry run option
if [ "$DRY_RUN" = "true" ]; then
    echo "[DRY RUN] Would execute: $TOOL $ARGS"
    exit 0
fi

# Execute with timeout and error capture
timeout 300 $TOOL $ARGS
EXIT_CODE=$?

echo ""
echo "=== RESULT ==="
echo "Exit code: $EXIT_CODE"

if [ $EXIT_CODE -eq 0 ]; then
    echo "Status: SUCCESS ✓"
else
    echo "Status: FAILED ✗"
    echo "Check output above for errors"
fi

exit $EXIT_CODE
```

### Tool Chain Orchestrator
```bash
# bin/run-chain.sh

CHAIN_FILE=$1

echo "=== TOOL CHAIN ORCHESTRATOR ==="
echo "Chain: $CHAIN_FILE"
echo ""

# Read chain definition (JSON format)
# {
#   "steps": [
#     { "name": "test", "tool": "pnpm", "args": ["test"], "stopOnFail": true },
#     { "name": "build", "tool": "pnpm", "args": ["build"], "stopOnFail": true }
#   ]
# }

for step in $(jq -c '.steps[]' $CHAIN_FILE); do
    NAME=$(echo $step | jq -r '.name')
    TOOL=$(echo $step | jq -r '.tool')
    ARGS=$(echo $step | jq -r '.args | join(" ")')
    STOP_ON_FAIL=$(echo $step | jq -r '.stopOnFail')
    
    echo "Step: $NAME"
    echo "Running: $TOOL $ARGS"
    
    $TOOL $ARGS
    EXIT_CODE=$?
    
    if [ $EXIT_CODE -ne 0 ] && [ "$STOP_ON_FAIL" = "true" ]; then
        echo "❌ Step $NAME failed, stopping chain"
        exit $EXIT_CODE
    elif [ $EXIT_CODE -ne 0 ]; then
        echo "⚠️  Step $NAME failed, continuing..."
    else
        echo "✓ Step $NAME complete"
    fi
    echo ""
done

echo "=== CHAIN COMPLETE ==="
```

## Implementation in .pip

### Tool Registry
Document available tools:
```markdown
# ia/tools/tool-registry.md

## Version Control
- git: Code versioning and collaboration
- Requires: Git installed
- Docs: `man git`, `git --help`

## Testing
- pnpm test: Run test suite
- Requires: pnpm, test framework configured
- Docs: See package.json scripts

## Linear Integration
- Linear MCP: Create/update tickets
- Requires: Linear API token in .envrc
- Docs: docs/linear-integration.md
```

### For CTO Agent
Primary tool user:
- Use git for version control
- Use pnpm for package management
- Use testing tools before commits
- Use build tools before deployment
- Chain tools into development workflows

### For CPO Agent
Product-focused tools:
- Use Linear API to track features
- Use analytics tools to measure adoption
- Use documentation tools to capture requirements

### For COO Agent
Operations tools:
- Use Linear API to manage workflow
- Use monitoring tools to track progress
- Use automation scripts to reduce toil

### Tool Selection Framework
```markdown
WHEN to use a tool:
1. Task requires external system interaction
2. Tool provides specialized capability
3. Tool is reliable and well-tested
4. Tool aligns with tech stack

WHICH tool to choose:
1. Check tool-registry.md for recommended tools
2. Prefer tools already in tech stack
3. Select based on capability match
4. Consider reliability and experience

HOW to use safely:
1. Understand tool's purpose and capabilities
2. Configure parameters correctly
3. Validate expected output
4. Handle errors appropriately
5. Document usage patterns
```

## Further Reading

- Tool use in AI: [Toolformer](https://arxiv.org/abs/2302.04761)
- API design: [REST API Best Practices](https://restfulapi.net/)
- CLI design: [Command Line Interface Guidelines](https://clig.dev/)
- Agentic Design Patterns PDF: Advanced tool composition
- `ia/agents/cto/tech-stack/`: Recommended tools per domain

## Changelog

- **2025-12-17**: Initial extraction from Agentic Design Patterns PDF
- **Next**: Add tool registry with pip-specific tools
