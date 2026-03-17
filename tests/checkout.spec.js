import { test, expect } from '@playwright/test';

test('user can browse products and add to cart', async ({ page }) => {
    // Go to the local dev server
    await page.goto('http://localhost:5173/');

    // Click on the first product card
    const productCard = page.locator('.product-card').first();
    await productCard.click();

    // The modal should open. Wait for the "Select Size" text to be visible
    await expect(page.getByText('Select Size')).toBeVisible();

    // Click on a size, e.g., 'L'
    await page.getByRole('button', { name: 'L', exact: true }).click();

    // Click "Add to Cart"
    await page.getByRole('button', { name: /Add to Cart/i }).click();

    // The modal should close, and the Cart should open.
    // Wait for the Cart header to appear
    await expect(page.getByRole('heading', { name: /Your Cart/i })).toBeVisible();

    // Verify that an item was added to the cart
    await expect(page.getByText('Size: L')).toBeVisible();
    await expect(page.getByRole('heading', { name: /Your Cart \(1\)/i })).toBeVisible();
});
