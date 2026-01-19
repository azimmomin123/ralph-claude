#!/bin/bash

# ralph-claude.sh - Autonomous AI agent loop for Claude Code
# Adapted from snarktank/ralph for Claude Code instead of Amp
#
# Usage: ./ralph-claude.sh [max_iterations]
# Default: 10 iterations

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MAX_ITERATIONS=${1:-10}
ITERATION=0

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    if ! command -v claude &> /dev/null; then
        log_error "Claude Code CLI not found. Install with: npm install -g @anthropic-ai/claude-code"
        exit 1
    fi
    
    if ! command -v jq &> /dev/null; then
        log_error "jq not found. Install with: brew install jq (macOS) or apt install jq (Linux)"
        exit 1
    fi
    
    if [ ! -f "$SCRIPT_DIR/prd.json" ]; then
        log_error "prd.json not found in $SCRIPT_DIR"
        log_info "Create a prd.json with user stories. See prd.json.example"
        exit 1
    fi
    
    if [ ! -f "$SCRIPT_DIR/prompt.md" ]; then
        log_error "prompt.md not found in $SCRIPT_DIR"
        exit 1
    fi
}

# Check if all stories are complete
all_stories_complete() {
    local incomplete=$(jq '[.userStories[] | select(.passes == false)] | length' "$SCRIPT_DIR/prd.json")
    [ "$incomplete" -eq 0 ]
}

# Archive previous run if different feature
maybe_archive() {
    local current_branch=$(jq -r '.branchName // empty' "$SCRIPT_DIR/prd.json")
    local progress_file="$SCRIPT_DIR/progress.txt"
    
    if [ -f "$progress_file" ]; then
        local previous_branch=$(head -n 1 "$progress_file" | grep -o 'Branch: [^ ]*' | cut -d' ' -f2 || echo "")
        
        if [ -n "$previous_branch" ] && [ "$previous_branch" != "$current_branch" ]; then
            local archive_dir="$SCRIPT_DIR/archive/$(date +%Y-%m-%d)-$previous_branch"
            mkdir -p "$archive_dir"
            mv "$progress_file" "$archive_dir/"
            log_info "Archived previous run to $archive_dir"
        fi
    fi
}

# Main loop
main() {
    check_prerequisites
    maybe_archive
    
    log_info "Starting Ralph (Claude Code) - Max iterations: $MAX_ITERATIONS"
    log_info "Working directory: $SCRIPT_DIR"
    
    while [ $ITERATION -lt $MAX_ITERATIONS ]; do
        ITERATION=$((ITERATION + 1))
        
        echo ""
        echo "=============================================="
        log_info "ITERATION $ITERATION of $MAX_ITERATIONS"
        echo "=============================================="
        
        # Check if all done before starting
        if all_stories_complete; then
            log_success "All stories complete! 🎉"
            exit 0
        fi
        
        # Show current status
        log_info "Remaining stories:"
        jq -r '.userStories[] | select(.passes == false) | "  - [\(.id)] \(.title)"' "$SCRIPT_DIR/prd.json"
        
        echo ""
        log_info "Spawning Claude Code instance..."
        
        # Run Claude Code with the prompt
        # --dangerously-skip-permissions allows autonomous operation
        # -p runs in non-interactive (print) mode with the prompt
        OUTPUT=$(claude -p "$(cat "$SCRIPT_DIR/prompt.md")" --dangerously-skip-permissions 2>&1 | tee /dev/stderr) || true
        
        # Check for completion signal
        if echo "$OUTPUT" | grep -q "COMPLETE"; then
            log_success "Ralph signaled COMPLETE"
            if all_stories_complete; then
                log_success "All stories verified complete! 🎉"
                exit 0
            else
                log_warning "COMPLETE signal but stories remain. Continuing..."
            fi
        fi
        
        # Check for explicit failure
        if echo "$OUTPUT" | grep -q "FAILED"; then
            log_error "Story implementation failed. Check output above."
            log_info "Continuing to next iteration..."
        fi
        
        # Brief pause between iterations
        sleep 2
        
    done
    
    log_warning "Reached max iterations ($MAX_ITERATIONS)"
    log_info "Remaining incomplete stories:"
    jq -r '.userStories[] | select(.passes == false) | "  - [\(.id)] \(.title)"' "$SCRIPT_DIR/prd.json"
    exit 1
}

main "$@"
