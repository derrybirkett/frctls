# CMO Agent Workflow

**Agent Role**: Chief Marketing Officer  
**Primary Responsibility**: Messaging, content strategy, marketing channels, brand voice  
**Key Patterns**: Planning, Multi-Agent Collaboration, Reflection

## Overview

The CMO agent owns all external communication: blog posts, documentation, website copy, product announcements, and marketing campaigns. The CMO ensures consistent messaging aligned with product strategy and business goals. This workflow shows how to create compelling content that drives user adoption and retention.

## Core Pattern: Planning + Storytelling

The CMO primarily uses:
- **Planning Pattern**: Content calendars, campaign planning
- **Multi-Agent Collaboration**: Working with CPO (product launches), CRO (conversion goals), CEO (brand narrative)
- **Reflection Pattern**: Analyzing content performance

---

## Standard Content Workflow

### Phase 1: Content Planning

**Goal**: Align content with product roadmap and business goals

#### **Quarterly Content Calendar**

**Inputs**:
- CPO: Product roadmap (upcoming features)
- CRO: Revenue goals (conversion targets)
- CEO: Strategic priorities (market positioning)
- COO: Release schedule (launch dates)

**Planning Process**:

1. **Map Content to Launches**
   ```markdown
   Q1 2025 Content Calendar
   
   January:
   - Authentication launch (Week 2)
     - Blog post: "Secure Authentication with Supabase"
     - Docs: /docs/authentication
     - Email: Existing users announcement
     - Social: Twitter, LinkedIn
   
   February:
   - Dashboard widgets launch (Week 3)
     - Blog post: "Customizable Dashboards for Power Users"
     - Video: Dashboard tour
     - Docs: /docs/widgets
     - Case study: Early adopter
   
   March:
   - API access launch (Week 2)
     - Blog post: "API Documentation and Best Practices"
     - Developer guide: /docs/api
     - Webinar: Building with our API
     - Social: Dev community (Reddit, Hacker News)
   ```

2. **Plan Content Types**
   - **Launch content**: Blog posts, docs, announcements
   - **Educational content**: Tutorials, guides, videos
   - **Thought leadership**: Industry insights, best practices
   - **Community content**: Case studies, user stories
   - **SEO content**: Keyword-optimized articles

3. **Assign Resources**
   - Who writes? (CMO, guest authors, community)
   - Who reviews? (CPO for technical accuracy, CEO for messaging)
   - When published? (coordinate with COO releases)

---

### Phase 2: Content Creation

**Goal**: Create high-quality content that resonates with target audience

#### **Blog Post Creation (Standard Process)**

**Week 1: Research & Outline**

1. **Understand the Feature**
   ```markdown
   FROM: CMO
   TO: CPO
   
   CONTENT RESEARCH: Authentication feature launch
   
   QUESTIONS:
   - What problem does this solve for users?
   - Who is the target audience?
   - What are the key benefits?
   - What are common questions/concerns?
   - Any user testimonials available?
   
   TIMELINE: Need answers by EOW for writing next week
   ```

2. **Create Outline**
   ```markdown
   ## Blog Post Outline: "Secure Authentication with Supabase"
   
   ### Target Audience
   - Developers building SaaS apps
   - Founders launching MVPs
   
   ### Key Message
   Authentication shouldn't slow you down. Launch faster with built-in security.
   
   ### Structure
   1. Hook: The authentication dilemma (custom vs. pre-built)
   2. Problem: Building custom auth is risky and time-consuming
   3. Solution: Our Supabase integration
   4. Benefits: Security, speed, scalability
   5. How it works: Screenshots, code examples
   6. Call to action: Try it today
   
   ### SEO Keywords
   - "authentication for SaaS"
   - "Supabase authentication"
   - "secure login system"
   
   ### Length: 800-1200 words
   ```

**Week 2: Writing**

