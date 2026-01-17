#!/usr/bin/env node

const { Octokit } = require('@octokit/rest');
const fs = require('fs');

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

async function createSecurityIssue() {
  const issueBody = fs.readFileSync('security-issue.md', 'utf8');

  // Extract title from markdown (first H1)
  const titleMatch = issueBody.match(/^# (.+)$/m);
  const title = titleMatch ? titleMatch[1] : '🔴 CRITICAL: Multiple Security Vulnerabilities in Production Configuration';

  // Remove the title from body
  const body = issueBody.replace(/^# .+$/m, '').trim();

  try {
    const response = await octokit.issues.create({
      owner: 'derrybirkett',
      repo: 'frctls',
      title: title,
      body: body,
      labels: ['security', 'critical', 'high', 'roadmap', 'priority-high']
    });

    console.log(`✅ Issue created: #${response.data.number}`);
    console.log(`📋 URL: ${response.data.html_url}`);

    return response.data;
  } catch (error) {
    console.error('❌ Failed to create issue:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    process.exit(1);
  }
}

createSecurityIssue();
