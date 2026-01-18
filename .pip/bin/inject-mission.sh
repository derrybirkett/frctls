#!/usr/bin/env bash
set -euo pipefail

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

TARGET_DIR="$(pwd)"
MISSION_FILE="$TARGET_DIR/docs/mission.md"

echo -e "${YELLOW}🔄 Injecting mission data into app components...${NC}"
echo

# Check if mission file exists
if [ ! -f "$MISSION_FILE" ]; then
  echo -e "${RED}❌ Mission file not found: $MISSION_FILE${NC}"
  echo "   Run bootstrap-project.sh first to create mission.md"
  exit 1
fi

# Extract mission data from docs/mission.md
# Simple line-based parsing - looks for specific patterns

extract_field() {
  local field="$1"
  local file="$2"
  
  # Try different patterns
  if grep -q "^# Mission: " "$file"; then
    # Pattern: # Mission: Project Name
    if [ "$field" = "PROJECT_NAME" ]; then
      sed -n 's/^# Mission: //p' "$file" | head -1
      return
    fi
  fi
  
  # Pattern: **Primary user**: value
  if [ "$field" = "PRIMARY_USER" ]; then
    sed -n 's/^- \*\*Primary user\*\*: //p' "$file" | head -1
    return
  fi
  
  # Pattern: ## Problem We Solve (next line is the value)
  if [ "$field" = "PROBLEM" ]; then
    sed -n '/^## Problem We Solve$/{ n; p; }' "$file" | head -1
    return
  fi
  
  # Pattern: ## Solution Overview (next line is the value)
  if [ "$field" = "SOLUTION" ]; then
    sed -n '/^## Solution Overview$/{ n; p; }' "$file" | head -1
    return
  fi
  
  # Pattern: **Differentiator**: value
  if [ "$field" = "DIFFERENTIATOR" ]; then
    sed -n 's/^\*\*Differentiator\*\*: //p' "$file" | head -1
    return
  fi
}

PROJECT_NAME=$(extract_field "PROJECT_NAME" "$MISSION_FILE")
PRIMARY_USER=$(extract_field "PRIMARY_USER" "$MISSION_FILE")
PROBLEM=$(extract_field "PROBLEM" "$MISSION_FILE")
SOLUTION=$(extract_field "SOLUTION" "$MISSION_FILE")
DIFFERENTIATOR=$(extract_field "DIFFERENTIATOR" "$MISSION_FILE")

# Debug output
echo "Extracted values:"
echo "  PROJECT_NAME: ${PROJECT_NAME:-<not found>}"
echo "  PRIMARY_USER: ${PRIMARY_USER:-<not found>}"
echo "  PROBLEM: ${PROBLEM:-<not found>}"
echo "  SOLUTION: ${SOLUTION:-<not found>}"
echo "  DIFFERENTIATOR: ${DIFFERENTIATOR:-<not found>}"
echo

# Replace placeholders in marketing app
MARKETING_APP="$TARGET_DIR/apps/marketing/src/app/app.tsx"

if [ -f "$MARKETING_APP" ]; then
  echo -e "${YELLOW}Updating $MARKETING_APP...${NC}"
  
  # Create backup
  cp "$MARKETING_APP" "$MARKETING_APP.bak"
  
  # Replace placeholders (use | as delimiter to avoid issues with / in text)
  if [ -n "$PROJECT_NAME" ]; then
    sed -i '' "s|{{PROJECT_NAME}}|$PROJECT_NAME|g" "$MARKETING_APP"
  fi
  
  if [ -n "$SOLUTION" ]; then
    sed -i '' "s|{{SOLUTION}}|$SOLUTION|g" "$MARKETING_APP"
  fi
  
  echo -e "${GREEN}✅ Updated marketing app${NC}"
else
  echo -e "${YELLOW}⚠️  Marketing app not found at $MARKETING_APP${NC}"
  echo "   Run apply-nx-product-surfaces.sh first"
fi

echo
echo -e "${GREEN}✨ Mission injection complete!${NC}"
echo
echo "Next steps:"
echo "  1. Review updated files in apps/marketing/src/app/"
echo "  2. Start marketing: nx serve marketing"
echo "  3. Start app: nx serve app"
