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
  const prompt = `Write a professional blog post about "${topic}" for enterprise directors. 

The post should be 800-1200 words and include:
- A compelling title
- Practical insights for large organizations
- Actionable recommendations
- Professional tone

Return ONLY a valid JSON object with this structure:
{
  "title": "Blog post title",
  "description": "SEO description under 160 characters",
  "content": "Full blog post content in markdown",
  "tags": ["tag1", "tag2", "tag3"],
  "summary": "Brief 2-sentence summary"
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
  
  console.log('📝 Creating blog post file...');
  console.log('- Title:', title);
  console.log('- Slug:', slug);
  console.log('- Pub Date:', format(pubDate, 'yyyy-MM-dd'));
  
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

async function main() {
  try {
    console.log('🤖 Starting AI content generation...');
    
    // Check environment
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    
    // Get topic (from input or random selection)
    const topicOverride = process.env.TOPIC_OVERRIDE;
    const topic = topicOverride || CONTENT_THEMES[Math.floor(Math.random() * CONTENT_THEMES.length)];
    
    console.log(`📝 Generating content for topic: ${topic}`);
    
    // Generate the blog post
    console.log('🎯 Step 1: Generating blog post content...');
    const postData = await generateBlogPost(topic, process.env.TARGET_DATE);
    
    // Create the blog post file
    console.log('💾 Step 2: Creating blog post file...');
    const fileInfo = await createBlogPostFile(postData);
    
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

module.exports = { generateBlogPost, createBlogPostFile, CONTENT_THEMES, PAIN_POINTS };