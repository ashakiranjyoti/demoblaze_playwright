const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { HomePage } = require('../pages/HomePage');
const { ProductPage } = require('../pages/ProductPage');
const { CartPage } = require('../pages/CartPage');
const { CheckoutPage } = require('../pages/CheckoutPage');
const testData = require('../utils/testData');

/**
 * End-to-End Test Suite
 * Full user journey: Login → Browse → Cart → Checkout → Logout
 */
test.describe('DemoBlaze E2E Flow', () => {

  // ✅ TC-E2E-01: Complete purchase flow
  test('complete purchase flow - login to logout @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Step 1: Login
    await loginPage.goto();
    await loginPage.login(testData.users.validUser.username, testData.users.validUser.password);
    await expect(page.locator('#nameofuser')).toBeVisible();
    console.log('✅ Step 1: Login successful');

    // Step 2: Clear cart
    await cartPage.clearCart();
    console.log('✅ Step 2: Cart cleared');

    // Step 3: Browse Monitors
    await homePage.selectCategory('monitors');
    const products = await homePage.getVisibleProductNames();
    expect(products.length).toBeGreaterThan(0);
    console.log(`✅ Step 3: ${products.length} products found`);

    // Step 4: Select product
    await productPage.selectProduct(testData.products.monitors.appleMonitor);
    const productName = await productPage.getProductName();
    expect(productName).toContain('Apple monitor');
    console.log(`✅ Step 4: Product selected - "${productName}"`);

    // Step 5: Add to cart — network wait built-in hai ProductPage mein
    await productPage.addToCart();
    console.log('✅ Step 5: Added to cart');

    // Step 6: Verify cart
    await cartPage.goto(true);
    const isInCart = await cartPage.isProductInCart(testData.products.monitors.appleMonitor);
    expect(isInCart).toBe(true);
    const cartTotal = await cartPage.getCartTotal();
    expect(cartTotal).toBeGreaterThan(0);
    console.log(`✅ Step 6: Cart verified - Total: $${cartTotal}`);

    // Step 7: Checkout
    await cartPage.placeOrder();
    await checkoutPage.fillForm(testData.checkout.valid);
    await checkoutPage.completePurchase();
    console.log('✅ Step 7: Purchase submitted');

    // Step 8: Verify success
    await expect(checkoutPage.getSuccessHeading()).toBeVisible();
    const confirmText = await checkoutPage.getConfirmationText();
    expect(confirmText).toContain(testData.checkout.valid.name);
    console.log('✅ Step 8: Purchase confirmed');

    // Step 9: Close modal + Logout
    await checkoutPage.clickOk();
    await loginPage.logout();
    await expect(page.getByRole('link', { name: 'Log in' })).toBeVisible();
    console.log('✅ Step 9: Logout successful');
  });

  // ✅ TC-E2E-02: Multi-product purchase flow
  test('purchase flow with multiple products @regression', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Login
    await loginPage.goto();
    await loginPage.login(testData.users.validUser.username, testData.users.validUser.password);

    await cartPage.clearCart();
    console.log('✅ Cart cleared — fresh start');

    // Add Monitor
    await homePage.selectCategory('monitors');
    await productPage.selectProduct(testData.products.monitors.appleMonitor);
    await productPage.addToCart(); // network wait built-in

    await homePage.goto();
    await homePage.selectCategory('phones');
    await productPage.selectProduct(testData.products.phones.samsungGalaxy);
    await productPage.addToCart(); // network wait built-in

    await cartPage.goto(true);
    const itemCount = await cartPage.getCartItemCount();
    console.log(`Cart item count: ${itemCount}`);

    expect(itemCount).toBeGreaterThanOrEqual(2);

    await cartPage.placeOrder();
    await checkoutPage.fillForm(testData.checkout.valid);
    await checkoutPage.completePurchase();

    await expect(checkoutPage.getSuccessHeading()).toBeVisible();
    console.log('✅ Multi-product purchase successful');
  });
});
