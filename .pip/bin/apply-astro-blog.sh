#!/usr/bin/env bash
set -e

PIP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRAGMENT_DIR="$PIP_DIR/fragments/astro-blog/files"
TARGET_DIR="$(pwd)"

echo "🚀 Applying astro-blog fragment..."
echo

# Check prerequisites
if [ ! -f "$TARGET_DIR/nx.json" ]; then
  echo "❌ Error: Nx workspace not initialized"
  echo "   Run: npx nx@latest init --integrated"
  exit 1
fi

if ! command -v pnpm &> /dev/null; then
  echo "❌ Error: pnpm not installed"
  echo "   Run: npm install -g pnpm"
  exit 1
fi

# Copy blog app
if [ -d "$TARGET_DIR/apps/blog" ]; then
  echo "⚠️  apps/blog already exists, skipping"
else
  cp -r "$FRAGMENT_DIR/apps/blog" "$TARGET_DIR/apps/"
  echo "✅ Created apps/blog/"
fi

# Create symlink for blog content
mkdir -p "$TARGET_DIR/blog"
mkdir -p "$TARGET_DIR/apps/blog/src/content"
if [ ! -L "$TARGET_DIR/apps/blog/src/content/blog" ]; then
  ln -s "$TARGET_DIR/blog" "$TARGET_DIR/apps/blog/src/content/blog"
  echo "✅ Linked blog/ to apps/blog/src/content/blog"
fi

# Create example post if blog/ is empty
if [ -z "$(ls -A $TARGET_DIR/blog 2>/dev/null)" ]; then
  cat > "$TARGET_DIR/blog/example-post.md" << 'EOF'
---
title: "Welcome to Your Blog"
description: "Getting started with Astro"
date: 2025-01-01
author: "Team"
tags: ["welcome"]
---

# Welcome!

This is your first blog post. Edit this file or create new `.md` files in the `blog/` directory.

## Writing Posts

Create new posts as markdown files with frontmatter:

\`\`\`markdown
---
title: "Post Title"
description: "Short description"
date: 2025-01-01
author: "Author Name"
tags: ["tag1", "tag2"]
---

Your content here...
\`\`\`

## Next Steps

1. Edit `apps/blog/astro.config.mjs` and set your site URL
2. Customize `apps/blog/src/layouts/Layout.astro`
3. Run `nx serve blog` to start development server
4. Visit http://localhost:4321

Happy blogging!
EOF
  echo "✅ Created example post in blog/"
fi

echo
echo "✨ Fragment applied successfully!"
echo
echo "Next steps:"
echo "  1. Install dependencies: pnpm install"
echo "  2. Start dev server: nx serve blog"
echo "  3. Visit http://localhost:4321"
echo
echo "Add new posts by creating .md files in blog/"
echo
