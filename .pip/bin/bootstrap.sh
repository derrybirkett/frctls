#!/usr/bin/env bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PIP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET_DIR="$(pwd)"

echo -e "${BLUE}╔═══════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║    .pip Project Bootstrap Wizard 🚀          ║${NC}"
echo -e "${BLUE}╔═══════════════════════════════════════════════╗${NC}"
echo
echo -e "${YELLOW}This wizard will help you set up .pip for your project${NC}"
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

# Function to ask text questions with defaults
ask_text() {
    local prompt="$1"
    local default="$2"
    local response
    
    if [ -n "$default" ]; then
        read -p "$prompt [$default]: " response
        echo "${response:-$default}"
    else
        read -p "$prompt: " response
        echo "$response"
    fi
}

# Check if we're in the right place
if [ "$TARGET_DIR" = "$PIP_DIR" ]; then
    echo -e "${RED}Error: You're running this from inside the .pip directory itself${NC}"
    echo "Please run this from your project root after adding .pip as a submodule"
    exit 1
fi

# Step 1: Project Info
echo -e "${GREEN}📝 Step 1: Project Information${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

PROJECT_NAME=$(ask_text "Project name" "$(basename "$TARGET_DIR")")
PROJECT_DESCRIPTION=$(ask_text "Brief description" "")
PROJECT_TYPE=$(ask_text "Project type (product/library/service/internal)" "product")

echo

# Step 2: Agentic Framework
echo -e "${GREEN}🤖 Step 2: Agentic Framework${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "The agentic framework enables AI-first development with:"
echo "  • Role-based agent collaboration (CEO, CTO, CPO, CISO, etc.)"
echo "  • Formal workflow patterns (ReAct, Planning, Reflection)"
echo "  • Decision rights and handoff protocols"
echo "  • Multi-agent interaction and quality metrics"
echo

USE_AGENTIC_FRAMEWORK=$(ask_yes_no "Enable full agentic development framework?" "n")

if [ "$USE_AGENTIC_FRAMEWORK" = "true" ]; then
    echo
    echo -e "${BLUE}Select agent roles to configure:${NC}"
    USE_CEO=$(ask_yes_no "  CEO (mission, strategy, cross-functional decisions)" "y")
    USE_CTO=$(ask_yes_no "  CTO (technical architecture, delivery)" "y")
    USE_CPO=$(ask_yes_no "  CPO (product roadmap, outcomes)" "y")
    USE_CISO=$(ask_yes_no "  CISO (security, risk, compliance)" "y")
    USE_CMO=$(ask_yes_no "  CMO (marketing, messaging, content)" "n")
    USE_CRO=$(ask_yes_no "  CRO (revenue, pricing, growth)" "n")
    USE_COO=$(ask_yes_no "  COO (delivery operations, release hygiene)" "y")
else
    USE_CEO="false"
    USE_CTO="false"
    USE_CPO="false"
    USE_CISO="false"
    USE_CMO="false"
    USE_CRO="false"
    USE_COO="false"
fi

echo

# Step 3: Product Surfaces
echo -e "${GREEN}🌐 Step 3: Product Surfaces${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

HAS_PRODUCT_APP=$(ask_yes_no "Do you have a core product/app?" "y")
HAS_MARKETING_SITE=$(ask_yes_no "Do you have a marketing website?" "n")
HAS_BLOG=$(ask_yes_no "Do you have a blog?" "n")

echo

# Step 4: Infrastructure
echo -e "${GREEN}🏗️  Step 4: Infrastructure${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

USE_NX_FRAGMENT=$(ask_yes_no "Apply Nx + Docker + Postgres dev environment?" "n")

echo

# Step 5: Environment Setup
echo -e "${GREEN}🔐 Step 5: Environment Variables${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

SETUP_ENVRC=$(ask_yes_no "Set up .envrc for direnv?" "y")

echo
echo -e "${YELLOW}═══════════════════════════════════════════════${NC}"
echo -e "${YELLOW}Ready to bootstrap! Here's what I'll do:${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════${NC}"
echo "• Project: $PROJECT_NAME ($PROJECT_TYPE)"
[ -n "$PROJECT_DESCRIPTION" ] && echo "• Description: $PROJECT_DESCRIPTION"
echo "• Agentic Framework: $([ "$USE_AGENTIC_FRAMEWORK" = "true" ] && echo "Enabled" || echo "Disabled")"
if [ "$USE_AGENTIC_FRAMEWORK" = "true" ]; then
    echo "• Agents: $(
        agents=""
        [ "$USE_CEO" = "true" ] && agents="$agents CEO"
        [ "$USE_CTO" = "true" ] && agents="$agents CTO"
        [ "$USE_CPO" = "true" ] && agents="$agents CPO"
        [ "$USE_CISO" = "true" ] && agents="$agents CISO"
        [ "$USE_CMO" = "true" ] && agents="$agents CMO"
        [ "$USE_CRO" = "true" ] && agents="$agents CRO"
        [ "$USE_COO" = "true" ] && agents="$agents COO"
        [ -z "$agents" ] && agents=" None"
        echo "$agents"
    )"
