# Code Review Recommendations

**Review Date**: 2026-01-09  
**Status**: Active Roadmap

This document provides actionable recommendations for agents working on this codebase, prioritized according to `.pip` principles of incremental improvement and measurable outcomes.

---

## 🎯 Core Principles

When working on these recommendations:
- **Small, strategic changes** - Focus on one recommendation at a time
- **Measure impact** - Track before/after metrics where applicable
- **Document decisions** - Update activity-log.md with rationale
- **Test first** - Ensure tests pass before and after changes
- **Feature branches** - Never commit directly to main

---

## 🔴 High Priority (Blocking Issues)

### HP-1: Fix GitHub URLs Configuration
**File**: `apps/blog/astro.config.mjs`  
**Issue**: Hardcoded personal GitHub username instead of organization name  
**Current**:
```javascript
site: 'https://derrybirkett.github.io',
base: '/frctls',
```
**Expected**: Should match actual deployment URL or be environment-based  
**Impact**: Broken canonical URLs, incorrect sitemap entries  
**Effort**: 10 minutes  
**Test**: Verify sitemap.xml and RSS feed URLs after change

### HP-2: Replace Hardcoded Credentials
**File**: `docker-compose.yml`  
**Issue**: Database credentials committed in plain text  
**Action**:
1. Create `.env.example` with placeholder values
2. Update docker-compose.yml to use `${POSTGRES_PASSWORD:-default}`
3. Add `.env` to `.gitignore` (verify it exists)
4. Document in README.md setup section

**Impact**: Security vulnerability - credentials exposed in git history  
**Effort**: 30 minutes  
**Test**: Verify containers start with environment variables

### HP-3: Enhance Root package.json
**File**: `package.json`  
**Issue**: Missing workspace-level scripts and metadata  
**Action**: Add the following:
```json
{
  "name": "fractals",
  "version": "1.0.0",
  "description": "Transforming organizations through small, strategic changes",
  "repository": {
    "type": "git",
    "url": "https://github.com/fractalsofchange/frctls"
  },
  "scripts": {
    "build": "nx run-many -t build",
    "test": "nx run-many -t test",
    "test:all": "nx run-many -t test test:e2e",
    "lint": "nx run-many -t lint",
    "format": "nx format:write",
    "format:check": "nx format:check"
  }
}
```
**Impact**: Improves developer experience and CI/CD capabilities  
**Effort**: 15 minutes  
**Test**: Run `pnpm build`, `pnpm test` at root level

### HP-4: Configure Nx Caching
**File**: `nx.json`  
**Issue**: Not leveraging Nx's caching and task pipeline features  
**Action**: Add target defaults and caching configuration:
```json
{
  "installation": {
    "version": "22.2.0"
  },
  "$schema": "./node_modules/nx/schemas/nx-schema.json",
  "nxCloudId": "69399b92ef3b5c75bf4c2b88",
  "targetDefaults": {
    "build": {
      "cache": true,
      "dependsOn": ["^build"],
      "inputs": ["production", "^production"],
      "outputs": ["{projectRoot}/dist"]
    },
    "test": {
      "cache": true,
      "inputs": ["default", "^production", "{workspaceRoot}/jest.config.ts"]
    },
    "test:e2e": {
      "cache": true,
      "inputs": ["default", "^production"]
    },
    "lint": {
      "cache": true,
      "inputs": ["default", "{workspaceRoot}/.eslintrc.json"]
    }
  }
}
```
**Impact**: 50-80% faster builds/tests with caching  
**Effort**: 20 minutes  
**Test**: Run tasks twice, verify "Nx read the output from cache" message

---

## 🟡 Medium Priority (Quality Improvements)

### MP-1: Expand Test Coverage
**Current**: Only 1 test file (`consts.test.ts`)  
**Target**: >70% coverage for critical paths  
**Action Plan**:
1. Add component tests:
   - `src/components/Header.test.ts`
   - `src/components/Footer.test.ts`
   - `src/components/FormattedDate.test.ts`
2. Add content validation tests:
   - `src/content.config.test.ts` (validate all blog posts)
3. Expand E2E tests:
   - Test blog post navigation
   - Test tag filtering (if implemented)
   - Test RSS feed

**Effort**: 4-6 hours  
**Test**: Run `pnpm test:all` and verify coverage report

### MP-2: Add Pre-commit Hooks
**Action**: Create `.husky/` configuration or git hooks:
1. Format check (Nx format)
2. Lint check
3. Unit tests
4. Commit message validation (conventional commits)

