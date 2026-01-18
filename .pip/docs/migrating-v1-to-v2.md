# Migrating from v1 to v2

This guide helps you upgrade from `.pip` v1.1.0 (and earlier) to v2.x.

## Overview of v2 Breaking Changes

v2.0 represents a significant architectural shift in how `.pip` is organized:

**v1.x (Before):** The `.pip` repository included both the framework kernel AND a public website/blog using GitHub Pages.

**v2.0 (Now):** The `.pip` repository is purely a **genome/kernel** focused on governance, patterns, fragments, and tooling. The website/blog has been extracted into a separate **organism** repository.

## What Changed

### Removed from v2
- Jekyll site files (Gemfile, _config.yml, _posts/, _layouts/, etc.)
- GitHub Pages publishing workflow
- Blog-specific assets and styling

### What Stays in v2
- All governance documentation (mission, method, agents)
- Pattern library and agentic design patterns
- Fragments system (nx-dev-infra, nx-product-surfaces, astro-blog)
- Bootstrap tooling and scripts
- All kernel functionality

## Migration Paths

### If You're Using .pip v1 as a Submodule

**Good news:** You likely don't need to change anything!

If you've been using `.pip` as a git submodule in your project (the recommended approach), just update your submodule reference:

```bash
# Update .pip submodule to v2
cd .pip
git fetch origin
git checkout main
git pull
cd ..
git add .pip
git commit -m "chore: update .pip submodule to v2"
```

Your project documentation lives in your organism's `docs/` directory, so the site extraction doesn't affect you.

### If You're Contributing to the .pip Kernel

**Action required:** The website is now in a separate repository.

1. **For website/blog contributions:**
   - Clone the new `pip-blog` organism repository (recommended name)
   - The blog organism includes `.pip` as a submodule for governance/tooling
   - Follow the organism's contribution guidelines

2. **For kernel contributions:**
   - Continue contributing to the main `pip` repository
   - Focus on governance, patterns, fragments, and tooling
   - No website-related files needed

### If You Forked .pip for Your Own Use

**Decision needed:** Choose your migration strategy.

**Option A: Switch to Submodule Approach (Recommended)**
```bash
# In your project
git submodule add https://github.com/derrybirkett/pip.git .pip

# Bootstrap your organism docs
./.pip/bin/bootstrap-project.sh

# Migrate your custom content to organism docs/
# Keep your customizations in docs/, use .pip/ as immutable reference
```

**Option B: Continue with Fork (Advanced)**
```bash
# Pull v2 changes from upstream
git remote add upstream https://github.com/derrybirkett/pip.git
git fetch upstream
git merge upstream/main

# Resolve conflicts (website files removed)
# Keep your organism-specific customizations separate from kernel
```

## Feature Parity

v2 doesn't remove any kernel functionality. Everything that worked in v1 still works:

| Feature | v1 | v2 | Notes |
|---------|----|----|-------|
| Agent governance | ✅ | ✅ | Unchanged |
| Pattern library | ✅ | ✅ | Unchanged |
| Fragments system | ✅ | ✅ | Unchanged |
| Bootstrap tooling | ✅ | ✅ | Enhanced with `.piprc` |
| Activity log | ✅ | ✅ | Unchanged |
| Changelog | ✅ | ✅ | Unchanged |
| Website/blog | ✅ | ➡️ | Moved to organism |

## New in v2

### First-Class Organism Configuration

v2 introduces `.piprc` for explicit organism configuration:

```bash
# Create/upgrade .piprc
pip migrate

# View current execution modes
pip mode
```

### Execution Modes

Control agent behavior with explicit modes:

**PIP_MODE:**
- `observe` - Read-only, no side effects
- `propose` - Suggest changes without executing
- `execute` - Permit side-effecting operations

**PIP_ACTION_MODE:**
- `live` - Execute immediately (default)
- `confirm` - Prompt before side effects
- `dry-run` - Block side effects, support wrap-up preview

Example:
```bash
# Safe exploration mode
PIP_MODE=observe pip review

# Execute with confirmation prompts
PIP_MODE=execute PIP_ACTION_MODE=confirm pip apply nx-dev-infra

# Dry-run wrap-up process
PIP_MODE=execute PIP_ACTION_MODE=dry-run pip wrap
```

### Nx Workspace Wrappers

Kernel scripts now have Nx targets for better DX:

```bash
# Old way
./bin/test-bootstrap.sh

# New way (still works, but Nx available too)
nx run pip:test-bootstrap
```

## Timeline

- **v1.1.0** (Dec 30, 2025) - Last release with integrated site
- **v2.0** (Jan 5, 2026) - Site extraction complete

## Getting Help

- **Issues:** [GitHub Issues](https://github.com/derrybirkett/pip/issues)
- **Discussions:** Check the repo for discussion threads
- **Examples:** See `pip-blog` organism for reference implementation

## Summary

**For most users:** Update your `.pip` submodule reference and continue working normally.

**Key insight:** v2 makes the genome/organism model explicit. The kernel (genome) provides patterns and tooling, while organisms (your projects) provide content and customization. This separation creates a cleaner architecture for both.