fi
echo "• Surfaces: $(
    surfaces=""
    [ "$HAS_PRODUCT_APP" = "true" ] && surfaces="$surfaces Product"
    [ "$HAS_MARKETING_SITE" = "true" ] && surfaces="$surfaces Marketing"
    [ "$HAS_BLOG" = "true" ] && surfaces="$surfaces Blog"
    [ -z "$surfaces" ] && surfaces=" None"
    echo "$surfaces"
)"
[ "$USE_NX_FRAGMENT" = "true" ] && echo "• Infrastructure: Nx + Docker + Postgres"
[ "$SETUP_ENVRC" = "true" ] && echo "• Environment: .envrc setup"
echo

PROCEED=$(ask_yes_no "Proceed with bootstrap?" "y")
if [ "$PROCEED" != "true" ]; then
    echo -e "${YELLOW}Bootstrap cancelled${NC}"
    exit 0
fi

echo
echo -e "${GREEN}🚀 Starting bootstrap...${NC}"
echo

# Create .pip directory structure
mkdir -p "$TARGET_DIR/.pip"/{mission,method,graph,ia/agents,fragments,bin,docs/{blog,processes,templates}}

# Copy base files
echo "📄 Setting up base files..."
cp "$PIP_DIR/README.md" "$TARGET_DIR/.pip/"
cp "$PIP_DIR/CONTRIBUTING.md" "$TARGET_DIR/.pip/"

cp "$PIP_DIR/fragment-prompt.md" "$TARGET_DIR/.pip/"
cp "$PIP_DIR/WARP.md" "$TARGET_DIR/.pip/"

# Copy mission
cp "$PIP_DIR/mission/mission.md" "$TARGET_DIR/.pip/mission/"
sed -i.bak "s/\[Your Product Name\]/$PROJECT_NAME/g" "$TARGET_DIR/.pip/mission/mission.md" 2>/dev/null || true
rm -f "$TARGET_DIR/.pip/mission/mission.md.bak"

# Copy method
cp "$PIP_DIR/method/delivery-method.md" "$TARGET_DIR/.pip/method/"

# Copy agent manifest
cp "$PIP_DIR/ia/agent_manifest.yml" "$TARGET_DIR/.pip/ia/"

# Copy agents based on selection
if [ "$USE_AGENTIC_FRAMEWORK" = "true" ]; then
    echo "👥 Setting up agent roles..."
    [ "$USE_CEO" = "true" ] && cp -r "$PIP_DIR/ia/agents/ceo" "$TARGET_DIR/.pip/ia/agents/"
    [ "$USE_CTO" = "true" ] && cp -r "$PIP_DIR/ia/agents/cto" "$TARGET_DIR/.pip/ia/agents/"
    [ "$USE_CPO" = "true" ] && cp -r "$PIP_DIR/ia/agents/cpo" "$TARGET_DIR/.pip/ia/agents/"
    [ "$USE_CISO" = "true" ] && cp -r "$PIP_DIR/ia/agents/ciso" "$TARGET_DIR/.pip/ia/agents/"
    [ "$USE_CMO" = "true" ] && cp -r "$PIP_DIR/ia/agents/cmo" "$TARGET_DIR/.pip/ia/agents/"
    [ "$USE_CRO" = "true" ] && cp -r "$PIP_DIR/ia/agents/cro" "$TARGET_DIR/.pip/ia/agents/"
    [ "$USE_COO" = "true" ] && cp -r "$PIP_DIR/ia/agents/coo" "$TARGET_DIR/.pip/ia/agents/" 2>/dev/null || true

    # Copy agentic framework documentation
    echo "🤖 Setting up agentic framework documentation..."
    if [ -f "$PIP_DIR/AGENTS.md" ]; then
        cp "$PIP_DIR/AGENTS.md" "$TARGET_DIR/.pip/"
    fi

    # Copy agentic design pattern resources
    if [ -f "$PIP_DIR/blog/2025-12-17-agentic-design-patterns.md" ]; then
        mkdir -p "$TARGET_DIR/.pip/docs/references"
        cp "$PIP_DIR/blog/2025-12-17-agentic-design-patterns.md" "$TARGET_DIR/.pip/docs/references/"
    fi

    if [ -f "$PIP_DIR/blog/2025-12-19-agent-workflow-documents.md" ]; then
        mkdir -p "$TARGET_DIR/.pip/docs/references"
        cp "$PIP_DIR/blog/2025-12-19-agent-workflow-documents.md" "$TARGET_DIR/.pip/docs/references/"
    fi

    if [ -f "$PIP_DIR/docs/agentic-benefits.md" ]; then
        cp "$PIP_DIR/docs/agentic-benefits.md" "$TARGET_DIR/.pip/docs/"
    fi
