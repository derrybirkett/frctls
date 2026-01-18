# COO Agent Workflow

**Agent Role**: Chief Operating Officer  
**Primary Responsibility**: Delivery operations, release hygiene, wrap-up process  
**Key Patterns**: Multi-Agent Collaboration, Tool Use, Reflection

## Overview

The COO agent ensures work leaves the repository production-ready. The COO owns the "last mile" of delivery: merging PRs, updating documentation, coordinating releases, and verifying readiness. This workflow shows how to execute wrap-up operations efficiently and consistently.

## Core Pattern: Multi-Agent Collaboration

The COO primarily coordinates handoffs:
- **From CTO**: Code ready for merge
- **From CISO**: Security approval
- **From CPO**: Feature acceptance
- **To Users**: Production deployment

---

## Standard Wrap-Up Workflow

### Phase 1: Pre-Merge Verification

**Goal**: Verify work is complete and ready to merge

#### **Checklist**

Before accepting any work:

**From CTO (Technical Readiness)**:
- [ ] All tests passing (CI green)
- [ ] Code review approved
- [ ] No merge conflicts
- [ ] Branch is up to date with main

**From CISO (Security Readiness)**:
- [ ] Security review completed (if required)
- [ ] No secrets in code
- [ ] Dependencies scanned (no critical vulnerabilities)
- [ ] Security checklist signed off

**From CPO (Product Readiness)**:
- [ ] Acceptance criteria met
- [ ] Feature matches requirements
- [ ] UX approved (if applicable)

**Documentation Readiness**:
- [ ] Activity log updated
- [ ] Changelog updated (if user-facing)
- [ ] README updated (if setup changed)
- [ ] Code comments present

**Communication Readiness** (coordinate with CMO):
- [ ] Blog post written (if new feature)
- [ ] Release notes drafted
- [ ] Support team notified

---

### Phase 2: Merge to Main

**Goal**: Safely merge approved work

#### **Merge Process**

1. **Final Verification**
   ```bash
   # Check branch status
   git checkout <feature-branch>
   git pull origin <feature-branch>
   
   # Verify tests pass locally
   pnpm test
   pnpm typecheck
   pnpm lint
   
   # Check for conflicts
   git fetch origin main
   git merge origin/main
   # If conflicts: resolve, commit, push, re-verify
   ```

2. **Squash and Merge** (default strategy)
   - Keeps main history clean
   - All commits in feature become one commit
   - Use PR merge button (GitHub/GitLab)

3. **Verify Merge**
   ```bash
   # Switch to main
   git checkout main
   git pull origin main
   
   # Verify commit is present
   git log --oneline -n 5
   
   # Verify tests still pass
   pnpm test
   ```

4. **Tag Release** (if applicable)
   ```bash
   # For user-facing releases
   git tag -a v1.2.0 -m "Release v1.2.0: Authentication feature"
   git push --tags
   ```

---

### Phase 3: Update Documentation

**Goal**: Keep documentation in sync with code

#### **Activity Log Update**

**Required for every merge**:

```markdown
| Date | Agent | Commit/PR | What | Why | Links |
|------|-------|-----------|------|-----|-------|
| 2025-12-19 | CTO | #123 | Added Supabase auth | Enable paid tier per roadmap | lib/auth/ |
```

**Guidelines**:
- One entry per merged PR
- Keep "What" concise (5-10 words)
- Keep "Why" strategic (not technical details)
- Link to key files or docs

#### **Changelog Update**

**Required for user-facing changes**:

```markdown
## [Unreleased]

### Added
- User authentication with email/password
- Remember me functionality
- Sign out button

### Changed
- Navigation bar now shows user avatar

### Fixed
- Session expiration handling

### Security
- Password hashing with bcrypt
- Rate limiting on auth endpoints
```

**Categories**:
- **Added**: New features
- **Changed**: Changes to existing features
- **Deprecated**: Soon-to-be-removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security improvements

#### **README Update**

**Required when setup changes**:

Update these sections if affected:
- Installation instructions
- Environment variables
- Configuration steps
- CLI commands
- Deployment process

---

### Phase 4: Release Communication

**Goal**: Inform stakeholders about changes

#### **Coordinate with CMO**

**For new features**:
```markdown
FROM: COO
TO: CMO

Feature merged: Authentication (PR #123)
Release: v1.2.0

READY FOR ANNOUNCEMENT:
- ✅ Live in production
- ✅ Documentation updated
- ✅ Blog post written
- ✅ Changelog published

TIMING:
- Merged: 2025-12-19 10:00 UTC
- Announced: 2025-12-19 14:00 UTC (your call)

LINKS:
- PR: https://github.com/org/repo/pull/123
- Docs: https://docs.example.com/auth
- Blog: https://blog.example.com/auth-launch
```

#### **Internal Communication**

