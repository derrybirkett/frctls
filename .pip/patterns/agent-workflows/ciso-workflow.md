# CISO Agent Workflow

**Agent Role**: Chief Information Security Officer  
**Primary Responsibility**: Security policies, risk management, compliance  
**Key Patterns**: Reflection, Multi-Agent Collaboration, Planning (for audits)

## Overview

The CISO agent owns security posture, risk management, and compliance. The CISO reviews security-sensitive changes, defines security policies, and ensures the system meets security standards. This workflow shows how to balance security with development velocity.

## Core Pattern: Reflection + Risk Assessment

The CISO primarily uses:
- **Reflection Pattern**: Analyzing security implications
- **Risk Assessment**: Evaluating threats and vulnerabilities
- **Multi-Agent Collaboration**: Reviewing with CTO, approving to COO

---

## Standard Security Review Workflow

### Phase 1: Request Triage

**Goal**: Determine if security review is needed

#### **Review Required For**

- ✅ Authentication/authorization changes
- ✅ Data privacy features
- ✅ External API integrations
- ✅ User input handling
- ✅ Cryptographic operations
- ✅ Database schema changes (if sensitive data)
- ✅ Deployment configuration changes
- ✅ Dependency updates (if security-related)

#### **Review NOT Required For**

- ❌ UI-only changes (no data handling)
- ❌ Documentation updates
- ❌ Pure refactoring (no logic changes)
- ❌ Test code (unless testing security features)

**Triage Decision**:
```
Request: Add user authentication
Impact: HIGH (handles passwords, sessions)
Decision: FULL REVIEW required

Request: Change button color
Impact: NONE (cosmetic only)
Decision: NO REVIEW needed

Request: Add logging
Impact: MEDIUM (may log sensitive data)
Decision: QUICK REVIEW (verify no PII logged)
```

---

### Phase 2: Security Review

**Goal**: Identify security risks and provide guidance

#### **Review Checklist**

**Authentication & Authorization**:
- [ ] Passwords hashed (bcrypt, argon2, or equivalent)
- [ ] Rate limiting on auth endpoints
- [ ] Session management secure (httpOnly, secure, sameSite cookies)
- [ ] Token expiration appropriate
- [ ] 2FA available (if applicable)
- [ ] Password requirements adequate (min 8 chars, complexity)

**Data Protection**:
- [ ] Sensitive data encrypted at rest
- [ ] TLS/HTTPS enforced for transit
- [ ] PII handling compliant (GDPR, CCPA if applicable)
- [ ] Secrets not in code (environment variables)
- [ ] API keys rotated regularly

**Input Validation**:
- [ ] All user input validated
- [ ] SQL injection prevented (parameterized queries)
- [ ] XSS prevention (sanitize outputs)
- [ ] CSRF protection (tokens or sameSite cookies)
- [ ] File upload validation (type, size, content)

**Access Control**:
- [ ] Principle of least privilege applied
- [ ] Authorization checks on all sensitive operations
- [ ] Role-based access control (if applicable)
- [ ] API endpoints protected

**Dependencies**:
- [ ] No critical vulnerabilities (npm audit, Snyk)
- [ ] Dependencies up to date
- [ ] License compliance
- [ ] Supply chain security (verify sources)

**Logging & Monitoring**:
- [ ] Security events logged (failed logins, privilege escalation)
- [ ] No sensitive data in logs (passwords, tokens, PII)
- [ ] Alerts configured for suspicious activity
- [ ] Audit trail for sensitive operations

---

### Phase 3: Risk Assessment

**Goal**: Evaluate and communicate risk level

#### **Risk Matrix**

**Likelihood × Impact = Risk Score**

**Likelihood**:
- **High (3)**: Likely to be exploited (public-facing, common vulnerability)
- **Medium (2)**: Could be exploited (requires specific conditions)
- **Low (1)**: Unlikely to be exploited (requires insider access)

**Impact**:
- **Critical (3)**: Data breach, complete system compromise
- **High (2)**: Unauthorized access, data corruption
- **Low (1)**: Information disclosure, service degradation

