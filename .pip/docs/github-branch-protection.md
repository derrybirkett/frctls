# GitHub Branch Protection Configuration

This document describes the branch protection rules that should be enabled on GitHub to prevent direct commits to `main` and enforce the PR workflow.

## Quick Setup

1. Go to: https://github.com/derrybirkett/pip/settings/branches
2. Click "Add rule" or edit existing rule for `main`
3. Configure settings as described below

## Required Settings

### Branch Name Pattern
```
main
```

### Protection Rules

#### ✅ Require a pull request before merging
- [x] **Require approvals**: 1
- [x] **Dismiss stale pull request approvals when new commits are pushed**
- [ ] Require review from Code Owners *(optional)*
- [x] **Require approval of the most recent reviewable push**

**Rationale**: Ensures all code is reviewed before merging. Stale approvals are dismissed to catch new changes.

#### ✅ Require status checks to pass before merging
- [x] **Require branches to be up to date before merging**
- Status checks to require:
  - **Docs hygiene** *(from `.github/workflows/validate-docs.yml` in bootstrapped projects)*
  - *(Add any additional CI/CD checks here as they're configured)*

**Rationale**: Prevents merging broken code and ensures compatibility with latest main.

#### ✅ Require conversation resolution before merging
- [x] **Enabled**

**Rationale**: All review comments must be addressed before merge.

#### ✅ Require signed commits
- [ ] *(Optional - enables GPG signature verification)*

**Rationale**: Adds extra security layer to verify commit authenticity.

#### ✅ Require linear history
- [x] **Enabled**

**Rationale**: Enforces squash or rebase merging for clean git history.

#### ✅ Require deployments to succeed before merging
- [ ] *(Optional - if using GitHub Deployments)*

**Rationale**: Ensures successful deployment before merging.

#### ⚠️ Do not allow bypassing the above settings
- [x] **Include administrators**

**Rationale**: Even repository admins must follow the process. No exceptions.

#### 🚫 Rules applied to everyone including administrators
- [x] **Restrict who can push to matching branches**
  - *Do not add any users/teams to the allowlist*

**Rationale**: Nobody (including admins) can push directly to main. ALL changes must go through PRs.

#### ✅ Allow force pushes
- [ ] **Disabled**

**Rationale**: Prevents rewriting history on main branch.

#### ✅ Allow deletions
- [ ] **Disabled**

**Rationale**: Prevents accidental deletion of main branch.

## Recommended Settings

### Merge Button Options

Go to: https://github.com/derrybirkett/pip/settings

Under "Pull Requests" section:

- [x] **Allow squash merging** ✅ (Default merge method)
  - Default to pull request title and commit details
- [ ] Allow merge commits ❌
- [ ] Allow rebase merging ❌
- [x] **Always suggest updating pull request branches**
- [x] **Automatically delete head branches**

**Rationale**: Squash merge creates clean git history. Auto-delete keeps repo tidy.

## Verification

After setup, try to push directly to main:

```bash
git checkout main
echo "test" >> test.txt
git add test.txt
git commit -m "test direct commit"
git push origin main
```

**Expected result**: GitHub should reject the push with an error like:
```
remote: error: GH006: Protected branch update failed
```

## Local Protection

In addition to GitHub settings, developers should install local git hooks:

```bash
./hooks/install-hooks.sh
```

This adds a pre-commit hook that blocks local commits to main before they even reach GitHub.

## Emergency Override

In rare emergencies where direct push to main is absolutely necessary:

1. Temporarily disable branch protection on GitHub
2. Push the urgent change
3. Re-enable branch protection immediately
4. Document the incident in activity log
5. Create a follow-up PR to formalize the change

**This should be extremely rare** - perhaps once or twice per year at most.

## Monitoring

Periodically verify settings are still in place:
- Monthly review of branch protection rules
- Check for any bypasses or overrides
- Audit git history for direct commits to main

## References

- [GitHub Branch Protection Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [WARP.md](../WARP.md) - Local workflow and branching strategy
- [hooks/README.md](../hooks/README.md) - Local git hooks documentation

---

**Last Updated**: 2025-12-09  
**Next Review**: 2025-12-16
