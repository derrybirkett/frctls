# .pip Agentic Workflow - Setup Guide

Complete installation and configuration guide for AI-powered autonomous development.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Detailed Installation](#detailed-installation)
4. [Configuration](#configuration)
5. [Verification](#verification)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required

- **GitHub repository** with Actions enabled
- **OpenAI API key** - Get from [platform.openai.com](https://platform.openai.com/api-keys)
- **Node.js 20+** - For running agent scripts
- **pnpm 8+** - Or adapt to npm/yarn

### Optional

- Git hooks for branch enforcement
- Issue templates for roadmap tasks
- Branch protection rules

### Costs

**OpenAI API:**
- GPT-4 Turbo: ~$0.01 per 1K input tokens, ~$0.03 per 1K output tokens
- Estimated: $5-20/month for typical usage
- First-time users get free credits

**GitHub Actions:**
- Free tier: 2,000 minutes/month for private repos
- Public repos: Unlimited free
- Estimated usage: 600-800 minutes/month

## Quick Start

### 1. Copy Files

```bash
# Create .pip directory structure
mkdir -p .pip/{agents,workflows,docs}

# Copy from template or existing .pip installation
cp -r /path/to/.pip/agents .pip/
cp -r /path/to/.pip/workflows .pip/
cp -r /path/to/.pip/docs .pip/
```

### 2. Install Dependencies

```bash
cd .pip/agents
pnpm install
```

### 3. Configure

```bash
# Copy configuration template
cp .pip/agents/config.template.json .pip/agents/config.json

# Edit with your settings
nano .pip/agents/config.json
```

### 4. Set Secrets

```bash
# Set OpenAI API key
gh secret set OPENAI_API_KEY

# Verify
gh secret list
```

### 5. Install Workflows

```bash
# Copy to GitHub Actions
cp .pip/workflows/*.yml .github/workflows/

# Verify
gh workflow list
```

### 6. Create Labels

```bash
# Create required labels
gh label create roadmap --description "Approved roadmap tasks" --color 0E8A16
gh label create agent-suggestion --description "Agent-generated suggestions" --color FFA500
gh label create needs-approval --description "Requires CPO approval" --color FBCA04
gh label create priority-high --description "High priority" --color FF0000
gh label create priority-medium --description "Medium priority" --color FFAA00
gh label create priority-low --description "Low priority" --color 00FF00
```

### 7. Test

```bash
# Trigger autonomous agent manually
gh workflow run autonomous-roadmap-agent.yml -f priority=high

# Watch it run
gh run watch
```

## Detailed Installation

### Step 1: Repository Setup

1. **Enable GitHub Actions**
   - Settings → Actions → General
   - Allow all actions and reusable workflows

2. **Configure Permissions**
   - Settings → Actions → General → Workflow permissions
   - Select "Read and write permissions"
   - Check "Allow GitHub Actions to create and approve pull requests"

3. **Enable Auto-Merge (optional)**
   - Settings → General → Pull Requests
   - Check "Allow auto-merge"

### Step 2: OpenAI API Key

1. **Get API Key**
   - Visit [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Create new secret key
   - Copy the key (you won't see it again!)

2. **Set in GitHub**
   ```bash
   gh secret set OPENAI_API_KEY
   # Paste key when prompted
   ```

3. **Verify**
   ```bash
   gh secret list
   # Should show: OPENAI_API_KEY
   ```

### Step 3: Install Agent Scripts

1. **Copy Files**
   ```bash
   mkdir -p .pip/agents
   cp /path/to/.pip/agents/*.js .pip/agents/
   cp /path/to/.pip/agents/package.json .pip/agents/
   cp /path/to/.pip/agents/config.template.json .pip/agents/
   ```

2. **Install Dependencies**
   ```bash
   cd .pip/agents
   pnpm install
   ```

3. **Test Locally**
   ```bash
   # Test autonomous agent (will fail without GitHub context, but should load)
   node autonomous-agent.js
   
   # Expected: Error about missing environment variables (normal)
   ```

### Step 4: Configure Settings

1. **Copy Template**
   ```bash
   cp .pip/agents/config.template.json .pip/agents/config.json
   ```

2. **Edit Configuration**
   ```json
   {
     "ai_provider": {
       "type": "openai",
       "model": "gpt-4-turbo-preview",
       "api_key_env": "OPENAI_API_KEY",
       "temperature": {
         "implementation": 0.3,
         "review_cto": 0.2,
         "review_ciso": 0.1
       }
     },
     "review_agents": {
       "cto": {
         "enabled": true,
         "auto_create_issues": true,
         "review_criteria": ["code_quality", "architecture", "testing", "documentation"]
       },
       "ciso": {
         "enabled": true,
         "auto_create_issues": true,
         "scan_patterns": ["**/*.js", "**/*.ts", "**/*.py"]
       }
     },
     "autonomous_agent": {
       "schedule": "0 */6 * * *",
       "priority_filter": "all",
       "skip_labels": ["wip", "blocked"]
     },
     "auto_merge": {
       "enabled": true,
       "branch_pattern": "automated/*"
     },
     "product_workflow": {
       "cpo_triage_required": true,
       "approval_label": "roadmap",
       "suggestion_label": "agent-suggestion",
       "needs_approval_label": "needs-approval"
     }
   }
   ```

3. **Commit Configuration**
   ```bash
   git add .pip/agents/config.json
   git commit -m "feat: configure agentic workflow"
   ```

### Step 5: Install Workflows

1. **Copy Workflows**
   ```bash
   mkdir -p .github/workflows
   cp .pip/workflows/autonomous-roadmap-agent.yml .github/workflows/
   cp .pip/workflows/pr-review-agents.yml .github/workflows/
   ```

2. **Verify Installation**
   ```bash
   gh workflow list
   # Should show:
   # - Autonomous Roadmap Agent
   # - PR Review Agents
   ```

3. **Enable Workflows**
   ```bash
   gh workflow enable autonomous-roadmap-agent.yml
   gh workflow enable pr-review-agents.yml
   ```

### Step 6: Create Labels

Run the label creation script:

```bash
# Create all required labels
for label in "roadmap:0E8A16:Approved roadmap tasks" \
             "agent-suggestion:FFA500:Agent-generated suggestions" \
             "needs-approval:FBCA04:Requires CPO approval" \
             "priority-high:FF0000:High priority" \
             "priority-medium:FFAA00:Medium priority" \
             "priority-low:00FF00:Low priority" \
             "severity-critical:B60205:Critical security issue" \
             "severity-high:D93F0B:High severity issue" \
             "severity-medium:FBCA04:Medium severity issue" \
             "severity-low:0E8A16:Low severity issue"; do
  IFS=':' read -r name color desc <<< "$label"
  gh label create "$name" --description "$desc" --color "$color" || true
done
```

### Step 7: Optional - Git Hooks

1. **Copy Hook Script**
   ```bash
   cp .pip/docs/GIT-HOOKS.md docs/git-hooks-setup.md
   # Review and follow instructions
   ```

2. **Install Pre-Commit Hook**
   ```bash
   cp .github/scripts/pre-commit-hook.sh .git/hooks/pre-commit
   chmod +x .git/hooks/pre-commit
   ```

3. **Test Hook**
   ```bash
   # Try to commit on main (should block)
   git checkout main
   echo "test" >> test.txt
   git add test.txt
   git commit -m "test"
   # Expected: Error preventing commit to main
   
   # Clean up
   git restore test.txt
   ```

## Configuration

### Minimal Configuration

For basic usage, only configure:

```json
{
  "ai_provider": {
    "api_key_env": "OPENAI_API_KEY"
  },
  "autonomous_agent": {
    "schedule": "0 */6 * * *"
  }
}
```

### Recommended Configuration

For production use:

```json
{
  "ai_provider": {
    "type": "openai",
    "model": "gpt-4-turbo-preview",
    "temperature": {
      "implementation": 0.3,
      "review_cto": 0.2,
      "review_ciso": 0.1
    }
  },
  "review_agents": {
    "cto": { "enabled": true },
    "ciso": { "enabled": true }
  },
  "auto_merge": {
    "enabled": true,
    "branch_pattern": "automated/*"
  },
  "product_workflow": {
    "cpo_triage_required": true
  }
}
```

### Advanced Configuration

See [config.template.json](.pip/agents/config.template.json) for all options.

## Verification

### Test Autonomous Agent

1. **Create Test Issue**
   ```bash
   gh issue create \
     --title "Test: Add hello world script" \
     --body "Create a simple hello.js that logs 'Hello World'" \
     --label "roadmap,priority-high"
   ```

2. **Trigger Agent**
   ```bash
   gh workflow run autonomous-roadmap-agent.yml -f priority=high
   ```

3. **Watch Execution**
   ```bash
   gh run watch
   ```

4. **Verify Results**
   - Check for new branch: `git branch -r | grep automated`
   - Check for new PR: `gh pr list`
   - Check PR links to issue

### Test Review Agents

1. **Create Test PR**
   ```bash
   git checkout -b test/review-agents
   echo "console.log('test');" > test.js
   git add test.js
   git commit -m "test: add test file"
   git push -u origin test/review-agents
   gh pr create --title "Test PR" --body "Testing review agents"
   ```

2. **Check Reviews**
   ```bash
   # Wait ~2 minutes for agents to run
   gh pr view --json reviews
   ```

3. **Verify**
   - CTO review comment appears
   - CISO review comment appears
   - Issues created if suggestions/vulnerabilities found

### Test Auto-Merge

1. **Create Automated PR**
   ```bash
   git checkout -b automated/test-auto-merge
   echo "// Auto-merge test" > auto-merge-test.js
   git add auto-merge-test.js
   git commit -m "feat: test auto-merge"
   git push -u origin automated/test-auto-merge
   gh pr create --title "Auto-merge test" --body "Testing auto-merge"
   ```

2. **Wait for Reviews**
   - CTO and CISO agents review
   - If approved, PR auto-merges
   - If issues found, no auto-merge

3. **Verify**
   ```bash
   # Check if merged
   gh pr view <number>
   ```

## Troubleshooting

### Workflows Not Running

**Symptoms:** No workflow runs appear

**Solutions:**
```bash
# Check if workflows are enabled
gh workflow list

# Enable if disabled
gh workflow enable autonomous-roadmap-agent.yml

# Check permissions
# Settings → Actions → General → Workflow permissions
# Must be "Read and write permissions"
```

### Authentication Errors

**Symptoms:** Error about OPENAI_API_KEY

**Solutions:**
```bash
# Verify secret exists
gh secret list

# Reset if needed
gh secret set OPENAI_API_KEY

# Test in workflow
gh workflow run autonomous-roadmap-agent.yml
gh run watch
```

### No Issues Found

**Symptoms:** "No unassigned roadmap issues found"

**Solutions:**
```bash
# Check for roadmap issues
gh issue list --label "roadmap"

# Create test issue
gh issue create \
  --title "Test task" \
  --body "Test description" \
  --label "roadmap,priority-high"

# Run again
gh workflow run autonomous-roadmap-agent.yml -f priority=high
```

### Permission Denied Errors

**Symptoms:** Error creating branches/PRs

**Solutions:**
1. Settings → Actions → General → Workflow permissions
2. Select "Read and write permissions"
3. Check "Allow GitHub Actions to create and approve pull requests"
4. Save changes
5. Re-run workflow

### Reviews Not Creating Issues

**Symptoms:** Reviews run but no issues created

**Solutions:**
Check configuration:
```json
{
  "review_agents": {
    "cto": {
      "auto_create_issues": true  // Must be true
    },
    "ciso": {
      "auto_create_issues": true  // Must be true
    }
  }
}
```

### Auto-Merge Not Working

**Symptoms:** PR not merging automatically

**Check:**
```bash
# Is it an automated/* branch?
gh pr view <number> --json headRefName

# Did reviews pass?
gh pr view <number> --json reviews

# Are checks passing?
gh pr checks <number>

# Is auto-merge enabled in repo?
# Settings → General → Pull Requests
```

**Solutions:**
1. Use `automated/*` branch pattern
2. Ensure all checks pass
3. Enable auto-merge in repo settings
4. Check workflow permissions

## Next Steps

After installation:

1. **Read Documentation**
   - [CPO Triage Guide](.pip/docs/CPO-TRIAGE.md)
   - [Workflow Documentation](.pip/workflows/README.md)
   - [Git Hooks Setup](.pip/docs/GIT-HOOKS.md)

2. **Create Roadmap Issues**
   - Use issue templates
   - Label with `roadmap` and priority
   - Provide clear, actionable descriptions

3. **Monitor First Runs**
   - Watch workflow executions
   - Review generated code quality
   - Adjust configuration as needed

4. **Gradual Rollout**
   - Start with low-frequency runs (12-24 hours)
   - Enable one agent at a time
   - Increase automation as confidence grows

## Support

- **Documentation:** `.pip/docs/`
- **Issues:** GitHub Issues
- **Discussions:** GitHub Discussions
- **Examples:** See source repository

## License

MIT License - See LICENSE file
