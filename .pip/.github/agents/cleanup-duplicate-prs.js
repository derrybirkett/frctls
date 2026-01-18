#!/usr/bin/env node

/**
 * Cleanup Duplicate Automated PRs
 * 
 * Helps organisms clean up duplicate PRs created by the autonomous agent
 * before duplicate prevention was implemented.
 * 
 * Usage:
 *   node .github/agents/cleanup-duplicate-prs.js [--dry-run] [--keep-oldest]
 */

const { execSync } = require('child_process');

/**
 * Execute shell command and return output
 */
function exec(command, options = {}) {
  try {
    const result = execSync(command, {
      encoding: 'utf8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options,
    });
    return result ? result.trim() : '';
  } catch (error) {
    if (options.silent) {
      return '';
    }
    console.error(`Command failed: ${command}`);
    throw error;
  }
}

/**
 * Get all automated PRs
 */
function getAutomatedPRs() {
  try {
    const prs = JSON.parse(
      exec('gh pr list --label automated --label roadmap --state open --json number,title,body,createdAt,headRefName', { silent: true })
    );
    return prs;
  } catch (error) {
    console.error('❌ Failed to fetch PRs:', error.message);
    return [];
  }
}

/**
 * Group PRs by issue number
 */
function groupPRsByIssue(prs) {
  const groups = {};
  
  for (const pr of prs) {
    // Extract issue number from PR body or title
    const body = pr.body || '';
    const issueMatch = body.match(/Fixes #(\d+)|Closes #(\d+)|#(\d+)/);
    const issueNumber = issueMatch ? (issueMatch[1] || issueMatch[2] || issueMatch[3]) : null;
    
    if (issueNumber) {
      if (!groups[issueNumber]) {
        groups[issueNumber] = [];
      }
      groups[issueNumber].push(pr);
    }
  }
  
  return groups;
}

/**
 * Find duplicates (multiple PRs for same issue)
 */
function findDuplicates(groups) {
  const duplicates = {};
  
  for (const [issueNumber, prs] of Object.entries(groups)) {
    if (prs.length > 1) {
      duplicates[issueNumber] = prs;
    }
  }
  
  return duplicates;
}

/**
 * Close PR
 */
function closePR(prNumber, dryRun) {
  if (dryRun) {
    console.log(`  [DRY RUN] Would close PR #${prNumber}`);
    return;
  }
  
  try {
    exec(`gh pr close ${prNumber} --comment "Closed by cleanup tool: duplicate PR detected"`, { silent: true });
    console.log(`  ✅ Closed PR #${prNumber}`);
  } catch (error) {
    console.error(`  ❌ Failed to close PR #${prNumber}:`, error.message);
  }
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const keepOldest = args.includes('--keep-oldest');
  
  console.log('🧹 Cleaning up duplicate automated PRs...\n');
  
  if (dryRun) {
    console.log('🔍 DRY RUN MODE - No PRs will be closed\n');
  }
  
  // Get all automated PRs
  const prs = getAutomatedPRs();
  
  if (prs.length === 0) {
    console.log('✅ No automated PRs found. Nothing to clean up.');
    return;
  }
  
  console.log(`📋 Found ${prs.length} automated PR(s)\n`);
  
  // Group by issue
  const groups = groupPRsByIssue(prs);
  
  // Find duplicates
  const duplicates = findDuplicates(groups);
  
  if (Object.keys(duplicates).length === 0) {
    console.log('✅ No duplicate PRs found. All good!');
    return;
  }
  
  console.log(`⚠️  Found ${Object.keys(duplicates).length} issue(s) with duplicate PRs:\n`);
  
  let totalClosed = 0;
  
  for (const [issueNumber, issuePRs] of Object.entries(duplicates)) {
    console.log(`Issue #${issueNumber} has ${issuePRs.length} PR(s):`);
    
    // Sort by creation date
    issuePRs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    
    // Keep the oldest or newest based on flag
    const toKeep = keepOldest ? issuePRs[0] : issuePRs[issuePRs.length - 1];
    const toClose = issuePRs.filter(pr => pr.number !== toKeep.number);
    
    console.log(`  📌 Keeping: PR #${toKeep.number} (${toKeep.headRefName})`);
    
    for (const pr of toClose) {
      closePR(pr.number, dryRun);
      if (!dryRun) {
        totalClosed++;
      }
    }
    
    console.log('');
  }
  
  if (dryRun) {
    console.log(`\n🔍 DRY RUN: Would close ${Object.values(duplicates).flat().length - Object.keys(duplicates).length} duplicate PR(s)`);
    console.log('Run without --dry-run to actually close them.');
  } else {
    console.log(`\n✅ Cleanup complete! Closed ${totalClosed} duplicate PR(s).`);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main, getAutomatedPRs, groupPRsByIssue, findDuplicates };
