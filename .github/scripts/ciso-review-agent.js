#!/usr/bin/env node

/**
 * CISO Review Agent - Security code review
 * Reviews PRs for security vulnerabilities and risks
 */

const { execSync } = require('child_process');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const CONFIG = {
  model: 'gpt-4-turbo-preview',
  maxTokens: 2000,
  temperature: 0.1, // Lower temperature for security = more conservative
};

function exec(command, options = {}) {
  try {
    const result = execSync(command, {
      encoding: 'utf8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options,
    });
    return result ? result.trim() : '';
  } catch (error) {
    console.error(`Command failed: ${command}`);
    throw error;
  }
}

/**
 * Get PR details and diff
 */
function getPRDetails() {
  console.log('📋 Fetching PR details...');
  
  const prNumber = process.env.PR_NUMBER;
  const prJson = exec(`gh pr view ${prNumber} --json number,title,body,author,files,additions,deletions`, { silent: true });
  const pr = JSON.parse(prJson);
  
  // Get diff
  const diff = exec(`gh pr diff ${prNumber}`, { silent: true });
  
  return { ...pr, diff };
}

/**
 * Perform CISO security review using OpenAI
 */
async function performCISOReview(pr) {
  console.log('\n🔒 CISO performing security review...');

  const prompt = `You are a CISO (Chief Information Security Officer) reviewing a pull request for security vulnerabilities.

**PR #${pr.number}: ${pr.title}**

${pr.body || 'No description provided'}

**Author:** ${pr.author.login}
**Changes:** +${pr.additions} -${pr.deletions}

**Diff:**
\`\`\`diff
${pr.diff.slice(0, 8000)}
\`\`\`

**Security Review Checklist:**
1. ⚠️ Hardcoded credentials, API keys, tokens, passwords
2. 🔓 SQL injection vulnerabilities
3. 🌐 XSS (Cross-Site Scripting) risks
4. 🔑 Authentication/authorization bypasses
5. 📦 Insecure dependencies or packages
6. 🔐 Insecure configurations (CORS, CSP, etc.)
7. 💾 Data exposure or leakage
8. 🔗 SSRF (Server-Side Request Forgery)
9. 📝 Insecure file operations
10. 🚪 Improper input validation

**Response Format (JSON only):**
{
  "decision": "APPROVE|REQUEST_CHANGES|BLOCK",
  "risk_level": "none|low|medium|high|critical",
  "summary": "Brief security assessment",
  "vulnerabilities": [
    {
      "severity": "critical|high|medium|low",
      "type": "credentials|injection|xss|auth|dependency|config|data-leak|other",
      "title": "Vulnerability title",
      "description": "What is the security risk",
      "location": "File/line where found",
      "impact": "What could happen if exploited",
      "remediation": "How to fix it"
    }
  ],
  "create_security_issue": false,
  "block_merge": false
}

**Guidelines:**
- BLOCK if critical vulnerabilities found (set block_merge=true)
- REQUEST_CHANGES for high/medium severity issues
- APPROVE only if no security concerns
- create_security_issue=true for any vulnerability that needs tracking
- Be extremely cautious with credentials, keys, and secrets
- Consider OWASP Top 10`;

  try {
    const response = await openai.chat.completions.create({
      model: CONFIG.model,
      messages: [
        {
          role: 'system',
          content: 'You are a security-focused CISO. Prioritize security over convenience. Respond only with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: CONFIG.maxTokens,
      temperature: CONFIG.temperature,
    });

    const content = response.choices[0].message.content.trim();
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
    const jsonContent = jsonMatch[1] || content;
    
    return JSON.parse(jsonContent);
  } catch (error) {
    console.error('❌ OpenAI API error:', error.message);
    throw error;
  }
}

/**
 * Post security review to GitHub
 */
function postReview(prNumber, review) {
  console.log(`\n📝 Posting security review (${review.risk_level} risk)...`);

  const riskEmoji = {
    none: '✅',
    low: '🟢',
    medium: '🟡',
    high: '🟠',
    critical: '🔴'
  };

  let reviewBody = `## 🔒 CISO Security Review

${riskEmoji[review.risk_level]} **Risk Level: ${review.risk_level.toUpperCase()}**

${review.summary}

`;

  if (review.vulnerabilities.length > 0) {
    const critical = review.vulnerabilities.filter(v => v.severity === 'critical');
    const high = review.vulnerabilities.filter(v => v.severity === 'high');
    const medium = review.vulnerabilities.filter(v => v.severity === 'medium');
    const low = review.vulnerabilities.filter(v => v.severity === 'low');

    if (critical.length > 0) {
      reviewBody += `### 🔴 CRITICAL Vulnerabilities\n\n`;
      critical.forEach(vuln => {
        reviewBody += `**${vuln.title}** (${vuln.type})\n`;
        reviewBody += `📍 **Location:** ${vuln.location}\n`;
        reviewBody += `⚠️ **Risk:** ${vuln.description}\n`;
        reviewBody += `💥 **Impact:** ${vuln.impact}\n`;
        reviewBody += `🛠️ **Fix:** ${vuln.remediation}\n\n`;
      });
    }

    if (high.length > 0) {
      reviewBody += `### 🟠 HIGH Severity\n\n`;
      high.forEach(vuln => {
        reviewBody += `**${vuln.title}** (${vuln.type})\n`;
        reviewBody += `📍 ${vuln.location}\n`;
        reviewBody += `⚠️ ${vuln.description}\n`;
        reviewBody += `🛠️ **Fix:** ${vuln.remediation}\n\n`;
      });
    }

    if (medium.length > 0) {
      reviewBody += `### 🟡 MEDIUM Severity\n\n`;
      medium.forEach(vuln => {
        reviewBody += `**${vuln.title}** (${vuln.type})\n`;
        reviewBody += `${vuln.description}\n`;
        reviewBody += `🛠️ ${vuln.remediation}\n\n`;
      });
    }

    if (low.length > 0) {
      reviewBody += `### 🔵 LOW Severity\n\n`;
      low.forEach(vuln => {
        reviewBody += `**${vuln.title}**: ${vuln.description}\n\n`;
      });
    }

    if (review.block_merge) {
      reviewBody += `\n---\n\n🚫 **MERGE BLOCKED** - Critical security issues must be resolved before merging.\n\n`;
    }
  } else {
    reviewBody += `✅ No security vulnerabilities detected.\n\n`;
  }

  reviewBody += `---\n*Automated security review by CISO Agent*`;

  // Post review
  try {
    const event = review.decision === 'APPROVE' ? 'APPROVE' : 'COMMENT';
    exec(`gh pr review ${prNumber} --${event.toLowerCase()} --body "${reviewBody.replace(/"/g, '\\"')}"`);
    console.log(`✅ Security review posted (${event})`);
  } catch (error) {
    console.error('⚠️  Failed to post review, trying as comment...');
    exec(`gh pr comment ${prNumber} --body "${reviewBody.replace(/"/g, '\\"')}"`);
  }
}

/**
 * Create security issue if needed
 */
function createSecurityIssue(prNumber, review) {
  if (!review.create_security_issue || review.vulnerabilities.length === 0) return;

  console.log('\n🚨 Creating security issue...');

  const vulnList = review.vulnerabilities
    .map(v => `- **${v.title}** (${v.severity}): ${v.description}`)
    .join('\n');

  const issueBody = `## 🔒 Security Vulnerabilities Found

**Risk Level:** ${review.risk_level.toUpperCase()}

### Vulnerabilities
${vulnList}

### Details
${review.summary}

---
**Related PR:** #${prNumber}
**Detected by:** CISO Review Agent
**Action Required:** Address before merging PR`;

  try {
    exec(`gh issue create --title "🔒 Security: ${review.vulnerabilities[0].title}" --body "${issueBody.replace(/"/g, '\\"')}" --label "security,priority-high"`);
    console.log('✅ Security issue created');
  } catch (error) {
    console.error('⚠️  Failed to create security issue');
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 CISO Security Review Agent Starting...\n');

  try {
    // Get PR details
    const pr = getPRDetails();
    console.log(`  PR #${pr.number}: ${pr.title}`);
    console.log(`  Author: ${pr.author.login}`);
    console.log(`  Changes: +${pr.additions} -${pr.deletions}`);

    // Perform security review
    const review = await performCISOReview(pr);
    console.log(`\n✨ Security review complete: ${review.decision}`);
    console.log(`  Risk level: ${review.risk_level}`);
    console.log(`  Vulnerabilities found: ${review.vulnerabilities.length}`);

    // Post review
    postReview(pr.number, review);

    // Create security issue if needed
    createSecurityIssue(pr.number, review);

    if (review.block_merge) {
      console.log('\n🚫 MERGE BLOCKED due to critical security issues');
      process.exit(1);
    }

    console.log('\n🎉 CISO security review complete!');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
