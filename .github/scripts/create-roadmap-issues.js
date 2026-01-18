#!/usr/bin/env node

/**
 * Create GitHub issues from code review recommendations
 * Usage: node create-roadmap-issues.js [--dry-run] [--priority=HP|MP|LP]
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const priorityFilter = args.find(arg => arg.startsWith('--priority='))?.split('=')[1];

// Issue templates data
const recommendations = {
  HP: [
    {
      id: 'HP-1',
      title: 'Fix GitHub URLs configuration in astro.config.mjs',
      labels: ['roadmap', 'priority-high', 'config', 'quick-win', 'automated'],
      effort: '10 minutes',
      files: ['apps/blog/astro.config.mjs'],
      description: `**Current Issue**: Hardcoded personal GitHub username instead of organization name

**Current Code**:
\`\`\`javascript
site: 'https://derrybirkett.github.io',
base: '/frctls',
\`\`\`

**Expected**: Should match actual deployment URL or be environment-based

**Impact**: 
- Broken canonical URLs
- Incorrect sitemap entries
- SEO issues`,
      acceptance: `- [ ] astro.config.mjs uses correct GitHub organization URL
- [ ] Sitemap.xml generates correct URLs
- [ ] RSS feed has correct base URL
- [ ] Build succeeds without warnings
- [ ] Tests pass`,
      testing: `1. Update astro.config.mjs with correct URL
2. Run \`pnpm build\` in apps/blog
3. Check generated sitemap.xml for correct URLs
4. Verify RSS feed URLs
5. Test deployment preview`
    },
    {
      id: 'HP-2',
      title: 'Replace hardcoded database credentials with environment variables',
      labels: ['roadmap', 'priority-high', 'security'],
      effort: '30 minutes',
      files: ['docker-compose.yml', '.env.example', 'docs/'],
      description: `**Security Issue**: Database credentials committed in plain text in docker-compose.yml

**Current State**:
\`\`\`yaml
POSTGRES_DB: nexus
POSTGRES_USER: nexus
POSTGRES_PASSWORD: nexus
\`\`\`

**Required Changes**:
1. Create \`.env.example\` with placeholder values
2. Update docker-compose.yml to use environment variables
3. Add \`.env\` to .gitignore (verify)
4. Document setup in README.md

**Impact**: Critical security vulnerability - credentials exposed in git history`,
      acceptance: `- [ ] .env.example created with all required variables
- [ ] docker-compose.yml uses \${VARIABLE:-default} syntax
- [ ] .env added to .gitignore
- [ ] README.md documents environment setup
- [ ] Containers start successfully with env vars
- [ ] No credentials in git history (future commits)`,
      testing: `1. Create .env from .env.example
2. Run \`docker compose up -d\`
3. Verify containers start
4. Check database connectivity
5. Run \`git grep -i password\` to verify no plaintext creds`
    },
    {
      id: 'HP-3',
      title: 'Enhance root package.json with workspace scripts',
      labels: ['roadmap', 'priority-high', 'config', 'dx', 'automated'],
      effort: '15 minutes',
      files: ['package.json'],
      description: `**Issue**: Root package.json lacks workspace-level scripts and metadata

**Missing**:
- Workspace scripts (build, test, lint)
- Repository information
- Proper description
- Author/license info

**Add Scripts**:
\`\`\`json
{
  "scripts": {
    "build": "nx run-many -t build",
    "test": "nx run-many -t test",
    "test:all": "nx run-many -t test test:e2e",
    "lint": "nx run-many -t lint",
    "format": "nx format:write",
    "format:check": "nx format:check"
  }
}
\`\`\`

**Impact**: Improves developer experience and enables CI/CD optimizations`,
      acceptance: `- [ ] All workspace scripts added
- [ ] Repository metadata populated
- [ ] \`pnpm build\` works at root level
- [ ] \`pnpm test\` works at root level
- [ ] Scripts documented in README`,
      testing: `1. Add scripts to package.json
2. Run \`pnpm build\` from root
3. Run \`pnpm test\` from root
4. Verify all workspace projects build/test
5. Test in CI environment`
    },
    {
      id: 'HP-4',
      title: 'Configure Nx caching for faster builds',
      labels: ['roadmap', 'priority-high', 'performance', 'dx'],
      effort: '20 minutes',
      files: ['nx.json'],
      description: `**Issue**: Not leveraging Nx's caching and task pipeline features

**Current**: Minimal nx.json without caching configuration

**Required**: Add targetDefaults with caching, inputs, outputs

**Benefits**:
- 50-80% faster builds/tests with caching
- Better CI/CD performance
- Improved local development experience

**See**: Full configuration example in code-review-recommendations.md HP-4`,
      acceptance: `- [ ] targetDefaults configured for build, test, lint
- [ ] Cache inputs/outputs defined
- [ ] Task dependencies configured
- [ ] Cache working (second run faster)
- [ ] "Nx read the output from cache" message appears`,
      testing: `1. Add targetDefaults to nx.json
2. Run \`nx build blog\` twice
3. Verify cache hit on second run
4. Check for cache messages in output
5. Measure time difference (should be 50%+ faster)`
    }
  ],
  MP: [
    {
      id: 'MP-1',
      title: 'Expand test coverage to >70%',
      labels: ['roadmap', 'priority-medium', 'testing'],
      effort: '4-6 hours',
      files: ['apps/blog/src/**/*.test.ts', 'apps/blog/e2e/**/*.spec.ts'],
      description: `**Current**: Only 1 test file (consts.test.ts)
**Target**: >70% coverage for critical paths

**Required Tests**:
1. Component tests (Header, Footer, FormattedDate)
2. Content validation tests
3. E2E navigation tests
4. RSS feed validation

**Impact**: Increase confidence in changes, catch regressions early`,
      acceptance: `- [ ] Component tests added for Header, Footer, FormattedDate
- [ ] Content validation tests added
- [ ] E2E tests expanded
- [ ] Coverage report shows >70%
- [ ] All tests passing`,
      testing: `1. Run \`pnpm test:all\`
2. Check coverage report
3. Verify all critical paths tested
4. Run tests in CI`
    },
    {
      id: 'MP-2',
      title: 'Add pre-commit hooks for code quality',
      labels: ['roadmap', 'priority-medium', 'dx', 'testing'],
      effort: '1 hour',
      files: ['.husky/', 'package.json'],
      description: `**Goal**: Prevent broken commits from reaching remote

**Add Checks**:
1. Format validation
2. Linting
3. Unit tests
4. Commit message format

**Impact**: Catch issues before push, maintain code quality`,
      acceptance: `- [ ] Husky installed and configured
- [ ] Pre-commit hook runs format check
- [ ] Pre-commit hook runs lint
- [ ] Pre-commit hook runs unit tests
- [ ] Commit-msg hook validates format
- [ ] Bad commits are blocked`,
      testing: `1. Make intentional formatting error
2. Attempt commit
3. Verify it's blocked
4. Fix and retry
5. Verify success`
    }
  ],
  LP: [
    {
      id: 'LP-1',
      title: 'Add VS Code workspace settings',
      labels: ['roadmap', 'priority-low', 'dx', 'quick-win', 'automated'],
      effort: '10 minutes',
      files: ['.vscode/settings.json'],
      description: `**Goal**: Consistent editor configuration for all contributors

**Settings**: formatOnSave, codeActionsOnSave, file exclusions

**Impact**: Better developer experience, consistent code style`,
      acceptance: `- [ ] .vscode/settings.json created
- [ ] Format on save enabled
- [ ] ESLint auto-fix enabled
- [ ] File exclusions configured`,
      testing: `1. Open in VS Code
2. Make changes to file
3. Save and verify auto-formatting
4. Verify excluded files hidden`
    }
  ]
};

