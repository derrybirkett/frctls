#!/usr/bin/env node

/**
 * Workflow Health Check - Proactive CI/CD monitoring and diagnostics
 * Scans all GitHub Actions workflows for failures, issues, and health metrics
 * Part of COO operational excellence monitoring
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

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
    console.error(error.stderr || error.message);
    return null;
  }
}

/**
 * Get all workflows and their recent run status
 */
function getAllWorkflows() {
  console.log('📊 Fetching all workflows...\n');
  
  const workflowsJson = exec('gh workflow list --json id,name,state,path', { silent: true });
  if (!workflowsJson) {
    console.error('❌ Failed to fetch workflows');
    return [];
  }
  
  return JSON.parse(workflowsJson);
}

/**
 * Get recent runs for a specific workflow
 */
function getWorkflowRuns(workflowId, limit = 10) {
  const runsJson = exec(
    `gh run list --workflow=${workflowId} --limit=${limit} --json conclusion,status,createdAt,databaseId,name`,
    { silent: true }
  );
  
  if (!runsJson) return [];
  return JSON.parse(runsJson);
}

/**
 * Calculate workflow health metrics
 */
function calculateHealthMetrics(runs) {
  if (!runs || runs.length === 0) {
    return {
      totalRuns: 0,
      successRate: 0,
      failureRate: 0,
      successCount: 0,
      failureCount: 0,
      skippedCount: 0,
      status: 'unknown',
    };
  }
  
  const completed = runs.filter(r => r.status === 'completed');
  const successCount = completed.filter(r => r.conclusion === 'success').length;
  const failureCount = completed.filter(r => r.conclusion === 'failure').length;
  const skippedCount = completed.filter(r => r.conclusion === 'skipped').length;
  
  const successRate = completed.length > 0 ? (successCount / completed.length) * 100 : 0;
  const failureRate = completed.length > 0 ? (failureCount / completed.length) * 100 : 0;
  
  let status = 'healthy';
  if (failureRate > 50) {
    status = 'critical';
  } else if (failureRate > 20) {
    status = 'degraded';
  } else if (failureCount > 0) {
    status = 'warning';
  }
  
  return {
    totalRuns: runs.length,
    successRate: Math.round(successRate),
    failureRate: Math.round(failureRate),
    successCount,
    failureCount,
    skippedCount,
    status,
  };
}

/**
 * Check for common workflow configuration issues
 */
function checkWorkflowConfiguration() {
  console.log('\n🔍 Checking workflow configuration files...\n');
  
  const workflowDir = path.join(process.cwd(), '.github/workflows');
  const issues = [];
  
  if (!fs.existsSync(workflowDir)) {
    return [{ severity: 'error', message: 'Workflows directory not found' }];
  }
  
  const workflowFiles = fs.readdirSync(workflowDir).filter(f => f.endsWith('.yml') || f.endsWith('.yaml'));
  
  workflowFiles.forEach(file => {
    const filePath = path.join(workflowDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for common issues
    if (content.includes('${{ secrets.OPENAI }}') && !content.includes('OPENAI_API_KEY')) {
      issues.push({
        severity: 'warning',
        file,
        message: 'Uses OPENAI secret but may not map it correctly to OPENAI_API_KEY',
      });
    }
    
    if (content.includes('npm install') && !content.includes('cd .github/agents')) {
      const hasPackageJson = content.includes('package.json');
      if (!hasPackageJson) {
        issues.push({
          severity: 'info',
          file,
          message: 'Contains npm install - verify package.json location',
        });
      }
    }
    
    // Check for missing error handling
    if (content.includes('run: |') && !content.includes('set -e') && !content.includes('||')) {
      issues.push({
        severity: 'info',
        file,
        message: 'Multi-line script without explicit error handling',
      });
    }
  });
  
  return issues;
}

/**
 * Generate health report
 */
function generateHealthReport(workflows) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalWorkflows: workflows.length,
      healthy: 0,
      warning: 0,
      degraded: 0,
      critical: 0,
    },
    workflows: [],
  };
  
  workflows.forEach(workflow => {
    const runs = getWorkflowRuns(workflow.id, 10);
    const metrics = calculateHealthMetrics(runs);
    
    const workflowReport = {
      name: workflow.name,
      state: workflow.state,
      path: workflow.path,
      ...metrics,
    };
    
    report.workflows.push(workflowReport);
    
    // Update summary
    switch (metrics.status) {
      case 'healthy':
        report.summary.healthy++;
        break;
      case 'warning':
        report.summary.warning++;
        break;
      case 'degraded':
        report.summary.degraded++;
        break;
      case 'critical':
        report.summary.critical++;
        break;
    }
  });
  
  return report;
}

/**
 * Display health report
 */
