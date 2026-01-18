#!/usr/bin/env bash
set -euo pipefail

PIP_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

REQUIRE_PNPM="${REQUIRE_PNPM:-0}"
KEEP_TMP="${KEEP_TMP:-0}"

TMP_ROOT="$(mktemp -d 2>/dev/null || mktemp -d -t pip-fragment-test)"
TARGET_DIR="$TMP_ROOT/organism"

cleanup() {
  if [[ "$KEEP_TMP" = "1" ]]; then
    echo "Keeping temp directory: $TMP_ROOT"
  else
    rm -rf "$TMP_ROOT"
  fi
}
trap cleanup EXIT

have() { command -v "$1" >/dev/null 2>&1; }

assert_exists() {
  local path="$1"
  if [[ ! -e "$path" ]]; then
    echo "Expected path missing: $path" >&2
    exit 1
  fi
}

mkdir -p "$TARGET_DIR"
cd "$TARGET_DIR"

if ! have node || ! have npm || ! have npx; then
  echo "Missing prerequisites: node/npm/npx" >&2
  exit 1
fi

export CI=1

npm init -y >/dev/null
npx --yes nx@latest init --integrated --interactive=false

"$PIP_ROOT/bin/apply-nx-product-surfaces.sh"

"$PIP_ROOT/bin/apply-nx-webapp-starter.sh"

if have pnpm; then
  "$PIP_ROOT/bin/apply-astro-blog.sh"
else
  if [[ "$REQUIRE_PNPM" = "1" ]]; then
    echo "pnpm is required but not installed (REQUIRE_PNPM=1)" >&2
    exit 1
  fi
  echo "Skipping astro-blog fragment (pnpm not installed)."
fi

# infra fragment is optional; it requires Docker daemon running.
if have docker && docker info >/dev/null 2>&1; then
  "$PIP_ROOT/bin/apply-nx-dev-infra.sh"
else
  echo "Skipping nx-dev-infra fragment (Docker not available)."
fi

assert_exists "nx.json"
assert_exists "package.json"
assert_exists "apps/app"
assert_exists "apps/marketing"
assert_exists "libs/auth"
assert_exists "web"
assert_exists "web/src/app"
assert_exists "web/src/app/login"
assert_exists "web/src/app/app"
assert_exists "web/src/app/profile"
assert_exists "web/src/middleware.ts"
assert_exists "docs/graph/product-app.md"
assert_exists "docs/graph/marketing-website.md"
assert_exists "docs/graph/blog.md"

if have pnpm; then
  assert_exists "apps/blog"
  assert_exists "apps/blog/src/content/blog"
  assert_exists "blog/example-post.md"
fi

echo "Fragments test OK"