// Generate issue body
function generateIssueBody(rec) {
  return `## 🎯 Task: ${rec.id}

**Effort Estimate**: ${rec.effort}

## 📋 Description

${rec.description}

## 📁 Files to Modify

${rec.files.map(f => `- \`${f}\``).join('\n')}

## ✅ Acceptance Criteria

${rec.acceptance}

## 🧪 Test Plan

${rec.testing}

## 🔗 Related

- **Roadmap**: [docs/code-review-recommendations.md](../docs/code-review-recommendations.md#${rec.id.toLowerCase()})
- **Priority**: ${rec.id.startsWith('HP') ? '🔴 High' : rec.id.startsWith('MP') ? '🟡 Medium' : '🟢 Low'}

---

*Created from code review recommendations roadmap*
`;
}

// Create issue using GitHub CLI
function createIssue(rec) {
  const title = `${rec.id}: ${rec.title}`;
  const body = generateIssueBody(rec);
  const labels = rec.labels.join(',');

  if (dryRun) {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`DRY RUN: Would create issue`);
    console.log(`Title: ${title}`);
    console.log(`Labels: ${labels}`);
    console.log(`\nBody:\n${body}`);
    return;
  }

  try {
    // Write body to temp file
    const tempFile = `/tmp/gh-issue-${rec.id}.md`;
    fs.writeFileSync(tempFile, body);

    // Create issue
    const result = execSync(
      `gh issue create --title "${title}" --body-file "${tempFile}" --label "${labels}"`,
      { encoding: 'utf-8' }
    );

    // Clean up
    fs.unlinkSync(tempFile);

    console.log(`✅ Created: ${title}`);
    console.log(`   ${result.trim()}`);
  } catch (error) {
    console.error(`❌ Failed to create ${rec.id}: ${error.message}`);
  }
}

// Main execution
function main() {
  console.log('🚀 Creating GitHub Issues from Roadmap Recommendations\n');

  if (dryRun) {
    console.log('⚠️  DRY RUN MODE - No issues will be created\n');
  }

  if (priorityFilter) {
    console.log(`📌 Filtering by priority: ${priorityFilter}\n`);
  }

  // Create issues by priority
  for (const [priority, items] of Object.entries(recommendations)) {
    if (priorityFilter && priority !== priorityFilter) {
      continue;
    }

    console.log(`\n${'='.repeat(80)}`);
    console.log(`${priority === 'HP' ? '🔴' : priority === 'MP' ? '🟡' : '🟢'} ${priority} Priority Issues`);
    console.log('='.repeat(80));

    for (const rec of items) {
      createIssue(rec);
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('✨ Done!');
  console.log('\nNext steps:');
  console.log('1. Review issues at: https://github.com/derrybirkett/frctls/issues');
  console.log('2. Add additional labels or assignments as needed');
  console.log('3. Create GitHub Project board to track progress');
  console.log('4. Start working on highest priority items');
}

main();
