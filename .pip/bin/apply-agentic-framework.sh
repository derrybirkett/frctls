#!/usr/bin/env bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PIP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET_DIR="${1:-$(pwd)}"

echo -e "${BLUE}╔═══════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║    Agentic Framework Setup 🤖                ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════╝${NC}"
echo
echo -e "${YELLOW}This will set up AI-first development with agent collaboration${NC}"
echo

# Function to ask yes/no questions
ask_yes_no() {
    local prompt="$1"
    local default="${2:-n}"
    local response

    if [ "$default" = "y" ]; then
        prompt="$prompt [Y/n]: "
    else
        prompt="$prompt [y/N]: "
    fi

    read -p "$prompt" response
    response=${response:-$default}
    if [[ "$response" =~ ^[Yy] ]]; then
        echo "true"
    else
        echo "false"
    fi
}

# Check if .pip directory exists
if [ ! -d "$TARGET_DIR/.pip" ]; then
    echo -e "${RED}Error: .pip directory not found in $TARGET_DIR${NC}"
    echo "Please run bootstrap.sh first or ensure .pip is properly set up"
    exit 1
fi

echo -e "${GREEN}📋 Select Agent Roles${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Configure agent roles for your project:"
echo

USE_CEO=$(ask_yes_no "  CEO (mission, strategy, cross-functional decisions)" "y")
USE_CTO=$(ask_yes_no "  CTO (technical architecture, delivery)" "y")
USE_CPO=$(ask_yes_no "  CPO (product roadmap, outcomes)" "y")
USE_CISO=$(ask_yes_no "  CISO (security, risk, compliance)" "y")
USE_CMO=$(ask_yes_no "  CMO (marketing, messaging, content)" "n")
USE_CRO=$(ask_yes_no "  CRO (revenue, pricing, growth)" "n")
USE_COO=$(ask_yes_no "  COO (delivery operations, release hygiene)" "y")

