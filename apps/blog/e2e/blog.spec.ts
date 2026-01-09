import { test, expect } from '@playwright/test';

test.describe('Blog Pages', () => {
  test('should navigate to blog index', async ({ page }) => {
    await page.goto('/blog');
    await expect(page).toHaveURL(/\/blog/);
  });

  test('should display blog posts list', async ({ page }) => {
    await page.goto('/blog');
    // Check for blog post links or articles
    const blogPosts = page.locator('article, [class*="post"], a[href*="/blog/"]');
    await expect(blogPosts.first()).toBeVisible();
  });

  test('should navigate to a blog post', async ({ page }) => {
    await page.goto('/blog');
    
    // Find first blog post link
    const firstPostLink = page.locator('a[href*="/blog/"]').first();
    
    if (await firstPostLink.count() > 0) {
      const href = await firstPostLink.getAttribute('href');
      await firstPostLink.click();
      
      // Should navigate to blog post page
      await expect(page).toHaveURL(new RegExp(href || '/blog/'));
      
      // Should have article content
      const article = page.locator('article, main');
      await expect(article).toBeVisible();
    }
  });

  test('should display blog post content', async ({ page }) => {
    await page.goto('/blog');
    
    // Try to find and click first post
    const firstPostLink = page.locator('a[href*="/blog/"]').first();
    
    if (await firstPostLink.count() > 0) {
      await firstPostLink.click();
      
      // Check for post title
      const title = page.locator('h1, h2').first();
      await expect(title).toBeVisible();
      
      // Check for post content
      const content = page.locator('article p, main p').first();
      await expect(content).toBeVisible();
    }
  });
});
