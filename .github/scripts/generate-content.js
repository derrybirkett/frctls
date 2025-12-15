#!/usr/bin/env node

const { OpenAI } = require('openai');
const fs = require('fs').promises;
const path = require('path');
const { format, addDays, nextTuesday, nextFriday } = require('date-fns');

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Enhanced content topics organized by category and business calendar
const CONTENT_THEMES = {
  // Strategic Transformation (Q1 Focus - Planning & Vision)
  strategic: [
    'Cultural Token Identification and Modification',
    'Fractal Patterns in Enterprise Organizations', 
    'Building Transformation Roadmaps That Actually Work',
    'The Hidden Cost of Organizational Debt',
    'Strategic Change vs. Tactical Fixes: When to Use Each',
    'Creating Change-Ready Organizational DNA',
    'The Mathematics of Organizational Transformation',
    'Why Most Digital Transformations Fail (And How to Fix Them)',
    'Designing Resilient Organizational Architectures',
    'The Compound Effect of Small Organizational Changes'
  ],

  // Leadership & Culture (Q2 Focus - Implementation & People)
  leadership: [
    'Leadership Strategies for Cultural Change',
    'Breaking Down Silos Through Fractal Thinking',
    'The Director\'s Guide to Change Communication',
    'Building Change Champions at Every Level',
    'Managing Up During Organizational Transformation',
    'Creating Psychological Safety During Change',
    'The Art of Incremental Leadership',
    'Turning Resistance into Engagement',
    'Leading Through Uncertainty: A Fractal Approach',
    'Cultural Intelligence for Enterprise Directors'
  ],

  // Operational Excellence (Q3 Focus - Execution & Results)
  operational: [
    'Small Changes, Big Impact: Case Studies',
    'Measuring Organizational Transformation ROI',
    'Scaling Behavioral Changes Across Departments',
    'Data-Driven Cultural Transformation',
    'Change Management Without Disruption',
    'Operational Efficiency Through Cultural Tokens',
    'The Metrics That Matter in Transformation',
    'Process Optimization via Organizational Fractals',
    'Sustaining Change: Beyond the Initial Push',
    'Quality Improvement Through Cultural Shifts'
  ],

  // Innovation & Future (Q4 Focus - Growth & Evolution)
  innovation: [
    'Innovation Through Organizational Fractals',
    'Cross-Functional Team Optimization',
    'Remote Work and Cultural Token Evolution',
    'AI-Assisted Organizational Design',
    'The Future of Enterprise Transformation',
    'Adaptive Organizations: Built for Constant Change',
    'Innovation Culture: Engineering Breakthrough Thinking',
    'Digital-First Organizational Models',
    'Preparing for the Next Disruption',
    'Evolutionary vs. Revolutionary Change Strategies'
  ],

  // Tactical Guides (Year-round - Practical Implementation)
  tactical: [
    'Employee Engagement and Cultural Patterns',
    'Agile Transformation Using Fractal Principles',
    'Budget-Conscious Change Management',
    'Quick Wins: 30-Day Transformation Sprints',
    'Change Management Toolkit for Directors',
    'Stakeholder Alignment in Complex Organizations',
    'Communication Strategies for Large-Scale Change',
    'Risk Management in Organizational Transformation',
    'Vendor Management During Digital Transformation',
    'Compliance and Change: Navigating Regulatory Requirements'
  ],

  // Industry-Specific (Seasonal - Based on industry events)
  industry: [
    'Healthcare Transformation: Unique Cultural Challenges',
    'Financial Services: Regulatory Change Management',
    'Manufacturing: Industry 4.0 Cultural Shifts',
    'Technology Companies: Scaling Culture with Growth',
    'Retail Transformation: Customer-Centric Change',
    'Government Organizations: Public Sector Change Dynamics',
    'Education: Academic Institution Transformation',
    'Non-Profit Organizations: Mission-Driven Change',
    'Startups to Enterprise: Scaling Organizational Culture',
    'Global Organizations: Cross-Cultural Change Management'
  ]
};

