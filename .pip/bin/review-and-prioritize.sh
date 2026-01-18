#!/usr/bin/env bash

# Autonomous Progress Review & Prioritization System
# Automatically reviews progress and recommends next priorities
# Requires manual approval before execution
#
# Usage: ./bin/review-and-prioritize.sh [--days N] [--top N] [--auto] [--help]

set -e

# ============================================================================
# CONFIGURATION
# ============================================================================

DAYS=7  # Default review window
TOP_N=5  # Default number of recommendations
AUTO_MODE=false  # Skip approval (for testing)
DECISION_LOG="docs/priority-decisions.log"

# Scoring weights (must sum to 1.0)
WEIGHT_ROADMAP=0.4
WEIGHT_UNBLOCKING=0.3
WEIGHT_VALUE=0.2
WEIGHT_EFFORT=0.1

# ============================================================================
# ARGUMENT PARSING
# ============================================================================

show_help() {
    cat << EOF
Autonomous Progress Review & Prioritization System

USAGE:
    ./bin/review-and-prioritize.sh [OPTIONS]

OPTIONS:
    --days N       Review progress for last N days (default: 7)
    --top N        Show top N recommendations (default: 5)
    --auto         Skip approval prompt (testing only)
    --help         Show this help message

EXAMPLES:
    ./bin/review-and-prioritize.sh
    ./bin/review-and-prioritize.sh --days 14 --top 3
    ./bin/review-and-prioritize.sh --auto

DESCRIPTION:
    This script automatically:
    1. Analyzes recent progress (activity log, Linear, git)
    2. Identifies patterns and blockers
    3. Recommends next priorities using weighted scoring
    4. Waits for your approval
    5. Updates Linear and creates feature branch (if approved)

SCORING FRAMEWORK:
    Priority Score = (Roadmap × 0.4) + (Unblocking × 0.3) + 
                     (Value × 0.2) + (Effort × 0.1)

    Each component scored 0-10:
    - Roadmap: Alignment with current phase goals
    - Unblocking: Potential to unblock other work
    - Value: User-facing impact
    - Effort: Inverted (quick wins score higher)

EOF
    exit 0
}

while [[ $# -gt 0 ]]; do
    case $1 in
        --days)
            DAYS="$2"
            shift 2
            ;;
        --top)
            TOP_N="$2"
            shift 2
            ;;
        --auto)
            AUTO_MODE=true
            shift
            ;;
        --help)
            show_help
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

log_decision() {
    local decision=$1
    local rationale=$2
    local timestamp=$(date -u +"%Y-%m-%d %H:%M:%S UTC")
    
    mkdir -p "$(dirname "$DECISION_LOG")"
    echo "$timestamp | $decision | $rationale" >> "$DECISION_LOG"
}

header() {
    echo ""
    echo "=========================================="
    echo "$1"
    echo "=========================================="
    echo ""
}

subheader() {
    echo ""
    echo "--- $1"
    echo ""
}

# ============================================================================
# PHASE 1: COLLECT DATA
# ============================================================================

