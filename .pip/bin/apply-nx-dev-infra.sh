#!/usr/bin/env bash
set -e

PIP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRAGMENT_DIR="$PIP_DIR/fragments/nx-dev-infra/files"
TARGET_DIR="$(pwd)"

echo "🚀 Applying nx-dev-infra fragment from $FRAGMENT_DIR to $TARGET_DIR"
echo

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Docker
if ! docker info >/dev/null 2>&1; then
  echo "❌ Docker is not running"
  echo "   Please start Docker Desktop and try again"
  exit 1
fi
echo "✅ Docker is running"

# Check if Nx is initialized
if [ ! -f "$TARGET_DIR/nx.json" ]; then
  echo "⚠️  Nx workspace not initialized"
  echo "   Run: npx nx@latest init --integrated"
  echo "   Then run this script again"
  exit 1
fi
echo "✅ Nx workspace detected"

echo

# Copy scaffold root files (don't overwrite existing)
if [ -f "$TARGET_DIR/Dockerfile.dev" ]; then
  echo "⚠️  Dockerfile.dev already exists, skipping"
else
  cp "$FRAGMENT_DIR/Dockerfile.dev" "$TARGET_DIR/Dockerfile.dev"
  echo "✅ Created Dockerfile.dev"
fi

if [ -f "$TARGET_DIR/docker-compose.yml" ]; then
  echo "⚠️  docker-compose.yml already exists, skipping"
else
  cp "$FRAGMENT_DIR/docker-compose.yml" "$TARGET_DIR/docker-compose.yml"
  echo "✅ Created docker-compose.yml"
fi

if [ -f "$TARGET_DIR/.nxignore" ]; then
  echo "⚠️  .nxignore already exists, skipping"
else
  cp "$FRAGMENT_DIR/.nxignore" "$TARGET_DIR/.nxignore"
  echo "✅ Created .nxignore"
fi

# Create the Nx tools/infra folder structure
mkdir -p "$TARGET_DIR/tools/infra"

# Copy project.json into the project
if [ -f "$TARGET_DIR/tools/infra/project.json" ]; then
  echo "⚠️  tools/infra/project.json already exists, skipping"
else
  cp "$FRAGMENT_DIR/tools/infra/project.json" "$TARGET_DIR/tools/infra/project.json"
  echo "✅ Created tools/infra/project.json"
fi

echo
echo "✨ Nx + Docker dev scaffold applied successfully!"
echo
echo "Next steps:"
echo "  1. Run: nx run infra:up"
echo "  2. Then: docker compose exec dev bash"
echo "  3. Inside container: pnpm install, nx graph, nx <targets>, etc."
echo
echo "Services:"
echo "  • PostgreSQL: localhost:${POSTGRES_PORT:-5432} (db/user/pass: nexus)"
echo "  • n8n: http://localhost:${N8N_PORT:-5678}"
echo
echo "Port overrides (optional):"
echo "  • POSTGRES_PORT=5433 N8N_PORT=5679 nx run infra:up"
echo
