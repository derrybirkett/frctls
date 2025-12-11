# Deployment Guide

## GitHub Pages Deployment

The Fractals of Change blog is automatically deployed to GitHub Pages using GitHub Actions.

### Setup Requirements

1. **Repository Settings**
   - Go to Settings > Pages
   - Source: GitHub Actions
   - Custom domain (optional): Configure if using custom domain

2. **Branch Protection**
   - Main branch is protected
   - All changes must go through pull requests
   - Automated deployments trigger on main branch updates

### Deployment Process

**Automatic Deployment**:
- Triggers on push to `main` branch
- Only deploys when blog content changes (`apps/blog/**`)
- Build process runs in GitHub Actions
- Deploys to GitHub Pages automatically

**Manual Deployment**:
- Go to Actions tab in GitHub
- Select "Deploy Fractals of Change Blog"
- Click "Run workflow"

### Content Publishing Workflow

**Scheduled Publishing**:
1. Create blog posts in `apps/blog/src/content/drafts/`
2. Set future `pubDate` in frontmatter
3. Automation runs every Tuesday and Friday at 9 AM UTC
4. Ready posts are moved to `apps/blog/src/content/blog/`
5. Pull request is created automatically
6. Review and merge to publish

**Manual Publishing**:
1. Move posts from `drafts/` to `blog/` directory
2. Commit and push to main branch
3. Deployment happens automatically

### URLs

- **Production**: https://fractalsofchange.github.io/frctls/
- **Staging**: Preview deployments on pull requests

### Content Automation

**Scheduled Actions**:
- **Tuesday & Friday 9 AM UTC**: Check for scheduled content
- **Manual Trigger**: Generate content ideas

**Workflow Features**:
- Automatic content scheduling
- Pull request creation for reviews
- Content idea generation
- SEO optimization checks

### Monitoring

**Deployment Status**:
- Check GitHub Actions tab for build status
- Failed deployments will show error details
- Deployment history available in Actions

**Content Performance**:
- GitHub Pages provides basic analytics
- Consider adding Google Analytics for detailed metrics

### Troubleshooting

**Build Failures**:
1. Check GitHub Actions logs
2. Verify Astro configuration
3. Test build locally: `cd apps/blog && pnpm build`

**Content Issues**:
1. Verify frontmatter format
2. Check image paths and assets
3. Validate markdown syntax

**Deployment Issues**:
1. Verify GitHub Pages settings
2. Check repository permissions
3. Review workflow permissions in Actions