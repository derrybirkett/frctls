# Linear Integration

This document describes how the `.pip` framework uses Linear for project management and task tracking.

## Project Structure

**Project Name**: PIP Framework  
**Project URL**: https://linear.app/mnspc/project/pip-framework-9e570802c050  
**Team**: Studio

## Workflow

### Creating Tasks

When picking up work from the roadmap:

1. **Reference the Linear ticket number** in commit messages and PR titles
2. **Follow the branch naming convention**: Linear provides suggested branch names
3. **Update task status** as work progresses (Backlog → In Progress → Done)
4. **Link PRs to Linear issues** for automatic status updates

### Task Organization

Tasks are organized using:
- **Epics** for roadmap milestones (v1.1.0, v1.2.0, etc.)
- **Parent/Child relationships** for breaking down large features
- **Labels** for categorization (patterns, documentation, fragment, etc.)
- **Projects** to track progress toward milestones

### Status Flow

```
Backlog → Planned → In Progress → In Review → Done
```

## Current Roadmap in Linear

### v1.1.0: Foundation - Pattern Library & Resources
**Epic**: MSTUDIO-55  
**Timeline**: 2 weeks  
**Status**: Planned

#### Tasks
- **MSTUDIO-56**: Extract and document agentic design patterns
  - Priority 1: ReAct, Planning, Reflection
  - Priority 2: Tool Use, Multi-Agent Collaboration, Chain-of-Thought, Self-Correction
  - Priority 3: Hierarchical Planning, Memory Management, Quality Assessment

### Future Milestones
- v1.2.0: Vector Memory System (3 weeks)
- v1.3.0: Agent Enhancement (2 weeks)
- v1.4.0: Interaction Protocols (2 weeks)
- v1.5.0: Evaluation Framework (2 weeks)
- v1.6.0: Template System (1 week)
- v2.0.0: Memory Fragment (1 week)

## Agent Workflow with Linear

### When Starting New Work

1. **Check Linear** for next priority task
2. **Create feature branch** using Linear's suggested name
3. **Update task status** to "In Progress"
4. **Reference ticket number** in commits: `feat(MSTUDIO-56): add react pattern`
5. **Update activity log** with Linear ticket reference

### When Completing Work

1. **Create PR** with Linear ticket in title
2. **Link PR to Linear issue** (automatic via branch name)
3. **Update changelog** referencing Linear ticket
4. **Move task to "In Review"** when PR is ready
5. **Close ticket** when PR is merged (automatic)

## Linear MCP Integration

Warp AI agents can interact with Linear directly using MCP (Model Context Protocol):

```bash
# List issues
Linear: list_issues --project "PIP Framework"

# Get issue details
Linear: get_issue --id "MSTUDIO-56"

# Create new issue
Linear: create_issue --title "..." --description "..." --project "PIP Framework"

# Update issue
Linear: update_issue --id "MSTUDIO-56" --state "In Progress"
```

## Best Practices

### For Humans
- Check Linear daily for updated priorities
- Keep task descriptions up to date
- Use comments for async communication
- Update estimates based on actual time spent

### For AI Agents
- **Always specify ticket number** when picking up work (per user rules)
- Reference Linear ticket in all git commits
- Update Linear status as work progresses
- Use MCP tools to check current priorities

## References

- [Linear Documentation](https://linear.app/docs)
- [Linear API](https://developers.linear.app/)
- [MCP Linear Integration](https://github.com/modelcontextprotocol/servers)
- [User Rule: Linear Tickets](../WARP.md#important-reminders)