echo
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}Ready to apply agentic framework!${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo "Selected agents:"
agents=""
[ "$USE_CEO" = "true" ] && agents="$agents CEO"
[ "$USE_CTO" = "true" ] && agents="$agents CTO"
[ "$USE_CPO" = "true" ] && agents="$agents CPO"
[ "$USE_CISO" = "true" ] && agents="$agents CISO"
[ "$USE_CMO" = "true" ] && agents="$agents CMO"
[ "$USE_CRO" = "true" ] && agents="$agents CRO"
[ "$USE_COO" = "true" ] && agents="$agents COO"
echo "$agents"
echo

PROCEED=$(ask_yes_no "Proceed with setup?" "y")
if [ "$PROCEED" != "true" ]; then
    echo -e "${YELLOW}Setup cancelled${NC}"
    exit 0
fi

echo
echo -e "${GREEN}🚀 Setting up agentic framework...${NC}"
echo

# Create necessary directories
mkdir -p "$TARGET_DIR/.pip/ia/agents"
mkdir -p "$TARGET_DIR/.pip/docs/references"

# Copy agent manifest if not exists
if [ -f "$TARGET_DIR/.pip/ia/agent_manifest.yml" ]; then
    echo "⚠️  agent_manifest.yml already exists, skipping"
else
    cp "$PIP_DIR/ia/agent_manifest.yml" "$TARGET_DIR/.pip/ia/"
    echo -e "${GREEN}✅ Created agent_manifest.yml${NC}"
fi

# Copy selected agents
echo -e "${BLUE}👥 Setting up agent roles...${NC}"
[ "$USE_CEO" = "true" ] && {
    cp -r "$PIP_DIR/ia/agents/ceo" "$TARGET_DIR/.pip/ia/agents/" 2>/dev/null || echo "  CEO already configured"
    echo "  ✓ CEO"
}
[ "$USE_CTO" = "true" ] && {
    cp -r "$PIP_DIR/ia/agents/cto" "$TARGET_DIR/.pip/ia/agents/" 2>/dev/null || echo "  CTO already configured"
    echo "  ✓ CTO"
}
[ "$USE_CPO" = "true" ] && {
    cp -r "$PIP_DIR/ia/agents/cpo" "$TARGET_DIR/.pip/ia/agents/" 2>/dev/null || echo "  CPO already configured"
    echo "  ✓ CPO"
}
[ "$USE_CISO" = "true" ] && {
    cp -r "$PIP_DIR/ia/agents/ciso" "$TARGET_DIR/.pip/ia/agents/" 2>/dev/null || echo "  CISO already configured"
    echo "  ✓ CISO"
}
[ "$USE_CMO" = "true" ] && {
    cp -r "$PIP_DIR/ia/agents/cmo" "$TARGET_DIR/.pip/ia/agents/" 2>/dev/null || echo "  CMO already configured"
    echo "  ✓ CMO"
}
[ "$USE_CRO" = "true" ] && {
    cp -r "$PIP_DIR/ia/agents/cro" "$TARGET_DIR/.pip/ia/agents/" 2>/dev/null || echo "  CRO already configured"
    echo "  ✓ CRO"
}
[ "$USE_COO" = "true" ] && {
    cp -r "$PIP_DIR/ia/agents/coo" "$TARGET_DIR/.pip/ia/agents/" 2>/dev/null || echo "  COO already configured"
    echo "  ✓ COO"
}

# Copy core agentic framework documentation
echo
echo -e "${BLUE}📚 Setting up documentation...${NC}"

if [ -f "$PIP_DIR/AGENTS.md" ]; then
    cp "$PIP_DIR/AGENTS.md" "$TARGET_DIR/.pip/"
    echo -e "${GREEN}✅ Created AGENTS.md${NC}"
fi

if [ -f "$PIP_DIR/docs/agentic-benefits.md" ]; then
    cp "$PIP_DIR/docs/agentic-benefits.md" "$TARGET_DIR/.pip/docs/"
    echo -e "${GREEN}✅ Created agentic-benefits.md${NC}"
fi

# Copy method documentation
if [ -f "$PIP_DIR/method/delivery-method.md" ]; then
    cp "$PIP_DIR/method/delivery-method.md" "$TARGET_DIR/.pip/method/" 2>/dev/null || {
        mkdir -p "$TARGET_DIR/.pip/method"
        cp "$PIP_DIR/method/delivery-method.md" "$TARGET_DIR/.pip/method/"
    }
    echo -e "${GREEN}✅ Created delivery-method.md${NC}"
fi

# Copy agentic design patterns
if [ -f "$PIP_DIR/blog/2025-12-17-agentic-design-patterns.md" ]; then
    cp "$PIP_DIR/blog/2025-12-17-agentic-design-patterns.md" "$TARGET_DIR/.pip/docs/references/"
    echo -e "${GREEN}✅ Created agentic-design-patterns.md${NC}"
fi

if [ -f "$PIP_DIR/blog/2025-12-19-agent-workflow-documents.md" ]; then
    cp "$PIP_DIR/blog/2025-12-19-agent-workflow-documents.md" "$TARGET_DIR/.pip/docs/references/"
    echo -e "${GREEN}✅ Created agent-workflow-documents.md${NC}"
fi

# Copy agentic workflow template if not in docs/
if [ ! -f "$TARGET_DIR/docs/agentic.md" ] && [ -f "$PIP_DIR/docs/templates/organism-agentic.md" ]; then
    mkdir -p "$TARGET_DIR/docs"
    cp "$PIP_DIR/docs/templates/organism-agentic.md" "$TARGET_DIR/docs/agentic.md"
    echo -e "${GREEN}✅ Created docs/agentic.md${NC}"
fi

echo
echo -e "${GREEN}✨ Agentic framework setup complete! 🎉${NC}"
echo
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Read .pip/AGENTS.md to understand agent collaboration"
echo "  2. Update .pip/ia/agent_manifest.yml with owner assignments"
echo "  3. Review workflow patterns in .pip/docs/references/"
echo "  4. Read docs/agentic.md for your project's workflow guide"
echo
echo -e "${BLUE}Key Resources:${NC}"
echo "  • Agent governance: .pip/AGENTS.md"
echo "  • Benefits & patterns: .pip/docs/agentic-benefits.md"
echo "  • Delivery method: .pip/method/delivery-method.md"
echo "  • Design patterns: .pip/docs/references/agentic-design-patterns.md"
echo
echo -e "${GREEN}Happy agent-driven development! 🤖${NC}"
echo