fi

# Copy graph files based on selection
echo "🌐 Setting up product surfaces..."
[ "$HAS_PRODUCT_APP" = "true" ] && cp "$PIP_DIR/graph/product-app.md" "$TARGET_DIR/.pip/graph/"
[ "$HAS_MARKETING_SITE" = "true" ] && cp "$PIP_DIR/graph/marketing-website.md" "$TARGET_DIR/.pip/graph/"
[ "$HAS_BLOG" = "true" ] && cp "$PIP_DIR/graph/blog.md" "$TARGET_DIR/.pip/graph/"

# Copy docs
echo "📚 Setting up documentation..."
cp "$PIP_DIR/docs/activity-log.md" "$TARGET_DIR/.pip/docs/"
cp "$PIP_DIR/docs/changelog.md" "$TARGET_DIR/.pip/docs/"
cp "$PIP_DIR/docs/glossary.md" "$TARGET_DIR/.pip/docs/"
cp "$PIP_DIR/docs/fragments-guide.md" "$TARGET_DIR/.pip/docs/"
cp -r "$PIP_DIR/docs/processes" "$TARGET_DIR/.pip/docs/"
cp -r "$PIP_DIR/docs/templates" "$TARGET_DIR/.pip/docs/"

# Set up environment
if [ "$SETUP_ENVRC" = "true" ]; then
    echo "🔐 Setting up environment..."
    envrc_template=""
    if [ -f "$PIP_DIR/.envrc.example" ]; then
        envrc_template="$PIP_DIR/.envrc.example"
    elif [ -f "$PIP_DIR/docs/templates/organism-envrc.example" ]; then
        envrc_template="$PIP_DIR/docs/templates/organism-envrc.example"
    fi

    if [ -n "$envrc_template" ]; then
        cp "$envrc_template" "$TARGET_DIR/.envrc.example"
        if [ ! -f "$TARGET_DIR/.envrc" ]; then
            cp "$TARGET_DIR/.envrc.example" "$TARGET_DIR/.envrc"
            echo "  ✅ Created .envrc (edit this with your secrets)"
        else
            echo "  ⚠️  .envrc already exists, skipping"
        fi
    else
        echo "  ⚠️  No .envrc template found (skipping .envrc setup)"
    fi
fi

# Set up pip config (.piprc)
piprc_template=""
if [ -f "$PIP_DIR/docs/templates/organism-piprc.example" ]; then
    piprc_template="$PIP_DIR/docs/templates/organism-piprc.example"
fi

if [ -n "$piprc_template" ]; then
    cp "$piprc_template" "$TARGET_DIR/.piprc.example"
    if [ ! -f "$TARGET_DIR/.piprc" ]; then
        cp "$TARGET_DIR/.piprc.example" "$TARGET_DIR/.piprc"
        echo "  ✅ Created .piprc (safe defaults; edit to set PIP_MODE)"
    else
        echo "  ⚠️  .piprc already exists, skipping"
    fi
fi

# Apply Nx fragment if requested
if [ "$USE_NX_FRAGMENT" = "true" ]; then
    echo "🏗️  Applying Nx + Docker infrastructure..."
    "$PIP_DIR/bin/apply-nx-dev-infra.sh"
fi

echo
echo -e "${GREEN}✨ Bootstrap complete! 🎉${NC}"
echo
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Review and customize .pip/mission/mission.md"
if [ "$USE_AGENTIC_FRAMEWORK" = "true" ]; then
    echo "  2. Read .pip/AGENTS.md to understand agent collaboration"
    echo "  3. Update .pip/ia/agent_manifest.yml with owner assignments"
    echo "  4. Review agentic workflow patterns in .pip/docs/references/"
    step=5
else
    echo "  2. Update .pip/ia/agent_manifest.yml with owner assignments"
    step=3
fi
[ "$HAS_PRODUCT_APP" = "true" ] && echo "  $step. Define your product flows in .pip/graph/product-app.md" && step=$((step+1))
[ "$SETUP_ENVRC" = "true" ] && echo "  $step. Add your secrets to .envrc" && step=$((step+1))
[ "$USE_NX_FRAGMENT" = "true" ] && echo "  $step. Run: nx run infra:up"
echo
echo -e "${BLUE}📖 Read .pip/README.md for full documentation${NC}"
if [ "$USE_AGENTIC_FRAMEWORK" = "true" ]; then
    echo -e "${BLUE}🤖 Agentic framework enabled! See .pip/AGENTS.md for workflow guide${NC}"
fi
echo
