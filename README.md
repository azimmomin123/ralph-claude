# Ralph for Claude Code

An autonomous AI agent loop that runs **Claude Code** repeatedly until all PRD items are complete. Each iteration is a fresh Claude instance with clean context. Memory persists via git history, `progress.txt`, and `prd.json`.

Adapted from [snarktank/ralph](https://github.com/snarktank/ralph) (which uses Amp) to work with [Claude Code](https://docs.anthropic.com/en/docs/claude-code).

## How It Works

```
┌─────────────────────────────────────────────────────────┐
│                     ralph-claude.sh                      │
│                                                         │
│  ┌─────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │ Check   │───▶│ Pick Story  │───▶│ Run Claude  │     │
│  │ prd.json│    │ passes:false│    │ Code        │     │
│  └─────────┘    └─────────────┘    └──────┬──────┘     │
│                                           │             │
│                                           ▼             │
│  ┌─────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │ Loop or │◀───│ Update      │◀───│ Implement   │     │
│  │ Exit    │    │ prd.json    │    │ & Commit    │     │
│  └─────────┘    └─────────────┘    └─────────────┘     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

Each iteration:
1. Reads `prd.json` to find incomplete stories
2. Picks the highest priority story where `passes: false`
3. Implements the story, runs quality checks
4. Commits changes, updates `prd.json`
5. Appends learnings to `progress.txt`
6. Exits; loop spawns fresh Claude instance

## Prerequisites

- [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) installed and authenticated
- `jq` installed (`brew install jq` on macOS)
- A git repository for your project

Install Claude Code:
```bash
npm install -g @anthropic-ai/claude-code
claude login
```

## Setup

### Option 1: Copy to your project

```bash
# From your project root
mkdir -p scripts/ralph
cp ralph-claude.sh scripts/ralph/
cp prompt.md scripts/ralph/
chmod +x scripts/ralph/ralph-claude.sh
```

### Option 2: Global installation

```bash
# Copy to a location in your PATH
cp ralph-claude.sh /usr/local/bin/ralph-claude
chmod +x /usr/local/bin/ralph-claude
```

## Usage

### 1. Create your PRD

Create a `prd.json` in your scripts/ralph directory (or wherever you run from):

```json
{
  "name": "My Feature",
  "description": "What this feature does",
  "branchName": "feature/my-feature",
  "userStories": [
    {
      "id": "STORY-001",
      "title": "First task",
      "description": "Detailed description of what to implement",
      "priority": 1,
      "acceptanceCriteria": [
        "Criteria 1",
        "Criteria 2"
      ],
      "passes": false
    }
  ]
}
```

### 2. Run Ralph

```bash
./scripts/ralph/ralph-claude.sh [max_iterations]
```

Default is 10 iterations.

### 3. Monitor Progress

```bash
# See which stories are done
cat prd.json | jq '.userStories[] | {id, title, passes}'

# See learnings from previous iterations
cat progress.txt

# Check git history
git log --oneline -10
```

## Key Files

| File | Purpose |
|------|---------|
| `ralph-claude.sh` | The bash loop that spawns fresh Claude instances |
| `prompt.md` | Instructions given to each Claude instance |
| `prd.json` | User stories with `passes` status |
| `progress.txt` | Append-only learnings for future iterations |

## Critical Concepts

### Fresh Context Each Iteration

Each iteration spawns a **new Claude instance** with clean context. The only memory between iterations is:
- Git history (commits from previous iterations)
- `progress.txt` (learnings and context)
- `prd.json` (which stories are done)
- `CLAUDE.md` (project context that Claude Code reads automatically)

### Small Tasks

Each story should be small enough to complete in one context window. If a task is too big, Claude runs out of context before finishing.

**Right-sized stories:**
- Add a database table and migration
- Create an API endpoint
- Add a UI component
- Write tests for a function

**Too big (split these):**
- "Build the entire dashboard"
- "Add authentication"
- "Refactor the API"

### Quality Gates

Ralph only works if there are feedback loops:
- TypeScript/typecheck catches type errors
- Tests verify behavior
- Lint checks code style

**All checks must pass before committing.**

### CLAUDE.md Updates

After each iteration, Claude can update `CLAUDE.md` with learnings. This is powerful because Claude Code automatically reads this file, so future iterations benefit from discovered patterns.

## Customizing

### prompt.md

Edit `prompt.md` to customize Claude's behavior:
- Add project-specific quality check commands
- Include codebase conventions
- Add common gotchas for your stack

### Quality Checks

The default prompt assumes `npm run typecheck`, `npm run lint`, `npm run test`. Adjust for your project:

```markdown
## Step 5: Quality Checks

Run the project's quality checks:
```bash
# Python
pytest
ruff check .

# Go  
go test ./...
go vet ./...
```

## Differences from Amp Version

| Aspect | Amp Version | Claude Code Version |
|--------|-------------|---------------------|
| CLI | `amp --dangerously-allow-all` | `claude -p --dangerously-skip-permissions` |
| Memory file | `AGENTS.md` | `CLAUDE.md` |
| Auto-handoff | Supported via settings | Not needed (fresh instance each iteration) |
| Skills | Amp skills system | Claude Code slash commands |

## Troubleshooting

### Claude Code not found
```bash
npm install -g @anthropic-ai/claude-code
claude login
```

### Permission denied
```bash
chmod +x ralph-claude.sh
```

### Story stuck in progress
If a story keeps failing, check:
1. `progress.txt` for error details
2. The acceptance criteria - are they achievable?
3. Split the story into smaller pieces

### Context overflow
If Claude runs out of context mid-story:
1. The story is too big - split it
2. Add more detail to CLAUDE.md so Claude doesn't need to rediscover patterns

## Credits

- Original Ralph pattern by [Geoffrey Huntley](https://ghuntley.com/ralph/)
- Amp version by [Ryan Carson / snarktank](https://github.com/snarktank/ralph)
- Claude Code adaptation for SellerHub project
