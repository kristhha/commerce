// tests/product-catalog.spec.ts
import { expect, test } from '@playwright/test';

test.describe('Product Catalog', () => {
  test('Homepage should display product listings and verify API call', async ({ page }) => {
    // Intercept the product listing API call
    await page.route('**/commerce/webstores/*/products*', async (route) => {
      console.log('Intercepted product listing API call:', route.request().url());
      // **Verification:** Add assertions to check the request URL, headers, or parameters if needed
      expect(route.request().url()).toContain('/commerce/webstores/');
      route.continue(); // Let the request proceed
    });

    await page.goto('/');
    await expect(page.locator('.grid .grid-item')).toBeVisible();
    const productTitles = await page.locator('.grid .grid-item .label h3').allTextContents();
    expect(productTitles.length).toBeGreaterThan(0);
  });

  test('Product detail page should display product info and verify API call', async ({ page }) => {
    // Intercept the product detail API call
    await page.route('**/commerce/webstores/*/products/ProductHandle*', async (route) => {
      console.log('Intercepted product detail API call:', route.request().url());
      // **Verification:** Verify the product handle is in the URL
      expect(route.request().url()).toContain('/products/ProductHandle');
      route.continue();
    });

    await page.goto('/');
    await page.click('.grid .grid-item a').first();

    await expect(page.locator('h1.text-5xl')).toBeVisible();
    // ... rest of your product detail page assertions ...
  });

  // ... other product catalog tests (collection, search, etc.) ...
});