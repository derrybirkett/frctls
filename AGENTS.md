<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- You have access to the Nx MCP server and its tools, use them to help the user
- When answering questions about the repository, use the `nx_workspace` tool first to gain an understanding of the workspace architecture where applicable.
- When working in individual projects, use the `nx_project_details` mcp tool to analyze and understand the specific project structure and dependencies
- For questions around nx configuration, best practices or if you're unsure, use the `nx_docs` tool to get relevant, up-to-date docs. Always use this instead of assuming things about nx configuration
- If the user needs help with an Nx configuration or project graph error, use the `nx_workspace` tool to get any errors

<!-- nx configuration end-->

---

## 📋 Active Roadmap & Recommendations

**IMPORTANT**: Before starting any work, review [docs/code-review-recommendations.md](docs/code-review-recommendations.md)

This repository has a prioritized backlog of improvements based on a comprehensive code review. All agents should:

1. **Check the roadmap first** - Review [docs/code-review-recommendations.md](docs/code-review-recommendations.md) for current priorities
2. **Follow .pip principles** - Small, strategic changes that create measurable impact
3. **Work incrementally** - Complete one high-priority item before starting another
4. **Document decisions** - Update [docs/activity-log.md](docs/activity-log.md) with rationale for each change
5. **Test thoroughly** - Ensure all tests pass before and after changes
6. **Use feature branches** - Never commit directly to main

### Priority Categories

- 🔴 **High Priority**: Blocking issues (security, broken functionality, critical tech debt)
- 🟡 **Medium Priority**: Quality improvements (testing, documentation, developer experience)
- 🟢 **Low Priority**: Enhancements (features, optimizations, nice-to-haves)

### Current High-Priority Items

As of 2026-01-09, focus on:
1. **HP-1**: Fix GitHub URLs configuration in astro.config.mjs
2. **HP-2**: Replace hardcoded database credentials with environment variables
3. **HP-3**: Enhance root package.json with workspace scripts
4. **HP-4**: Configure Nx caching for faster builds

See full details and implementation order in [docs/code-review-recommendations.md](docs/code-review-recommendations.md)

### Success Metrics

Track progress using metrics defined in the recommendations document:
- Test coverage: Current <10%, Target >70%
- Build cache hit rate: Current 0%, Target >60%
- Security vulnerabilities: Target 0 critical

### Working Process

```bash
# 1. Review roadmap
cat docs/code-review-recommendations.md

# 2. Create feature branch
git checkout -b feat/hp-1-fix-github-urls

# 3. Make changes following .pip principles
# (small, focused, testable)

# 4. Test changes
pnpm test:all

# 5. Update activity log
# Edit docs/activity-log.md

# 6. Create PR
gh pr create --title "Fix GitHub URLs configuration" --body "Implements HP-1 from code review recommendations"
```

---

## 🔄 Continuous Improvement

This roadmap is a living document. As items are completed:
- Mark them done in activity-log.md
- Update success metrics
- Re-prioritize remaining items
- Add new recommendations as needed

**Review cycle**: Weekly on Thursdays  
**Next review**: 2026-01-16