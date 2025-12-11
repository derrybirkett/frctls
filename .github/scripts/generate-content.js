#!/usr/bin/env node

const { OpenAI } = require('openai');
const fs = require('fs').promises;
const path = require('path');
const { format, addDays, nextTuesday, nextFriday } = require('date-fns');

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Content topics and themes for organizational transformation
const CONTENT_THEMES = [
  'Cultural Token Identification and Modification',
  'Fractal Patterns in Enterprise Organizations',
  'Small Changes, Big Impact: Case Studies',
  'Measuring Organizational Transformation ROI',
  'Leadership Strategies for Cultural Change',
  'Breaking Down Silos Through Fractal Thinking',
  'Digital Transformation Through Cultural Tokens',
  'Change Management Without Disruption',
  'Scaling Behavioral Changes Across Departments',
  'Data-Driven Cultural Transformation',
  'Remote Work and Cultural Token Evolution',
  'Innovation Through Organizational Fractals',
  'Employee Engagement and Cultural Patterns',
  'Agile Transformation Using Fractal Principles',
  'Cross-Functional Team Optimization'
];

// Enterprise director pain points and interests
const PAIN_POINTS = [
  'Resistance to change initiatives',
  'Measuring transformation success',
  'Budget constraints for change programs',
  'Maintaining productivity during transitions',
  'Scaling changes across large organizations',
  'Getting buy-in from middle management',
  'Avoiding change fatigue',
  'Integrating new technologies smoothly',
  'Improving cross-departmental collaboration',
  'Reducing operational inefficiencies'
];

async function generateBlogPost(topic, targetDate) {
  const prompt = `
You are a thought leader writing for enterprise directors about organizational transformation using fractal change methodology.

Topic: ${topic}

Write a comprehensive blog post (1200-1500 words) that:

1. **Addresses enterprise director concerns**: Focus on practical, measurable solutions for large organizations
2. **Uses fractal change principles**: Small changes that scale naturally across organizations
3. **Provides actionable insights**: Concrete steps directors can implement immediately
4. **Includes real-world applications**: How this applies to common enterprise challenges
5. **Maintains professional tone**: Authoritative but accessible, avoiding jargon

Structure:
- Compelling headline that speaks to director-level concerns
- Hook that identifies a specific pain point
- 3-4 main sections with practical insights
- Concrete examples or case study elements
- Clear call-to-action for next steps

Focus on:
- ROI and measurable outcomes
- Low-risk implementation strategies
- Scalability across departments
- Cultural transformation that sticks
- Productivity improvements

Write in a confident, solution-oriented voice that positions small changes as the key to large-scale transformation.

Return the response in this exact JSON format:
{
  "title": "Blog post title",
  "description": "SEO meta description (150-160 characters)",
  "content": "Full blog post content in markdown format",
  "tags": ["tag1", "tag2", "tag3"],
  "summary": "2-sentence summary of the main value proposition"
}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert content creator specializing in organizational transformation and change management for enterprise leaders. You understand fractal change methodology and write compelling, actionable content for C-level executives."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000
    });

    const response = completion.choices[0].message.content;
    
    // Parse JSON response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(response);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      // Fallback: try to extract content between JSON markers
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Could not extract valid JSON from AI response');
      }
    }

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

async function createBlogPostFile(postData) {
  const { title, description, content, tags, targetDate, topic } = postData;
  const slug = createSlug(title);
  const pubDate = getNextPublicationDate(targetDate);
  
  const frontmatter = `---
title: '${title.replace(/'/g, "''")}'
description: '${description.replace(/'/g, "''")}'
pubDate: '${format(pubDate, 'yyyy-MM-dd')}'
heroImage: '/blog-placeholder-1.jpg'
tags: [${tags.map(tag => `'${tag}'`).join(', ')}]
---

${content}`;

  const filename = `${slug}.md`;
  const filepath = path.join('../../apps/blog/src/content/drafts', filename);
  
  // Ensure drafts directory exists
  await fs.mkdir(path.dirname(filepath), { recursive: true });
  
  // Write the file
  await fs.writeFile(filepath, frontmatter, 'utf8');
  
  return {
    filename,
    filepath,
    slug,
    pubDate: format(pubDate, 'yyyy-MM-dd'),
    wordCount: content.split(/\s+/).length
  };
}

async function main() {
  try {
    console.log('🤖 Starting AI content generation...');
    
    // Get topic (from input or random selection)
    const topicOverride = process.env.TOPIC_OVERRIDE;
    const topic = topicOverride || CONTENT_THEMES[Math.floor(Math.random() * CONTENT_THEMES.length)];
    
    console.log(`📝 Generating content for topic: ${topic}`);
    
    // Generate the blog post
    const postData = await generateBlogPost(topic, process.env.TARGET_DATE);
    
    // Create the blog post file
    const fileInfo = await createBlogPostFile(postData);
    
    console.log(`✅ Content generated successfully!`);
    console.log(`📄 File: ${fileInfo.filename}`);
    console.log(`📅 Publication Date: ${fileInfo.pubDate}`);
    console.log(`📊 Word Count: ${fileInfo.wordCount}`);
    
    // Set outputs for GitHub Actions
    const fs = require('fs');
    const outputFile = process.env.GITHUB_OUTPUT;
    if (outputFile) {
      fs.appendFileSync(outputFile, `content_created=true\n`);
      fs.appendFileSync(outputFile, `post_title=${postData.title}\n`);
      fs.appendFileSync(outputFile, `topic=${topic}\n`);
      fs.appendFileSync(outputFile, `target_date=${fileInfo.pubDate}\n`);
      fs.appendFileSync(outputFile, `slug=${fileInfo.slug}\n`);
      fs.appendFileSync(outputFile, `word_count=${fileInfo.wordCount}\n`);
      fs.appendFileSync(outputFile, `summary=${postData.summary}\n`);
    }
    
  } catch (error) {
    console.error('❌ Content generation failed:', error);
    const fs = require('fs');
    const outputFile = process.env.GITHUB_OUTPUT;
    if (outputFile) {
      fs.appendFileSync(outputFile, `content_created=false\n`);
    }
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { generateBlogPost, createBlogPostFile, CONTENT_THEMES, PAIN_POINTS };