1. **First Draft**
   - Write for the target audience
   - Use clear, conversational tone
   - Include examples and screenshots
   - Add code snippets (if technical)
   - Include CTA (call to action)

2. **Structure Template**
   ```markdown
   # [Compelling Title with Benefit]
   
   [Hook paragraph - grab attention, state problem]
   
   ## The Problem
   [Describe user pain point with empathy]
   
   ## Our Solution
   [Introduce feature, show it in action]
   
   ![Screenshot](path/to/image.png)
   
   ## Key Benefits
   - Benefit 1 (with example)
   - Benefit 2 (with example)
   - Benefit 3 (with example)
   
   ## How It Works
   [Step-by-step with visuals]
   
   ```typescript
   // Code example if relevant
   ```
   
   ## What's Next
   [Roadmap tease, future improvements]
   
   ## Try It Today
   [Clear CTA with link]
   
   ---
   
   [Author bio]
   [Related posts]
   ```

**Week 3: Review & Publish**

1. **Technical Review** (from CPO or CTO)
   ```markdown
   FROM: CMO
   TO: CPO
   
   BLOG POST REVIEW: Authentication launch
   
   DRAFT: /blog/draft-auth-launch.md
   
   PLEASE REVIEW:
   - Technical accuracy (code examples, feature descriptions)
   - User benefits (did I capture value correctly?)
   - Screenshots (are these the right flows?)
   
   TIMELINE: Need feedback by tomorrow for Friday publish
   ```

2. **Editorial Review** (self or CEO)
   - Brand voice consistent?
   - Grammar and spelling clean?
   - CTAs clear and compelling?
   - Images optimized?

3. **Coordinate Publish** (with COO)
   ```markdown
   FROM: CMO
   TO: COO
   
   BLOG POST READY: Authentication launch
   
   STATUS:
   - ✅ Written and reviewed
   - ✅ Technical accuracy verified (CPO)
   - ✅ Images optimized
   - ✅ SEO metadata added
   
   PUBLISH PLAN:
   - Date: 2025-01-15 (aligns with feature launch)
   - Time: 10:00 AM EST (after deployment)
   - Channels: Blog, email, Twitter, LinkedIn
   
   COORDINATION:
   - Waiting for: COO confirmation feature is live
   - Then: Publish blog and send announcements
   ```

---

### Phase 3: Content Distribution

**Goal**: Reach target audience through multiple channels

#### **Multi-Channel Distribution**

**Email Announcement**:
```markdown
Subject: 🔒 Secure Authentication is Here

Hi [Name],

We're excited to announce that secure authentication is now available!

[2-3 paragraphs highlighting benefits]

👉 Read the full announcement: [link to blog]

Try it today: [link to docs]

Questions? Reply to this email.

—
[Your Name]
[Company Name]
```

**Social Media**:
```markdown
Twitter (280 chars):
🔒 Launching secure authentication today! Build faster with Supabase integration. No more custom auth headaches. [link] #developer #SaaS

LinkedIn (longer form):
After months of development, we're thrilled to announce secure authentication...

[3-4 paragraphs]

Read more: [link]

What authentication challenges are you facing? Let's discuss in the comments.
```

**Community Channels**:
- Reddit (r/SaaS, r/webdev): Share with context, not just link
- Hacker News: If significant technical achievement
- Dev.to: Cross-post full article
- Product Hunt: If major launch

---

### Phase 4: Performance Tracking

**Goal**: Measure content impact and learn

#### **Content Metrics**

**Engagement Metrics**:
- Page views
- Time on page
- Bounce rate
- Social shares

**Conversion Metrics**:
- CTA click-through rate
- Sign-ups from blog post
- Feature adoption (coordinate with CPO)

**SEO Metrics**:
- Organic traffic
- Keyword rankings
- Backlinks

