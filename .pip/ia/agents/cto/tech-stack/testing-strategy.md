# Testing Strategy

## Testing Philosophy

### Quality Goals
- Prevent regressions and bugs from reaching production
- Enable confident refactoring and changes
- Serve as living documentation of behavior
- Fast feedback loops for developers

### Testing Pyramid
```
    /\
   /  \      E2E (Few)
  /____\     
  /    \     Integration (Some)
 /      \    
/________\   Unit (Many)
```

- **Many unit tests**: Fast, isolated, focused
- **Some integration tests**: Verify components work together
- **Few E2E tests**: Critical user flows only

## Testing Levels

### Unit Tests
**Purpose**: Test individual functions/methods in isolation

**Coverage Goals**:
- Business logic: 80%+ coverage
- Utilities and helpers: 90%+ coverage
- Edge cases and error handling

**Practices**:
- Fast execution (< 1ms per test)
- No external dependencies (mock I/O, databases, APIs)
- Test one thing at a time
- Clear arrange-act-assert structure

**Tools**: Jest, Vitest, pytest, Go testing package, etc.

### Integration Tests
**Purpose**: Test how components interact (API + database, services, etc.)

**Coverage Goals**:
- API endpoints: all critical paths
- Database operations: CRUD + queries
- Third-party integrations: connection and error handling

**Practices**:
- Use test databases or containers
- Reset state between tests
- Test realistic scenarios
- Include error and edge cases

**Tools**: Supertest, pytest with fixtures, Testcontainers

### End-to-End (E2E) Tests
**Purpose**: Test complete user flows through real UI

**Coverage Goals**:
- Critical user journeys (auth, onboarding, core features)
- Cross-browser compatibility
- Mobile responsive flows

**Practices**:
- Test against staging or production-like environment
- Use Playwright for browser automation
- Keep tests maintainable and reliable
- Run in CI and pre-deployment

**Tools**: Playwright (preferred per user rules)

## Playwright Implementation

### Setup
```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

### Test Structure
```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('user can sign up and log in', async ({ page }) => {
    // Navigate
    await page.goto('/signup');
    
    // Sign up
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'SecurePass123!');
    await page.click('button[type="submit"]');
    
    // Verify redirect to app
    await expect(page).toHaveURL('/app/dashboard');
    await expect(page.locator('h1')).toContainText('Welcome');
  });
});
```

### Best Practices
- Use semantic locators (role, label) over CSS selectors
- Create page object models for complex pages
- Use fixtures for test data and auth state
- Run tests in parallel for speed
- Retry flaky tests in CI

## Test Data Management

### Unit/Integration Tests
- Use factories or builders for test data
- Create minimal valid data for each test
- Use descriptive names for test data
- Reset database between tests

### E2E Tests
- Use API calls to seed data (faster than UI)
- Create isolated test accounts
- Clean up test data after runs
- Use unique identifiers (timestamps, UUIDs)

## Continuous Integration

### Pre-Commit
- Run linters and formatters
- Run fast unit tests (< 10s)
- Type checking

### PR Checks (Required to Pass)
- All unit tests
- All integration tests
- E2E tests for critical flows
- Code coverage threshold met
- Security scans (Dependabot, SAST)
- No linting errors

### Pre-Deployment
- Full E2E suite against staging
- Performance tests (if applicable)
- Smoke tests after deployment

## Test Maintenance

### Keep Tests Fast
- Mock external services
- Use in-memory databases when possible
- Run tests in parallel
- Profile and optimize slow tests

### Keep Tests Reliable
- Avoid timing dependencies (use waitFor)
- Clean up state between tests
- Don't depend on test execution order
- Handle async properly

### Keep Tests Maintainable
- Follow DRY principles (helpers, fixtures)
- Use descriptive test names
- Keep tests simple and focused
- Refactor tests with production code

## Coverage Goals

### Minimum Coverage Targets
- Overall: 70%
- New code: 80%
- Business logic: 90%

### What NOT to Test
- Third-party library internals
- Trivial getters/setters
- Generated code
- Framework configuration

### Coverage Reporting
- Display in PR comments
- Track trends over time
- Block PRs that decrease coverage without justification

## Testing New Features

### Discovery Phase
- Write test scenarios before implementation
- Identify edge cases and error states
- Plan test data requirements

### Development Phase
- Write tests alongside code (TDD when appropriate)
- Start with unit tests, then integration
- Add E2E for critical flows

### Review Phase
- Review test coverage in PR
- Verify edge cases are tested
- Check for test maintainability

## Performance Testing

### When to Performance Test
- APIs under expected load
- Database queries with realistic data volume
- Critical user flows (page load, interaction speed)

### Tools
- Artillery or k6 for load testing
- Lighthouse for frontend performance
- Database query profiling

### Targets (Customize per Project)
- API response time: < 200ms (p95)
- Page load (LCP): < 2.5s
- Time to interactive (TTI): < 3.5s
- Database queries: < 100ms

## Security Testing

### Automated Scans
- Dependency vulnerability scanning (daily)
- Static analysis security testing (SAST) in CI
- Dynamic analysis (DAST) for staging deployments

### Manual Testing
- Penetration testing (annual or per major release)
- Security code review for sensitive changes
- Threat modeling for new features

## Testing Checklist (Definition of Done)

For each feature/PR:
- [ ] Unit tests for new business logic
- [ ] Integration tests for API/database changes
- [ ] E2E tests for new user flows (if critical)
- [ ] All tests passing in CI
- [ ] Coverage threshold met
- [ ] No new security vulnerabilities
- [ ] Performance impact assessed (if applicable)
- [ ] Tests reviewed and approved