// Enterprise director pain points organized by category
const PAIN_POINTS = {
  // Financial & ROI Concerns
  financial: [
    'Proving ROI on transformation investments',
    'Budget constraints for change programs',
    'Cost overruns in digital transformation projects',
    'Justifying cultural change initiatives to the board',
    'Balancing short-term costs with long-term benefits',
    'Resource allocation during organizational change'
  ],

  // People & Culture Challenges
  cultural: [
    'Resistance to change initiatives',
    'Getting buy-in from middle management',
    'Avoiding change fatigue across teams',
    'Managing generational differences in change adoption',
    'Maintaining employee morale during transitions',
    'Creating urgency without creating panic'
  ],

  // Operational & Execution Issues
  operational: [
    'Maintaining productivity during transitions',
    'Scaling changes across large organizations',
    'Integrating new technologies smoothly',
    'Coordinating change across multiple departments',
    'Managing competing priorities and initiatives',
    'Ensuring consistent implementation across locations'
  ],

  // Leadership & Governance
  leadership: [
    'Aligning leadership team on transformation vision',
    'Managing stakeholder expectations',
    'Communicating change effectively at scale',
    'Building internal change management capabilities',
    'Succession planning during organizational change',
    'Board reporting on transformation progress'
  ],

  // Strategic & Competitive
  strategic: [
    'Keeping pace with industry disruption',
    'Competitive pressure to transform faster',
    'Technology obsolescence and upgrade cycles',
    'Regulatory compliance during change',
    'Market timing for transformation initiatives',
    'Balancing innovation with operational stability'
  ]
};

async function generateBlogPost(topic, targetDate, existingPosts = []) {
  const season = getCurrentSeason();
  const seasonalContext = season.context;
  const seasonalThemes = season.themes.join(', ');
  
  // Get relevant pain points for context
  const allPainPoints = Object.values(PAIN_POINTS).flat();
  const relevantPainPoints = allPainPoints.slice(0, 5).join(', ');
  
  // Find related posts for potential cross-linking
  const relatedPosts = findRelatedPosts(topic, ['enterprise', 'transformation', 'leadership'], existingPosts);
  const relatedContext = relatedPosts.length > 0 
    ? `\n- Related existing content: ${relatedPosts.map(p => `"${p.title}"`).join(', ')}`
    : '';
  
  const prompt = `Write a professional blog post about "${topic}" for enterprise directors.

CONTEXT:
- Current business season: ${season.quarter} (${seasonalContext})
- Seasonal themes: ${seasonalThemes}
- Key enterprise pain points: ${relevantPainPoints}
- Audience: Enterprise directors responsible for organizational transformation
- Approach: Fractal change methodology (small changes that scale naturally)${relatedContext}

REQUIREMENTS:
- 1000-1400 words with substantial depth
- Compelling, SEO-optimized title that addresses director-level concerns
- Practical, actionable insights for large organizations (1000+ employees)
- Real-world application examples
- Measurable outcomes and ROI considerations
- Professional, authoritative tone
- Focus on incremental change strategies that compound over time

STRUCTURE:
- Hook that identifies a specific enterprise challenge
- 3-4 main sections with practical frameworks
- Concrete implementation steps
- ROI/success metrics
- Clear call-to-action for next steps

Return ONLY a valid JSON object with this structure:
{
  "title": "Blog post title (optimized for enterprise directors)",
  "description": "SEO description under 160 characters focusing on business value",
  "content": "Full blog post content in markdown format",
  "tags": ["enterprise", "transformation", "leadership", "specific-topic-tags"],
  "summary": "2-sentence summary highlighting the main value proposition for directors"
}`;

  try {
    console.log('🤖 Calling OpenAI API...');
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional content writer. Always return valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 3000
    });

    const response = completion.choices[0].message.content.trim();
    console.log('📝 Received response from OpenAI');
    
    // Parse JSON response
    let parsedResponse;
    try {
      // Clean the response to ensure it's valid JSON
      const cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      parsedResponse = JSON.parse(cleanResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      console.log('Raw response:', response);
      throw new Error('Could not parse AI response as valid JSON');
    }

    console.log('✅ Successfully parsed AI response');
    return {
      ...parsedResponse,
      targetDate,
      topic
    };
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
}

