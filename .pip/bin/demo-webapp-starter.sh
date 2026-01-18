#!/usr/bin/env bash
set -e

# Demo script: Bootstrap a new organism with mission + webapp starter
# This shows the full OOTB flow from genome → organism → running app

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  .pip Webapp Starter Demo${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo

# Create temp organism directory
DEMO_DIR=$(mktemp -d -t pip-demo-XXXXXX)
echo -e "${YELLOW}Creating demo organism at: ${DEMO_DIR}${NC}"
cd "$DEMO_DIR"
git init -q

# Bootstrap mission (non-interactive)
echo -e "${GREEN}1. Bootstrapping mission...${NC}"
export PROJECT_NAME="DemoApp"
export PRIMARY_USER="Developers"
export PROBLEM="Manual setup takes too long"
export SOLUTION="One-command bootstrap with batteries included"
export DIFFERENTIATOR="OOTB auth + landing + app shell"

# Simulate bootstrap (create docs/mission.md)
mkdir -p docs
cat > docs/mission.md << 'EOF'
# Mission: DemoApp

## Who It Serves
- **Primary user**: Developers

## Problem We Solve
Manual setup takes too long

## Solution Overview
One-command bootstrap with batteries included

**Differentiator**: OOTB auth + landing + app shell
EOF
echo -e "${GREEN}✅ Created docs/mission.md${NC}"

# Apply webapp starter
echo -e "${GREEN}2. Applying webapp starter fragment...${NC}"
"$(dirname "$0")/apply-nx-webapp-starter.sh"

echo
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Demo organism ready!${NC}"
echo
echo -e "${YELLOW}Next steps:${NC}"
echo "  cd $DEMO_DIR"
echo "  npm install"
echo "  npx nx serve web"
echo
echo -e "${YELLOW}Then visit http://localhost:4200${NC}"
echo -e "${YELLOW}Landing page will show mission: 'Manual setup takes too long'${NC}"
echo
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