function displayHealthReport(report) {
  console.log('\n' + '='.repeat(80));
  console.log('                   CI/CD WORKFLOW HEALTH REPORT');
  console.log('='.repeat(80) + '\n');
  
  console.log(`📅 Generated: ${report.timestamp}\n`);
  
  console.log('📊 SUMMARY');
  console.log(`   Total Workflows: ${report.summary.totalWorkflows}`);
  console.log(`   ✅ Healthy:      ${report.summary.healthy}`);
  console.log(`   ⚠️  Warning:      ${report.summary.warning}`);
  console.log(`   🔶 Degraded:     ${report.summary.degraded}`);
  console.log(`   🔴 Critical:     ${report.summary.critical}\n`);
  
  console.log('=' + '='.repeat(79) + '\n');
  console.log('WORKFLOW DETAILS\n');
  
  // Sort by status (critical first)
  const sortedWorkflows = report.workflows.sort((a, b) => {
    const order = { critical: 0, degraded: 1, warning: 2, healthy: 3, unknown: 4 };
    return order[a.status] - order[b.status];
  });
  
  sortedWorkflows.forEach(wf => {
    const statusIcon = {
      healthy: '✅',
      warning: '⚠️',
      degraded: '🔶',
      critical: '🔴',
      unknown: '❓',
    }[wf.status];
    
    console.log(`${statusIcon} ${wf.name}`);
    console.log(`   State: ${wf.state}`);
    console.log(`   Last ${wf.totalRuns} runs: ${wf.successCount} success, ${wf.failureCount} failures, ${wf.skippedCount} skipped`);
    console.log(`   Success Rate: ${wf.successRate}%`);
    
    if (wf.failureCount > 0) {
      console.log(`   ⚠️  Action Required: ${wf.failureCount} recent failure(s)`);
    }
    console.log();
  });
}

/**
 * Display configuration issues
 */
function displayConfigIssues(issues) {
  if (issues.length === 0) {
    console.log('✅ No configuration issues detected\n');
    return;
  }
  
  console.log('=' + '='.repeat(79));
  console.log('\n⚙️  CONFIGURATION ISSUES\n');
  
  const errors = issues.filter(i => i.severity === 'error');
  const warnings = issues.filter(i => i.severity === 'warning');
  const info = issues.filter(i => i.severity === 'info');
  
  if (errors.length > 0) {
    console.log('🔴 ERRORS:');
    errors.forEach(issue => {
      console.log(`   - [${issue.file}] ${issue.message}`);
    });
    console.log();
  }
  
  if (warnings.length > 0) {
    console.log('⚠️  WARNINGS:');
    warnings.forEach(issue => {
      console.log(`   - [${issue.file}] ${issue.message}`);
    });
    console.log();
  }
  
  if (info.length > 0) {
    console.log('ℹ️  INFO:');
    info.forEach(issue => {
      console.log(`   - [${issue.file}] ${issue.message}`);
    });
    console.log();
  }
}

/**
 * Check if action is required
 */
function requiresAction(report) {
  return report.summary.critical > 0 || report.summary.degraded > 0;
}

/**
 * Generate recommended actions
 */
function generateRecommendations(report) {
  console.log('=' + '='.repeat(79));
  console.log('\n💡 RECOMMENDED ACTIONS\n');
  
  const criticalWorkflows = report.workflows.filter(w => w.status === 'critical');
  const degradedWorkflows = report.workflows.filter(w => w.status === 'degraded');
  
  if (criticalWorkflows.length > 0) {
    console.log('🚨 CRITICAL - Immediate Action Required:\n');
    criticalWorkflows.forEach(wf => {
      console.log(`   1. Investigate "${wf.name}"`);
      console.log(`      - ${wf.failureCount}/${wf.totalRuns} recent runs failed (${wf.failureRate}% failure rate)`);
      console.log(`      - Check logs: gh run list --workflow="${wf.name}"`);
      console.log(`      - Path: ${wf.path}\n`);
    });
  }
  
  if (degradedWorkflows.length > 0) {
    console.log('⚠️  DEGRADED - Action Recommended:\n');
    degradedWorkflows.forEach(wf => {
      console.log(`   • Review "${wf.name}"`);
      console.log(`     - Success rate: ${wf.successRate}%`);
      console.log(`     - Consider: flaky tests, dependency issues, or configuration drift\n`);
    });
  }
  
  if (criticalWorkflows.length === 0 && degradedWorkflows.length === 0) {
    console.log('✅ All workflows are operating within acceptable parameters.\n');
    console.log('   Continue monitoring for trends and patterns.\n');
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🏥 COO Workflow Health Check\n');
  console.log('Analyzing GitHub Actions CI/CD pipeline...\n');
  
  try {
    // Get all workflows
    const workflows = getAllWorkflows();
    
    if (workflows.length === 0) {
      console.error('❌ No workflows found');
      process.exit(1);
    }
    
    // Generate health report
    const report = generateHealthReport(workflows);
    
    // Check configuration
    const configIssues = checkWorkflowConfiguration();
    
    // Display results
    displayHealthReport(report);
    displayConfigIssues(configIssues);
    generateRecommendations(report);
    
    console.log('=' + '='.repeat(79) + '\n');
    
    // Exit with appropriate code
    if (report.summary.critical > 0) {
      console.error('❌ Health check FAILED: Critical issues detected\n');
      process.exit(1);
    } else if (report.summary.degraded > 0 || configIssues.some(i => i.severity === 'error')) {
      console.warn('⚠️  Health check WARNING: Issues detected\n');
      process.exit(0); // Don't fail, but warn
    } else {
      console.log('✅ Health check PASSED: All systems operational\n');
      process.exit(0);
    }
    
  } catch (error) {
    console.error('❌ Health check failed with error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { getAllWorkflows, calculateHealthMetrics, generateHealthReport };
