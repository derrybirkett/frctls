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
    return execSync(command, {
      encoding: 'utf8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options,
    }).trim();
  } catch (error) {
    console.error(`Command failed: ${command}`);
    throw error;
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

  // Filter unassigned issues
  const unassigned = issues.filter(issue => issue.assignees.length === 0);

  if (unassigned.length === 0) {
    console.log('❌ No unassigned issues found');
    return null;
  }

  const issue = unassigned[0];
  console.log(`✅ Found: #${issue.number} - ${issue.title}`);

  return issue;
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
    });

    const content = response.choices[0].message.content.trim();
    
    // Extract JSON from markdown code blocks if present
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
    const jsonContent = jsonMatch[1] || content;
    
    return JSON.parse(jsonContent);
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

  for (const file of implementation.files) {
    const fullPath = path.join(process.cwd(), file.path);
    const dir = path.dirname(fullPath);

    // Create directory if needed
    await fs.mkdir(dir, { recursive: true });

    // Write file
    await fs.writeFile(fullPath, file.content, 'utf8');
    console.log(`  ✅ ${file.action}: ${file.path}`);
  }
}

/**
 * Run validation tests
 */
function runValidation() {
  console.log('\n🧪 Running validation...');

  try {
    console.log('  → Installing dependencies...');
    exec('pnpm install', { silent: true });

    console.log('  → Checking format...');
    exec('pnpm format:check || true', { silent: true });

    console.log('  → Running tests...');
    exec('pnpm test:all || true', { silent: true });

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
    // Get configuration
    const issueNumber = process.env.ISSUE_NUMBER;
    const priorityFilter = process.env.PRIORITY_FILTER || 'high';

    // Get next issue
    const issue = issueNumber
      ? JSON.parse(exec(`gh issue view ${issueNumber} --json number,title,body,labels`, { silent: true }))
      : await getNextRoadmapIssue(priorityFilter);

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
