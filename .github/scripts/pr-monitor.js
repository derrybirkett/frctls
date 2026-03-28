#!/usr/bin/env node

/**
 * PR Monitor Agent
 * Monitors open PRs for stale status, conflicts, CI failures, and review metrics
 */

const { execSync } = require('child_process');

function exec(command, options = {}) {
  try {
    const result = execSync(command, {
      encoding: 'utf8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options,
    });
    return result ? result.trim() : '';
  } catch (error) {
    if (!options.silent) {
      console.error(`Command failed: ${command}`);
    }
    return null;
  }
}

/**
 * Get all open PRs with detailed info
 */
function getOpenPRs() {
  console.log('📋 Fetching open PRs...');

  try {
    const prs = JSON.parse(
      exec(
        'gh pr list --state open --json number,title,createdAt,updatedAt,isDraft,mergeable,reviewDecision,statusCheckRollup --limit 50',
        { silent: true }
      )
    );

    console.log(`✅ Found ${prs.length} open PRs`);
    return prs;
  } catch (error) {
    console.error('Failed to fetch PRs:', error.message);
    return [];
  }
}

/**
 * Check if PR is stale (no activity for X days)
 */
function checkStale(pr, staleDays = 7) {
  const updated = new Date(pr.updatedAt);
  const now = new Date();
  const daysOld = (now - updated) / (1000 * 60 * 60 * 24);

  return {
    isStale: daysOld > staleDays,
    daysOld: Math.floor(daysOld),
    threshold: staleDays
  };
}

/**
 * Check PR merge status
 */
function checkMergeStatus(pr) {
  return {
    isDraft: pr.isDraft,
    mergeable: pr.mergeable,
    hasConflict: pr.mergeable === false,
    reviewDecision: pr.reviewDecision || 'PENDING'
  };
}

/**
 * Check CI status
 */
function checkCIStatus(prNumber) {
  try {
    const checks = JSON.parse(
      exec(
        `gh pr view ${prNumber} --json statusCheckRollup --jq '.statusCheckRollup'`,
        { silent: true }
      )
    );

    if (!checks || checks.length === 0) {
      return { hasChecks: false, allPassed: false, failedChecks: [] };
    }

    const failedChecks = checks.filter(c => c.conclusion && c.conclusion !== 'SUCCESS');

    return {
      hasChecks: true,
      totalChecks: checks.length,
      passedChecks: checks.length - failedChecks.length,
      failedChecks: failedChecks.map(c => ({
        name: c.name,
        status: c.status,
        conclusion: c.conclusion
      })),
      allPassed: failedChecks.length === 0
    };
  } catch (error) {
    return { hasChecks: false, allPassed: false, failedChecks: [] };
  }
}

/**
 * Create alert issue for PR problems
 */
function createAlert(pr, issues) {
  if (issues.length === 0) return;

  const issueBody = `## PR #${pr.number} - ${pr.title}

**Issues Found:**
${issues.map((issue, i) => `${i + 1}. ${issue}`).join('\n')}

**Action Required:**
- Review and address the issues above
- Update PR to trigger re-checks if needed
- Comment when ready for review

**PR Link:** https://github.com/${{ github.repository }}/pull/${pr.number}

---
*Automated PR monitoring alert*`;

  const title = `⚠️ PR #${pr.number} needs attention`;

  try {
    exec(
      `gh issue create --title "${title}" --body "${issueBody.replace(/"/g, '\\"')}" --label "pr-monitor,needs-attention"`,
      { silent: true }
    );
    console.log(`✅ Created alert for PR #${pr.number}`);
  } catch (error) {
    console.error(`⚠️ Failed to create alert for PR #${pr.number}`);
  }
}

/**
 * Post comment on PR
 */
function commentOnPR(prNumber, comment) {
  try {
    exec(
      `gh pr comment ${prNumber} --body "${comment.replace(/"/g, '\\"')}"`,
      { silent: true }
    );
    console.log(`✅ Commented on PR #${prNumber}`);
  } catch (error) {
    console.error(`⚠️ Failed to comment on PR #${prNumber}`);
  }
}

/**
 * Main monitoring logic
 */
async function main() {
  console.log('🚀 PR Monitor Agent Starting...\n');

  const prs = getOpenPRs();

  if (prs.length === 0) {
    console.log('✨ No open PRs to monitor');
    return;
  }

  console.log('\n📊 Analyzing PRs...\n');

  let staleCount = 0;
  let conflictCount = 0;
  let ciFailureCount = 0;
  let draftCount = 0;

  for (const pr of prs) {
    console.log(`\n🔍 PR #${pr.number}: ${pr.title}`);

    const issues = [];

    // Check if draft
    if (pr.isDraft) {
      console.log(`  📝 Draft PR`);
      draftCount++;
    }

    // Check for stale PRs
    const staleCheck = checkStale(pr);
    if (staleCheck.isStale) {
      console.log(`  ⏰ Stale: ${staleCheck.daysOld} days without activity`);
      issues.push(`Stale: No activity for ${staleCheck.daysOld} days`);
      staleCount++;
    }

    // Check merge status
    const mergeStatus = checkMergeStatus(pr);
    if (mergeStatus.hasConflict) {
      console.log(`  ⚠️ Merge conflict detected`);
      issues.push('Has merge conflicts - needs resolution');
      conflictCount++;
    }

    // Check CI status
    const ciStatus = checkCIStatus(pr.number);
    if (ciStatus.hasChecks && !ciStatus.allPassed) {
      console.log(`  ❌ CI Failures: ${ciStatus.failedChecks.length}/${ciStatus.totalChecks} checks failed`);
      ciStatus.failedChecks.forEach(check => {
        issues.push(`CI Failed: ${check.name} (${check.conclusion})`);
      });
      ciFailureCount++;
    }

    // Create alert if issues found
    if (issues.length > 0) {
      createAlert(pr, issues);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Monitoring Summary:');
  console.log(`  📝 Draft PRs: ${draftCount}`);
  console.log(`  ⏰ Stale PRs: ${staleCount}`);
  console.log(`  ⚠️ PRs with conflicts: ${conflictCount}`);
  console.log(`  ❌ PRs with CI failures: ${ciFailureCount}`);
  console.log('='.repeat(60));

  if (staleCount + conflictCount + ciFailureCount > 0) {
    console.log('\n⚠️ Alerts created for PRs needing attention');
  } else {
    console.log('\n✨ All PRs look healthy!');
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  });
}

module.exports = { main };
