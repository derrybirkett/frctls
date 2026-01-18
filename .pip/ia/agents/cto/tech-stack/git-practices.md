# Git Practices

## Branching Strategy

### Trunk-Based Development
We use trunk-based development with short-lived feature branches:
- **Main branch** (`main`) is always deployable
- Feature branches live 1-3 days maximum
- Merge to main multiple times per day/week
- No long-running development branches

### Branch Naming Conventions
- `feat/<short-desc>` — New features
- `fix/<short-desc>` — Bug fixes
- `docs/<area>` — Documentation updates
- `chore/<task>` — Maintenance, tooling, refactoring

Examples:
- `feat/oauth-login`
- `fix/session-timeout`
- `docs/api-reference`
- `chore/upgrade-deps`

### Branch Lifecycle

#### Creating a Branch
```bash
# Always branch from latest main
git checkout main
git pull origin main
git checkout -b feat/your-feature
```

#### Keeping Branch Updated
```bash
# Rebase on main regularly (daily for branches > 1 day old)
git checkout main
git pull origin main
git checkout feat/your-feature
git rebase main

# If conflicts occur, resolve them and continue
git add <resolved-files>
git rebase --continue
```

#### When to Branch
- ✅ **Do branch** for any code change (feature, fix, docs)
- ✅ **Do branch** even for small changes (enables review + CI)
- ❌ **Don't commit directly to main** (except emergencies with approval)

#### When to Delete
```bash
# After PR is merged
git checkout main
git pull origin main
git branch -d feat/your-feature  # Local delete
git push origin --delete feat/your-feature  # Remote delete (if not auto-deleted)
```

### Protected Branches

#### Main Branch Protection
- **Required**: PR approval before merge
- **Required**: All CI checks passing
- **Required**: Branch up to date with main
- **Blocked**: Force pushes
- **Blocked**: Direct commits

### Merge Strategies

#### Default: Squash and Merge
For most PRs, squash commits into a single commit on main:
```bash
# Via GitHub UI: "Squash and merge"
# Or locally:
git checkout main
git merge --squash feat/your-feature
git commit -m "feat: add oauth login (#123)"
```

**Benefits:**
- Clean, linear history on main
- Easy to revert entire features
- Commit messages stay focused

#### When to Use Merge Commit
For multi-contributor branches or when preserving history:
```bash
git checkout main
git merge --no-ff feat/your-feature
```

#### When to Rebase and Merge
For small, clean PRs with well-crafted commits:
```bash
# Rebase feature branch on main, then fast-forward merge
git checkout feat/your-feature
git rebase main
git checkout main
git merge --ff-only feat/your-feature
```

### Handling Conflicts

#### During Rebase
```bash
# 1. Start rebase
git rebase main

# 2. If conflicts, git will pause
# 3. Resolve conflicts in your editor
# 4. Stage resolved files
git add <resolved-files>

# 5. Continue rebase
git rebase --continue

# If you get stuck, abort and ask for help
git rebase --abort
```

#### During Merge
```bash
# 1. Attempt merge
git merge main

# 2. Resolve conflicts in your editor
# 3. Stage resolved files
git add <resolved-files>

# 4. Complete merge
git commit
```

### Hotfix Workflow

For urgent production fixes:

```bash
# 1. Branch from main (or production tag)
git checkout main
git pull origin main
git checkout -b fix/critical-bug

# 2. Make minimal fix
# 3. Test thoroughly
# 4. Create PR with "HOTFIX" label
# 5. Get expedited review
# 6. Merge and tag immediately
git tag -a v1.2.4 -m "Hotfix: critical bug"
git push --tags

# 7. Deploy
# 8. Update changelog and notify team
```

### Working with Feature Flags

For larger features, use feature flags to merge incomplete work:

```bash
# Merge to main behind feature flag
if (featureFlags.newDashboard) {
  // New code path
} else {
  // Existing code path
}

# Benefits:
# - Keep branches short-lived
# - Continuous integration
# - Test in production safely
# - Gradual rollout
```

## Commits

### Commit Message Format
```
<type>: <subject>

<body>

<footer>
```

**Type:**
- `feat` — New feature
- `fix` — Bug fix
- `docs` — Documentation
- `style` — Formatting, missing semicolons, etc.
- `refactor` — Code restructuring
- `perf` — Performance improvement
- `test` — Adding tests
- `chore` — Maintenance

**Subject:**
- Use imperative mood ("add" not "added")
- Lowercase first letter
- No period at end
- 50 characters or less

**Body (optional):**
- Explain what and why, not how
- Wrap at 72 characters
- Separate from subject with blank line

**Footer (optional):**
- Reference issues: `Closes #123` or `Refs #456`
- Breaking changes: `BREAKING CHANGE: ...`

### Examples

#### Good Commits
```
feat: add OAuth login with Google and GitHub

Users can now sign in using their Google or GitHub accounts.
This reduces friction in the signup flow and improves conversion.

Closes #123
```

```
fix: resolve session timeout on slow networks

Increased timeout from 30s to 60s and added retry logic.

Fixes #456
```

```
docs: update API authentication guide
```

#### Bad Commits
```
❌ "fixed bug" — Too vague
❌ "WIP" — Never commit WIP to main
❌ "Updates" — No context
❌ "feat: Add OAuth, refactor auth, update docs, fix tests" — Too many changes
```

### Commit Best Practices

- **Small and atomic** — One logical change per commit
- **Complete** — Each commit should leave the code in a working state
- **Reference issues** — Link to issue tracker (`#123`)
- **Test before committing** — Run tests locally
- **Don't commit secrets** — Use environment variables
- **Don't commit generated files** — Use `.gitignore`

