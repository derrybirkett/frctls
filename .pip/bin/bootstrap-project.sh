#!/usr/bin/env bash
set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ensure_line_in_file() {
  local line="$1"
  local file="$2"

  if [ ! -f "$file" ]; then
    touch "$file"
  fi

  if ! grep -qxF "$line" "$file"; then
    echo "$line" >> "$file"
  fi
}

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                                ║${NC}"
echo -e "${BLUE}║              .pip Project Bootstrap Assistant                  ║${NC}"
echo -e "${BLUE}║                                                                ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo
echo -e "${YELLOW}Let's set up your project! I'll ask a few questions to create"
echo -e "your mission statement and bootstrap your documentation.${NC}"
echo
echo "────────────────────────────────────────────────────────────────"
echo

# Get project information
echo -e "${GREEN}1. Project Name${NC}"
echo "   What should we call this project?"
printf "   > "
read -r PROJECT_NAME
echo

echo -e "${GREEN}2. Who Does This Serve?${NC}"
echo "   Who is the primary user or customer?"
echo "   Example: 'Small business owners', 'Mobile developers', 'Fitness enthusiasts'"
printf "   > "
read -r PRIMARY_USER
echo

echo -e "${GREEN}3. What Problem Are You Solving?${NC}"
echo "   What specific pain point does this address?"
echo "   Example: 'Manually tracking inventory takes hours each week'"
printf "   > "
read -r PROBLEM
echo

echo -e "${GREEN}4. What's Your Solution?${NC}"
echo "   How does your project solve this problem?"
echo "   Example: 'Automated inventory tracking with real-time sync'"
printf "   > "
read -r SOLUTION
echo

echo -e "${GREEN}5. What Makes It Different?${NC}"
echo "   What's your unique differentiator?"
echo "   Example: 'Works offline-first with no monthly subscription'"
printf "   > "
read -r DIFFERENTIATOR
echo

echo -e "${GREEN}6. Enable Agentic Framework?${NC}"
echo "   The agentic framework enables AI-first development with:"
echo "   • Role-based agent collaboration (CEO, CTO, CPO, CISO, etc.)"
echo "   • Formal workflow patterns (ReAct, Planning, Reflection)"
echo "   • Decision rights and handoff protocols"
echo
echo -n "   Enable agentic framework? (y/N): "
read -r AGENTIC_RESPONSE
echo

# Strip control characters from all inputs
PROJECT_NAME=$(echo "$PROJECT_NAME" | tr -d '[:cntrl:]')
PRIMARY_USER=$(echo "$PRIMARY_USER" | tr -d '[:cntrl:]')
PROBLEM=$(echo "$PROBLEM" | tr -d '[:cntrl:]')
SOLUTION=$(echo "$SOLUTION" | tr -d '[:cntrl:]')
DIFFERENTIATOR=$(echo "$DIFFERENTIATOR" | tr -d '[:cntrl:]')
AGENTIC_RESPONSE=$(echo "$AGENTIC_RESPONSE" | tr -d '[:cntrl:]')

# Determine if agentic framework should be enabled
if [[ "$AGENTIC_RESPONSE" =~ ^[Yy] ]]; then
  IS_AGENTIC_PROJECT=true
else
  IS_AGENTIC_PROJECT=false
fi
echo

echo "────────────────────────────────────────────────────────────────"
echo -e "${YELLOW}Creating your project documentation...${NC}"
echo

# Create docs directory
mkdir -p docs

# Generate mission.md
cat > docs/mission.md << EOF
# Mission: ${PROJECT_NAME}

## Who It Serves
- **Primary user**: ${PRIMARY_USER}

## Problem We Solve
${PROBLEM}

## Solution Overview
${SOLUTION}

**Differentiator**: ${DIFFERENTIATOR}

## Why It Matters (Vision & Outcomes)
- **Vision**: <Describe where you want to be in 12-24 months>
- **Outcomes**: 
  1. <First measurable outcome>
  2. <Second measurable outcome>
  3. <Third measurable outcome>
- **Success metrics**: <Quantified targets and leading indicators>

## Non-Goals
- <Explicitly list what we are NOT doing>

## Current Status
- **Lifecycle stage**: Discovery
- **Next milestone**: <Date and objective>
EOF

echo -e "${GREEN}✅ Created docs/mission.md${NC}"

# Copy activity log and changelog templates
cp .pip/docs/templates/organism-activity-log.md docs/activity-log.md
echo -e "${GREEN}✅ Created docs/activity-log.md${NC}"

cp .pip/docs/templates/organism-changelog.md docs/changelog.md
# Customize changelog with project name
sed -i '' "s/\[Project Name\]/${PROJECT_NAME}/g" docs/changelog.md
echo -e "${GREEN}✅ Created docs/changelog.md${NC}"