function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Business calendar and seasonal themes
const SEASONAL_THEMES = {
  // Q1 (Jan-Mar): Planning & Strategy
  Q1: {
    months: [1, 2, 3],
    focus: 'strategic',
    context: 'New year planning, budget allocation, strategic initiatives',
    themes: ['strategic planning', 'budget optimization', 'goal setting', 'vision alignment']
  },
  
  // Q2 (Apr-Jun): Implementation & Growth
  Q2: {
    months: [4, 5, 6],
    focus: 'leadership',
    context: 'Implementation phase, team building, performance reviews',
    themes: ['team development', 'performance management', 'leadership development', 'culture building']
  },
  
  // Q3 (Jul-Sep): Execution & Optimization
  Q3: {
    months: [7, 8, 9],
    focus: 'operational',
    context: 'Mid-year execution, process optimization, efficiency drives',
    themes: ['operational efficiency', 'process improvement', 'productivity', 'cost optimization']
  },
  
  // Q4 (Oct-Dec): Results & Future Planning
  Q4: {
    months: [10, 11, 12],
    focus: 'innovation',
    context: 'Year-end results, future planning, innovation initiatives',
    themes: ['innovation', 'future planning', 'digital transformation', 'competitive advantage']
  }
};

function getCurrentSeason() {
  const now = new Date();
  const month = now.getMonth() + 1; // JavaScript months are 0-indexed
  
  for (const [quarter, data] of Object.entries(SEASONAL_THEMES)) {
    if (data.months.includes(month)) {
      return { quarter, ...data };
    }
  }
  
  return SEASONAL_THEMES.Q1; // Default fallback
}

