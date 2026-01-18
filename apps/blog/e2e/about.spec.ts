import { test, expect } from '@playwright/test';

test.describe('About Page', () => {
  test('should navigate to about page', async ({ page }) => {
    await page.goto('/about');
    await expect(page).toHaveURL(/\/about/);
  });

  test('should display about page content', async ({ page }) => {
    await page.goto('/about');
    const content = page.locator('main, article');
    await expect(content).toBeVisible();
  });

  test('should have page title', async ({ page }) => {
    await page.goto('/about');
    const title = page.locator('h1').first();
    await expect(title).toBeVisible();
  });
});
