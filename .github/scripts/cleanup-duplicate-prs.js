#!/usr/bin/env node

/**
 * Cleanup Duplicate Automated PRs
 * Closes duplicate automated PRs while keeping the most recent one for each issue
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
    console.error(`Command failed: ${command}`);
    throw error;
  }
}

/**
 * Get all open automated PRs
 */
function getAutomatedPRs() {
  console.log('🔍 Fetching automated PRs...\n');
  
  const prs = JSON.parse(
    exec(
      'gh pr list --label automated --label roadmap --state open --json number,title,createdAt,headRefName --limit 100',
      { silent: true }
    )
  );
  
  console.log(`Found ${prs.length} automated PRs\n`);
  return prs;
}

/**
 * Extract issue number from PR title or branch name
 */
function extractIssueNumber(pr) {
  // Try to extract from branch name first (automated/implement-123)
  const branchMatch = pr.headRefName.match(/implement-(\d+)/);
  if (branchMatch) return parseInt(branchMatch[1]);
  
  // Try to extract from title
  const titleMatch = pr.title.match(/#(\d+)/);
  if (titleMatch) return parseInt(titleMatch[1]);
  
  return null;
}

/**
 * Group PRs by issue number
 */
function groupPRsByIssue(prs) {
  const groups = {};
  const noIssue = [];
  
  prs.forEach(pr => {
    const issueNum = extractIssueNumber(pr);
    if (issueNum) {
      if (!groups[issueNum]) {
        groups[issueNum] = [];
      }
      groups[issueNum].push(pr);
    } else {
      noIssue.push(pr);
    }
  });
  
  return { groups, noIssue };
}

/**
 * Close a PR with a comment
 */
function closePR(prNumber, reason) {
  console.log(`  Closing PR #${prNumber}...`);
  
  try {
    exec(`gh pr close ${prNumber} --comment "${reason}"`, { silent: true });
    console.log(`  ✅ Closed PR #${prNumber}`);
    return true;
  } catch (error) {
    console.error(`  ❌ Failed to close PR #${prNumber}`);
    return false;
  }
}

/**
 * Main cleanup logic
 */
async function main() {
  console.log('🧹 Automated PR Cleanup Tool\n');
  console.log('This will close duplicate automated PRs, keeping the most recent one.\n');
  
  const prs = getAutomatedPRs();
  
  if (prs.length === 0) {
    console.log('✨ No automated PRs found. Nothing to clean up!');
    return;
  }
  
  const { groups, noIssue } = groupPRsByIssue(prs);
  
  let closedCount = 0;
  let keptCount = 0;
  
  // Process groups (PRs linked to issues)
  console.log('📋 Processing PRs by issue:\n');
  
  for (const [issueNum, issuePRs] of Object.entries(groups)) {
    if (issuePRs.length === 1) {
      console.log(`Issue #${issueNum}: 1 PR (keeping it)`);
      keptCount++;
      continue;
    }
    
    // Sort by creation date (newest first)
    issuePRs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    const keep = issuePRs[0];
    const close = issuePRs.slice(1);
    
    console.log(`\nIssue #${issueNum}: ${issuePRs.length} PRs found`);
    console.log(`  ✅ Keeping: PR #${keep.number} (most recent)`);
    console.log(`  ❌ Closing ${close.length} duplicate(s):`);
    
    for (const pr of close) {
      const reason = `🤖 Closing duplicate PR. A newer automated PR (#${keep.number}) exists for the same issue.`;
      if (closePR(pr.number, reason)) {
        closedCount++;
      }
    }
    
    keptCount++;
  }
  
  // Handle PRs without clear issue links
  if (noIssue.length > 0) {
    console.log(`\n\n⚠️  Found ${noIssue.length} PRs without clear issue links:`);
    noIssue.forEach(pr => {
      console.log(`  - PR #${pr.number}: ${pr.title}`);
    });
    console.log('\nThese were not automatically closed. Please review manually.');
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Cleanup Summary:');
  console.log(`  ✅ Kept: ${keptCount} PRs`);
  console.log(`  ❌ Closed: ${closedCount} duplicate PRs`);
  console.log(`  ⚠️  Needs manual review: ${noIssue.length} PRs`);
  console.log('='.repeat(50));
  
  if (closedCount > 0) {
    console.log('\n✨ Cleanup complete! Future runs will be prevented by the updated agent.');
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