**Risk Score**:
- **9**: Critical - Block deployment immediately
- **6**: High - Require fixes before deployment
- **4**: Medium - Fix soon, can deploy with mitigations
- **3**: Low - Fix in next sprint
- **2**: Minimal - Fix when convenient
- **1**: Negligible - Accept risk

**Example Assessment**:
```markdown
## Security Review: Authentication Feature (PR #123)

### Findings

1. **Password Storage**
   - Issue: Using bcrypt with cost factor 10
   - Likelihood: Low (1) - bcrypt is secure
   - Impact: Critical (3) - passwords could be cracked if DB leaked
   - Risk Score: 3 (Low)
   - Recommendation: Increase cost factor to 12
   - Status: ✅ FIXED

2. **Rate Limiting**
   - Issue: No rate limiting on login endpoint
   - Likelihood: High (3) - easy to exploit
   - Impact: High (2) - credential stuffing possible
   - Risk Score: 6 (High)
   - Recommendation: Add rate limit (5 attempts per minute)
   - Status: ⚠️ REQUIRED BEFORE MERGE

3. **Session Timeout**
   - Issue: Sessions never expire
   - Likelihood: Medium (2) - requires stolen session
   - Impact: High (2) - unlimited access if session stolen
   - Risk Score: 4 (Medium)
   - Recommendation: Set 30-day expiration
   - Status: ⚠️ REQUIRED BEFORE MERGE

### Decision
STATUS: ⛔ BLOCKED pending fixes #2 and #3

TIMELINE: 1 day to fix
```

---

### Phase 4: Provide Guidance

**Goal**: Help CTO fix issues efficiently

#### **Handoff to CTO**

```markdown
FROM: CISO
TO: CTO

SECURITY REVIEW: Authentication feature (PR #123)

STATUS: ⛔ BLOCKED (2 required fixes)

REQUIRED FIXES:
1. Rate Limiting (HIGH RISK)
   - Add rate limit to /api/auth/login
   - Suggestion: Use express-rate-limit or similar
   - Config: 5 attempts per IP per minute
   - Test: Verify rate limit triggers

2. Session Timeout (MEDIUM RISK)
   - Set session expiration
   - Suggestion: maxAge: 30 * 24 * 60 * 60 * 1000 (30 days)
   - Add "Remember me" option for longer sessions
   - Test: Verify expired sessions rejected

RECOMMENDATIONS (not blocking):
- Increase bcrypt cost factor to 12 (current: 10)
- Add 2FA support in future sprint

APPROVAL CONDITIONS:
- ✅ Both required fixes implemented
- ✅ Tests verify fixes work
- ✅ No new security issues introduced

TIMELINE:
- Estimated fix time: 4 hours
- Re-review time: 1 hour
- Expected approval: Tomorrow

CONTACT: Available for questions anytime
```

---

### Phase 5: Re-Review & Approval

**Goal**: Verify fixes and approve for deployment

#### **Re-Review Process**

1. **Verify Fixes**
   ```bash
   git checkout <branch>
   git pull
   
   # Check code changes
   git diff <previous-commit>
   
   # Review specific files
   # (Review rate limiting implementation)
   # (Review session config)
   ```

2. **Test Fixes**
   ```bash
   # Run tests
   pnpm test
   
   # Manual testing
   # - Test rate limit triggers
   # - Test session expiration
   # - Test "remember me" functionality
   ```

3. **Final Assessment**
   ```markdown
   ## Security Re-Review: Authentication Feature (PR #123)
   
   ### Fixes Verified
   - ✅ Rate limiting implemented (express-rate-limit)
   - ✅ Session timeout set (30 days)
   - ✅ Tests added and passing
   - ✅ No new issues introduced
   
   ### Final Risk Assessment
   - All HIGH risks mitigated
   - All MEDIUM risks mitigated
   - LOW risks acceptable
   
   ### Decision
   STATUS: ✅ APPROVED
   
   AUTHORIZATION: Approved for production deployment
   
   POST-DEPLOYMENT:
   - [ ] Monitor failed login attempts (alert if >100/min)
   - [ ] Review auth logs weekly for first month
   - [ ] Schedule security audit in Q1 2025
   ```

