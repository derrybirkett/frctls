# Jekyll Authoring Guide

Guide for writing blog posts using Jekyll with the Hitchens theme.

## Quick Start

### Create a New Post

1. Create a file in `_posts/` with format: `YYYY-MM-DD-title-slug.md`
2. Add Jekyll front matter
3. Write your content (no H1 title needed - front matter handles it)
4. Commit and push

## Front Matter Template

Every post **must** start with YAML front matter:

```yaml
---
title: "Your Post Title"
description: "SEO-friendly description for search engines and social sharing"
date: 2025-12-19
author: "Author Name"
tags: ["tag1", "tag2", "tag3"]
---
```

### Front Matter Fields

- **title** (required): Displayed as the H1 and in post listings
- **description** (required): For SEO and social media previews
- **date** (required): YYYY-MM-DD format, controls post ordering
- **author** (optional): Author name, defaults to site author
- **tags** (optional): Array of tags for categorization
- **layout** (optional): Defaults to `post`, usually don't need to specify

## Writing Content

### Start After Front Matter

```markdown
---
title: "My Post"
description: "Description here"
date: 2025-12-19
author: "CTO Agent"
tags: ["jekyll", "guide"]
---

## First Section

Your content starts here. **No H1 needed** - the front matter title becomes the H1.
```

###  Headings

- **Never use H1 (`#`)** - front matter title is the H1
- Start with H2 (`##`) for your first section
- Use H3 (`###`) for subsections
- Use H4 (`####`) sparingly

### Code Blocks

Use triple backticks with language specifier:

````markdown
```javascript
const example = "code here";
```

```bash
pip review
```
````

### Links

Internal links (within the blog):
```markdown
[Previous post](./2025-12-18-other-post.md)
```

External links:
```markdown
[GitHub](https://github.com/derrybirkett/pip)
```

### Images

Place images in `assets/images/`:
```markdown
![Alt text](/pip/assets/images/screenshot.png)
```

Note the `/pip` baseurl prefix!

## Hitchens Theme Features

### Excerpts

The Hitchens theme shows excerpts on the home page:
- By default: First 30 words of your post
- Configure in `_config.yml`: `excerpt_length: 30`
- Override per post with `excerpt` in front matter:

```yaml
---
title: "My Post"
description: "Description"
date: 2025-12-19
excerpt: "Custom excerpt that appears on home page instead of auto-generated one."
---
```

### Title-less Posts

Hitchens supports microblogging without titles:

```yaml
---
title_is_hidden: true
date: 2025-12-19
---

Your short post content here. No title will be displayed.
```

### Pagination

Configured in `_config.yml`:
- `paginate: 10` - Shows 10 posts per page
- `paginate_path: "/page:num/"` - URL structure for pages

## File Naming

Jekyll is strict about post filenames:

✅ **Correct**:
- `2025-12-19-jekyll-migration.md`
- `2025-01-05-new-feature.md`

❌ **Wrong**:
- `jekyll-migration.md` (no date)
- `12-19-2025-jekyll-migration.md` (wrong date format)
- `2025-12-19_jekyll_migration.md` (underscores instead of hyphens)

## Markdown Best Practices

### Lists

**Unordered**:
```markdown
- Item one
- Item two
  - Nested item
```

**Ordered**:
```markdown
1. First step
2. Second step
3. Third step
```

### Emphasis

- *Italic*: `*italic*` or `_italic_`
- **Bold**: `**bold**` or `__bold__`
- ***Bold italic***: `***bold italic***`

### Blockquotes

```markdown
> This is a quoted section.
> It can span multiple lines.
```

### Tables

```markdown
| Feature | Status |
|---------|--------|
| Theme | Hitchens |
| Posts | 6 |
```

### Horizontal Rules

```markdown
---
```

## SEO Optimization

### Meta Description

The `description` field is used for:
- Meta description tag (Google search results)
- Open Graph description (social media)
- RSS feed description

Keep it under 160 characters for best SEO.

### Tags

Tags help with:
- Content organization
- Internal search
- Related posts

Use 3-5 tags per post, be consistent with naming.

### Permalinks

Configured in `_config.yml` as:
```yaml
permalink: /:year/:month/:day/:title/
```

This creates URLs like:
```
https://derrybirkett.github.io/pip/2025/12/19/jekyll-migration/
```

## Publishing Workflow

### Local Preview (requires Xcode tools)

```bash
bundle exec jekyll serve
# Visit http://localhost:4000/pip
```

### Deploy to GitHub Pages

1. Create post in `_posts/`
2. Commit to your branch
3. Create PR
4. Merge to main
5. GitHub Actions builds and deploys automatically

## Common Issues

### Post Not Showing Up

- **Check filename format**: Must be `YYYY-MM-DD-title.md`
- **Check date**: Future-dated posts don't show (unless `future: true` in config)
- **Check front matter**: Must have valid YAML with closing `---`

### Broken Links

- Remember the `/pip` baseurl for internal links
- Use relative paths for post-to-post links

### Images Not Loading

- Place in `assets/images/`
- Use full path: `/pip/assets/images/image.png`
- Commit images to repo

### Code Blocks Not Highlighting

- Specify language: ` ```javascript ` not just ` ``` `
- Jekyll uses Rouge for syntax highlighting

## Jekyll-Specific Syntax

### Liquid Tags

Jekyll uses Liquid for templating. Usually you don't need these in posts, but they're available:

```liquid
{% raw %}
{{ site.title }}        # Site title
{{ page.title }}        # Current page title
{{ post.date | date: "%B %d, %Y" }}  # Formatted date
{% endraw %}
```

### Including Files

To include reusable content:
```liquid
{% raw %}
{% include alert.html content="Warning message" %}
{% endraw %}
```

## Resources

- [Jekyll Docs](https://jekyllrb.com/docs/)
- [Hitchens Theme](https://github.com/patdryburgh/hitchens)
- [Markdown Guide](https://www.markdownguide.org/)
- [GitHub Pages Docs](https://docs.github.com/en/pages)

## CMO Agent Responsibilities

When creating blog posts, the CMO agent should:

1. **Write for humans first** - SEO optimized but readable
2. **Include all front matter fields** - Especially description
3. **Use semantic headings** - H2 for sections, H3 for subsections
4. **Add relevant tags** - 3-5 tags that match existing taxonomy
5. **Include links** - To PRs, commits, and related posts
6. **Proofread** - Check spelling, grammar, formatting before committing
7. **No H1 titles in content** - front matter title is used
