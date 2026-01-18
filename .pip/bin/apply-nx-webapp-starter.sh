#!/usr/bin/env bash
set -euo pipefail

PIP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET_DIR="$(pwd)"

echo "🚀 Scaffolding Nx webapp starter (Next.js + landing + dummy auth + app shell)"
echo "   From: $PIP_DIR"
echo "   Into: $TARGET_DIR"
echo

if [ ! -f "$TARGET_DIR/nx.json" ]; then
  echo "❌ Nx workspace not detected (nx.json missing)."
  echo "   Initialize Nx first (example):"
  echo "     npx nx@latest init --integrated"
  exit 1
fi

if [ ! -f "$TARGET_DIR/package.json" ]; then
  echo "❌ package.json missing."
  echo "   Nx init should create it; please run Nx init first."
  exit 1
fi

detect_pm() {
  if [ -f "pnpm-lock.yaml" ]; then
    echo "pnpm"
  elif [ -f "yarn.lock" ]; then
    echo "yarn"
  else
    echo "npm"
  fi
}

PM="$(detect_pm)"

pm_add_dev() {
  case "$PM" in
    pnpm) pnpm add -D "$@" ;;
    yarn) yarn add -D "$@" ;;
    npm) npm install -D "$@" ;;
    *)
      echo "❌ Unsupported package manager: $PM";
      exit 1
      ;;
  esac
}

pm_add() {
  case "$PM" in
    pnpm) pnpm add "$@" ;;
    yarn) yarn add "$@" ;;
    npm) npm install "$@" ;;
    *)
      echo "❌ Unsupported package manager: $PM";
      exit 1
      ;;
  esac
}

has_dep() {
  local name="$1"
  node -e "const p=require('./package.json');const d={...(p.dependencies||{}),...(p.devDependencies||{})};process.exit(d[name]?0:1)" "$name" >/dev/null 2>&1
}

ensure_nx_next() {
  if has_dep "@nx/next"; then
    echo "✅ Nx Next tooling already installed (@nx/next)"
    return
  fi

  echo "📦 Installing Nx Next tooling (@nx/next)..."
  pm_add_dev @nx/next
}

NX_INTERACTIVE=false
export NX_INTERACTIVE

NX_CMD="npx nx"

ensure_nx_next

echo

echo "🧱 Creating web (Next.js app)..."
if [ -d "web" ]; then
  echo "⚠️  web already exists, skipping generator"
else
  $NX_CMD g @nx/next:application web --skipFormat
  echo "✅ Created web"
fi

echo

echo "🧩 Applying webapp starter templates..."
TEMPLATE_ROOT="$PIP_DIR/fragments/nx-webapp-starter/files"

copy_file() {
  local rel="$1"
  local src="$TEMPLATE_ROOT/$rel"
  local dst="$TARGET_DIR/$rel"

  if [ ! -f "$src" ]; then
    echo "❌ Missing template: $src" >&2
    exit 1
  fi

  mkdir -p "$(dirname "$dst")"
  cp "$src" "$dst"
}

# Next.js app router templates (Nx 20+). These will overwrite generated stubs.
copy_file "web/src/app/layout.tsx"
copy_file "web/src/app/page.tsx"
copy_file "web/src/app/providers.tsx"
copy_file "web/src/app/login/page.tsx"
copy_file "web/src/app/login/actions.ts"
copy_file "web/src/app/logout/actions.ts"
copy_file "web/src/app/app/page.tsx"
copy_file "web/src/app/profile/page.tsx"
copy_file "web/src/components/NavBar.tsx"
copy_file "web/src/lib/auth.ts"
copy_file "web/src/middleware.ts"
copy_file "web/.env.example"

# Override the default Playwright example with an auth-aware smoke.
copy_file "web-e2e/src/example.spec.ts"

echo "✅ Templates applied"

echo

echo "🔐 Ensuring web/.env.local exists (demo auth secret + creds)..."
if [ -f "web/.env.local" ]; then
  echo "✅ web/.env.local already exists"
else
  SECRET="$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")"
  cat > web/.env.local <<EOF
AUTH_SECRET=$SECRET
DEMO_USER_EMAIL=demo@example.com
DEMO_USER_PASSWORD=demo
EOF
  echo "✅ Created web/.env.local"
fi

echo

echo "✨ Webapp starter scaffold complete!"
echo

echo "Next steps:"
echo "  1) Run: npx nx serve web"
echo "  2) Visit: http://localhost:4200"
echo "  3) (Optional) Change demo creds in web/.env.local"
echo "  4) (Optional) Run e2e: npx nx e2e web-e2e"
echo
