# Git Hooks Setup

This document explains the git hooks setup for this project and how to ensure they're properly installed.

## Issue Discovered (RESOLVED)

During development, we discovered that git hooks were not enforcing the feature branch workflow. This has been **resolved** by implementing a repository-specific pre-commit hook.

**Solution:** The pre-commit hook is now version-controlled in `.github/scripts/` and can be installed via `install-git-hooks.sh`.

## What Git Hooks Do

The `.pip` framework includes git hooks that:
- **Prevent direct commits to `main` branch** - Enforces feature branch workflow
- **Check for secrets** - Prevents accidental commit of sensitive data (if git-secrets is installed)

## Installation

Git hooks are now maintained in this repository. Install them with:

```bash
# Install the pre-commit hook
.github/scripts/install-git-hooks.sh
```

This will:
- Copy the pre-commit hook to `.git/hooks/`
- Make it executable
- Block future direct commits to main
- Maintain git-secrets integration (if installed)

## Verification

Test that hooks are working:

```bash
# This should fail with an error message
echo "test" > test.txt
git add test.txt
git commit -m "test commit to main"

# Clean up
rm test.txt
git reset HEAD test.txt
```

## Proper Workflow

With hooks installed, use this workflow:

```bash
# Create feature branch
git checkout -b feat/your-feature

# Make changes and commit
git add .
git commit -m "your changes"

# Push and create PR
git push origin feat/your-feature
gh pr create
```

## Framework Status

✅ **RESOLVED**: Git hooks are now version-controlled in this repository and work independently of the `.pip` framework setup.

## Emergency Bypass

In rare emergencies, you can bypass hooks with:

```bash
git commit --no-verify -m "emergency commit"
```

**⚠️ WARNING**: Only use `--no-verify` in true emergencies.

### When to Use Emergency Bypass

Emergency bypass should only be used when:
- Production is down and a hotfix is critically urgent
- CI/CD pipeline is broken and blocking all work
- The hook itself is malfunctioning and needs immediate fix

### Post-Emergency Process

After making an emergency commit:

1. **Immediate notification**: Alert the team in your project chat/channel
2. **Create tracking issue**: Document why the bypass was necessary
3. **Create follow-up PR**: Move the emergency commit to a proper feature branch
4. **Request review**: Have at least one team member review the emergency changes
5. **Update runbook**: If this emergency type could recur, document the proper procedure

Example follow-up workflow:
```bash
# Create a proper feature branch from main
git checkout -b hotfix/emergency-followup main

# Cherry-pick the emergency commit
git cherry-pick <emergency-commit-sha>

# Create PR for review
gh pr create --title "Review: Emergency commit for [issue]"
```

**Remember**: Emergency bypasses compromise code quality gates. Every bypass should be reviewed and justified.

## Related Files

- `.github/scripts/pre-commit-hook.sh` - The pre-commit hook source
- `.github/scripts/install-git-hooks.sh` - Hook installation script
- `docs/git-hooks-setup.md` - This documentation
- `AGENTS.md` - Agent guidelines (references feature branch workflow)