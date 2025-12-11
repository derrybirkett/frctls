# Fractals of Change - Deployment Setup

## 🚀 GitHub Pages Deployment

This repository is configured for automatic deployment to GitHub Pages with content automation.

### Quick Setup

1. **Enable GitHub Pages**
   ```
   Repository Settings > Pages > Source: GitHub Actions
   ```

2. **Configure Repository URL**
   - Update `site` in `apps/blog/astro.config.mjs` if using custom domain
   - Current config: `https://fractalsofchange.github.io/frctls/`

3. **Push to Main Branch**
   - Deployment triggers automatically on changes to `apps/blog/**`

### 📅 Content Automation

**Scheduled Publishing**:
- Every Tuesday & Friday at 9 AM UTC
- Checks `apps/blog/src/content/drafts/` for ready posts
- Creates pull requests for review

**Content Workflow**:
1. Write posts in `apps/blog/src/content/drafts/`
2. Set future `pubDate` in frontmatter
3. Automation moves to `apps/blog/src/content/blog/` when ready
4. Review and merge PR to publish

### 🛠 Manual Operations

**Deploy Now**:
```bash
# Trigger manual deployment
gh workflow run deploy-blog.yml
```

**Generate Content Ideas**:
```bash
# Generate content ideas based on pillars
gh workflow run content-automation.yml -f action=generate-content-ideas
```

**Local Development**:
```bash
# Start development server
nx run infra:up
cd apps/blog && pnpm dev
# Visit http://localhost:4321
```

### 📊 Content Strategy

**Publishing Schedule**:
- **Tuesday**: Theory or Implementation posts
- **Friday**: Leadership or Case Study posts
- **Monthly**: Long-form case studies

**Content Pillars**:
1. **Theory** - Fractal mathematics applied to organizations
2. **Leadership** - Practical advice for enterprise directors  
3. **Case Studies** - Real transformation examples
4. **Implementation** - Step-by-step guides and tools

### 🔧 Technical Details

**Build Process**:
- Astro static site generation
- Automatic image optimization
- Sitemap generation
- RSS feed creation

**Performance**:
- Static files served from GitHub Pages CDN
- Optimized images (WebP format)
- Minimal JavaScript bundle

**SEO**:
- Semantic HTML structure
- Meta tags and Open Graph
- XML sitemap
- RSS feed for syndication

### 📈 Analytics & Monitoring

**Deployment Status**:
- GitHub Actions tab shows build/deploy status
- Failed builds include detailed error logs

**Content Performance**:
- GitHub Pages provides basic traffic stats
- Consider Google Analytics for detailed metrics

**Recommended Metrics**:
- Page views by content pillar
- Time on page for long-form content
- RSS feed subscribers
- Social media engagement

### 🚨 Troubleshooting

**Build Failures**:
1. Check GitHub Actions logs
2. Test locally: `cd apps/blog && pnpm build`
3. Verify frontmatter format in new posts

**Content Issues**:
1. Validate markdown syntax
2. Check image paths (use relative paths)
3. Verify date formats in frontmatter

**Deployment Issues**:
1. Confirm GitHub Pages is enabled
2. Check repository permissions
3. Verify workflow permissions in Settings > Actions

### 🔄 Workflow Files

- `.github/workflows/deploy-blog.yml` - Main deployment workflow
- `.github/workflows/content-automation.yml` - Content scheduling and automation
- `apps/blog/src/content/drafts/` - Scheduled content directory

### 📝 Next Steps

1. **Custom Domain** (optional): Configure in repository settings
2. **Analytics**: Add Google Analytics or similar
3. **Newsletter**: Integrate email signup for RSS subscribers
4. **Social**: Automate social media posting for new content

---

**Live Site**: https://fractalsofchange.github.io/frctls/  
**Content Schedule**: Tuesday & Friday publications  
**Contact**: Enterprise directors interested in fractal organizational transformation