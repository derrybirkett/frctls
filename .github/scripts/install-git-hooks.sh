#!/usr/bin/env bash

# Git hooks installation script
# Installs pre-commit hook to enforce .pip framework guidelines

HOOKS_DIR=".git/hooks"
SCRIPT_DIR=".github/scripts"

echo "🔧 Installing git hooks..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Install pre-commit hook
if [ -f "$SCRIPT_DIR/pre-commit-hook.sh" ]; then
    # Check if hook is already installed and up-to-date
    if [ -f "$HOOKS_DIR/pre-commit" ]; then
        if cmp -s "$SCRIPT_DIR/pre-commit-hook.sh" "$HOOKS_DIR/pre-commit"; then
            echo "✅ Pre-commit hook is already up-to-date"
        else
            cp "$SCRIPT_DIR/pre-commit-hook.sh" "$HOOKS_DIR/pre-commit"
            chmod +x "$HOOKS_DIR/pre-commit"
            echo "✅ Pre-commit hook updated"
        fi
    else
        cp "$SCRIPT_DIR/pre-commit-hook.sh" "$HOOKS_DIR/pre-commit"
        chmod +x "$HOOKS_DIR/pre-commit"
        echo "✅ Pre-commit hook installed"
    fi
else
    echo "❌ Error: pre-commit-hook.sh not found"
    exit 1
fi

echo ""
echo "🎉 Git hooks installed successfully!"
echo ""
echo "The pre-commit hook will now:"
echo "  • Prevent direct commits to main/master"
echo "  • Enforce feature branch workflow"
echo "  • Check for secrets (if git-secrets installed)"
echo ""
echo "To test: Try committing to main (it should fail)"