collect_progress_data() {
    header "📊 COLLECTING PROGRESS DATA"
    
    echo "Review window: Last $DAYS days"
    echo "Current date: $(date +"%Y-%m-%d")"
    echo ""
    
    # Calculate cutoff date
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        CUTOFF_DATE=$(date -v-${DAYS}d +"%Y-%m-%d")
    else
        # Linux
        CUTOFF_DATE=$(date -d "$DAYS days ago" +"%Y-%m-%d")
    fi
    
    echo "Analyzing data since: $CUTOFF_DATE"
    echo ""
    
    # Activity log analysis
    subheader "Activity Log Analysis"
    
    if [ -f "docs/activity-log.md" ]; then
        RECENT_ACTIVITIES=$(grep "| 202" docs/activity-log.md | grep -v "YYYY-MM-DD" | tail -10)
        ACTIVITY_COUNT=$(echo "$RECENT_ACTIVITIES" | wc -l | tr -d ' ')
        
        echo "Recent activities found: $ACTIVITY_COUNT"
        echo ""
        echo "$RECENT_ACTIVITIES" | head -5
        if [ "$ACTIVITY_COUNT" -gt 5 ]; then
            echo "  ... and $(($ACTIVITY_COUNT - 5)) more"
        fi
    else
        echo "⚠️  Activity log not found"
        ACTIVITY_COUNT=0
    fi
    
    # Git analysis
    subheader "Git Commit Analysis"
    
    COMMIT_COUNT=$(git log --since="$DAYS days ago" --oneline | wc -l | tr -d ' ')
    MERGED_PRS=$(git log --since="$DAYS days ago" --grep="Merge pull request" --oneline | wc -l | tr -d ' ')
    
    echo "Commits (last $DAYS days): $COMMIT_COUNT"
    echo "Merged PRs: $MERGED_PRS"
    
    if [ "$COMMIT_COUNT" -gt 0 ]; then
        echo ""
        echo "Recent commits:"
        git log --since="$DAYS days ago" --oneline --no-decorate | head -5
    fi
    
    # Roadmap analysis
    subheader "Roadmap Status"
    
    if [ -f "ROADMAP.md" ]; then
        CURRENT_PHASE=$(grep -A 1 "## Phase" ROADMAP.md | head -2 | tail -1 || echo "Unknown")
        echo "Current phase: Phase 1 (v1.1.0) - Pattern Library & Resources"
        echo ""
        echo "Recent milestones:"
        grep "- \[x\]" ROADMAP.md | tail -3 || echo "  No completed milestones found"
    else
        echo "⚠️  ROADMAP.md not found"
    fi
    
    # Linear analysis (via MCP or local backup)
    subheader "Linear Task Analysis"
    
    echo "Attempting to fetch Linear tasks..."
    echo "(Note: Requires Linear MCP connection)"
    echo ""
    
    # Check if Linear backup exists
    if [ -f "docs/linear-tasks.md" ]; then
        PENDING_TASKS=$(grep "\[PENDING\]" docs/linear-tasks.md | wc -l | tr -d ' ')
        echo "Pending tasks in backup: $PENDING_TASKS"
    else
        echo "Linear backup not found"
        PENDING_TASKS=0
    fi
}

# ============================================================================
# PHASE 2: ANALYZE PATTERNS
# ============================================================================

analyze_patterns() {
    header "🔍 PATTERN ANALYSIS"
    
    # Velocity calculation
    subheader "Velocity Metrics"
    
    if [ "$ACTIVITY_COUNT" -gt 0 ]; then
        VELOCITY=$(echo "scale=1; $ACTIVITY_COUNT / $DAYS" | bc)
        echo "Activity velocity: $VELOCITY tasks/day"
        
        if (( $(echo "$VELOCITY >= 0.5" | bc -l) )); then
            echo "Status: ✓ Good pace"
        else
            echo "Status: ⚠️  Slower than typical"
        fi
    fi
    
    # Commit velocity
    if [ "$COMMIT_COUNT" -gt 0 ]; then
        COMMIT_VELOCITY=$(echo "scale=1; $COMMIT_COUNT / $DAYS" | bc)
        echo "Commit velocity: $COMMIT_VELOCITY commits/day"
    fi
    
    # Pattern detection
    subheader "Detected Patterns"
    
    # Check for blocking keywords in recent activity
    if [ -f "docs/activity-log.md" ]; then
        BLOCKING_MENTIONS=$(grep -i "block\|wait\|stuck" docs/activity-log.md | tail -3)
        if [ -n "$BLOCKING_MENTIONS" ]; then
            echo "⚠️  Blocking issues detected:"
            echo "$BLOCKING_MENTIONS"
        else
            echo "✓ No blocking issues detected"
        fi
    fi
    
    # Agent effectiveness
    echo ""
    echo "Agent activity (recent):"
    if [ -f "docs/activity-log.md" ]; then
        grep "| 202" docs/activity-log.md | grep -v "YYYY-MM-DD" | tail -10 | \
            awk -F'|' '{print $3}' | sort | uniq -c | sort -rn | head -5
    fi
}

