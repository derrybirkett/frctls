#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PIP_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

KEEP_TMP="${KEEP_TMP:-0}"
TARGET_DIR="$(mktemp -d 2>/dev/null || mktemp -d -t pip-bootstrap-test)"

cleanup() {
	if [ "$KEEP_TMP" = "1" ]; then
		echo "Keeping temp directory: $TARGET_DIR"
	else
		rm -rf "$TARGET_DIR"
	fi
}
trap cleanup EXIT

# Test the bootstrap script with pre-filled answers in a temporary downstream project.
cd "$TARGET_DIR"

# Feed answers to the bootstrap script
"$PIP_ROOT/bin/bootstrap.sh" <<EOF
rdbl
Reading & blogging platform
product
y
y
y
y
n
n
y
n
y
n
y
y
EOF

assert_exists() {
	local path="$1"
	if [ ! -e "$path" ]; then
		echo "Expected path missing: $path" >&2
		exit 1
	fi
}

assert_exists ".pip/README.md"
assert_exists ".pip/mission/mission.md"
assert_exists ".pip/method/delivery-method.md"
assert_exists ".pip/ia/agent_manifest.yml"
assert_exists ".pip/graph/product-app.md"
assert_exists ".pip/graph/blog.md"
assert_exists ".pip/docs/activity-log.md"
assert_exists ".pip/docs/changelog.md"

if [ ! -f ".envrc" ]; then
	echo "Expected .envrc to be created" >&2
	exit 1
fi