## Pull Requests

### PR Template
Every PR should include:
- **Goal** — What are you trying to achieve?
- **Scope** — What changed? (files, systems, features)
- **Screenshots/Demo** — For UI changes
- **Test Plan** — How did you verify this works?
- **Risks** — What could go wrong?
- **Rollback Plan** — How to revert if needed?
- **Links** — Related issues, docs, designs

### PR Checklist
Before requesting review:
- [ ] Tests passing locally
- [ ] Code linted and formatted
- [ ] No console logs or debug code
- [ ] Documentation updated (README, API docs, etc.)
- [ ] Changelog updated (for user-facing changes)
- [ ] Activity log updated
- [ ] Screenshots included (for UI changes)
- [ ] Migration plan documented (for breaking changes)

### PR Size Guidelines

- **Small** (< 200 lines): Ideal, review in 15 min
- **Medium** (200-500 lines): Acceptable, review in 30 min
- **Large** (500-1000 lines): Consider splitting, review in 1 hour
- **XL** (> 1000 lines): Must split or justify, review in 2+ hours

**Tips to keep PRs small:**
- Break features into smaller steps
- Use feature flags for incomplete work
- Refactor in separate PRs
- Extract shared code first

### Review Process

#### Requesting Review
1. Self-review your changes first
2. Assign 1-2 reviewers based on scope (see CONTRIBUTING.md)
3. Add context in PR description
4. Respond to feedback promptly

#### Required Approvals
Depends on scope:
- **Product scope** → CPO approval
- **Technical/infra** → CTO approval
- **Security-impacting** → CTO + CISO approval
- **Messaging/marketing** → CMO approval
- **Pricing/packaging** → CRO approval
- **Cross-functional/mission** → CEO approval

#### Giving Feedback
- Be specific and actionable
- Distinguish between "must fix" and "nice to have"
- Assume good intent
- Prefer async discussion
- Avoid bikeshedding (nitpicking style)
- Approve quickly if changes are minor

#### Addressing Feedback
```bash
# Make requested changes
git add <files>
git commit -m "address review feedback"
git push origin feat/your-feature

# PR automatically updates
# Re-request review if needed
```

### Merging

1. Ensure all checks pass (CI, reviews, etc.)
2. Ensure branch is up to date with main
3. Use "Squash and merge" (default)
4. Edit commit message if needed
5. Delete branch after merge (auto or manual)

## Releases

### Semantic Versioning
Use `vMAJOR.MINOR.PATCH` format:
- **MAJOR** — Breaking changes (v2.0.0)
- **MINOR** — New features, backward compatible (v1.3.0)
- **PATCH** — Bug fixes (v1.2.1)

### Creating a Release

```bash
# 1. Ensure you're on main and up to date
git checkout main
git pull origin main

# 2. Update changelog
# Move items from "Unreleased" to dated version section
vim .pip/docs/changelog.md

# 3. Commit changelog
git add .pip/docs/changelog.md
git commit -m "chore: prepare v1.3.0 release"
git push origin main

# 4. Create annotated tag
git tag -a v1.3.0 -m "Release v1.3.0 - OAuth login and dashboard improvements"

# 5. Push tag
git push --tags

# 6. Create GitHub release (optional)
gh release create v1.3.0 --title "v1.3.0" --notes-file RELEASE_NOTES.md

# 7. Communicate release (blog post, email, etc.)
```

### Release Checklist
- [ ] All PRs for this release merged
- [ ] Changelog updated with user-facing changes
- [ ] Blog post drafted (for major/minor releases)
- [ ] Tests passing on main
- [ ] Tag created and pushed
- [ ] GitHub release created
- [ ] Stakeholders notified
- [ ] Deployed to production
- [ ] Post-deploy monitoring

## Best Practices Summary

### Do ✅
- Branch from main for every change
- Keep branches short-lived (< 3 days)
- Rebase on main regularly
- Write clear, atomic commits
- Reference issues in commits
- Self-review before requesting review
- Update docs and changelog
- Delete branches after merge
- Use feature flags for large features
- Tag releases with semantic versions

### Don't ❌
- Commit directly to main
- Create long-running feature branches
- Force push to shared branches
- Commit secrets or credentials
- Leave branches stale for weeks
- Merge without review
- Skip tests or linting
- Forget to update changelog
- Create giant PRs (> 1000 lines)
- Ignore merge conflicts

## Troubleshooting

### "My branch is behind main"
```bash
git checkout main
git pull origin main
git checkout feat/your-feature
git rebase main
```

### "I committed to main by accident"
```bash
# Create a branch with your changes
git branch feat/accidental-commit

# Reset main to remote
git checkout main
git reset --hard origin/main

# Switch to your new branch
git checkout feat/accidental-commit
```

### "I need to undo my last commit"
```bash
# Undo commit but keep changes
git reset --soft HEAD~1

# Undo commit and discard changes
git reset --hard HEAD~1
```

### "My PR has merge conflicts"
```bash
# Update your branch
git checkout feat/your-feature
git fetch origin
git rebase origin/main

# Resolve conflicts, then
git add <resolved-files>
git rebase --continue

# Force push (safe for your own branch)
git push --force-with-lease origin feat/your-feature
```

## Additional Resources

- [Trunk-Based Development](https://trunkbaseddevelopment.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Git Best Practices](https://git-scm.com/book/en/v2/Distributed-Git-Contributing-to-a-Project)

