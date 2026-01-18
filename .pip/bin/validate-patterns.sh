#!/usr/bin/env bash

# Test script to validate agentic design patterns are accessible and properly formatted
# Usage: ./bin/validate-patterns.sh

set -e

echo "=== PATTERN VALIDATION TEST ==="
echo ""

PATTERN_DIR="resources/agentic-design-patterns/extracted-patterns"

# Test 1: Check all pattern files exist
echo "Test 1: Checking pattern files exist..."
PATTERNS=(
    "react-pattern.md"
    "planning-pattern.md"
    "reflection-pattern.md"
    "tool-use-pattern.md"
    "multi-agent-collaboration-pattern.md"
    "README.md"
)

for pattern in "${PATTERNS[@]}"; do
    if [ -f "$PATTERN_DIR/$pattern" ]; then
        echo "  ✓ $pattern exists"
    else
        echo "  ✗ $pattern missing"
        exit 1
    fi
done

# Test 2: Check each pattern has required sections
echo ""
echo "Test 2: Checking pattern structure..."
REQUIRED_SECTIONS=(
    "## Overview"
    "## When to Use"
    "## How It Works"
    "## Benefits"
    "## Limitations"
    "## Related Patterns"
)

for pattern in "${PATTERNS[@]}"; do
    if [ "$pattern" == "README.md" ]; then
        continue
    fi
    
    echo "  Checking $pattern..."
    for section in "${REQUIRED_SECTIONS[@]}"; do
        if grep -q "$section" "$PATTERN_DIR/$pattern"; then
            echo "    ✓ Has $section"
        else
            echo "    ✗ Missing $section"
            exit 1
        fi
    done
done

# Test 3: Count total lines
echo ""
echo "Test 3: Checking documentation size..."
TOTAL_LINES=$(find "$PATTERN_DIR" -name "*.md" -exec wc -l {} + | tail -1 | awk '{print $1}')
echo "  Total lines documented: $TOTAL_LINES"

if [ "$TOTAL_LINES" -gt 3000 ]; then
    echo "  ✓ Substantial documentation (>3000 lines)"
else
    echo "  ⚠️  Less than expected (target: 3000+ lines)"
fi

# Test 4: Check README has pattern links
echo ""
echo "Test 4: Checking README catalog..."
if grep -q "react-pattern.md" "$PATTERN_DIR/README.md" && \
   grep -q "planning-pattern.md" "$PATTERN_DIR/README.md" && \
   grep -q "reflection-pattern.md" "$PATTERN_DIR/README.md" && \
   grep -q "tool-use-pattern.md" "$PATTERN_DIR/README.md" && \
   grep -q "multi-agent-collaboration-pattern.md" "$PATTERN_DIR/README.md"; then
    echo "  ✓ README links to all patterns"
else
    echo "  ✗ README missing pattern links"
    exit 1
fi

echo ""
echo "=== ALL TESTS PASSED ✓ ==="
echo ""
echo "Pattern library is properly structured and complete!"