// Function to analyze existing blog posts for cross-linking
async function analyzeExistingContent() {
  try {
    const blogDir = path.join('../../apps/blog/src/content/blog');
    const draftsDir = path.join('../../apps/blog/src/content/drafts');
    
    const existingPosts = [];
    
    // Read published posts
    try {
      const blogFiles = await fs.readdir(blogDir);
      for (const file of blogFiles) {
        if (file.endsWith('.md')) {
          const content = await fs.readFile(path.join(blogDir, file), 'utf8');
          const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
          if (frontmatterMatch) {
            const frontmatter = frontmatterMatch[1];
            const titleMatch = frontmatter.match(/title:\s*['"](.+)['"]/);
            const tagsMatch = frontmatter.match(/tags:\s*\[(.*?)\]/);
            
            if (titleMatch) {
              existingPosts.push({
                filename: file,
                title: titleMatch[1],
                tags: tagsMatch ? tagsMatch[1].split(',').map(t => t.trim().replace(/['"]/g, '')) : [],
                type: 'published'
              });
            }
          }
        }
      }
    } catch (error) {
      console.log('No published posts found or error reading blog directory');
    }
    
    // Read draft posts
    try {
      const draftFiles = await fs.readdir(draftsDir);
      for (const file of draftFiles) {
        if (file.endsWith('.md') && file !== '.gitkeep') {
          const content = await fs.readFile(path.join(draftsDir, file), 'utf8');
          const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
          if (frontmatterMatch) {
            const frontmatter = frontmatterMatch[1];
            const titleMatch = frontmatter.match(/title:\s*['"](.+)['"]/);
            const tagsMatch = frontmatter.match(/tags:\s*\[(.*?)\]/);
            
            if (titleMatch) {
              existingPosts.push({
                filename: file,
                title: titleMatch[1],
                tags: tagsMatch ? tagsMatch[1].split(',').map(t => t.trim().replace(/['"]/g, '')) : [],
                type: 'draft'
              });
            }
          }
        }
      }
    } catch (error) {
      console.log('No draft posts found or error reading drafts directory');
    }
    
    console.log(`📚 Found ${existingPosts.length} existing posts for cross-linking analysis`);
    return existingPosts;
  } catch (error) {
    console.error('Error analyzing existing content:', error);
    return [];
  }
}

// Function to find related posts for cross-linking
function findRelatedPosts(currentTopic, currentTags, existingPosts) {
  const relatedPosts = [];
  const topicWords = currentTopic.toLowerCase().split(' ').filter(word => word.length > 3);
  
  for (const post of existingPosts) {
    let relevanceScore = 0;
    
    // Check title similarity
    const postTitleWords = post.title.toLowerCase().split(' ');
    const titleMatches = topicWords.filter(word => 
      postTitleWords.some(titleWord => titleWord.includes(word) || word.includes(titleWord))
    );
    relevanceScore += titleMatches.length * 2;
    
    // Check tag similarity
    const tagMatches = currentTags.filter(tag => 
      post.tags.some(postTag => 
        postTag.toLowerCase().includes(tag.toLowerCase()) || 
        tag.toLowerCase().includes(postTag.toLowerCase())
      )
    );
    relevanceScore += tagMatches.length * 3;
    
    // Add to related if score is high enough
    if (relevanceScore >= 2) {
      relatedPosts.push({
        ...post,
        relevanceScore,
        titleMatches,
        tagMatches
      });
    }
  }
  
  // Sort by relevance and return top 3
  return relatedPosts
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 3);
}

function getNextPublicationDate(targetDate) {
  if (targetDate) {
    return new Date(targetDate);
  }
  
  const now = new Date();
  const nextTues = nextTuesday(now);
  const nextFri = nextFriday(now);
  
  // Choose the next available publication date (Tuesday or Friday)
  return nextTues < nextFri ? nextTues : nextFri;
}

async function createBlogPostFile(postData, existingPosts = []) {
  const { title, description, content, tags, targetDate, topic } = postData;
  const slug = createSlug(title);
  const pubDate = getNextPublicationDate(targetDate);
  
  console.log('📝 Creating blog post file...');
  console.log('- Title:', title);
  console.log('- Slug:', slug);
  console.log('- Pub Date:', format(pubDate, 'yyyy-MM-dd'));
  
  // Find related posts for cross-linking
  const relatedPosts = findRelatedPosts(topic, tags, existingPosts);
  
  // Add cross-links to content if related posts exist
  let enhancedContent = content;
  if (relatedPosts.length > 0) {
    console.log(`🔗 Adding cross-links to ${relatedPosts.length} related posts`);
    
    const crossLinks = relatedPosts.map(post => {
      const postSlug = createSlug(post.title);
      const linkPath = post.type === 'published' ? `/blog/${postSlug.replace('.md', '')}/` : '#';
      return `- [${post.title}](${linkPath})`;
    }).join('\n');
    
    enhancedContent += `\n\n## Related Articles\n\n${crossLinks}`;
  }
  
  const frontmatter = `---
title: '${title.replace(/'/g, "''")}'
description: '${description.replace(/'/g, "''")}'
pubDate: '${format(pubDate, 'yyyy-MM-dd')}'
heroImage: '/blog-placeholder-1.jpg'
tags: [${tags.map(tag => `'${tag}'`).join(', ')}]
---

${enhancedContent}`;

  const filename = `${slug}.md`;
  const filepath = path.join('../../apps/blog/src/content/drafts', filename);
  
  console.log('📂 Writing to:', filepath);
  
  try {
    // Ensure drafts directory exists
    await fs.mkdir(path.dirname(filepath), { recursive: true });
    
    // Write the file
    await fs.writeFile(filepath, frontmatter, 'utf8');
    
    console.log('✅ File written successfully');
    
    return {
      filename,
      filepath,
      slug,
      pubDate: format(pubDate, 'yyyy-MM-dd'),
      wordCount: content.split(/\s+/).length
    };
  } catch (error) {
    console.error('❌ Error writing file:', error);
    throw error;
  }
}

function selectIntelligentTopic() {
  const season = getCurrentSeason();
  const focusCategory = season.focus;
  
  console.log(`📅 Current season: ${season.quarter} - Focus: ${focusCategory}`);
  console.log(`🎯 Context: ${season.context}`);
  
  // Get topics from the seasonal focus category
  const seasonalTopics = CONTENT_THEMES[focusCategory] || [];
  
  // Add some variety by including tactical topics (always relevant)
  const tacticalTopics = CONTENT_THEMES.tactical || [];
  
  // 70% seasonal focus, 30% tactical variety
  const topicPool = [
    ...seasonalTopics,
    ...seasonalTopics, // Double weight for seasonal
    ...tacticalTopics
  ];
  
  if (topicPool.length === 0) {
    // Fallback to all topics if something goes wrong
    const allTopics = Object.values(CONTENT_THEMES).flat();
    return allTopics[Math.floor(Math.random() * allTopics.length)];
  }
  
  return topicPool[Math.floor(Math.random() * topicPool.length)];
}

async function main() {
  try {
    console.log('🤖 Starting AI content generation...');
    
    // Check environment
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    
    // Analyze existing content for intelligent topic selection and cross-linking
    console.log('📚 Step 1: Analyzing existing content...');
    const existingPosts = await analyzeExistingContent();
    
    // Get topic (from input or intelligent selection)
    const topicOverride = process.env.TOPIC_OVERRIDE;
    const topic = topicOverride || selectIntelligentTopic(existingPosts);
    
    console.log(`📝 Generating content for topic: ${topic}`);
    
    // Generate the blog post with cross-linking context
    console.log('🎯 Step 2: Generating blog post content...');
    const postData = await generateBlogPost(topic, process.env.TARGET_DATE, existingPosts);
    
    // Create the blog post file
    console.log('💾 Step 3: Creating blog post file...');
    const fileInfo = await createBlogPostFile(postData, existingPosts);
    
    console.log(`✅ Content generated successfully!`);
    console.log(`📄 File: ${fileInfo.filename}`);
    console.log(`📅 Publication Date: ${fileInfo.pubDate}`);
    console.log(`📊 Word Count: ${fileInfo.wordCount}`);
    
    // Set outputs for GitHub Actions
    console.log('🔧 Step 3: Setting GitHub Actions outputs...');
    const outputFile = process.env.GITHUB_OUTPUT;
    if (outputFile) {
      await fs.appendFile(outputFile, `content_created=true\n`);
      await fs.appendFile(outputFile, `post_title=${postData.title}\n`);
      await fs.appendFile(outputFile, `topic=${topic}\n`);
      await fs.appendFile(outputFile, `target_date=${fileInfo.pubDate}\n`);
      await fs.appendFile(outputFile, `slug=${fileInfo.slug}\n`);
      await fs.appendFile(outputFile, `word_count=${fileInfo.wordCount}\n`);
      await fs.appendFile(outputFile, `summary=${postData.summary}\n`);
      console.log('✅ GitHub Actions outputs set');
    }
    
  } catch (error) {
    console.error('❌ Content generation failed:', error);
    console.error('Error details:', error.message);
    console.error('Stack trace:', error.stack);
    
    const outputFile = process.env.GITHUB_OUTPUT;
    if (outputFile) {
      await fs.appendFile(outputFile, `content_created=false\n`);
      await fs.appendFile(outputFile, `error_message=${error.message}\n`);
    }
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { 
  generateBlogPost, 
  createBlogPostFile, 
  CONTENT_THEMES, 
  PAIN_POINTS, 
  SEASONAL_THEMES,
  getCurrentSeason,
  selectIntelligentTopic
};