import { expect, test } from '@playwright/test';

test('ootb webapp starter flow', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Ship the mission, fast.' })).toBeVisible();

  await page.getByRole('link', { name: 'Log in' }).click();
  await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible();

  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByRole('heading', { name: 'App' })).toBeVisible();

  // Open user dropdown (native <details>/<summary>) and go to Profile.
  await page.getByText('Demo User').click();
  await page.getByRole('link', { name: 'Profile' }).click();
  await expect(page.getByRole('heading', { name: 'Profile' })).toBeVisible();

  // Open dropdown again and log out.
  await page.getByText('Demo User').click();
  await page.getByRole('button', { name: 'Log out' }).click();

  await expect(page.getByRole('heading', { name: 'Ship the mission, fast.' })).toBeVisible();
});