4. **Handoff to COO**
   ```markdown
   FROM: CISO
   TO: COO
   
   SECURITY APPROVAL: Authentication feature (PR #123)
   
   STATUS: ✅ APPROVED
   
   DEPLOYMENT REQUIREMENTS:
   - [ ] Environment variables must be set:
     - SESSION_SECRET (generate secure random value)
     - RATE_LIMIT_WINDOW_MS=60000
     - RATE_LIMIT_MAX_REQUESTS=5
   
   MONITORING:
   - [ ] Alert on failed login rate >100/min
   - [ ] Weekly review of auth logs
   
   NEXT REVIEW: Q1 2025 security audit
   
   AUTHORIZATION: Approved for production deployment
   ```

---

## Special Workflows

### Security Audit (Planning Pattern)

**Quarterly or major release security audit**:

#### **Week 1: Preparation**

1. **Scope Definition**
   ```markdown
   ## Q4 2024 Security Audit
   
   ### Scope
   - All authentication/authorization code
   - All external API integrations
   - All data storage (databases, files)
   - All user input handling
   - Deployment configuration
   
   ### Out of Scope
   - Third-party services (rely on their audits)
   - Physical security
   - Social engineering
   ```

2. **Gather Information**
   - Review all security-related PRs from quarter
   - List all dependencies
   - Map data flows
   - Identify external attack surfaces

#### **Week 2: Assessment**

1. **Automated Scanning**
   ```bash
   # Dependency vulnerabilities
   npm audit
   
   # Static analysis
   npm run lint:security
   
   # License compliance
   npx license-checker
   ```

2. **Manual Code Review**
   - Review authentication logic
   - Review authorization checks
   - Review data handling
   - Review API endpoints
   - Review configuration files

3. **Threat Modeling**
   - Identify assets (user data, API keys, etc.)
   - Identify threat actors (external, insider)
   - Identify attack vectors
   - Prioritize threats

#### **Week 3: Remediation**

1. **Categorize Findings**
   - **Critical**: Fix immediately (block releases)
   - **High**: Fix this sprint
   - **Medium**: Fix next sprint
   - **Low**: Backlog

2. **Create Remediation Plan**
   ```markdown
   ## Security Audit Findings - Q4 2024
   
   ### Critical (0)
   None found ✅
   
   ### High (2)
   1. API keys in environment variables not rotated
      - Risk: Compromised keys not invalidated
      - Fix: Implement key rotation (CTO)
      - Timeline: This sprint
   
   2. Admin panel accessible without 2FA
      - Risk: Account takeover
      - Fix: Require 2FA for admin (CTO)
      - Timeline: This sprint
   
   ### Medium (5)
   [List medium-priority findings]
   
   ### Low (10)
   [List low-priority findings]
   ```

3. **Handoff to CTO**
   ```markdown
   FROM: CISO
   TO: CTO
   
   SECURITY AUDIT COMPLETE: Q4 2024
   
   SUMMARY:
   - 0 Critical findings
   - 2 High findings (require immediate attention)
   - 5 Medium findings (next sprint)
   - 10 Low findings (backlog)
   
   IMMEDIATE ACTION REQUIRED:
   1. Implement API key rotation
   2. Add 2FA for admin panel
   
   TIMELINE:
   - Complete by: End of sprint (2025-01-15)
   - Re-audit: After fixes implemented
   
   FULL REPORT: /docs/security/audit-2024-q4.md
   ```

#### **Week 4: Follow-Up**

- Verify fixes implemented
- Re-scan for vulnerabilities
- Update security policies
- Document lessons learned

---

### Incident Response (React Pattern)

**When security incident is detected**:

#### **Phase 1: Detect & Assess**

1. **Confirm Incident**
   - Is this a real security incident?
   - What's the scope?
   - Is it ongoing?

