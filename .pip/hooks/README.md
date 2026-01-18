# Git Hooks

This directory contains git hooks to enforce repository policies.

## Installation

Run the install script after cloning the repository:

```bash
./hooks/install-hooks.sh
```

This will copy hooks to `.git/hooks/` and make them executable.

## Available Hooks

### pre-commit

**Purpose**: Prevents direct commits to the `main` branch

This hook enforces the branching strategy documented in `WARP.md`:
- All changes must be made on feature branches
- Never commit directly to `main`
- Branch naming: `feat/`, `fix/`, `docs/`, `chore/`

**Error message when triggered**:
```
❌ ERROR: Direct commits to 'main' branch are not allowed!

Please use a feature branch instead:
  git checkout -b feat/your-feature
  # make your changes
  git add .
  git commit -m "your message"
```

Also runs `git-secrets` check if available to prevent committing secrets.

## Bypassing Hooks (Emergency Only)

In rare emergencies, you can bypass hooks with:

```bash
git commit --no-verify
```

**⚠️ WARNING**: Only use `--no-verify` if absolutely necessary and you understand the risks.

## GitHub Branch Protection

In addition to local hooks, the `main` branch should have the following protections enabled on GitHub:

1. **Require pull request reviews before merging**
   - At least 1 approval required
   - Dismiss stale reviews when new commits are pushed

2. **Require status checks to pass**
   - All CI checks must pass

3. **Require branches to be up to date before merging**

4. **Do not allow bypassing the above settings**
   - Even administrators should follow the process

5. **Require linear history**
   - Use squash merge or rebase to keep history clean

## Updating Hooks

If you modify hooks in this directory, run the install script again:

```bash
./hooks/install-hooks.sh
```

All team members should run the install script to get the latest hooks.

## For New Contributors

After cloning the repository:

1. Run `./hooks/install-hooks.sh`
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Make changes and commit to your branch
4. Push and create a PR
5. Never commit directly to `main`

See `WARP.md` for complete workflow documentation.
