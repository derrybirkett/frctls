#!/usr/bin/env node

/**
 * Branch Monitor Agent
 * Monitors branches for staleness and suggests cleanup
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
 * Get all branches with last commit info
 */
function getAllBranches() {
  console.log('📋 Fetching all branches...');

  try {
    const branches = JSON.parse(
      exec(
        'gh api repos/${{ github.repository }}/branches --paginate --jq ".[] | {name: .name, protected: .protected, commit: .commit.sha, lastCommit: .commit.commit.author.date}"',
        { silent: true }
      )
    );

    console.log(`✅ Found ${branches.length} branches`);
    return branches;
  } catch (error) {
    console.error('Failed to fetch branches:', error.message);
    return [];
  }
}

/**
 * Check if branch is stale
 */
function checkStale(branch, staleDays = 30) {
  const lastCommit = new Date(branch.lastCommit);
  const now = new Date();
  const daysOld = (now - lastCommit) / (1000 * 60 * 60 * 24);

  return {
    isStale: daysOld > staleDays,
    daysOld: Math.floor(daysOld),
    threshold: staleDays,
    lastCommitDate: lastCommit.toISOString().split('T')[0]
  };
}

/**
 * Check if branch is merged into main
 */
function isMergedIntoMain(branchName) {
  try {
    const merged = exec(
      `git merge-base --is-ancestor origin/${branchName} origin/main`,
      { silent: true }
    );
    return merged === '';
  } catch (error) {
    return false;
  }
}

/**
 * Check if branch has open PRs
 */
function hasOpenPRs(branchName) {
  try {
    const result = exec(
      `gh pr list --head ${branchName} --state open --json number`,
      { silent: true }
    );
    const prs = JSON.parse(result);
    return prs.length > 0;
  } catch (error) {
    return false;
  }
}

/**
 * Create alert issue for stale branch
 */
function createAlert(branch, staleInfo, merged, hasOpenPRs) {
  const isMerged = merged ? ' (merged into main)' : '';
  const hasActivePRs = hasOpenPRs ? ' (has open PRs)' : '';

  const issueBody = `## Stale Branch: ${branch.name}

**Details:**
- Last commit: ${staleInfo.lastCommitDate}
- Days since update: ${staleInfo.daysOld}
- Protected: ${branch.protected}${isMerged}${hasActivePRs}

**Recommendation:**
${merged && !hasOpenPRs ? `✅ Safe to delete - merged into main with no active PRs` : ''}
${!merged && !hasOpenPRs ? `⚠️ Not merged - consider rebasing or deleting if no longer needed` : ''}
${hasOpenPRs ? `📌 Has active PRs - keep until PRs are resolved` : ''}

**Action Required:**
- Review branch status
- Close/merge any associated PRs
- Delete branch if no longer needed

---
*Automated branch monitoring alert*`;

  const title = `🌿 Stale branch: ${branch.name}`;

  try {
    exec(
      `gh issue create --title "${title}" --body "${issueBody.replace(/"/g, '\\"')}" --label "branch-cleanup,stale"`,
      { silent: true }
    );
    console.log(`✅ Created alert for branch: ${branch.name}`);
  } catch (error) {
    console.error(`⚠️ Failed to create alert for branch: ${branch.name}`);
  }
}

/**
 * Main monitoring logic
 */
async function main() {
  console.log('🚀 Branch Monitor Agent Starting...\n');

  const branches = getAllBranches();

  if (branches.length === 0) {
    console.log('✨ No branches to monitor');
    return;
  }

  // Filter out main and develop branches
  const monitoredBranches = branches.filter(
    b => b.name !== 'main' && b.name !== 'develop' && !b.protected
  );

  console.log(`\n📊 Monitoring ${monitoredBranches.length} non-protected branches...\n`);

  let staleCount = 0;
  let mergedNotDeletedCount = 0;
  const staleBranches = [];

  for (const branch of monitoredBranches) {
    const staleInfo = checkStale(branch, 30); // 30 day threshold

    if (staleInfo.isStale) {
      console.log(`\n🌿 Stale branch: ${branch.name}`);
      console.log(`   Last commit: ${staleInfo.lastCommitDate}`);
      console.log(`   Days old: ${staleInfo.daysOld}`);

      const merged = isMergedIntoMain(branch.name);
      const hasOpenPRs = hasOpenPRs(branch.name);

      if (merged) {
        console.log(`   ✅ Merged into main`);
        mergedNotDeletedCount++;
      }

      if (hasOpenPRs) {
        console.log(`   📌 Has open PRs`);
      }

      staleBranches.push({
        name: branch.name,
        staleInfo,
        merged,
        hasOpenPRs
      });

      staleCount++;
    }
  }

  // Create alerts for stale branches
  console.log('\n📢 Creating alerts for stale branches...');
  for (const branch of staleBranches) {
    createAlert(branch, branch.staleInfo, branch.merged, branch.hasOpenPRs);
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Branch Monitoring Summary:');
  console.log(`  🌿 Total branches (non-protected): ${monitoredBranches.length}`);
  console.log(`  ⏰ Stale branches (>30 days): ${staleCount}`);
  console.log(`  ✅ Merged but not deleted: ${mergedNotDeletedCount}`);
  console.log('='.repeat(60));

  if (staleCount > 0) {
    console.log('\n⚠️ Alerts created for stale branches');
    console.log('💡 Consider deleting merged branches to keep repository clean');
  } else {
    console.log('\n✨ All branches are current!');
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
