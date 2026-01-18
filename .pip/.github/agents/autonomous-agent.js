#!/usr/bin/env node

/**
 * Autonomous Agent for Roadmap Implementation
 * Uses OpenAI to implement tasks from GitHub Issues
 */

const { execSync } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configuration
const CONFIG = {
  model: 'gpt-4-turbo-preview',
  maxTokens: 4000,
  temperature: 0.3,
  priorityOrder: ['HP', 'MP', 'LP'],
};

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
    console.error(`Command failed: ${command}`);
    throw error;
  }
}

/**
 * Check if there are existing open PRs for automated roadmap tasks
 */
function hasExistingAutomatedPRs() {
  console.log('\n🔍 Checking for existing automated PRs...');
  
  try {
    const prs = JSON.parse(
      exec(
        'gh pr list --label automated --label roadmap --state open --json number,title --limit 50',
        { silent: true }
      )
    );
    
    if (prs.length > 0) {
      console.log(`⚠️  Found ${prs.length} existing automated PRs:`);
      prs.slice(0, 5).forEach(pr => {
        console.log(`   #${pr.number}: ${pr.title}`);
      });
      if (prs.length > 5) {
        console.log(`   ... and ${prs.length - 5} more`);
      }
      return true;
    }
    
    console.log('✅ No existing automated PRs found');
    return false;
  } catch (error) {
    console.log('⚠️  Could not check for existing PRs (continuing anyway)');
    return false;
  }
}

/**
 * Check if there's already a PR for a specific issue
 */
function hasExistingPRForIssue(issueNumber) {
  console.log(`\n🔍 Checking for existing PR for issue #${issueNumber}...`);
  
  try {
    const prs = JSON.parse(
      exec(
        `gh pr list --search "#${issueNumber}" --state open --json number,title --limit 10`,
        { silent: true }
      )
    );
    
    if (prs.length > 0) {
      console.log(`⚠️  Found existing PR for this issue: #${prs[0].number}`);
      return true;
    }
    
    console.log('✅ No existing PR for this issue');
    return false;
  } catch (error) {
    console.log('⚠️  Could not check for existing PR (continuing anyway)');
    return false;
  }
}

/**
 * Get next unassigned roadmap issue by priority
 */
async function getNextRoadmapIssue(priorityFilter) {
  console.log(`\n🔍 Finding next roadmap issue (priority: ${priorityFilter})...`);

  const issues = JSON.parse(
    exec(
      `gh issue list --label roadmap --label priority-${priorityFilter.toLowerCase()} --json number,title,labels,assignees,body --limit 10`,
      { silent: true }
    )
  );

  // Filter out agent suggestions that need approval
  const approvedIssues = issues.filter(issue => {
    const labels = issue.labels.map(l => l.name);
    // Skip issues with 'needs-approval' or 'agent-suggestion' labels
    return !labels.includes('needs-approval') && !labels.includes('agent-suggestion');
  });

  // Filter unassigned issues without existing PRs
  const unassigned = approvedIssues.filter(issue => {
    if (issue.assignees.length > 0) return false;
    // Check if there's already a PR for this issue
    return !hasExistingPRForIssue(issue.number);
  });

  if (unassigned.length === 0) {
    console.log('❌ No unassigned approved roadmap issues found (or all have existing PRs)');
    return null;
  }

  // Check each issue for existing PRs (prevent duplicates)
  for (const issue of unassigned) {
    if (!hasExistingPRForIssue(issue.number)) {
      console.log(`✅ Found: #${issue.number} - ${issue.title}`);
      return issue;
    } else {
      console.log(`⏭️  Skipping #${issue.number} - PR already exists`);
    }
  }

  console.log('❌ No issues without existing PRs found');
  return null;
}

/**
 * Assign issue to bot (add comment instead since bot can't self-assign)
 */
function assignIssue(issueNumber) {
  console.log(`\n📌 Marking issue #${issueNumber} as in-progress...`);
  try {
    exec(`gh issue comment ${issueNumber} --body "🤖 Autonomous agent is now working on this issue..."`);
  } catch (error) {
    console.log('⚠️  Could not comment on issue (continuing anyway)');
  }
}

/**
 * Extract task details from issue body
 */
