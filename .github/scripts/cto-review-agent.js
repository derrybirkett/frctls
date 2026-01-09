#!/usr/bin/env node

/**
 * CTO Review Agent - Technical code review
 * Reviews PRs for code quality, architecture, and best practices
 */

const { execSync } = require('child_process');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const CONFIG = {
  model: 'gpt-4-turbo-preview',
  maxTokens: 2000,
  temperature: 0.2,
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
 * Perform CTO review using OpenAI
 */
async function performCTOReview(pr) {
  console.log('\n🔍 CTO performing technical review...');

  const prompt = `You are a CTO reviewing a pull request. Analyze this PR for technical quality.

**PR #${pr.number}: ${pr.title}**

${pr.body || 'No description provided'}

**Author:** ${pr.author.login}
**Changes:** +${pr.additions} -${pr.deletions}

**Diff:**
\`\`\`diff
${pr.diff.slice(0, 8000)}
\`\`\`

**Review Focus:**
1. Code quality and maintainability
2. Architecture alignment with .pip principles (small, incremental changes)
3. Performance implications
4. Test coverage (if tests modified/added)
5. Breaking changes
6. Documentation needs
7. Best practices adherence

**Response Format (JSON only):**
{
  "decision": "APPROVE|COMMENT|REQUEST_CHANGES",
  "summary": "Brief overall assessment",
  "issues": [
    {
      "severity": "critical|major|minor|suggestion",
      "category": "architecture|performance|testing|documentation|best-practice",
      "title": "Issue title",
      "description": "Detailed explanation",
      "suggestion": "How to fix it"
    }
  ],
  "create_issue": false,
  "issue_title": "Optional: title if create_issue is true",
  "issue_body": "Optional: detailed issue description"
}

**Guidelines:**
- APPROVE if no significant issues (minor suggestions OK)
- COMMENT for minor issues that don't block merge
- REQUEST_CHANGES for critical/major issues
- create_issue=true only for architectural concerns needing discussion
- Be constructive and specific
- Consider .pip principles: small, strategic, measurable changes`;

  try {
    const response = await openai.chat.completions.create({
      model: CONFIG.model,
      messages: [
        {
          role: 'system',
          content: 'You are an experienced CTO reviewing code. Be thorough but constructive. Respond only with valid JSON.',
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
 * Post review to GitHub
 */
function postReview(prNumber, review) {
  console.log(`\n📝 Posting ${review.decision} review...`);

  let reviewBody = `## 🏗️ CTO Technical Review

${review.summary}

`;

  if (review.issues.length > 0) {
    const critical = review.issues.filter(i => i.severity === 'critical');
    const major = review.issues.filter(i => i.severity === 'major');
    const minor = review.issues.filter(i => i.severity === 'minor');
    const suggestions = review.issues.filter(i => i.severity === 'suggestion');

    if (critical.length > 0) {
      reviewBody += `### 🔴 Critical Issues\n\n`;
      critical.forEach(issue => {
        reviewBody += `**${issue.title}** (${issue.category})\n${issue.description}\n\n💡 **Suggestion:** ${issue.suggestion}\n\n`;
      });
    }

    if (major.length > 0) {
      reviewBody += `### 🟡 Major Issues\n\n`;
      major.forEach(issue => {
        reviewBody += `**${issue.title}** (${issue.category})\n${issue.description}\n\n💡 **Suggestion:** ${issue.suggestion}\n\n`;
      });
    }

    if (minor.length > 0) {
      reviewBody += `### 🔵 Minor Issues\n\n`;
      minor.forEach(issue => {
        reviewBody += `**${issue.title}** (${issue.category})\n${issue.description}\n\n💡 **Suggestion:** ${issue.suggestion}\n\n`;
      });
    }

    if (suggestions.length > 0) {
      reviewBody += `### 💭 Suggestions\n\n`;
      suggestions.forEach(issue => {
        reviewBody += `**${issue.title}** (${issue.category})\n${issue.description}\n\n💡 **Suggestion:** ${issue.suggestion}\n\n`;
      });
    }
  } else {
    reviewBody += `✅ No issues found. Code looks good!\n\n`;
  }

  reviewBody += `---\n*Automated review by CTO Agent*`;

  // Post review comment
  try {
    exec(`gh pr review ${prNumber} --comment --body "${reviewBody.replace(/"/g, '\\"')}"`);
    console.log('✅ Review posted');
  } catch (error) {
    console.error('⚠️  Failed to post review, trying as comment...');
    exec(`gh pr comment ${prNumber} --body "${reviewBody.replace(/"/g, '\\"')}"`);
  }
}

/**
 * Create issues for agent suggestions
 */
function createIssuesForSuggestions(prNumber, review) {
  // Create issues for all suggestions (not just when create_issue flag is true)
  if (!review.issues || review.issues.length === 0) return;

  console.log('\n📋 Creating issues for agent suggestions...');

  review.issues.forEach((issue, index) => {
    // Only create issues for suggestions and minor/major issues
    // Skip critical issues as they should block the PR
    if (issue.severity === 'critical') return;

    const severityLabel = issue.severity === 'major' ? 'priority-medium' : 'priority-low';
    const categoryLabel = issue.category || 'technical-debt';
    
    const issueBody = `## Agent Suggestion from PR Review

**Original PR:** #${prNumber}
**Severity:** ${issue.severity}
**Category:** ${issue.category}

### Description
${issue.description}

### Suggested Solution
${issue.suggestion}

---
**Status:** Needs CPO approval before adding to roadmap
**Created by:** CTO Review Agent
**Labels:** This issue requires CPO triage and approval`;

    const issueTitle = `[Agent Suggestion] ${issue.title}`;

    try {
      exec(`gh issue create --title "${issueTitle}" --body "${issueBody.replace(/"/g, '\\"')}" --label "agent-suggestion,needs-approval,${severityLabel},${categoryLabel}"`);
      console.log(`✅ Issue created: ${issue.title}`);
    } catch (error) {
      console.error(`⚠️  Failed to create issue: ${issue.title}`);
    }
  });
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 CTO Review Agent Starting...\n');

  try {
    // Get PR details
    const pr = getPRDetails();
    console.log(`  PR #${pr.number}: ${pr.title}`);
    console.log(`  Author: ${pr.author.login}`);
    console.log(`  Changes: +${pr.additions} -${pr.deletions}`);

    // Perform review
    const review = await performCTOReview(pr);
    console.log(`\n✨ Review complete: ${review.decision}`);
    console.log(`  Issues found: ${review.issues.length}`);

    // Post review
    postReview(pr.number, review);

    // Create issues for suggestions (for CPO triage)
    createIssuesForSuggestions(pr.number, review);

    // Set output for workflow
    const shouldBlock = review.decision === 'REQUEST_CHANGES';
    console.log(`\n🚦 Should block merge: ${shouldBlock}`);
    
    // Write to GitHub Actions output
    if (process.env.GITHUB_OUTPUT) {
      require('fs').appendFileSync(
        process.env.GITHUB_OUTPUT,
        `should_block=${shouldBlock}\n`
      );
    }

    console.log('\n🎉 CTO review complete!');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
