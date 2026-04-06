const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { HomePage } = require('../pages/HomePage');
const { ProductPage } = require('../pages/ProductPage');
const { CartPage } = require('../pages/CartPage');
const { CheckoutPage } = require('../pages/CheckoutPage');
const testData = require('../utils/testData');

test.describe('Checkout Tests', () => {
  /**
   * beforeEach: Login + add product to cart
   */
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    // Login
    await loginPage.goto();
    await loginPage.login(
      testData.users.validUser.username,
      testData.users.validUser.password
    );

    // Clear any old cart items
    await cartPage.clearCart();

    // Add product
    await homePage.selectCategory('monitors');
    await productPage.selectProduct(testData.products.monitors.appleMonitor);
    await productPage.addToCart();
  });

  // ✅ TC-CHECKOUT-01: Happy path checkout
  test('should complete purchase successfully with valid data @smoke', async ({ page }) => {
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await cartPage.goto();
    await cartPage.placeOrder();

    await checkoutPage.fillForm(testData.checkout.valid);
    await checkoutPage.completePurchase();

    await expect(checkoutPage.getSuccessHeading()).toBeVisible();

    const confirmText = await checkoutPage.getConfirmationText();
    expect(confirmText).toContain(testData.checkout.valid.name);
  });

  // ✅ TC-CHECKOUT-02: Order confirmation modal has OK button
  test('should show OK button after successful purchase @regression', async ({ page }) => {
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await cartPage.goto();
    await cartPage.placeOrder();
    await checkoutPage.fillForm(testData.checkout.valid);
    await checkoutPage.completePurchase();

    await expect(checkoutPage.okButton).toBeVisible();
    await checkoutPage.clickOk();

    await expect(page).toHaveURL(/demoblaze\.com/);
  });

  // ✅ TC-CHECKOUT-03: Verify Place Order modal fields
  test('should display all checkout form fields @regression', async ({ page }) => {
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await cartPage.goto();
    await cartPage.placeOrder();

    await expect(checkoutPage.nameInput).toBeVisible();
    await expect(checkoutPage.countryInput).toBeVisible();
    await expect(checkoutPage.cityInput).toBeVisible();
    await expect(checkoutPage.cardInput).toBeVisible();
    await expect(checkoutPage.monthInput).toBeVisible();
    await expect(checkoutPage.yearInput).toBeVisible();
    await expect(checkoutPage.purchaseButton).toBeVisible();
  });
});