**For all releases**:
- Update team chat (#releases channel)
- Notify support team (if user-facing)
- Update status page (if relevant)

---

### Phase 5: Post-Merge Monitoring

**Goal**: Ensure release is stable

#### **Immediate Checks** (first 15 minutes)

```bash
# Check deployment status
# (Project-specific command)

# Monitor error rates
# (Project-specific monitoring tool)

# Check key metrics
# (Project-specific analytics)
```

#### **First 24 Hours**

Monitor for:
- Error rate spikes
- Performance degradation
- User complaints
- Support ticket volume

**If issues detected**:
1. Alert CTO immediately
2. Consider rollback if critical
3. Document incident
4. Post-mortem after resolution

#### **Rollback Procedure**

**If feature causes issues**:

```bash
# Option 1: Revert commit
git revert <commit-hash>
git push origin main

# Option 2: Revert to previous tag
git checkout v1.1.0
git push origin main --force
# ⚠️ Only if absolutely necessary

# Option 3: Feature flag (if available)
# Disable feature without code change
```

**After rollback**:
- Update changelog (rollback entry)
- Notify CMO (halt announcements)
- Document what went wrong
- Schedule fix with CTO

---

## Special Workflows

### Hotfix Workflow

**For critical production issues**:

1. **Create Hotfix Branch**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b hotfix/critical-bug
   ```

2. **Fast-Track Process**
   - CTO fixes bug immediately
   - Skip standard PR review (if truly critical)
   - CISO reviews if security-related
   - Test manually (if CI slow)

3. **Emergency Merge**
   ```bash
   # Merge directly to main
   git checkout main
   git merge hotfix/critical-bug
   git push origin main
   
   # Tag as patch release
   git tag -a v1.2.1 -m "Hotfix: Critical auth bug"
   git push --tags
   ```

4. **Post-Hotfix**
   - Update activity log immediately
   - Update changelog
   - Announce fix (coordinate with CMO)
   - Post-mortem within 24 hours

---

### Multi-PR Release Workflow

**When releasing multiple features together**:

1. **Gather PRs**
   - List all PRs for release
   - Verify all are approved and ready
   - Check for dependencies between PRs

2. **Merge in Sequence**
   - Merge independent PRs first
   - Merge dependent PRs in order
   - Test after each merge
   - Stop if any merge fails tests

3. **Batch Documentation**
   - Update activity log (one entry per PR)
   - Update changelog (group by category)
   - Write release announcement (coordinate with CMO)

4. **Tag Release**
   ```bash
   git tag -a v1.3.0 -m "Release v1.3.0: Multiple features"
   git push --tags
   ```

---

### Quarterly Release Workflow

**For major releases (new version)**:

**Week 1: Preparation**
- [ ] Freeze main branch (no new features)
- [ ] CTO fixes critical bugs only
- [ ] CISO completes security audit
- [ ] CPO validates all acceptance criteria

**Week 2: Documentation**
- [ ] Update all documentation
- [ ] Write comprehensive changelog
- [ ] Create migration guide (if breaking changes)
- [ ] CMO writes major release blog post

**Week 3: Release**
- [ ] Create release branch (release/v2.0.0)
- [ ] Tag release (v2.0.0)
- [ ] Deploy to production
- [ ] Announce release (CMO leads)
- [ ] Monitor closely for 48 hours

**Week 4: Retrospective**
- [ ] Gather feedback from all agents
- [ ] Document lessons learned
- [ ] Update release process as needed
- [ ] Plan next quarter

---

## Collaboration Patterns

### Receiving Handoffs

#### **From CTO (Code Ready)**

**Expected format**:
```markdown
FROM: CTO
TO: COO

READY TO MERGE: Authentication feature (PR #123)

STATUS:
- ✅ All tests passing
- ✅ Code review approved
- ✅ Documentation updated
- ✅ CISO security review complete

DEPLOYMENT NOTES:
- New environment variables needed (see PR description)
- No database migrations
- No breaking changes

MONITORING:
- Watch auth error rates
- Monitor signup funnel
- Check session management

ROLLBACK PLAN:
- Safe to revert (no data migrations)
- Feature behind feature flag (can disable)

REQUEST: Merge to main and tag v1.2.0
```

**COO Actions**:
1. Verify checklist complete
2. Review PR one final time
3. Merge to main
4. Tag release (if requested)
5. Update documentation
6. Monitor post-merge

#### **From CISO (Security Approval)**

**Expected format**:
```markdown
FROM: CISO
TO: COO

SECURITY REVIEW: Authentication feature (PR #123)

STATUS: ✅ APPROVED

FINDINGS:
- ✅ Password hashing: bcrypt (correct)
- ✅ Rate limiting: Implemented
- ✅ Session management: Secure
- ⚠️ CSRF tokens: Not needed (API only)

REQUIREMENTS:
- [ ] Environment variables must be set before deployment:
  - SUPABASE_URL
  - SUPABASE_ANON_KEY
- [ ] Monitor failed login attempts (alert if >100/min)

NEXT SECURITY REVIEW: Q1 2025

AUTHORIZATION: Approved for production deployment
```

**COO Actions**:
1. Add environment variables (before merge)
2. Set up monitoring alerts
3. Note next security review date
4. Proceed with merge

#### **From CPO (Product Acceptance)**

**Expected format**:
```markdown
FROM: CPO
TO: COO

PRODUCT ACCEPTANCE: Authentication feature (PR #123)

STATUS: ✅ ACCEPTED

ACCEPTANCE CRITERIA:
- ✅ User can sign up with email/password
- ✅ User can sign in
- ✅ User stays logged in
- ✅ Error messages are clear

SUCCESS METRICS SETUP:
- ✅ Analytics tracking: Signup funnel
- ✅ Analytics tracking: Login success rate
- ✅ Analytics tracking: Session duration

LAUNCH COORDINATION:
- ✅ User docs ready: /docs/authentication
- ✅ Blog post drafted (CMO has it)
- ⏳ Support team training (scheduled for tomorrow)

AUTHORIZATION: Approved for production deployment

POST-LAUNCH:
- [ ] Review metrics after 1 week
- [ ] Gather user feedback
- [ ] Plan v2 improvements
```

**COO Actions**:
1. Wait for support training (if not critical)
2. Coordinate with CMO on announcement timing
3. Proceed with merge
4. Set reminder for 1-week review

---

### Giving Handoffs

#### **To CMO (Release Announcement)**

```markdown
FROM: COO
TO: CMO

RELEASE READY: v1.2.0 - Authentication

STATUS:
- ✅ Merged to main (commit abc123)
- ✅ Tagged v1.2.0
- ✅ Deployed to production
- ✅ All systems operational

CONTENT READY:
- ✅ Changelog: /docs/changelog.md
- ✅ Blog post: /blog/2025-12-19-auth-launch.md
- ✅ User docs: /docs/authentication.md
- ✅ Release notes: GitHub release page

TIMING:
- Deployed: 2025-12-19 10:00 UTC
- Stable: 2 hours (no issues detected)
- Ready to announce: NOW

REQUEST: Publish blog post and announce release
```

#### **To CEO (Release Report)**

```markdown
FROM: COO
TO: CEO

RELEASE REPORT: v1.2.0 - Authentication

SUMMARY:
Released authentication feature successfully. Feature is live, stable, and announced.

TIMELINE:
- Development: 2 weeks (on schedule)
- Merge: 2025-12-19 10:00 UTC
- Deployment: 2025-12-19 10:15 UTC
- Announcement: 2025-12-19 14:00 UTC

HEALTH:
- ✅ No errors detected
- ✅ Performance within targets
- ✅ User adoption tracking live
- ✅ Support team ready

METRICS (First 24h):
- Signups: 120 (vs. 100 goal)
- Success rate: 85%
- Support tickets: 2 (minor questions)

NEXT:
- CTO monitoring for 48h
- CPO reviewing metrics weekly
- Next release: TBD (awaiting roadmap)
```

---

## Quality Metrics

Track these to improve release operations:

### Release Velocity
- Releases per week/month
- Time from merge to deployment
- PR merge time (from approval to merge)

### Release Quality
- Rollback rate (target: <5%)
- Post-release incidents
- Documentation completeness
- Test coverage before merge

### Process Quality
- Wrap-up checklist completion (target: 100%)
- Activity log entries (target: 100%)
- Changelog accuracy
- Release communication timeliness

### Collaboration Quality
- Handoff clarity (feedback from agents)
- Time to respond to handoffs
- Blocking issues resolved

---

## Quick Reference

### Daily Workflow
```bash
1. Check for PRs ready to merge
2. Verify all checklists complete
3. Merge approved PRs
4. Update documentation
5. Monitor post-merge stability
6. Coordinate announcements with CMO
```

### Pre-Merge Checklist

**Quick version**:
```bash
# Tests pass?
pnpm test && pnpm typecheck && pnpm lint

# Docs updated?
git diff origin/main docs/

# Security approved?
# (Check PR comments for CISO approval)

# Product approved?
# (Check PR comments for CPO approval)

# Ready to merge? YES → Merge
```

### Common Commands
```bash
# Merge PR (via GitHub/GitLab UI preferred)

# Tag release
git tag -a v1.2.0 -m "Release v1.2.0: Description"
git push --tags

# Update docs
vim docs/activity-log.md
vim docs/changelog.md

# Wrap-up helper
./bin/pip wrap
```

---

## Related Patterns

- [Multi-Agent Collaboration](../../resources/agentic-design-patterns/extracted-patterns/multi-agent-collaboration-pattern.md) - Handoffs
- [Tool Use Pattern](../../resources/agentic-design-patterns/extracted-patterns/tool-use-pattern.md) - Git, deployment tools
- [Reflection Pattern](../../resources/agentic-design-patterns/extracted-patterns/reflection-pattern.md) - Process improvement

---

## Related Documents

- [COO Role](../../ia/agents/coo/role.md)
- [Wrap-Up Checklist](../../docs/processes/wrap-up-checklist.md)
- [Activity Log](../../docs/activity-log.md)
- [Changelog](../../docs/changelog.md)

---

## Changelog

- **2025-12-19**: Initial COO workflow documentation
- **Next**: Add deployment automation, rollback procedures
