#!/usr/bin/env bash
# Install git hooks for .pip repository

set -e

HOOKS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GIT_HOOKS_DIR="$(git rev-parse --git-dir)/hooks"

echo "Installing git hooks..."

# Copy pre-commit hook
cp "$HOOKS_DIR/pre-commit" "$GIT_HOOKS_DIR/pre-commit"
chmod +x "$GIT_HOOKS_DIR/pre-commit"
echo "✅ Installed pre-commit hook (blocks commits to main)"

# Copy prepare-commit-msg if it exists
if [ -f "$HOOKS_DIR/prepare-commit-msg" ]; then
  cp "$HOOKS_DIR/prepare-commit-msg" "$GIT_HOOKS_DIR/prepare-commit-msg"
  chmod +x "$GIT_HOOKS_DIR/prepare-commit-msg"
  echo "✅ Installed prepare-commit-msg hook"
fi

echo ""
echo "Git hooks installed successfully!"
echo ""
echo "These hooks will:"
echo "  - Block direct commits to main branch"
echo "  - Check for secrets (if git-secrets is installed)"
echo ""
echo "To bypass hooks in emergency (NOT RECOMMENDED):"
echo "  git commit --no-verify"
echo ""
