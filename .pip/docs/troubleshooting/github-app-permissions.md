# GitHub App Workflow Permissions Issue

## Problem

Autonomous roadmap agent fails with error:
```
! [remote rejected] automated/implement-72 -> automated/implement-72 
(refusing to allow a GitHub App to create or update workflow 
`.github/workflows/autonomous-roadmap-agent.yml` without `workflows` permission)
```

## Root Cause

The GitHub token used by the autonomous agent lacks the `workflows` permission needed to modify files in `.github/workflows/`.

## Solutions

### Option 1: Update Workflow Permissions (Recommended)

Add `actions: write` permission to the workflow:

```yaml
# .github/workflows/autonomous-roadmap-agent.yml
jobs:
  implement-roadmap-task:
    permissions:
      issues: write
      pull-requests: write
      contents: write
      actions: write  # Add this line
```

### Option 2: Use Personal Access Token

1. Create PAT with `workflow` scope:
   ```bash
   # Go to: https://github.com/settings/tokens
   # Create token with: repo, workflow, project scopes
   ```

2. Add as repository secret:
   ```bash
   gh secret set GH_PROJECT_TOKEN --body "ghp_your_token_here"
   ```

3. Update workflow to use PAT:
   ```yaml
   - name: Checkout repository
     uses: actions/checkout@v4
     with:
       token: ${{ secrets.GH_PROJECT_TOKEN }}
   
   - name: Run autonomous agent
     env:
       GITHUB_TOKEN: ${{ secrets.GH_PROJECT_TOKEN }}  # Use PAT
   ```

### Option 3: Exclude Workflow Files

If agents shouldn't modify workflows, add exclusion to agent script:

```javascript
// In autonomous-agent.js
const EXCLUDED_PATHS = [
  '.github/workflows/',
  '.github/actions/',
  'secrets/',
];

function isPathAllowed(filePath) {
  return !EXCLUDED_PATHS.some(excluded => filePath.startsWith(excluded));
}
```

## Prevention

1. **Review issue requirements** before agent implementation
2. **Use least-privilege permissions** for automation
3. **Document permission requirements** in agent setup
4. **Test with dry-run mode** before production

## Related Issues

- Issue #72: Agent file path handling (triggered this error)
- COO responsibilities: Workflow monitoring and remediation

## References

- [GitHub Actions Permissions](https://docs.github.com/en/actions/security-guides/automatic-token-authentication#permissions-for-the-github_token)
- [COO Workflow Monitoring Playbook](../ia/agents/coo/workflow-monitoring-playbook.md)