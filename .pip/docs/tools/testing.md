# Testing

This repo is mostly scripts + docs, so “testing” is primarily regression checks for bootstrapping, fragment application, and docs/pattern structure.

## Quick Local Checks

```bash
./bin/test-bootstrap.sh
./bin/validate-patterns.sh
./bin/test-fragments.sh
```

Notes:
- `bin/test-fragments.sh` skips `nx-dev-infra` unless Docker is running.
- `bin/test-fragments.sh` skips `astro-blog` unless `pnpm` is installed. Set `REQUIRE_PNPM=1` to force failure if missing.

## Wrap-Up Script (Dry Run)

`bin/wrap-up.sh` is interactive and will commit/push by default.

To validate the flow without committing or pushing:

```bash
PIP_WRAP_UP_DRY_RUN=1 \
PIP_WRAP_UP_CONFIRM_DOCS=y \
PIP_WRAP_UP_COMMIT_MSG="chore: wrap-up dry run" \
PIP_WRAP_UP_SKIP_PUSH=1 \
./bin/wrap-up.sh
```

## CI Suggestions

PR checks (fast):

```bash
./bin/test-bootstrap.sh
./bin/validate-patterns.sh
```

Nightly (heavier):

```bash
# Requires Node + npm/npx; pnpm optional unless REQUIRE_PNPM=1
REQUIRE_PNPM=1 ./bin/test-fragments.sh
```
