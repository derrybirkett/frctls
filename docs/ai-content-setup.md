# AI Content Generation Setup

This document explains how to set up and configure the AI-powered content generation system for the Fractals of Change blog.

## Overview

The AI content generation system automatically creates high-quality blog posts using OpenAI's GPT-4 API. It runs on a schedule and creates pull requests for human review before publication.

## Prerequisites

1. **OpenAI API Account**: You need an OpenAI API key with GPT-4 access
2. **GitHub Repository**: With Actions enabled
3. **Blog Structure**: Astro blog with drafts directory

## Setup Steps

### 1. Get OpenAI API Key

1. Go to [OpenAI API Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy the key (starts with `sk-`)

### 2. Add GitHub Secret

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `OPENAI_API_KEY`
5. Value: Your OpenAI API key
6. Click "Add secret"

### 3. Verify Workflow Files

The following files should be in your repository:
- `.github/workflows/ai-content-generation.yml`
- `.github/scripts/generate-content.js`
- `.github/scripts/package.json`

### 4. Test the System

#### Manual Test
```bash
# Trigger workflow manually
gh workflow run ai-content-generation.yml

# Check workflow status
gh run list --workflow=ai-content-generation.yml
```

#### Custom Topic Test
```bash
# Generate content for specific topic
gh workflow run ai-content-generation.yml \
  -f topic_override="Digital Transformation in Enterprise Organizations"
```

## How It Works

### Automatic Schedule
- **Trigger**: Every Sunday at 6:00 AM UTC
- **Generation**: Creates blog post for next Tuesday/Friday
- **Review**: Creates PR with generated content
- **Publication**: Existing automation publishes after PR merge

### Content Generation Process

1. **Topic Selection**: Randomly selects from predefined themes or uses override
2. **AI Generation**: Uses GPT-4 to create 1200-1500 word blog post
3. **File Creation**: Saves to `apps/blog/src/content/drafts/`
4. **PR Creation**: Creates pull request with review checklist
5. **Human Review**: You review, edit, and approve content
6. **Publication**: Existing automation handles scheduling and deployment

### Generated Content Includes

- **SEO-optimized title** targeting enterprise directors
- **Meta description** (150-160 characters)
- **Structured content** with practical insights
- **Relevant tags** for categorization
- **Call-to-action** for engagement

## Customization

### Content Themes

Edit the `CONTENT_THEMES` array in `.github/scripts/generate-content.js`:

```javascript
const CONTENT_THEMES = [
  'Cultural Token Identification and Modification',
  'Fractal Patterns in Enterprise Organizations',
  'Small Changes, Big Impact: Case Studies',
  // Add your themes here
];
```

### AI Prompt Customization

Modify the prompt in the `generateBlogPost()` function to adjust:
- Brand voice and tone
- Content structure
- Target audience focus
- Industry-specific requirements

### Publication Schedule

Change the cron schedule in `.github/workflows/ai-content-generation.yml`:

```yaml
schedule:
  - cron: '0 6 * * 0'  # Every Sunday at 6 AM UTC
```

## Quality Control

### Review Checklist

Each generated PR includes a review checklist:
- [ ] Content accuracy and factual verification
- [ ] Tone and voice alignment with brand
- [ ] SEO optimization (title, description, keywords)
- [ ] Image selection and alt text
- [ ] Call-to-action effectiveness
- [ ] Publication date and scheduling

### Best Practices

1. **Always Review**: Never publish AI content without human review
2. **Fact Check**: Verify any statistics or claims made
3. **Brand Alignment**: Ensure content matches your brand voice
4. **SEO Optimization**: Review and optimize titles and descriptions
5. **Image Selection**: Choose appropriate hero images
6. **Call-to-Action**: Ensure CTAs are relevant and effective

## Monitoring and Maintenance

### Check Workflow Status
```bash
# List recent workflow runs
gh run list --workflow=ai-content-generation.yml

# View specific run details
gh run view <run-id>

# View workflow logs
gh run view <run-id> --log
```

### Monitor API Usage

1. Check OpenAI API usage in your dashboard
2. Monitor costs and set billing alerts
3. Adjust generation frequency if needed

### Content Performance

Track metrics for AI-generated content:
- Page views and engagement
- Time on page
- Social shares
- Conversion rates

Use this data to refine AI prompts and content themes.

## Troubleshooting

### Common Issues

**Workflow Fails to Run**
- Check OpenAI API key is correctly set in GitHub Secrets
- Verify API key has sufficient credits
- Check workflow file syntax

**Poor Content Quality**
- Refine the AI prompt in `generate-content.js`
- Add more specific examples and guidelines
- Adjust temperature settings for more/less creativity

**Wrong Publication Dates**
- Check timezone settings in date calculations
- Verify cron schedule matches your needs
- Test with manual date override

**PR Creation Fails**
- Check GitHub token permissions
- Verify repository settings allow PR creation
- Check for branch naming conflicts

### Getting Help

1. Check workflow logs in GitHub Actions
2. Review OpenAI API documentation
3. Test with manual workflow triggers
4. Monitor API usage and limits

## Cost Considerations

### OpenAI API Costs

- GPT-4 costs approximately $0.03-0.06 per 1000 tokens
- Average blog post generation: ~$0.50-1.00
- Weekly generation: ~$2-4 per month
- Monitor usage in OpenAI dashboard

### Optimization Tips

1. Use GPT-3.5-turbo for lower costs (adjust model in script)
2. Reduce max_tokens if posts are too long
3. Implement caching for repeated topics
4. Set up billing alerts in OpenAI dashboard

## Security

### API Key Protection

- Never commit API keys to repository
- Use GitHub Secrets for sensitive data
- Rotate API keys periodically
- Monitor API key usage for anomalies

### Content Review

- Always review generated content before publication
- Check for potential bias or inappropriate content
- Verify factual accuracy of claims
- Ensure compliance with your content policies

## Future Enhancements

Potential improvements to consider:
- Integration with content calendar systems
- A/B testing for different AI prompts
- Automatic image generation and selection
- SEO keyword research integration
- Social media post generation
- Multi-language content support