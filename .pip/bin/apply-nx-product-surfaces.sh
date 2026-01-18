#!/usr/bin/env bash
set -euo pipefail

PIP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET_DIR="$(pwd)"

echo "🚀 Scaffolding Nx product surfaces (app + marketing + auth boundary)"
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

has_dep() {
  local name="$1"
  node -e "const p=require('./package.json');const d={...(p.dependencies||{}),...(p.devDependencies||{})};process.exit(d[name]?0:1)" "$name" >/dev/null 2>&1
}

ensure_nx_react() {
  if has_dep "@nx/react" && has_dep "@nx/vite"; then
    echo "✅ Nx React tooling already installed (@nx/react, @nx/vite)"
    return
  fi

  echo "📦 Installing Nx React tooling (@nx/react, @nx/vite)..."
  pm_add_dev @nx/react @nx/vite
}

NX_INTERACTIVE=false
export NX_INTERACTIVE

NX_CMD="npx nx"

ensure_nx_react

echo

echo "🧱 Creating apps/app (product app surface)..."
if [ -d "apps/app" ]; then
  echo "⚠️  apps/app already exists, skipping"
else
  $NX_CMD g @nx/react:application apps/app \
    --bundler=vite \
    --linter=eslint \
    --unitTestRunner=vitest \
    --e2eTestRunner=none \
    --routing=false \
    --style=css \
    --port=4200 \
    --skipFormat
  echo "✅ Created apps/app"
fi

echo

echo "🧱 Creating apps/marketing (marketing surface)..."
if [ -d "apps/marketing" ]; then
  echo "⚠️  apps/marketing already exists, skipping"
else
  $NX_CMD g @nx/react:application apps/marketing \
    --bundler=vite \
    --linter=eslint \
    --unitTestRunner=vitest \
    --e2eTestRunner=none \
    --routing=false \
    --style=css \
    --port=4201 \
    --skipFormat
  echo "✅ Created apps/marketing"
fi

echo

echo "🧱 Creating libs/auth (provider-swappable boundary)..."
if [ -d "libs/auth" ]; then
  echo "⚠️  libs/auth already exists, skipping"
else
  $NX_CMD g @nx/js:library libs/auth \
    --bundler=tsc \
    --linter=eslint \
    --unitTestRunner=none \
    --minimal \
    --skipFormat
  echo "✅ Created libs/auth"
fi

echo

# Install Tailwind CSS and React Router
echo "📦 Installing Tailwind CSS, PostCSS, Autoprefixer..."
if ! has_dep "tailwindcss"; then
  pm_add_dev tailwindcss @tailwindcss/postcss postcss autoprefixer
  echo "✅ Installed Tailwind CSS"
else
  echo "✅ Tailwind CSS already installed"
fi

echo "📦 Installing React Router..."
if ! has_dep "react-router-dom"; then
  case "$PM" in
    pnpm) pnpm add react-router-dom ;;
    yarn) yarn add react-router-dom ;;
    npm) npm install react-router-dom ;;
  esac
  echo "✅ Installed React Router"
else
  echo "✅ React Router already installed"
fi

echo

# Copy fragment files for marketing app
echo "🎨 Copying marketing landing page fragment files..."
FRAGMENT_DIR="$PIP_DIR/fragments/nx-product-surfaces/files"

if [ -d "apps/marketing" ]; then
  # Copy component files
  mkdir -p apps/marketing/src/components
  
  if [ -f "$FRAGMENT_DIR/apps/marketing/src/components/Hero.tsx" ]; then
    cp "$FRAGMENT_DIR/apps/marketing/src/components/Hero.tsx" apps/marketing/src/components/
    echo "✅ Copied Hero.tsx"
  fi
  
  # Copy app.tsx
  if [ -f "$FRAGMENT_DIR/apps/marketing/src/app/app.tsx" ]; then
    cp "$FRAGMENT_DIR/apps/marketing/src/app/app.tsx" apps/marketing/src/app/
    echo "✅ Copied marketing app.tsx"
  fi
  
  # Copy app.css
  if [ -f "$FRAGMENT_DIR/apps/marketing/src/app/app.css" ]; then
    cp "$FRAGMENT_DIR/apps/marketing/src/app/app.css" apps/marketing/src/app/
    echo "✅ Copied marketing app.css"
  fi
  
  # Copy Tailwind config
  if [ -f "$FRAGMENT_DIR/apps/marketing/tailwind.config.js" ]; then
    cp "$FRAGMENT_DIR/apps/marketing/tailwind.config.js" apps/marketing/
    echo "✅ Copied marketing tailwind.config.js"
  fi
  
  # Copy PostCSS config
  if [ -f "$FRAGMENT_DIR/apps/marketing/postcss.config.js" ]; then
    cp "$FRAGMENT_DIR/apps/marketing/postcss.config.js" apps/marketing/
    echo "✅ Copied marketing postcss.config.js"
  fi
fi

echo

