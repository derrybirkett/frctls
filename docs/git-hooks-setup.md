# Git Hooks Setup

This document explains the git hooks setup for this project and how to ensure they're properly installed.

## Issue Discovered

During development, we discovered that the `.pip` framework's git hooks were not automatically installed during project bootstrapping. This allowed direct commits to the `main` branch, which violates the framework's intended workflow.

## What Git Hooks Do

The `.pip` framework includes git hooks that:
- **Prevent direct commits to `main` branch** - Enforces feature branch workflow
- **Check for secrets** - Prevents accidental commit of sensitive data (if git-secrets is installed)

## Manual Installation (Current Fix)

If git hooks aren't working, install them manually:

```bash
# Install the proper git hooks
.pip/hooks/install-hooks.sh
```

This will:
- Copy the pre-commit hook to `.git/hooks/`
- Make it executable
- Block future direct commits to main

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

## Framework Fix

This issue has been reported to the `.pip` framework. The bootstrap scripts should be updated to automatically install git hooks during project setup.

## Emergency Bypass

In rare emergencies, you can bypass hooks with:

```bash
git commit --no-verify -m "emergency commit"
```

**⚠️ WARNING**: Only use `--no-verify` in true emergencies and ensure you follow up with proper process.

## Related Files

- `.pip/hooks/install-hooks.sh` - Hook installation script
- `.pip/hooks/pre-commit` - The actual pre-commit hook
- `.pip/hooks/README.md` - Detailed hook documentation
- `.pip/CONTRIBUTING.md` - Framework contribution guidelines