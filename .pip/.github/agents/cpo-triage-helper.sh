#!/bin/bash
# CPO Triage Helper Script
# Helps CPO quickly review and approve/reject agent suggestions
set -e

echo "📋 CPO Roadmap Triage Helper"
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
  echo "❌ Error: GitHub CLI (gh) is not installed"
  echo "Install it from: https://cli.github.com/"
  exit 1
fi

# Check if jq is installed
if ! command -v jq &> /dev/null; then
  echo "⚠️  Warning: jq is not installed (optional, but recommended)"
  echo "Install it with: brew install jq (macOS) or apt-get install jq (Linux)"
fi

echo "Fetching pending approvals..."
echo ""

# Show pending approvals
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PENDING APPROVALS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if command -v jq &> /dev/null; then
  gh issue list --label needs-approval --json number,title,createdAt,labels | \
    jq -r '.[] | "#\(.number) - \(.title)\n  Created: \(.createdAt | fromdateiso8601 | strftime("%Y-%m-%d"))\n  Labels: \(.labels | map(.name) | join(", "))\n"'
else
  gh issue list --label needs-approval
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "COMMANDS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Approve:  gh issue edit <N> --add-label roadmap --remove-label needs-approval"
echo "  Reject:   gh issue close <N> --reason 'not planned'"
echo "  Defer:    gh issue edit <N> --add-label backlog"
echo "  View:     gh issue view <N> --web"
echo ""

# Interactive approval
read -p "Issue number to approve (or press Enter to skip): " issue_num

if [ -n "$issue_num" ]; then
  echo ""
  echo "📖 Viewing issue #$issue_num..."
  gh issue view "$issue_num"
  echo ""
  
  read -p "Approve this issue? (y/N): " confirm
  
  if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
    # Get milestone for approval
    echo ""
    echo "Available milestones:"
    gh api repos/:owner/:repo/milestones --jq '.[] | "  \(.number). \(.title) (due: \(.due_on // "none"))"'
    echo ""
    read -p "Milestone number (or press Enter to skip): " milestone_num
    
    # Approve the issue
    gh issue edit "$issue_num" --add-label roadmap --remove-label needs-approval
    
    if [ -n "$milestone_num" ]; then
      gh issue edit "$issue_num" --milestone "$milestone_num"
    fi
    
    echo "✅ Issue #$issue_num approved and added to roadmap!"
    
    # Ask if user wants to continue
    echo ""
    read -p "Review another issue? (y/N): " continue_review
    
    if [ "$continue_review" = "y" ] || [ "$continue_review" = "Y" ]; then
      exec "$0"  # Re-run the script
    fi
  else
    echo "❌ Approval cancelled"
  fi
else
  echo "👋 Exiting triage helper"
fi
