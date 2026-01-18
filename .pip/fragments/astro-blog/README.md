# astro-blog Fragment

Fast, SEO-friendly blog powered by Astro. Perfect for content-led growth with markdown posts.

## What's Included

- **Astro 4** - Lightning-fast static site generator
- **Tailwind CSS** - Utility-first styling
- **TypeScript** - Type-safe development
- **Content Collections** - Type-safe markdown handling
- **RSS Feed** - Auto-generated from posts
- **Dark Mode** - Built-in light/dark theme
- **SEO Optimized** - Meta tags and semantic HTML
- **Nx Integration** - Seamless workspace integration

## Prerequisites

- **Nx workspace** initialized (`nx.json` exists)
- **pnpm** installed globally
- **Node 22+** (provided by nx-dev-infra fragment)

## Quick Start

### 1. Apply Fragment

```bash
# In your project root (organism, not .pip)
./.pip/bin/apply-astro-blog.sh
```

This creates:
```
your-project/
├── apps/blog/              # Astro application
├── blog/                   # Your markdown posts (symlinked)
└── blog/example-post.md   # Sample post
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Start Development Server

```bash
nx serve blog
```

Visit http://localhost:4321

## Writing Posts

### Create a New Post

```bash
cat > blog/2025-12-11-my-post.md << 'EOF'
---
title: "My Awesome Post"
description: "A brief description for SEO"
date: 2025-12-11
author: "Your Name"
tags: ["tutorial", "astro"]
---

# My Awesome Post

Your content here...

## Subheading

More content...
EOF
```

The blog auto-discovers new `.md` files in `blog/`!

### Frontmatter Schema

```yaml
---
title: string          # Required: Post title
description: string    # Required: SEO description
date: YYYY-MM-DD      # Required: Publish date
author: string        # Optional: defaults to "Team"
tags: [string]        # Optional: array of tags
draft: boolean        # Optional: hide from production
---
```

### Markdown Features

- GitHub-flavored markdown
- Syntax highlighting (via Shiki)
- Code blocks with language support
- Blockquotes, lists, tables
- Images (place in `apps/blog/public/`)

## Development

```bash
# Start dev server (hot reload)
nx serve blog

# Build for production
nx build blog

# Preview production build
nx preview blog
```

## Customization

### Update Site URL

Edit `apps/blog/astro.config.mjs`:
```js
export default defineConfig({
  site: 'https://yourdomain.com'  // Your actual domain
});
```

### Customize Styling

Edit `apps/blog/src/layouts/Layout.astro` to change:
- Header/footer
- Navigation links
- Color scheme
- Typography

The blog uses Tailwind CSS - modify `apps/blog/tailwind.config.mjs` for theme changes.

### Add Analytics

Edit `apps/blog/src/layouts/Layout.astro` and add tracking scripts in `<head>`.

## File Structure

```
apps/blog/
├── astro.config.mjs       # Astro configuration
├── package.json           # Dependencies
├── project.json           # Nx targets
├── tailwind.config.mjs    # Tailwind config
├── tsconfig.json          # TypeScript config
└── src/
    ├── pages/
    │   ├── index.astro        # Home page (post list)
    │   ├── posts/
    │   │   └── [...slug].astro # Dynamic post pages
    │   └── rss.xml.ts          # RSS feed
    ├── layouts/
    │   └── Layout.astro       # Base layout
    └── content/
        ├── config.ts          # Content schema
        └── blog/              # → Symlink to /blog
```

## RSS Feed

Auto-generated at `/rss.xml` with all published posts.

Test it: http://localhost:4321/rss.xml

## Deployment

### Build Static Site

```bash
nx build blog
```

Output: `apps/blog/dist/` (static HTML/CSS/JS)

### Deploy Options

**Vercel/Netlify:**
```bash
# Build command
nx build blog

# Output directory
apps/blog/dist
```

**Docker + Nginx:**
```dockerfile
FROM nginx:alpine
COPY apps/blog/dist /usr/share/nginx/html
EXPOSE 80
```

**GitHub Pages:**
```yaml
# .github/workflows/deploy.yml
- run: pnpm install
- run: nx build blog
- uses: peaceiris/actions-gh-pages@v3
  with:
    publish_dir: ./apps/blog/dist
```

## Troubleshooting

### "Cannot find module 'astro:content'"

**Solution**: Run `pnpm install` first.

### Posts not appearing

**Check**:
1. File is in `blog/` directory
2. File has `.md` extension
3. Frontmatter is valid YAML
4. `draft: false` (or omitted)
5. Date is not in future

### Symlink issues

**Solution**: The script creates `apps/blog/src/content/blog` → `/blog`.  
If broken, recreate:
```bash
rm apps/blog/src/content/blog
ln -s ../../../blog apps/blog/src/content/blog
```

### Build errors

```bash
# Clear cache and rebuild
rm -rf apps/blog/dist apps/blog/.astro
nx build blog
```

## Best Practices

### Writing
- Keep posts focused (one topic)
- Use descriptive titles and descriptions
- Add relevant tags for discoverability
- Include code examples where helpful
- Optimize images (<200KB each)

### SEO
- Write unique descriptions (50-160 chars)
- Use semantic headings (H1 → H2 → H3)
- Add alt text to images
- Internal link between related posts
- Update `site` in astro.config.mjs

### Performance
- Optimize images before adding
- Keep bundle size small
- Test with Lighthouse (aim for 95+)
- Use lazy loading for images

## Integration with .pip

This fragment follows the genome/organism pattern:
- **`.pip/` (genome)** = Template (immutable)
- **Your project (organism)** = Expression (modify freely)

After applying:
- `apps/blog/` is yours to customize
- `blog/` contains your actual posts
- `.pip/` stays pristine for updates

## Next Steps

- [ ] Customize `apps/blog/astro.config.mjs` (set site URL)
- [ ] Update header/footer in `Layout.astro`
- [ ] Write your first post
- [ ] Test RSS feed
- [ ] Configure deployment
- [ ] Add analytics (optional)
- [ ] Set up newsletter (optional)

## Resources

- [Astro Documentation](https://docs.astro.build)
- [Content Collections Guide](https://docs.astro.build/en/guides/content-collections/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Shiki Themes](https://shiki.style/themes)

---

**Fragment Version**: 1.0.0  
**Astro Version**: 4.16+  
**Maintained by**: CTO Agent