**Example Dashboard**:
```markdown
## Blog Post Performance: Authentication Launch

Published: 2025-01-15

### Week 1 Results
- Views: 2,500 (vs. 1,000 avg)
- Time on page: 3:45 (vs. 2:00 avg)
- CTA clicks: 125 (5% CTR)
- Sign-ups attributed: 15

### SEO Performance
- Ranking: "Supabase authentication" - #8 (up from unranked)
- Organic traffic: 300/week
- Backlinks: 3 (2 from dev blogs)

### Social Performance
- Twitter: 50 likes, 12 retweets
- LinkedIn: 100 likes, 20 shares
- Reddit: 200 upvotes on r/SaaS

### Learning
- Technical content resonates (high time on page)
- Developers want code examples (most-clicked section)
- "Try it today" CTA strong (5% CTR vs. 2% avg)
```

#### **Reflection Questions**

Use **Reflection Pattern**:

1. **What worked well?**
   - Technical depth attracted developers
   - Code examples increased engagement
   - Launch timing aligned with product release

2. **What didn't work?**
   - LinkedIn post underperformed (wrong audience?)
   - SEO keywords too competitive
   - Video would have been better than screenshots

3. **What to do differently?**
   - Create video tutorial next time
   - Target long-tail SEO keywords
   - Post LinkedIn in developer groups, not company page

4. **Action items**:
   - [ ] Add video tutorials to content roadmap
   - [ ] Research long-tail keywords for next post
   - [ ] Test LinkedIn strategy in next launch

---

## Special Workflows

### Feature Launch Campaign (Planning Pattern)

**For major feature launches**:

#### **T-30 Days: Campaign Planning**

1. **Align with CPO**
   ```markdown
   FROM: CMO
   TO: CPO
   
   LAUNCH CAMPAIGN PLANNING: Dashboard Widgets
   
   LAUNCH DATE: 2025-02-15
   
   CONTENT PLAN:
   - Blog post (announcement + how-to)
   - Video tutorial (dashboard customization)
   - Email announcement (all users)
   - Developer docs (technical guide)
   - Case study (early adopter story)
   - Social campaign (Twitter, LinkedIn)
   
   QUESTIONS:
   - Who are the early adopters we can feature?
   - What's the most impressive use case?
   - Any beta user testimonials?
   
   TIMELINE:
   - T-30: Outline and research (this week)
   - T-21: First drafts
   - T-14: Review and feedback
   - T-7: Final polish
   - T-0: Launch!
   ```

2. **Create Campaign Timeline**
   ```markdown
   ## Dashboard Widgets Launch Campaign
   
   ### Pre-Launch (T-14 to T-1)
   - T-14: Teaser blog post ("Coming Soon: Dashboard Widgets")
   - T-10: Beta user case study published
   - T-7: Video tutorial published
   - T-3: Email teaser to subscribers
   - T-1: Social media countdown
   
   ### Launch Day (T-0)
   - 9:00 AM: Feature goes live (COO)
   - 10:00 AM: Launch blog post published
   - 10:30 AM: Email announcement sent
   - 11:00 AM: Social media posts (Twitter, LinkedIn)
   - 12:00 PM: Post to Reddit, Hacker News
   - All day: Monitor comments, respond to questions
   
   ### Post-Launch (T+1 to T+30)
   - T+1: Highlight user-created dashboards on social
   - T+7: "Tips & Tricks" follow-up blog post
   - T+14: Usage metrics update
   - T+30: Impact report (CPO metrics)
   ```

#### **T-14 Days: Content Creation Sprint**

- Write all content
- Create visuals (screenshots, diagrams)
- Record video tutorial
- Interview early adopters
- Prepare social media assets

#### **T-7 Days: Review & Approval**

- CPO: Technical accuracy
- CTO: Feature readiness
- CEO: Messaging alignment
- COO: Launch coordination

#### **T-0: Launch Execution**

- Monitor channels
- Respond to questions/comments
- Track metrics in real-time
- Adjust messaging if needed

---

### Documentation Updates

**For every feature launch**:

#### **User Documentation**

