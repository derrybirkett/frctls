# Wrap-Up Process

This checklist (owned by the COO) guides you through the final steps before completing work on a feature or fix. Use `bin/wrap-up.sh` (triggered whenever someone says “ok wrap up”) to walk through these steps interactively.

## What is "Wrap-Up"?

Wrap-up is the process of finishing your work properly before moving on:
1. Document what changed and why
2. Merge and tag your work
3. Communicate the changes to users (if applicable)
4. Prepare for next steps

## Wrap-Up Checklist

### 1. Testing & Quality
- [ ] All tests passing (unit, integration, E2E)
- [ ] Code linted and formatted
- [ ] Type checking passes (if applicable)
- [ ] Security scan completed (no new vulnerabilities)
- [ ] Manual testing completed for critical flows
- [ ] Performance impact assessed (if applicable)

### 2. Documentation

#### Activity Log
- [ ] Update `.pip/docs/activity-log.md`
- [ ] Add row with: date, agent/person, commit/PR, what changed, why, links
- [ ] Keep rationale concise and actionable

Example:
```markdown
| 2025-11-28 | CTO | feat/auth-flow | Added OAuth login | User request for SSO | #123, .pip/docs/... |
```

#### Changelog
- [ ] Update `.pip/docs/changelog.md` if user-facing
- [ ] Add to "Unreleased" section or create new dated section
- [ ] Categorize: Added, Changed, Fixed, Security
- [ ] Write from user perspective (not implementation details)

Example:
```markdown
## 2025-11-28 — OAuth Login Support
### Added
- OAuth login with Google and GitHub
- Single sign-on for enterprise accounts
```

#### Code Documentation
- [ ] Update README if setup steps changed
- [ ] Update API docs if endpoints changed
- [ ] Add inline comments for complex logic
- [ ] Update architecture diagrams if structure changed

### 3. Blog Post (if applicable)

Blog posts are required for:
- New features visible to users
- Major improvements or changes
- Milestone releases

- [ ] Draft blog post in `.pip/docs/blog/` or actual blog location
- [ ] Include: what, why, how to use, screenshots/demos
- [ ] Get review from CMO (and CTO for technical posts)
- [ ] Link to changelog and documentation
- [ ] Schedule or publish

### 4. Version Control

#### Commit & Push
- [ ] All changes committed
- [ ] Commit messages are clear and reference issues
- [ ] Branch pushed to remote

#### PR & Review
- [ ] PR created with proper template
- [ ] PR description includes: goal, scope, testing, risks
- [ ] Screenshots or demo included (if UI changes)
- [ ] Linked issues and related docs
- [ ] Required approvals obtained (see CONTRIBUTING.md)
- [ ] CI checks passing

#### Merge & Tag
- [ ] PR approved and merged to main
- [ ] Create git tag for release (if applicable): `git tag -a v1.2.3 -m "Release description"`
- [ ] Push tags: `git push --tags`
- [ ] Delete feature branch (if done)

### 5. Communication & Next Steps

#### Stakeholder Communication
- [ ] Notify relevant stakeholders of completion
- [ ] Update Linear/issue tracker status
- [ ] Close related issues

#### Next Steps
- [ ] Identify follow-up work (if any)
- [ ] Create issues for known limitations or future improvements
- [ ] Update roadmap or backlog
- [ ] Plan monitoring and feedback collection

### 6. Cleanup
- [ ] Remove debug code and console logs
- [ ] Clean up test data (if applicable)
- [ ] Archive or remove temporary resources
- [ ] Update dependencies if security patches available

## Quick Reference

### For Small Changes (Bug fixes, minor improvements)
Minimum requirements:
- Activity log updated
- Tests passing
- PR merged

### For Features
Required:
- Activity log updated
- Changelog updated
- Blog post written (if user-facing)
- Tests passing
- PR merged and tagged

### For Major Releases
Full wrap-up:
- All above +
- Announcement prepared (email, social, etc.)
- Documentation reviewed and updated
- Migration guide (if breaking changes)
- Rollback plan documented

## Common Pitfalls

❌ **Don't:**
- Commit without updating activity log
- Merge without changelog entry for user-facing changes
- Skip blog post for significant features
- Forget to tag releases
- Leave TODOs or debug code in production

✅ **Do:**
- Update docs before merging
- Write changelog from user perspective
- Link everything (commits → issues → docs → blog)
- Plan next steps before closing out
- Celebrate completed work!

## Agent Automation Reminders

When working with AI agents:
- Agents should perform wrap-up steps automatically unless told otherwise
- Activity log and changelog are required before merge
- Blog posts should be drafted (not just outlined)
- Tags should be created for releases
- Agents should verify all checklist items before declaring work complete
