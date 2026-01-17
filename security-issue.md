# 🔴 CRITICAL: Multiple Security Vulnerabilities in Production Configuration

**Labels:** security, critical, high, roadmap
**Priority:** HP (High Priority)

## 🔒 Security Issue Summary

Critical security vulnerabilities discovered during repository security audit that must be addressed before production deployment.

## 🔴 Critical Vulnerabilities

### 1. N8N Authentication Disabled - CRITICAL
**Location:** `docker-compose.yml:37`, `.env.example:18`

**Issue:** N8N workflow automation is publicly accessible without authentication
- `N8N_BASIC_AUTH_ACTIVE=false` disables all authentication
- N8N exposed on port `5678:5678` (publicly accessible)
- Anyone can access and manipulate workflows

**Risk Impact:**
- ❌ Workflow manipulation and deletion
- ❌ Data exfiltration through workflow access
- ❌ Arbitrary code execution via N8N nodes
- ❌ Access to connected systems and APIs

**Fix Required:**
```bash
# Add to .env.example and .env
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=CHANGE_ME_STRONG_PASSWORD
```

### 2. PostgreSQL Database Publicly Exposed - CRITICAL
**Location:** `docker-compose.yml:22`

**Issue:**
- PostgreSQL port `5432:5432` exposed to host network
- Default password is weak (`nexus`)
- Direct database access possible if firewall misconfigured

**Risk Impact:**
- ❌ Direct database access from network
- ❌ Data breach potential
- ❌ Database manipulation or deletion
- ❌ Credential theft

**Fix Required:**
```yaml
# Option 1: Bind to localhost only
ports:
  - "127.0.0.1:5432:5432"

# Option 2: Remove port mapping entirely (recommended if only containers need access)
# ports:
#   - "5432:5432"
```

### 3. Weak Default Credentials - CRITICAL
**Location:** `docker-compose.yml:18-20`

**Issue:**
- Fallback defaults use easily guessable credentials: `nexus`
- If `.env` file not created, system starts with weak passwords
- No enforcement of password strength

**Risk Impact:**
- ❌ Brute force attacks trivial
- ❌ Default credential exploitation
- ❌ Unauthorized database access

**Fix Required:**
1. Remove weak defaults - require `.env` file:
```yaml
POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:?POSTGRES_PASSWORD must be set in .env file}
```

2. Add password validation/strength requirements
3. Document minimum password requirements (16+ chars, special chars, etc.)

### 4. Command Injection Vulnerability - CRITICAL
**Location:** `.github/scripts/autonomous-agent.js:307`, `autonomous-agent.js:347`

**Issue:**
- User input (issue titles, descriptions) directly interpolated into shell commands
- No sanitization or escaping
```javascript
exec(`git commit -m "${commitMsg}"`);
exec(`gh pr create --title "${title}" --body "${prBody}"`);
```

**Attack Vector:**
Malicious issue title: `Feature"; rm -rf / #` could execute arbitrary commands

**Risk Impact:**
- ❌ Arbitrary command execution in CI/CD
- ❌ Repository deletion or corruption
- ❌ Secret exfiltration
- ❌ Supply chain attack vector

**Fix Required:**
```javascript
// Use array-based execution or proper escaping
const { execFile } = require('child_process');
execFile('git', ['commit', '-m', commitMsg]);

// Or use shell escaping library
const shellEscape = require('shell-escape');
exec(shellEscape(['git', 'commit', '-m', commitMsg]));
```

## 🟡 Additional Security Concerns

### 5. Unrestricted Auto-Merge
- All `automated/*` branches auto-merge after AI review
- No human verification for code changes
- AI reviews can be bypassed via prompt injection

**Recommendation:** Require manual approval for changes to:
- `.github/workflows/`
- Security-sensitive files
- Database configurations

### 6. Overly Broad GitHub Token Permissions
**Location:** All workflow files

**Issue:**
```yaml
permissions:
  contents: write
  pull-requests: write
  issues: write
```

**Recommendation:** Use minimum required permissions per job

## 📁 Files to Modify

- `docker-compose.yml` - Fix database exposure, remove weak defaults
- `.env.example` - Add N8N auth variables, strengthen password requirements
- `.github/scripts/autonomous-agent.js` - Fix command injection
- `README.md` - Add security documentation
- `.github/workflows/pr-review-agents.yml` - Restrict auto-merge for sensitive files

## ✅ Acceptance Criteria

- [ ] N8N basic authentication enabled with strong credentials
- [ ] PostgreSQL port restricted to localhost or removed
- [ ] Weak default passwords removed - `.env` file required
- [ ] Command injection vulnerabilities fixed with proper escaping
- [ ] Security documentation added to README
- [ ] Auto-merge requires manual approval for sensitive files
- [ ] GitHub Action permissions reduced to minimum required
- [ ] Security testing performed on fixes

## 🧪 Test Plan

1. **N8N Authentication:**
   - Start services without auth enabled → should fail or warn
   - Access N8N with invalid credentials → should be denied
   - Access N8N with valid credentials → should succeed

2. **Database Security:**
   - Verify port not accessible from external network
   - Attempt to start without `.env` → should fail with clear error
   - Test with weak password → should be rejected

3. **Command Injection:**
   - Create test issue with special characters: `Test"; echo "pwned" #`
   - Verify autonomous agent handles safely
   - Check logs for command execution attempts

4. **Auto-merge:**
   - Create PR modifying `.github/workflows/`
   - Verify manual approval required

## 📚 References

- OWASP Top 10: A01:2021 – Broken Access Control
- OWASP Top 10: A03:2021 – Injection
- CWE-78: Improper Neutralization of Special Elements (Command Injection)
- CWE-798: Use of Hard-coded Credentials

## Priority

**Priority:** HP (High Priority)
**Severity:** Critical
**Impact:** Production blocker

---

*Generated by security audit on 2026-01-17*
