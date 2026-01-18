#!/usr/bin/env node

/**
 * COO Workflow Monitor Agent - Intelligent CI/CD failure triage and remediation
 * Monitors GitHub Actions workflows, analyzes failures, and auto-remediates when possible
 */

const { execSync } = require('child_process');
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');

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
    if (options.allowFailure) {
      return error.stdout?.trim() || '';
    }
    console.error(`Command failed: ${command}`);
    throw error;
  }
}

/**
 * Load COO workflow monitoring playbook for context
 */
function loadPlaybook() {
  const playbookPath = path.join(__dirname, '../../ia/agents/coo/workflow-monitoring-playbook.md');
  return fs.readFileSync(playbookPath, 'utf8');
}

/**
 * Get workflow run details
 */
function getWorkflowDetails() {
  console.log('📋 Fetching workflow run details...');
  
  const runId = process.env.WORKFLOW_RUN_ID;
  const workflowName = process.env.WORKFLOW_NAME || 'Unknown Workflow';
  const conclusion = process.env.WORKFLOW_CONCLUSION || 'failure';
  
  if (!runId) {
    throw new Error('WORKFLOW_RUN_ID environment variable not set');
  }
  
  // Get workflow run details including logs
  const runJson = exec(`gh run view ${runId} --json conclusion,name,headBranch,event,createdAt,url,jobs`, { silent: true });
  const run = JSON.parse(runJson);
  
  // Get logs for failed jobs
  const logs = exec(`gh run view ${runId} --log-failed`, { silent: true, allowFailure: true });
  
  return {
    ...run,
    logs: logs || 'No logs available',
    workflowName,
    conclusion,
  };
}

/**
 * Perform intelligent triage using OpenAI
 */
