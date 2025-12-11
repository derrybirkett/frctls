#!/usr/bin/env node

console.log('🔍 Testing AI content generation...');

// Test environment variables
console.log('Environment check:');
console.log('- OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'Present' : 'Missing');
console.log('- GITHUB_TOKEN:', process.env.GITHUB_TOKEN ? 'Present' : 'Missing');

// Test OpenAI import
try {
  const { OpenAI } = require('openai');
  console.log('✅ OpenAI import successful');
  
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  console.log('✅ OpenAI client created');
  
} catch (error) {
  console.error('❌ OpenAI setup failed:', error.message);
}

// Test file system access
const fs = require('fs').promises;
const path = require('path');

async function testFileSystem() {
  try {
    const draftsPath = path.join('../../apps/blog/src/content/drafts');
    console.log('Testing drafts path:', draftsPath);
    
    const stats = await fs.stat(draftsPath);
    console.log('✅ Drafts directory exists');
    
    // Test write access
    const testFile = path.join(draftsPath, 'test-file.txt');
    await fs.writeFile(testFile, 'test content');
    console.log('✅ Write access confirmed');
    
    // Clean up
    await fs.unlink(testFile);
    console.log('✅ Test file cleaned up');
    
  } catch (error) {
    console.error('❌ File system test failed:', error.message);
  }
}

testFileSystem();