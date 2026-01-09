#!/usr/bin/env bash

# Pre-commit hook to enforce .pip framework guidelines
# 1. Prevent direct commits to main/master
# 2. Check for secrets (if git-secrets is installed)

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get current branch name
current_branch=$(git symbolic-ref --short HEAD 2>/dev/null)

# Check if committing directly to main or master
if [ "$current_branch" = "main" ] || [ "$current_branch" = "master" ]; then
    echo -e "${RED}❌ ERROR: Direct commits to '$current_branch' are not allowed!${NC}"
    echo ""
    echo -e "${YELLOW}The .pip framework requires using feature branches.${NC}"
    echo ""
    echo "Please use this workflow:"
    echo "  1. Create a feature branch:"
    echo "     git checkout -b feat/your-feature"
    echo ""
    echo "  2. Make your changes and commit:"
    echo "     git add ."
    echo "     git commit -m 'your message'"
    echo ""
    echo "  3. Push and create a PR:"
    echo "     git push origin feat/your-feature"
    echo "     gh pr create"
    echo ""
    echo -e "${YELLOW}To bypass this check (emergencies only):${NC}"
    echo "  git commit --no-verify -m 'emergency commit'"
    echo ""
    exit 1
fi

# Run git-secrets check if available
if command -v git-secrets &> /dev/null; then
    git secrets --pre_commit_hook -- "$@"
fi

exit 0