1. **Create How-To Guide**
   ```markdown
   # How to Use Authentication
   
   ## Overview
   Brief description of feature
   
   ## Getting Started
   Step-by-step for basic usage
   
   ## Common Use Cases
   - Use case 1
   - Use case 2
   - Use case 3
   
   ## Advanced Features
   Power user configurations
   
   ## Troubleshooting
   Common issues and solutions
   
   ## API Reference
   Technical details (if applicable)
   ```

2. **Update Navigation**
   - Add to docs sidebar
   - Update getting started guide
   - Link from related pages

3. **Create Video Tutorial** (optional)
   - Screen recording (5-10 mins)
   - Clear narration
   - Show real use case
   - Publish to YouTube, embed in docs

#### **Developer Documentation**

1. **API Documentation**
   ```markdown
   # Authentication API
   
   ## Endpoints
   
   ### POST /api/auth/register
   Register a new user
   
   **Request**:
   ```json
   {
     "email": "user@example.com",
     "password": "securepassword123"
   }
   ```
   
   **Response**:
   ```json
   {
     "user": { "id": "123", "email": "user@example.com" },
     "session": { "token": "abc...", "expires": "2025-02-15" }
   }
   ```
   
   **Errors**:
   - 400: Invalid email or password
   - 409: Email already exists
   ```

2. **Code Examples**
   - Show common integrations
   - Multiple languages (if applicable)
   - Copy-paste ready
   - Working examples (test before publishing)

---

### Content Types & Templates

#### **Blog Post Types**

**1. Feature Announcement**
- What: New feature description
- Why: Problem it solves
- How: Usage examples
- CTA: Try it now

**2. Tutorial / How-To**
- Goal: What user will learn
- Prerequisites: What they need
- Steps: Clear, numbered instructions
- Result: What they've built

**3. Case Study**
- Company: Who they are
- Challenge: What problem they had
- Solution: How they used our product
- Results: Metrics and outcomes

**4. Thought Leadership**
- Trend: Industry observation
- Analysis: What it means
- Our take: How we approach it
- Takeaway: What readers should do

**5. Round-Up / Listicle**
- Theme: Topic (e.g., "10 Authentication Best Practices")
- Items: 5-10 actionable tips
- Examples: Real-world applications
- CTA: Implement with our tool

#### **Email Types**

**1. Feature Announcement**
- Subject: Exciting news format
- Body: 3 paragraphs max
- CTA: Read more / Try it
- Send: At launch time

**2. Newsletter**
- Subject: Monthly updates format
- Body: 5-7 short sections
- CTA: Multiple links
- Send: First Monday of month

**3. Educational**
- Subject: How-to format
- Body: Tutorial-style
- CTA: Learn more
- Send: Weekly (Tuesdays)

---

## Collaboration Patterns

### With CPO (Product Launches)

**Launch Coordination**:
```markdown
FROM: CPO
TO: CMO

Feature launch: Authentication
Launch date: 2025-01-15

KEY MESSAGES:
- Users can now create accounts
- Secure authentication with Supabase
- Enables upcoming paid tier

TARGET AUDIENCE:
- Developers building SaaS
- Founders launching MVPs

DELIVERABLES FOR CMO:
- Feature screenshots: [link]
- User quotes from beta: [link]
- Technical details: [link]
- Success metrics goals: 100 signups in week 1

FROM CMO:
- Blog post draft by T-7 days
- Email and social by T-3 days
- Review with CPO before publish
```

### With CRO (Conversion Optimization)

