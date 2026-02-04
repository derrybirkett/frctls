#!/bin/bash

# Script to close useless automated roadmap PRs
# These PRs were created by the autonomous-roadmap-agent workflow
# before the scheduled triggers were removed.

set -e

REPO="derrybirkett/frctls"

echo "🧹 Closing useless automated roadmap PRs..."
echo ""

# PRs 97-124 are the automated roadmap PRs that need to be closed
for pr_number in {97..124}; do
    echo "Checking PR #$pr_number..."
    
    # Get PR details
    pr_state=$(gh pr view $pr_number --repo $REPO --json state --jq '.state' 2>/dev/null || echo "not_found")
    
    if [ "$pr_state" = "OPEN" ]; then
        pr_title=$(gh pr view $pr_number --repo $REPO --json title --jq '.title' 2>/dev/null || echo "")
        
        # Only close PRs with the automated roadmap title
        if [[ "$pr_title" == *"[Auto] Implement roadmap task"* ]]; then
            echo "  Closing PR #$pr_number: $pr_title"
            gh pr close $pr_number --repo $REPO --comment "Closing this automated PR as it was created by a scheduled workflow that has been disabled. These PRs were not properly reviewed or completed." || echo "  Failed to close PR #$pr_number"
        else
            echo "  Skipping PR #$pr_number (not an automated roadmap PR): $pr_title"
        fi
    else
        echo "  Skipping PR #$pr_number (already $pr_state)"
    fi
    
    echo ""
done

echo "✅ Cleanup complete!"
