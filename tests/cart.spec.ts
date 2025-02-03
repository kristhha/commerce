// tests/cart.spec.ts
import { expect, test } from '@playwright/test';

test.describe('Cart Functionality', () => {
  test('Should add a product to cart and verify API call', async ({ page }) => {
    // Intercept the "add to cart" API call
    await page.route('**/commerce/webstores/*/carts/*/cart-items', async (route) => {
      if (route.request().method() === 'POST') {
        console.log('Intercepted add to cart API call:', route.request().url());
        const postData = route.request().postDataJSON();
        // **Verification:** Verify product ID and quantity in postData
        expect(postData).toHaveProperty('cartItemId'); // Example verification
      }
      route.continue();
    });

    await page.goto('/product/example-product');
    await page.click('.add-to-cart-button button');

    await expect(page.locator('.cart-modal')).toBeVisible();
    // ... rest of your add to cart assertions ...
  });

  test('Should update cart item quantity and mock API response', async ({ page }) => {
    // Mock the "update cart item" API response
    await page.route('**/commerce/webstores/*/carts/*/cart-items/*', async (route) => {
      if (route.request().method() === 'PATCH' ) {
        console.log('Intercepted update cart item API call - Mocking response');
        // **Mocking/Stubbing:**  Return a predefined successful response
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            "cart": { // Mocked Cart object - adapt to your Cart response structure
              "id": "mockedCartId",
              "checkoutUrl": "mockedCheckoutUrl",
              "totalQuantity": 2,
              "lines": [],
              "cost": { "subtotalAmount": { "amount": "MockedAmount", "currencyCode": "USD" }, "totalAmount": { "amount": "MockedAmount", "currencyCode": "USD" }, "totalTaxAmount": { "amount": "0", "currencyCode": "USD" } }
            }
          }),
        });
      }
    });

    await page.goto('/product/another-product');
    await page.click('.add-to-cart-button button');
    await page.locator('.open-cart-button').click();

    const cartItem = page.locator('.cart-item').first();
    const quantityElement = cartItem.locator('.item-quantity');
    const increaseButton = cartItem.locator('.increase-quantity-button');

    await expect(quantityElement).toHaveText('1');
    await increaseButton.click();
    await expect(quantityElement).toHaveText('2'); // Verify UI updated based on mocked response
  });

  // ... other cart functionality tests (remove item, coupon, checkout init, etc.) ...
});