async function performTriage(workflow) {
  console.log('\n🔍 COO analyzing workflow failure...');
  
  const playbook = loadPlaybook();
  
  const prompt = `You are a COO agent monitoring CI/CD workflows. A workflow has failed and you need to triage it.

**Workflow Run Details:**
- **Name:** ${workflow.name}
- **Conclusion:** ${workflow.conclusion}
- **Branch:** ${workflow.headBranch}
- **Event:** ${workflow.event}
- **URL:** ${workflow.url}
- **Created:** ${workflow.createdAt}

**Failed Job Logs:**
\`\`\`
${workflow.logs.slice(0, 6000)}
\`\`\`

**Your Playbook Context:**
${playbook.slice(0, 4000)}

**Your Task:**
1. Classify the failure type (Branch Conflict, Test Failure, Dependency Issue, Security Scan, Infrastructure, Authentication)
2. Determine if this can be auto-remediated or needs escalation
3. If auto-remediation: specify exact commands to run
4. If escalation: specify which agent (CTO/CISO/CPO/CEO/CMO) and why
5. Provide a clear explanation for the team

**Response Format (JSON only):**
{
  "failure_type": "branch_conflict|test_failure|dependency_issue|security_scan|infrastructure|authentication|unknown",
  "severity": "critical|major|minor",
  "can_auto_remediate": true|false,
  "root_cause": "Brief diagnosis of what went wrong",
  "remediation_plan": {
    "approach": "describe the approach",
    "commands": ["array", "of", "shell", "commands"],
    "rationale": "why this approach"
  },
  "escalation": {
    "needed": true|false,
    "agent": "CTO|CISO|CPO|CEO|CMO",
    "priority": "P0|P1|P2|P3",
    "reason": "why escalating to this agent",
    "create_issue": true|false,
    "issue_title": "title if create_issue is true",
    "issue_body": "detailed issue description"
  },
  "communication": {
    "summary": "What happened and what was done",
    "impact": "Impact on delivery/timeline",
    "next_steps": "What happens next"
  }
}

**Guidelines:**
- Branch conflicts for automated/* branches: auto-remediate by deleting remote branch
- Test failures: always escalate to CTO
- Security scans: always escalate to CISO
- Infrastructure timeouts: retry once, then escalate if persistent
- Be decisive but cautious with destructive operations
- Follow the playbook's escalation guidelines strictly`;

  try {
    const response = await openai.chat.completions.create({
      model: CONFIG.model,
      messages: [
        {
          role: 'system',
          content: 'You are an experienced COO managing operational excellence. Be thorough, decisive, and follow the playbook. Respond only with valid JSON.',
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
 * Execute auto-remediation commands
 */
function executeRemediation(triage) {
  if (!triage.can_auto_remediate || !triage.remediation_plan.commands) {
    console.log('⏭️  No auto-remediation to perform');
    return { success: false, message: 'No remediation commands' };
  }

  console.log('\n🔧 Executing auto-remediation...');
  console.log(`Approach: ${triage.remediation_plan.approach}`);
  
  try {
    for (const command of triage.remediation_plan.commands) {
      console.log(`Running: ${command}`);
      exec(command, { silent: false });
    }
    
    console.log('✅ Auto-remediation completed successfully');
    return { success: true, message: 'Remediation completed' };
  } catch (error) {
    console.error('❌ Auto-remediation failed:', error.message);
    return { success: false, message: error.message };
  }
}

/**
 * Post triage results as workflow comment
 */
function postTriageResults(workflow, triage, remediationResult) {
  console.log('\n📝 Posting triage results...');

  const icons = {
    branch_conflict: '🔀',
    test_failure: '🧪',
    dependency_issue: '📦',
    security_scan: '🔒',
    infrastructure: '⚙️',
    authentication: '🔑',
    unknown: '❓',
  };

  const severityEmoji = {
    critical: '🔴',
    major: '🟡',
    minor: '🔵',
  };

  let comment = `## ${icons[triage.failure_type] || '❓'} COO Workflow Triage Report

**Workflow:** ${workflow.name}
**Run:** ${workflow.url}
**Branch:** ${workflow.headBranch}

---

### ${severityEmoji[triage.severity]} Failure Classification

**Type:** ${triage.failure_type.replace(/_/g, ' ').toUpperCase()}
**Severity:** ${triage.severity.toUpperCase()}

**Root Cause:**
${triage.root_cause}

---
`;

  if (triage.can_auto_remediate) {
    comment += `### 🔧 Auto-Remediation ${remediationResult.success ? 'Completed' : 'Attempted'}

**Approach:** ${triage.remediation_plan.approach}
**Rationale:** ${triage.remediation_plan.rationale}

`;
    
    if (remediationResult.success) {
      comment += `✅ **Status:** Successfully remediated\n\n`;
    } else {
      comment += `❌ **Status:** Remediation failed - ${remediationResult.message}\n\n`;
    }
  }

  if (triage.escalation.needed) {
    const priorityEmoji = { P0: '🔴', P1: '🟡', P2: '🔵', P3: '⚪' };
    comment += `### 📢 Escalation Required

**Agent:** ${triage.escalation.agent}
**Priority:** ${priorityEmoji[triage.escalation.priority]} ${triage.escalation.priority}
**Reason:** ${triage.escalation.reason}

`;
  }

  comment += `### 📊 Summary

${triage.communication.summary}

**Impact:** ${triage.communication.impact}
**Next Steps:** ${triage.communication.next_steps}

---
*Automated triage by COO Workflow Monitor Agent*`;

  // Post as issue comment on the workflow run
  try {
    // Create a comment on the repo about this workflow failure
    const repo = exec('gh repo view --json nameWithOwner -q .nameWithOwner', { silent: true });
    const [owner, repoName] = repo.split('/');
    
    // Use GitHub CLI to create an issue comment or discussion
    // For now, we'll output to the workflow logs
    console.log('\n' + '='.repeat(80));
    console.log(comment);
    console.log('='.repeat(80) + '\n');
    
    // Save triage report to file for workflow artifacts
    fs.writeFileSync('/tmp/coo-triage-report.md', comment);
    console.log('📄 Triage report saved to /tmp/coo-triage-report.md');
    
  } catch (error) {
    console.error('⚠️  Failed to post comment:', error.message);
  }
}

/**
 * Create escalation issue
 */
function createEscalationIssue(triage) {
  if (!triage.escalation.needed || !triage.escalation.create_issue) {
    return;
  }

  console.log('\n📋 Creating escalation issue...');

  const labels = [`agent:${triage.escalation.agent.toLowerCase()}`, triage.escalation.priority.toLowerCase()];
  
  if (triage.failure_type !== 'unknown') {
    labels.push(`workflow:${triage.failure_type}`);
  }

  try {
    const issueBody = `${triage.escalation.issue_body}

---

**Workflow Details:**
- **Run:** ${process.env.WORKFLOW_URL || 'N/A'}
- **Branch:** ${process.env.WORKFLOW_BRANCH || 'N/A'}
- **Failure Type:** ${triage.failure_type}
- **Severity:** ${triage.severity}

**Root Cause:**
${triage.root_cause}

---
*Created by COO Workflow Monitor Agent*`;

    exec(`gh issue create --title "${triage.escalation.issue_title}" --body "${issueBody.replace(/"/g, '\\"')}" --label "${labels.join(',')}"`, { silent: false });
    console.log('✅ Escalation issue created');
  } catch (error) {
    console.error('❌ Failed to create issue:', error.message);
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('🏗️  COO Workflow Monitor Agent Starting...\n');

    // Get workflow details
    const workflow = getWorkflowDetails();
    
    // Perform intelligent triage
    const triage = await performTriage(workflow);
    
    // Execute auto-remediation if applicable
    const remediationResult = executeRemediation(triage);
    
    // Post triage results
    postTriageResults(workflow, triage, remediationResult);
    
    // Create escalation issue if needed
    createEscalationIssue(triage);

    console.log('\n✅ COO Workflow Monitor completed successfully');
    
    // Exit with appropriate code
    if (triage.severity === 'critical' && !remediationResult.success) {
      process.exit(1);
    }
    
  } catch (error) {
    console.error('\n❌ COO Workflow Monitor failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main, performTriage, executeRemediation };