# Copy agentic workflow playbook
if [ -f ".pip/docs/templates/organism-agentic.md" ]; then
  cp .pip/docs/templates/organism-agentic.md docs/agentic.md
  echo -e "${GREEN}✅ Created docs/agentic.md${NC}"
fi

# Seed development guide
if [ -f ".pip/docs/templates/organism-dev.md" ]; then
  cp .pip/docs/templates/organism-dev.md docs/dev.md
  echo -e "${GREEN}✅ Created docs/dev.md${NC}"
fi

# If agentic project, set up agent infrastructure
if [ "$IS_AGENTIC_PROJECT" = "true" ]; then
  echo
  echo -e "${BLUE}Setting up agentic framework...${NC}"

  # Create .pip directory structure for agents
  mkdir -p .pip/{ia/agents,method,mission}

  # Copy agent manifest
  if [ -f ".pip/ia/agent_manifest.yml" ]; then
    echo -e "${GREEN}✅ Agent manifest already available${NC}"
  fi

  # Copy AGENTS.md for reference
  if [ -f ".pip/AGENTS.md" ]; then
    cp .pip/AGENTS.md docs/agents-reference.md
    echo -e "${GREEN}✅ Created docs/agents-reference.md${NC}"
  fi

  # Copy delivery method
  if [ -f ".pip/method/delivery-method.md" ]; then
    cp .pip/method/delivery-method.md docs/delivery-method.md
    echo -e "${GREEN}✅ Created docs/delivery-method.md${NC}"
  fi

  # Copy agentic design patterns blog post if available
  if [ -f ".pip/blog/2025-12-17-agentic-design-patterns.md" ]; then
    mkdir -p docs/references
    cp .pip/blog/2025-12-17-agentic-design-patterns.md docs/references/
    echo -e "${GREEN}✅ Created docs/references/agentic-design-patterns.md${NC}"
  fi

  if [ -f ".pip/blog/2025-12-19-agent-workflow-documents.md" ]; then
    mkdir -p docs/references
    cp .pip/blog/2025-12-19-agent-workflow-documents.md docs/references/
    echo -e "${GREEN}✅ Created docs/references/agent-workflow-documents.md${NC}"
  fi

  echo
  echo -e "${YELLOW}📋 Agentic Framework Setup Complete!${NC}"
  echo
  echo "Your project is configured for AI-first development with:"
  echo "  • Agent collaboration framework (CEO, CTO, CPO, CISO, etc.)"
  echo "  • Workflow patterns (ReAct, Planning, Reflection)"
  echo "  • Decision rights and handoff protocols"
  echo
  echo "Run the full wizard to select specific agents:"
  echo "  ./.pip/bin/bootstrap.sh"
  echo
fi

# Seed local env conventions (direnv)
if [ -f ".pip/docs/templates/organism-envrc.example" ]; then
  cp .pip/docs/templates/organism-envrc.example .envrc.example
  echo -e "${GREEN}✅ Created .envrc.example${NC}"
  ensure_line_in_file ".envrc" ".gitignore"
  ensure_line_in_file ".direnv/" ".gitignore"
fi

# Seed SECURITY.md
if [ -f ".pip/docs/templates/organism-security.md" ]; then
  cp .pip/docs/templates/organism-security.md SECURITY.md
  echo -e "${GREEN}✅ Created SECURITY.md${NC}"
fi

# Seed GitHub issue templates + CODEOWNERS stub
mkdir -p .github/ISSUE_TEMPLATE

if [ -f ".pip/docs/templates/organism-issue-bug.yml" ]; then
  cp .pip/docs/templates/organism-issue-bug.yml .github/ISSUE_TEMPLATE/bug_report.yml
  echo -e "${GREEN}✅ Created .github/ISSUE_TEMPLATE/bug_report.yml${NC}"
fi

if [ -f ".pip/docs/templates/organism-issue-feature.yml" ]; then
  cp .pip/docs/templates/organism-issue-feature.yml .github/ISSUE_TEMPLATE/feature_request.yml
  echo -e "${GREEN}✅ Created .github/ISSUE_TEMPLATE/feature_request.yml${NC}"
fi

if [ -f ".pip/docs/templates/organism-codeowners" ]; then
  cp .pip/docs/templates/organism-codeowners .github/CODEOWNERS
  echo -e "${GREEN}✅ Created .github/CODEOWNERS${NC}"
fi

# Seed GitHub repo hygiene (workflows + PR template)
mkdir -p .github/workflows

if [ -f ".pip/docs/templates/organism-validate-docs.yml" ]; then
  cp .pip/docs/templates/organism-validate-docs.yml .github/workflows/validate-docs.yml
  echo -e "${GREEN}✅ Created .github/workflows/validate-docs.yml${NC}"
fi

