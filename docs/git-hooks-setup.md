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

**⚠️ WARNING**: Only use `--no-verify` in true emergencies and ensure you follow up with proper process.

## Related Files

- `.github/scripts/pre-commit-hook.sh` - The pre-commit hook source
- `.github/scripts/install-git-hooks.sh` - Hook installation script
- `docs/git-hooks-setup.md` - This documentation
- `AGENTS.md` - Agent guidelines (references feature branch workflow)