**Content Performance Review**:
```markdown
FROM: CMO
TO: CRO

Q1 Content Performance Review

BLOG POSTS:
- 12 posts published
- 15K total views
- 450 CTA clicks (3% CTR)
- 45 attributed sign-ups

BEST PERFORMERS:
1. Authentication launch (5% CTR, 15 sign-ups)
2. Dashboard tutorial (4% CTR, 10 sign-ups)
3. API guide (3.5% CTR, 8 sign-ups)

INSIGHTS:
- Technical tutorials drive sign-ups (4x vs. thought leadership)
- Video content has 2x engagement vs. text-only
- Developer audience responds to code examples

OPTIMIZATION PLAN:
- MORE: Technical tutorials with video
- LESS: Generic thought leadership
- TEST: Interactive code playgrounds
- IMPROVE: CTAs (test variations)

REQUEST: Review plan and suggest A/B tests for Q2
```

### With CEO (Brand Narrative)

**Messaging Review**:
```markdown
FROM: CMO
TO: CEO

Brand Messaging Audit - Q4 2024

CURRENT POSITIONING:
"The fastest way to build authenticated SaaS apps"

COMPETITIVE LANDSCAPE:
- Competitor A: "Enterprise-grade authentication"
- Competitor B: "Open-source auth platform"
- Us: "Fast and secure for developers"

ANALYSIS:
- "Fast" resonates with indie devs (high engagement)
- "Secure" required for enterprise (credibility)
- Missing: "Scalable" (enterprise concern)

RECOMMENDATION:
Evolve positioning to: "Fast, secure, scalable authentication for modern SaaS"

TARGET AUDIENCES:
- Primary: Developer/founder (keep "fast")
- Secondary: Enterprise (add "scalable")

CHANGES NEEDED:
- Website homepage
- Product messaging
- Sales collateral
- All future content

REQUEST: Approval to update brand messaging
```

---

## Quality Metrics

Track these to improve content performance:

### Content Quality
- Readability score (target: Grade 8-10)
- Grammar/spelling errors (target: 0)
- Technical accuracy (CPO sign-off)
- Brand voice consistency

### Engagement
- Page views per post
- Time on page (target: 2+ mins)
- Bounce rate (target: <70%)
- Social shares (varies by channel)

### Conversion
- CTA click-through rate (target: 3%+)
- Sign-ups attributed to content
- Feature adoption post-announcement
- Email open rates (target: 25%+)

### SEO
- Organic traffic growth (target: 10% MoM)
- Keyword rankings (track top 10 terms)
- Backlinks acquired
- Domain authority

---

## Quick Reference

### Daily Workflow
```bash
1. Monitor content performance (analytics)
2. Respond to comments/questions on blog and social
3. Work on active content pieces (writing/review)
4. Coordinate with CPO/COO on upcoming launches
5. Plan next week's content
```

### Decision Tree

**New Content Request**:
```
Aligns with product roadmap?
  → Yes: Add to content calendar
  → No: Discuss with CPO/CEO

Urgency?
  → High: Fast-track (1 week)
  → Normal: Standard process (3 weeks)
  → Low: Backlog

Type?
  → Feature launch: Full campaign
  → Educational: Tutorial format
  → Thought leadership: Analysis format
  → Case study: Interview + write-up
```

### Common Commands
```bash
# Check content performance
# (Analytics tool - project-specific)

# Review content calendar
cat docs/content-calendar.md

# Publish blog post
# (CMS - project-specific)
```

---

## Related Patterns

- [Planning Pattern](../../resources/agentic-design-patterns/extracted-patterns/planning-pattern.md) - Content calendars, campaigns
- [Multi-Agent Collaboration](../../resources/agentic-design-patterns/extracted-patterns/multi-agent-collaboration-pattern.md) - Working with CPO/CRO/CEO
- [Reflection Pattern](../../resources/agentic-design-patterns/extracted-patterns/reflection-pattern.md) - Content performance analysis

---

## Related Documents

- [CMO Role](../../ia/agents/cmo/role.md)
- [CPO Workflow](./cpo-workflow.md) - Product launch partner
- [CRO Workflow](./cro-workflow.md) - Conversion optimization partner

---

## Changelog

- **2025-12-19**: Initial CMO workflow documentation
- **Next**: Add content templates, style guide, SEO playbook
