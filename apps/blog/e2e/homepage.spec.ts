import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Fractals of Change/i);
  });

  test('should display site title', async ({ page }) => {
    await page.goto('/');
    const title = page.locator('h1').first();
    await expect(title).toBeVisible();
  });

  test('should have navigation links', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('should have blog posts section', async ({ page }) => {
    await page.goto('/');
    // Check for blog content or links
    const blogSection = page.locator('main, article, [class*="blog"]').first();
    await expect(blogSection).toBeVisible();
  });
});