if [ -f ".pip/docs/templates/organism-pull-request-template.md" ]; then
  cp .pip/docs/templates/organism-pull-request-template.md .github/PULL_REQUEST_TEMPLATE.md
  echo -e "${GREEN}✅ Created .github/PULL_REQUEST_TEMPLATE.md${NC}"
fi

# Create README.md
cat > README.md << EOF
# ${PROJECT_NAME}

${SOLUTION}

## Problem

${PROBLEM}

## Solution

A full-stack SaaS product that ${SOLUTION,,}

**What makes it different**: ${DIFFERENTIATOR}

## Product Structure

This project follows PIP's opinionated product graph:

- **Marketing Website** - Landing pages, pricing, public content
- **Product App** - SaaS dashboard with authentication
- **Auth Boundary** - Secure login, signup, password recovery
- **API** - Backend services integrated with the product app
- **Blog** (Optional) - Content marketing and updates

### Tech Stack
- **Monorepo**: Nx
- **UI**: React with ShadCN UI components
- **Backend**: Supabase (Postgres + Auth)
- **Payments**: Stripe
- **Operations**: Docker

## Documentation

This project uses \`.pip\` as an immutable template (genome):
- \`.pip/\` - Framework templates and guides (DO NOT MODIFY)
- \`docs/\` - This project's actual documentation

### Project Documentation
- [Mission](./docs/mission.md) - Project purpose and vision
- [Activity Log](./docs/activity-log.md) - Historical record of changes
- [Changelog](./docs/changelog.md) - User-facing release notes
- [Agentic Workflow](./docs/agentic.md) - How to use agents with a human in the loop

### Framework Documentation  
- [.pip Framework](./.pip/README.md) - Framework overview
- [Using .pip as Genome](./.pip/docs/using-pip-as-genome.md) - Detailed usage guide
- [Fragment System](./.pip/docs/fragments-guide.md) - Infrastructure scaffolding

## Getting Started

### Option A: Docs-only (start lean)

- Customize your mission: \`docs/mission.md\`
- Keep your activity log + changelog current as you ship

### Option B: Nx SaaS scaffold (marketing + app + auth boundary)

\`\`\`bash
# Initialize Nx (if not already)
npx nx@latest init --integrated

# (Optional) Dev infra
./.pip/bin/apply-nx-dev-infra.sh

# Product surfaces
./.pip/bin/apply-nx-product-surfaces.sh

# Run
nx serve app
nx serve marketing
\`\`\`

## Status

🚧 **In Development** - Project bootstrapped $(date +%Y-%m-%d)

---

**Primary User**: ${PRIMARY_USER}
EOF

echo -e "${GREEN}✅ Created README.md${NC}"

# Create .cursorrules from template
if [ -f ".pip/.cursorrules.example" ]; then
  sed "s/\[Project Name\]/${PROJECT_NAME}/g" .pip/.cursorrules.example > .cursorrules
  echo -e "${GREEN}✅ Created .cursorrules${NC}"
fi

echo
echo "────────────────────────────────────────────────────────────────"
echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                                ║${NC}"
echo -e "${BLUE}║                    Bootstrap Complete! 🎉                      ║${NC}"
echo -e "${BLUE}║                                                                ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo
echo -e "${GREEN}Your project has been bootstrapped with:${NC}"
echo "  • Mission statement (docs/mission.md)"
echo "  • Activity log (docs/activity-log.md)"
echo "  • Changelog (docs/changelog.md)"
echo "  • Agentic workflow playbook (docs/agentic.md)"
echo "  • Dev guide template (docs/dev.md)"
echo "  • Local env example (.envrc.example)"
echo "  • Security policy (SECURITY.md)"
echo "  • Docs hygiene workflow (.github/workflows/validate-docs.yml)"
echo "  • Pull request template (.github/PULL_REQUEST_TEMPLATE.md)"
echo "  • Issue templates + CODEOWNERS stub (.github/*)"
echo "  • README with your project story"
echo "  • Cursor AI rules (.cursorrules)"
if [ "$IS_AGENTIC_PROJECT" = "true" ]; then
  echo "  • Agent collaboration framework (docs/agents-reference.md)"
  echo "  • Delivery method (docs/delivery-method.md)"
  echo "  • Agentic design patterns (docs/references/)"
fi
echo
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Review and customize docs/mission.md"
echo "  2. Initialize Nx workspace: npx nx@latest init --integrated"
echo "  3. Apply dev infrastructure: ./.pip/bin/apply-nx-dev-infra.sh"
echo "  4. Scaffold product surfaces: ./.pip/bin/apply-nx-product-surfaces.sh"
echo "       (Creates: marketing site + product app + auth boundary)"
echo "  5. Start development:"
echo "       nx serve app         # Product app on http://localhost:4200"
echo "       nx serve marketing   # Marketing site on http://localhost:4300"
echo
echo -e "${BLUE}Happy building! 🚀${NC}"
echo