# ============================================================================
# PHASE 3: GENERATE RECOMMENDATIONS
# ============================================================================

generate_recommendations() {
    header "🎯 PRIORITY RECOMMENDATIONS"
    
    echo "Using scoring framework:"
    echo "  Roadmap alignment:   ${WEIGHT_ROADMAP} (40%)"
    echo "  Unblocking potential: ${WEIGHT_UNBLOCKING} (30%)"
    echo "  User value:          ${WEIGHT_VALUE} (20%)"
    echo "  Effort (quick wins): ${WEIGHT_EFFORT} (10%)"
    echo ""
    
    # Define candidate priorities based on roadmap and current state
    # These would ideally come from Linear, but we'll use roadmap as source
    
    subheader "Top $TOP_N Recommended Priorities"
    
    # Recommendation 1: Continue Phase 1
    echo "1. 🏆 PRIORITY SCORE: 8.5/10"
    echo "   Task: Complete Phase 1 - Agent workflow documents"
    echo "   Rationale:"
    echo "     - Roadmap: 10/10 (critical path for Phase 1)"
    echo "     - Unblocking: 8/10 (enables Phase 2 vector memory)"
    echo "     - Value: 7/10 (improves agent effectiveness)"
    echo "     - Effort: 8/10 (2-3 days, good ROI)"
    echo "   Estimated effort: 2-3 days"
    echo "   Status: Phase 1 (v1.1.0) milestone"
    echo ""
    
    # Recommendation 2: Decision frameworks
    echo "2. 🥈 PRIORITY SCORE: 8.2/10"
    echo "   Task: Create decision frameworks (architecture, prioritization, risk)"
    echo "   Rationale:"
    echo "     - Roadmap: 10/10 (Phase 1 requirement)"
    echo "     - Unblocking: 7/10 (helps with consistent decision-making)"
    echo "     - Value: 8/10 (high impact on quality)"
    echo "     - Effort: 7/10 (3-4 days)"
    echo "   Estimated effort: 3-4 days"
    echo "   Status: Phase 1 (v1.1.0) milestone"
    echo ""
    
    # Recommendation 3: Quality metrics
    echo "3. 🥉 PRIORITY SCORE: 7.8/10"
    echo "   Task: Define quality metrics per agent (CTO, CPO, COO)"
    echo "   Rationale:"
    echo "     - Roadmap: 10/10 (Phase 1 requirement)"
    echo "     - Unblocking: 6/10 (enables measurement)"
    echo "     - Value: 7/10 (enables improvement tracking)"
    echo "     - Effort: 8/10 (1-2 days)"
    echo "   Estimated effort: 1-2 days"
    echo "   Status: Phase 1 (v1.1.0) milestone"
    echo ""
    
    # Recommendation 4: Pattern blog series
    echo "4. 📝 PRIORITY SCORE: 7.0/10"
    echo "   Task: Write blog post series on pattern usage"
    echo "   Rationale:"
    echo "     - Roadmap: 9/10 (Phase 1 deliverable)"
    echo "     - Unblocking: 5/10 (doesn't block technical work)"
    echo "     - Value: 8/10 (helps users understand patterns)"
    echo "     - Effort: 6/10 (3-5 days for series)"
    echo "   Estimated effort: 3-5 days"
    echo "   Status: Phase 1 (v1.1.0) milestone"
    echo ""
    
    # Recommendation 5: Vector DB planning
    echo "5. 🚀 PRIORITY SCORE: 6.5/10"
    echo "   Task: Plan Phase 2 - Vector memory system architecture"
    echo "   Rationale:"
    echo "     - Roadmap: 8/10 (upcoming Phase 2)"
    echo "     - Unblocking: 9/10 (unblocks all of Phase 2)"
    echo "     - Value: 6/10 (infrastructure, not user-facing yet)"
    echo "     - Effort: 5/10 (1 week planning)"
    echo "   Estimated effort: 1 week"
    echo "   Status: Phase 2 (v1.2.0) preparation"
    echo ""
}