# Copy fragment files for app
echo "🎨 Copying app dashboard fragment files..."

if [ -d "apps/app" ]; then
  # Copy component files
  mkdir -p apps/app/src/components apps/app/src/pages
  
  if [ -f "$FRAGMENT_DIR/apps/app/src/components/DashboardLayout.tsx" ]; then
    cp "$FRAGMENT_DIR/apps/app/src/components/DashboardLayout.tsx" apps/app/src/components/
    echo "✅ Copied DashboardLayout.tsx"
  fi
  
  if [ -f "$FRAGMENT_DIR/apps/app/src/pages/Dashboard.tsx" ]; then
    cp "$FRAGMENT_DIR/apps/app/src/pages/Dashboard.tsx" apps/app/src/pages/
    echo "✅ Copied Dashboard.tsx"
  fi
  
  if [ -f "$FRAGMENT_DIR/apps/app/src/pages/Profile.tsx" ]; then
    cp "$FRAGMENT_DIR/apps/app/src/pages/Profile.tsx" apps/app/src/pages/
    echo "✅ Copied Profile.tsx"
  fi
  
  # Copy app.tsx
  if [ -f "$FRAGMENT_DIR/apps/app/src/app/app.tsx" ]; then
    cp "$FRAGMENT_DIR/apps/app/src/app/app.tsx" apps/app/src/app/
    echo "✅ Copied app app.tsx"
  fi
  
  # Copy app.css
  if [ -f "$FRAGMENT_DIR/apps/app/src/app/app.css" ]; then
    cp "$FRAGMENT_DIR/apps/app/src/app/app.css" apps/app/src/app/
    echo "✅ Copied app app.css"
  fi
  
  # Copy Tailwind config
  if [ -f "$FRAGMENT_DIR/apps/app/tailwind.config.js" ]; then
    cp "$FRAGMENT_DIR/apps/app/tailwind.config.js" apps/app/
    echo "✅ Copied app tailwind.config.js"
  fi
  
  # Copy PostCSS config
  if [ -f "$FRAGMENT_DIR/apps/app/postcss.config.js" ]; then
    cp "$FRAGMENT_DIR/apps/app/postcss.config.js" apps/app/
    echo "✅ Copied app postcss.config.js"
  fi
fi

echo

# Copy auth lib files
echo "🔐 Copying auth boundary files..."

if [ -d "libs/auth" ]; then
  mkdir -p libs/auth/src/lib
  
  if [ -f "$FRAGMENT_DIR/libs/auth/src/lib/auth.tsx" ]; then
    cp "$FRAGMENT_DIR/libs/auth/src/lib/auth.tsx" libs/auth/src/lib/
    echo "✅ Copied auth.tsx"
  fi
  
  if [ -f "$FRAGMENT_DIR/libs/auth/src/lib/types.ts" ]; then
    cp "$FRAGMENT_DIR/libs/auth/src/lib/types.ts" libs/auth/src/lib/
    echo "✅ Copied types.ts"
  fi
  
  if [ -f "$FRAGMENT_DIR/libs/auth/src/index.ts" ]; then
    cp "$FRAGMENT_DIR/libs/auth/src/index.ts" libs/auth/src/
    echo "✅ Copied index.ts"
  fi
fi

echo

echo "📚 Adding organism graph templates under docs/graph/..."
mkdir -p docs/graph

copy_graph() {
  local name="$1"
  local src="$PIP_DIR/graph/$name.md"
  local dst="$TARGET_DIR/docs/graph/$name.md"

  if [ -f "$dst" ]; then
    echo "⚠️  docs/graph/$name.md already exists, skipping"
    return
  fi

  if [ ! -f "$src" ]; then
    echo "⚠️  Missing template: $src (skipping)"
    return
  fi

  cp "$src" "$dst"
  echo "✅ Created docs/graph/$name.md"
}

copy_graph "product-app"
copy_graph "marketing-website"
copy_graph "blog"

echo

# Run mission injection if mission.md exists
if [ -f "$TARGET_DIR/docs/mission.md" ]; then
  echo "🔄 Injecting mission data into components..."
  "$PIP_DIR/bin/inject-mission.sh"
  echo
fi

echo "✨ Product surfaces scaffold complete!"
echo

echo "Next steps:"
echo "  1) Review generated files:"
echo "     - apps/marketing/src/app/app.tsx (landing page with hero)"
echo "     - apps/app/src/pages/Dashboard.tsx (dashboard)"
echo "     - apps/app/src/pages/Profile.tsx (user profile)"
echo "     - libs/auth/src/lib/auth.tsx (auth boundary)"
echo "  2) Start marketing: nx serve marketing"
echo "  3) Start app: nx serve app"
echo "  4) (Optional) Apply infra: ./.pip/bin/apply-nx-dev-infra.sh"
echo "  5) Implement real auth by swapping provider in libs/auth"
echo "     (Supabase/Clerk/WorkOS - see comments in auth.tsx)"
echo ""