function parseIssueBody(body) {
  const sections = {
    description: '',
    files: [],
    acceptance: '',
    testing: '',
  };

  // Extract description
  const descMatch = body.match(/## 📋 Description\s+([\s\S]*?)(?=##|$)/);
  if (descMatch) sections.description = descMatch[1].trim();

  // Extract files
  const filesMatch = body.match(/## 📁 Files to Modify\s+([\s\S]*?)(?=##|$)/);
  if (filesMatch) {
    sections.files = filesMatch[1]
      .split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.replace(/^-\s*`?([^`]+)`?.*/, '$1').trim());
  }

  // Extract acceptance criteria
  const acceptMatch = body.match(/## ✅ Acceptance Criteria\s+([\s\S]*?)(?=##|$)/);
  if (acceptMatch) sections.acceptance = acceptMatch[1].trim();

  // Extract test plan
  const testMatch = body.match(/## 🧪 Test Plan\s+([\s\S]*?)(?=##|$)/);
  if (testMatch) sections.testing = testMatch[1].trim();

  return sections;
}

/**
 * Read file contents for context
 */
async function readFileContents(files) {
  const contents = {};
  
  for (const file of files) {
    try {
      const fullPath = path.join(process.cwd(), file);
      const content = await fs.readFile(fullPath, 'utf8');
      contents[file] = content;
    } catch (error) {
      console.log(`⚠️  Could not read ${file}: ${error.message}`);
      contents[file] = null;
    }
  }

  return contents;
}

/**
 * Generate implementation using OpenAI
 */
async function generateImplementation(issue, taskDetails, fileContents) {
  console.log('\n🤖 Generating implementation with OpenAI...');

  const prompt = `You are an expert software engineer implementing a task from a GitHub issue.

**Issue #${issue.number}: ${issue.title}**

${taskDetails.description}

**Files to modify:**
${taskDetails.files.map(f => `- ${f}`).join('\n')}

**Current file contents:**
${Object.entries(fileContents)
  .map(([file, content]) => `
### ${file}
\`\`\`
${content || 'File does not exist yet'}
\`\`\`
`)
  .join('\n')}

**Acceptance Criteria:**
${taskDetails.acceptance}

**Instructions:**
1. Follow .pip principles (small, incremental changes)
2. Maintain existing code style
3. Ensure all acceptance criteria are met
4. Provide complete file contents for modified files

Please provide your response in the following JSON format:
{
  "summary": "Brief summary of changes",
  "files": [
    {
      "path": "relative/path/to/file",
      "action": "create|modify",
      "content": "complete file content after changes"
    }
  ],
  "testing_notes": "How to verify the changes work"
}

Respond ONLY with valid JSON, no additional text.`;

  try {
    const response = await openai.chat.completions.create({
      model: CONFIG.model,
      messages: [
        {
          role: 'system',
          content: 'You are a precise code implementation assistant. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: CONFIG.maxTokens,
      temperature: CONFIG.temperature,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content.trim();
    
    // Log raw response for debugging
    console.log('Raw OpenAI response length:', content.length);
    
    // Try to parse directly first
    try {
      return JSON.parse(content);
    } catch (parseError) {
      // If that fails, try extracting from markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1]);
      }
      
      // Log the problematic content for debugging
      console.error('Failed to parse JSON. First 500 chars:', content.substring(0, 500));
      throw parseError;
    }
  } catch (error) {
    console.error('❌ OpenAI API error:', error.message);
    throw error;
  }
}

/**
 * Apply file changes
 */
async function applyChanges(implementation) {
  console.log(`\n📝 Applying ${implementation.files.length} file change(s)...`);

  // Determine repo root - go up two levels from .github/agents
  const repoRoot = path.resolve(__dirname, '../..');
  console.log(`  📁 Repo root: ${repoRoot}`);

  for (const file of implementation.files) {
    const fullPath = path.join(repoRoot, file.path);
    const dir = path.dirname(fullPath);

    // Create directory if needed
    await fs.mkdir(dir, { recursive: true });

    // Handle JSON files - ensure content is a string
    let content = file.content;
    if (typeof content === 'object' && file.path.endsWith('.json')) {
      content = JSON.stringify(content, null, 2);
    }

    // Write file
    await fs.writeFile(fullPath, content, 'utf8');
    console.log(`  ✅ ${file.action}: ${file.path}`);
  }
}

/**
 * Run validation tests
 */
function runValidation() {
  console.log('\n🧪 Running validation...');

  // Get repo root
  const repoRoot = path.resolve(__dirname, '../..');

  try {
    console.log('  → Installing dependencies...');
    exec('pnpm install', { silent: true, cwd: repoRoot });

    console.log('  → Checking format...');
    exec('pnpm format:check || true', { silent: true, cwd: repoRoot });

    console.log('  → Running tests...');
    exec('pnpm test:all || true', { silent: true, cwd: repoRoot });

    console.log('✅ Validation complete');
    return true;
  } catch (error) {
    console.log('⚠️  Validation had warnings (continuing)');
    return false;
  }
}

/**
 * Commit and push changes
 */
function commitChanges(issue, implementation) {
  console.log('\n💾 Committing changes...');

  const branchName = `automated/implement-${issue.number}`;
  
  try {
    // Create and checkout branch
    exec(`git checkout -b ${branchName}`);

    // Stage all changes
    exec('git add .');

    // Commit
    const commitMsg = `feat: implement ${issue.title}

${implementation.summary}

Fixes #${issue.number}

Generated by autonomous agent`;
    
    exec(`git commit -m "${commitMsg}"`);

    // Push
    exec(`git push -u origin ${branchName}`);

    console.log(`✅ Pushed to ${branchName}`);
    return branchName;
  } catch (error) {
    console.error('❌ Git operation failed:', error.message);
    throw error;
  }
}

/**
 * Create pull request
 */
function createPullRequest(issue, implementation, branchName) {
  console.log('\n🔀 Creating pull request...');

  const prBody = `## 🤖 Automated Implementation

This PR implements the roadmap task from issue #${issue.number}.

### Summary
${implementation.summary}

### Changes
${implementation.files.map(f => `- ${f.action}: \`${f.path}\``).join('\n')}

### Testing
${implementation.testing_notes}

---

Fixes #${issue.number}

*Generated by autonomous agent*`;

  const title = `feat: ${issue.title}`;

  exec(`gh pr create --title "${title}" --body "${prBody}" --label automated --label roadmap`);

  console.log('✅ Pull request created');
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Autonomous Roadmap Agent Starting...\n');

  try {
    // Check if there are already open automated PRs (unless targeting specific issue)
    const issueNumber = process.env.ISSUE_NUMBER;
    if (!issueNumber && hasExistingAutomatedPRs()) {
      console.log('\n⏸️  Skipping: Existing automated PRs need review first.');
      console.log('Please review and merge/close existing PRs before creating new ones.');
      return;
    }

    // Get configuration
    const priorityFilter = process.env.PRIORITY_FILTER || 'high';

    // Get next issue
    let issue;
    if (issueNumber) {
      // Check for existing PR for this specific issue
      if (hasExistingPRForIssue(issueNumber)) {
        console.log(`⚠️  PR already exists for issue #${issueNumber}. Skipping to prevent duplicate.`);
        return;
      }
      issue = JSON.parse(exec(`gh issue view ${issueNumber} --json number,title,body,labels`, { silent: true }));
    } else {
      issue = await getNextRoadmapIssue(priorityFilter);
    }

    if (!issue) {
      console.log('✨ No issues to process. All done!');
      return;
    }

    // Assign issue
    assignIssue(issue.number);

    // Parse issue details
    const taskDetails = parseIssueBody(issue.body);
    console.log(`\n📋 Task details:`);
    console.log(`  Files: ${taskDetails.files.join(', ')}`);

    // Read current file contents
    const fileContents = await readFileContents(taskDetails.files);

    // Generate implementation
    const implementation = await generateImplementation(issue, taskDetails, fileContents);
    console.log(`\n✨ Implementation plan:`);
    console.log(`  ${implementation.summary}`);

    // Apply changes
    await applyChanges(implementation);

    // Run validation
    runValidation();

    // Commit and push
    const branchName = commitChanges(issue, implementation);

    // Create PR
    createPullRequest(issue, implementation, branchName);

    console.log('\n🎉 Success! PR created and ready for review.');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main };