2. **Assess Severity**
   ```
   CRITICAL: Data breach, system compromise
   HIGH: Unauthorized access detected
   MEDIUM: Suspicious activity
   LOW: Policy violation
   ```

#### **Phase 2: Contain**

1. **Immediate Actions**
   ```bash
   # If active attack
   - Block attacking IPs (firewall)
   - Disable compromised accounts
   - Rotate exposed credentials
   - Take affected service offline (if necessary)
   ```

2. **Alert Team**
   ```markdown
   🚨 SECURITY INCIDENT 🚨
   
   Severity: HIGH
   Status: CONTAINED
   
   Description: Brute force attack on login endpoint
   Impact: 1,000 failed login attempts in 5 minutes
   
   Actions taken:
   - ✅ Blocked attacker IP (192.168.1.1)
   - ✅ Enabled rate limiting
   - ✅ No accounts compromised
   
   Next steps:
   - [ ] CTO: Improve rate limiting
   - [ ] COO: Monitor for 24 hours
   - [ ] CISO: Post-mortem tomorrow
   ```

#### **Phase 3: Eradicate & Recover**

1. **Fix Root Cause**
   - Work with CTO to address vulnerability
   - Verify fix prevents recurrence

2. **Restore Service**
   - Bring service back online
   - Monitor closely

#### **Phase 4: Post-Mortem**

Use **Reflection Pattern**:

```markdown
## Security Incident Post-Mortem

Date: 2025-01-15
Severity: HIGH
Duration: 30 minutes

### What Happened
Brute force attack on login endpoint. 1,000 failed login attempts in 5 minutes.

### Timeline
- 14:00: Attack began
- 14:05: Automated alert triggered
- 14:10: CISO assessed severity
- 14:15: Blocked attacker IP
- 14:20: Enabled rate limiting
- 14:30: Attack stopped

### Impact
- ✅ No accounts compromised
- ✅ No data breached
- ⚠️ Service degraded for 5 minutes

### Root Cause
- Rate limiting not enabled on login endpoint
- CISO recommendation ignored in earlier review

### What Went Well
- Automated alerts worked
- Response time: 15 minutes
- No data loss

### What Went Wrong
- Rate limiting should have been implemented earlier
- Manual IP blocking (should be automated)

### Action Items
- [ ] CTO: Enable rate limiting on ALL auth endpoints
- [ ] CTO: Implement automated IP blocking
- [ ] CISO: Enforce security recommendations (not optional)
- [ ] COO: Update incident response playbook

### Lessons
- Security recommendations are not optional
- Need automated response capabilities
- Monitoring alerts work well
```

---

## Security Policy Management

### Policy Review Cycle

**Quarterly review**:
1. Review existing policies
2. Identify gaps
3. Update based on incidents and audits
4. Get CEO approval for major changes
5. Communicate to all agents

### Key Policies to Maintain

**Authentication Policy**:
```markdown
## Authentication Policy

### Password Requirements
- Minimum 8 characters
- Must include: uppercase, lowercase, number
- No common passwords (dictionary check)
- No password reuse (last 5 passwords)

### Session Management
- Session timeout: 30 days
- "Remember me": 90 days
- Secure cookies: httpOnly, secure, sameSite

### Multi-Factor Authentication
- Required for: Admin accounts
- Optional for: Regular users
- Methods: TOTP (Google Authenticator), SMS backup
```

**Data Protection Policy**:
```markdown
## Data Protection Policy

### Encryption
- At rest: AES-256
- In transit: TLS 1.3
- Backups: Encrypted

### PII Handling
- Collect only necessary data
- User consent required
- Right to deletion honored
- Data retention: 2 years after account deletion

### Access Control
- Principle of least privilege
- Role-based access control
- Regular access reviews (quarterly)
```