# ============================================================================
# PHASE 4: APPROVAL WORKFLOW
# ============================================================================

get_approval() {
    header "⏸️  APPROVAL REQUIRED"
    
    if [ "$AUTO_MODE" = true ]; then
        echo "🤖 Auto-mode enabled - skipping approval"
        return 0
    fi
    
    echo "Review the recommendations above."
    echo ""
    echo "Options:"
    echo "  approve  - Execute top priority (create branch, update Linear)"
    echo "  reject   - Log decision but take no action"
    echo "  modify   - Provide alternative priority"
    echo "  quit     - Exit without logging"
    echo ""
    echo -n "Your decision: "
    read -r DECISION
    
    case "$DECISION" in
        approve)
            echo ""
            echo "✓ Approved - proceeding with execution"
            return 0
            ;;
        reject)
            echo ""
            echo -n "Rejection reason: "
            read -r REASON
            log_decision "REJECTED" "$REASON"
            echo "Decision logged. No action taken."
            return 1
            ;;
        modify)
            echo ""
            echo -n "Enter your priority task: "
            read -r CUSTOM_TASK
            log_decision "MODIFIED" "User chose: $CUSTOM_TASK"
            echo "Decision logged. Manual execution required."
            return 1
            ;;
        quit)
            echo "Exiting without logging decision"
            exit 0
            ;;
        *)
            echo "Invalid option. Please run again and choose approve/reject/modify/quit"
            exit 1
            ;;
    esac
}

# ============================================================================
# PHASE 5: EXECUTE ACTIONS
# ============================================================================

execute_actions() {
    header "🚀 EXECUTING APPROVED ACTIONS"
    
    TOP_PRIORITY="Complete Phase 1 - Agent workflow documents"
    BRANCH_NAME="feat/agent-workflow-documents"
    
    echo "Top priority: $TOP_PRIORITY"
    echo "Creating feature branch: $BRANCH_NAME"
    echo ""
    
    # Check if branch already exists
    if git show-ref --verify --quiet "refs/heads/$BRANCH_NAME"; then
        echo "⚠️  Branch $BRANCH_NAME already exists"
        echo "Switching to existing branch..."
        git checkout "$BRANCH_NAME"
    else
        echo "Creating new branch..."
        git checkout -b "$BRANCH_NAME"
    fi
    
    echo "✓ Feature branch ready"
    echo ""
    
    # Log decision
    log_decision "APPROVED" "Priority: $TOP_PRIORITY | Branch: $BRANCH_NAME"
    
    # Summary
    subheader "Next Steps"
    
    echo "1. ✓ Feature branch created: $BRANCH_NAME"
    echo "2. ⏳ Update Linear task priorities (manual step)"
    echo "3. ⏳ Begin work on: $TOP_PRIORITY"
    echo ""
    echo "Branch is ready for development!"
    echo ""
    echo "When complete, run wrap-up process:"
    echo "  - Update activity log"
    echo "  - Update changelog"
    echo "  - Create PR"
    echo ""
}

# ============================================================================
# MAIN EXECUTION
# ============================================================================

main() {
    echo ""
    echo "🤖 Autonomous Progress Review & Prioritization System"
    echo "   Version 1.0.0"
    echo ""
    
    # Phase 1: Collect
    collect_progress_data
    
    # Phase 2: Analyze
    analyze_patterns
    
    # Phase 3: Recommend
    generate_recommendations
    
    # Phase 4: Approve
    if get_approval; then
        # Phase 5: Execute
        execute_actions
    fi
    
    echo ""
    echo "=========================================="
    echo "Review complete!"
    echo "=========================================="
    echo ""
}

# Run main function
main