**Files to create**:
- `.husky/pre-commit`
- `.husky/commit-msg`
- Update root `package.json` with husky scripts

**Impact**: Prevent broken commits from reaching remote  
**Effort**: 1 hour  
**Test**: Make intentional bad commit, verify it's blocked

### MP-3: Create CONTRIBUTING.md
**Action**: Document development workflow:
- How to set up local environment
- Branch naming conventions
- Commit message format
- PR process and review checklist
- Testing requirements
- Release process

**Impact**: Faster onboarding, consistent contributions  
**Effort**: 2 hours  
**Reference**: Use `.pip` principles as template

### MP-4: Configure Performance Budgets
**File**: `apps/blog/astro.config.mjs`  
**Action**: Add build size limits:
```javascript
export default defineConfig({
  vite: {
    build: {
      chunkSizeWarningLimit: 500,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          }
        }
      }
    }
  }
});
```
**Impact**: Prevent bundle bloat, maintain fast page loads  
**Effort**: 30 minutes  
**Test**: Build and check bundle sizes

### MP-5: Add Analytics Implementation
**Status**: Mentioned in docs but not implemented  
**Options**:
1. Google Analytics 4
2. Plausible (privacy-friendly)
3. Simple Analytics

**Action**:
1. Choose analytics provider
2. Add tracking script to `BaseHead.astro`
3. Document in deployment.md
4. Add environment variable for tracking ID

**Impact**: Track content performance metrics  
**Effort**: 1 hour

---

## 🟢 Low Priority (Enhancements)

### LP-1: Add VS Code Workspace Settings
**File**: `.vscode/settings.json`  
**Action**: Create workspace settings:
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "files.exclude": {
    "**/dist": true,
    "**/node_modules": true
  }
}
```

### LP-2: Implement Related Posts Feature
**Files**: 
- `src/components/RelatedPosts.astro`
- Update blog post layout to include related posts

**Logic**: Match by tags, exclude current post, limit to 3 results

### LP-3: Add Search Functionality
**Options**:
1. Client-side with Fuse.js
2. Pagefind (recommended for Astro)
3. Algolia (if budget allows)

**Recommended**: Pagefind for static site search

### LP-4: Newsletter Signup Integration
**Providers to consider**:
- ConvertKit
- Mailchimp
- Buttondown

**Impact**: Build email list for content distribution

---

## 📊 Success Metrics

Track these metrics as improvements are implemented:

| Metric | Current | Target | How to Measure |
|--------|---------|--------|----------------|
| Test Coverage | <10% | >70% | `nx test --coverage` |
| Build Cache Hit Rate | 0% | >60% | Nx Cloud dashboard |
| Build Time (cold) | Unknown | <2min | GitHub Actions logs |
| Build Time (cached) | N/A | <30s | Local/CI with cache |
| Bundle Size | Unknown | <200KB | `pnpm build` output |
| Lighthouse Score | Unknown | >90 | Chrome DevTools |
| Security Vulnerabilities | Unknown | 0 critical | `pnpm audit` |

---

## 🔄 Implementation Order

**Week 1: Security & Configuration**
1. HP-2: Replace hardcoded credentials (Day 1)
2. HP-1: Fix GitHub URLs (Day 1)
3. HP-3: Enhance root package.json (Day 2)
4. HP-4: Configure Nx caching (Day 2-3)

**Week 2: Testing & Quality**
5. MP-1: Expand test coverage (Day 4-7)
6. MP-2: Add pre-commit hooks (Day 8)
7. MP-3: Create CONTRIBUTING.md (Day 9)

**Week 3: Performance & Features**
8. MP-4: Configure performance budgets (Day 10)
9. MP-5: Add analytics (Day 11)
10. LP-1: VS Code settings (Day 12)

**Week 4+: Enhancements**
11. LP-2: Related posts feature
12. LP-3: Search functionality
13. LP-4: Newsletter integration

---

## 📝 Working with This Document

**For Agents**:
1. Check off completed items in activity-log.md
2. Create feature branch: `feat/hp-1-fix-github-urls`
3. Make changes following `.pip` principles
4. Update this document if priorities change
5. Create PR with reference to this recommendation

**For Humans**:
- Review progress weekly
- Adjust priorities based on business needs
- Archive completed sections quarterly
- Celebrate wins when metrics improve

---

**Last Updated**: 2026-01-09  
**Next Review**: 2026-01-16