**Incident Response Policy**:
```markdown
## Incident Response Policy

### Severity Levels
- CRITICAL: Data breach, system compromise
- HIGH: Unauthorized access
- MEDIUM: Suspicious activity
- LOW: Policy violation

### Response Times
- CRITICAL: Immediate (24/7)
- HIGH: 1 hour
- MEDIUM: 4 hours
- LOW: 1 business day

### Communication
- CRITICAL: CEO, all agents, legal (if required)
- HIGH: CEO, CTO, COO
- MEDIUM: CTO, COO
- LOW: CISO internal only
```

---

## Collaboration Patterns

### With CTO (Security Review)

**Request Format**:
```markdown
FROM: CTO
TO: CISO

SECURITY REVIEW REQUEST: Authentication feature (PR #123)

TYPE: Authentication/authorization

CHANGES:
- Added user registration
- Added login/logout
- Session management with cookies

QUESTIONS:
- Is bcrypt cost factor 10 sufficient?
- Should we implement 2FA now or later?
- Session timeout: 30 days appropriate?

TIMELINE: Ready to merge in 2 days (need review ASAP)

PR: https://github.com/org/repo/pull/123
```

### With CEO (Risk Decisions)

**Escalation Format**:
```markdown
FROM: CISO
TO: CEO

SECURITY RISK DECISION NEEDED

SITUATION:
CTO wants to deploy authentication feature, but high-risk issues remain.

RISKS:
- No rate limiting (HIGH) - credential stuffing possible
- No 2FA (MEDIUM) - account takeover possible

OPTIONS:
1. BLOCK deployment until fixed (secure, delays release 1 week)
2. ALLOW deployment with mitigations (faster, higher risk)
3. DEPLOY to limited beta users first (balanced)

RECOMMENDATION: Option 3 (beta deployment)

RATIONALE:
- Enables testing with real users (CPO priority)
- Limits exposure (only 100 beta users)
- Gives CTO time to implement fixes
- Can roll out to all users when secure

DECISION NEEDED BY: Tomorrow (deployment scheduled)
```

---

## Quality Metrics

Track these to improve security posture:

### Vulnerability Management
- Open vulnerabilities by severity
- Time to remediate (by severity)
- Vulnerability recurrence rate

### Review Quality
- Review turnaround time (target: <24h)
- False positive rate (blocked but not risky)
- False negative rate (approved but risky - only known in retrospect)

### Incident Response
- Mean time to detect (MTTD)
- Mean time to respond (MTTR)
- Incident recurrence rate

### Policy Compliance
- % of PRs with required security review
- % of security recommendations implemented
- Security training completion rate

---

## Quick Reference

### Daily Workflow
```bash
1. Review security review requests from CTO
2. Triage: Full review or quick review?
3. Perform security assessment
4. Provide guidance to CTO
5. Re-review fixes
6. Approve to COO or block
```

### Decision Tree

**Review Request**:
```
Is security-sensitive?
  → Yes: Perform full review
  → No: No review needed

Risk level?
  → Critical/High: BLOCK until fixed
  → Medium: Fix before deploy or mitigate
  → Low: Fix in next sprint

Fixes implemented?
  → Yes: Re-review
  → No: Wait for CTO

Fixes adequate?
  → Yes: Approve to COO
  → No: Request additional fixes
```

### Common Commands
```bash
# Security scanning
npm audit
npm audit fix

# License check
npx license-checker

# Static analysis
npm run lint:security
```

---

## Related Patterns

- [Reflection Pattern](../../resources/agentic-design-patterns/extracted-patterns/reflection-pattern.md) - Risk assessment, post-mortems
- [Multi-Agent Collaboration](../../resources/agentic-design-patterns/extracted-patterns/multi-agent-collaboration-pattern.md) - CTO reviews
- [Planning Pattern](../../resources/agentic-design-patterns/extracted-patterns/planning-pattern.md) - Security audits

---

## Related Documents

- [CISO Role](../../ia/agents/ciso/role.md)
- [CTO Workflow](./cto-workflow.md) - Implementation partner
- [COO Workflow](./coo-workflow.md) - Deployment partner

---

## Changelog

- **2025-12-19**: Initial CISO workflow documentation
- **Next**: Add threat modeling guide, compliance checklists
