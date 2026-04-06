const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { HomePage } = require('../pages/HomePage');
const { ProductPage } = require('../pages/ProductPage');
const { CartPage } = require('../pages/CartPage');
const testData = require('../utils/testData');

test.describe.configure({ mode: 'serial' });

test.describe('Cart Tests', () => {
  /** @type {import('@playwright/test').Page} */
  let page;
  let loginPage, cartPage;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    cartPage = new CartPage(page);

    await loginPage.goto();
    await loginPage.login(
      testData.users.validUser.username,
      testData.users.validUser.password
    );
  });

  test.afterAll(async () => {
    await page.close();
  });

  test.beforeEach(async () => {
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);

    await cartPage.clearCart();

    await homePage.selectCategory('monitors');
    await productPage.selectProduct(testData.products.monitors.appleMonitor);
    await productPage.addToCart();
  });

  // ✅ TC-CART-01: Product exists in cart
  test('should display added product in cart @smoke', async () => {
    await cartPage.goto(true);
    const isInCart = await cartPage.isProductInCart(testData.products.monitors.appleMonitor);
    expect(isInCart).toBe(true);
  });

  // ✅ TC-CART-02: Cart has items
  test('should have items in cart @regression', async () => {
    await cartPage.goto(true);
    const count = await cartPage.getCartItemCount();
    expect(count).toBeGreaterThanOrEqual(1);

    const isInCart = await cartPage.isProductInCart(testData.products.monitors.appleMonitor);
    expect(isInCart).toBe(true);
  });

  // ✅ TC-CART-03: Cart total non-zero
  test('should display non-zero total price @regression', async () => {
    await cartPage.goto(true);
    const total = await cartPage.getCartTotal();
    expect(total).toBeGreaterThan(0);
  });

  // ✅ TC-CART-04: Delete product from cart
  test('should remove product from cart after deletion @regression', async () => {
    await cartPage.goto(true);

    await page.getByRole('link', { name: 'Delete' }).first().click();
    await page.waitForTimeout(3000);

    await page.goto('/#/cart');
    await page.waitForTimeout(3000);

    const rows = await page.locator('#tbodyid tr').count();
    if (rows > 0) {
      const isStillInCart = await cartPage.isProductInCart(testData.products.monitors.appleMonitor);
      expect(isStillInCart).toBe(false);
    }
    // rows === 0 means cart empty — pass
  });

  // ✅ TC-CART-05: Multiple products in cart
  test('should allow multiple products in cart @regression', async () => {
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);

    await homePage.goto();
    await homePage.selectCategory('phones');
    await productPage.selectProduct(testData.products.phones.samsungGalaxy);
    await productPage.addToCart();

    await cartPage.goto(true, 2);
    const count = await cartPage.getCartItemCount();
    expect(count).toBeGreaterThanOrEqual(2);
  });
});
