# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it by emailing the maintainers. **Do not open a public issue.**

We take all security vulnerabilities seriously and will respond promptly.

## Security Best Practices

### 1. Secrets Management

**Never commit secrets to version control:**
- API keys
- Database passwords
- Access tokens
- Private keys
- SSL certificates

**Required practices:**
- Use `.env` files for local development (already in `.gitignore`)
- Use GitHub Secrets for CI/CD workflows
- Use `direnv` for local environment management (`.envrc` is gitignored)
- Reference `.env.example` for required variables

### 2. API Key Management

**OpenAI API Key:**
- Stored in GitHub Secrets as `OPENAI_API_KEY`
- Used by: AI content generation, autonomous agents, PR review agents
- Rotation policy: Every 90 days or immediately if compromised
- Access: Limited to GitHub Actions workflows only

**GitHub Token:**
- Automatically provided by GitHub Actions as `GITHUB_TOKEN`
- Permissions: Limited per-workflow using `permissions` block
- Expires: Automatically after workflow completion

### 3. Pre-commit Hook Enforcement

A pre-commit hook is installed to prevent:
1. Direct commits to `main` branch
2. Accidental secret commits (when git-secrets is installed)

**Setup:**
```bash
# Install the hook (done automatically by setup scripts)
bash .github/scripts/install-git-hooks.sh

# Install git-secrets (recommended)
brew install git-secrets  # macOS
# or
apt-get install git-secrets  # Ubuntu

# Initialize git-secrets
git secrets --install
git secrets --register-aws
```

### 4. GitHub Actions Security

**Permissions Model:**
- Each workflow specifies minimum required permissions
- Default `GITHUB_TOKEN` permissions are restricted
- No workflow has admin access

**Secret Usage:**
- Secrets are never logged or echoed
- Secrets are passed as environment variables only
- Failed workflows don't expose secret values

### 5. Dependency Security

**Automated scanning:**
- Dependabot alerts enabled for vulnerability detection
- Monthly dependency updates via Dependabot PRs

**Manual review:**
- New dependencies require CTO review
- Security-critical dependencies require CISO review
- Lock files are committed to ensure reproducible builds

### 6. Code Review Security

**Automated CISO Review:**
- All PRs automatically scanned for security issues
- Checks for:
  - Hardcoded credentials
  - SQL injection vulnerabilities
  - XSS risks
  - Authentication bypasses
  - Insecure dependencies
  - Data exposure
  - Input validation issues

**Manual review required for:**
- Authentication/authorization changes
- Database schema changes
- External API integrations
- Workflow modifications
- Infrastructure changes

## Secure Development Checklist

Before merging any PR, ensure:

- [ ] No hardcoded secrets or credentials
- [ ] Environment variables used for sensitive data
- [ ] Input validation for all user inputs
- [ ] SQL queries use parameterized statements
- [ ] Authentication/authorization properly implemented
- [ ] Error messages don't leak sensitive information
- [ ] Dependencies are up to date and vulnerability-free
- [ ] CISO review agent has approved (or issues addressed)
- [ ] Pre-commit hooks are passing

## Incident Response

### If a Secret is Compromised:

1. **Immediate Actions:**
   - Revoke/rotate the compromised secret immediately
   - Update GitHub Secrets with new value
   - Audit recent usage of the compromised secret
   - Check logs for unauthorized access

2. **Investigation:**
   - Determine scope of exposure
   - Identify when and how secret was compromised
   - Review git history for accidental commits
   - Check CI/CD logs for leaks

3. **Remediation:**
   - Remove secret from git history if committed (use `git filter-repo`)
   - Force push to overwrite history (coordinate with team)
   - Update all affected systems
   - Document incident and lessons learned

4. **Prevention:**
   - Review and strengthen controls
   - Update documentation
   - Train team members on secure practices

### If a Vulnerability is Discovered:

1. **Assessment:**
   - Severity: Critical, High, Medium, Low
   - Exploitability: Active exploits? PoC available?
   - Impact: Data exposure? Service disruption?

2. **Response Timeline:**
   - Critical: Fix within 24 hours
   - High: Fix within 1 week
   - Medium: Fix within 1 month
   - Low: Fix in next release cycle

3. **Communication:**
   - Notify maintainers immediately
   - Create private security advisory
   - Coordinate disclosure with reporters
   - Publish fixes before disclosure

## Security Audit Log

Document security-related changes here:

| Date | Type | Description | Resolved By |
|------|------|-------------|-------------|
| 2026-01-17 | Policy | Initial security policy creation | Security Review |
| 2026-01-17 | Fix | Enhanced .gitignore for secret protection | Security Review |

## Contact

For security concerns, contact the repository maintainers.

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [CWE Top 25](https://cwe.mitre.org/top25/)
