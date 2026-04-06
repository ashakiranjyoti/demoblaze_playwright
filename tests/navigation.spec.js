const { test, expect } = require('@playwright/test');
const { HomePage } = require('../pages/HomePage');

/**
 * Navigation Test Suite - No login needed, fast tests
 */
test.describe('Navigation Tests', () => {

  // ✅ TC-NAV-01: Home page loads
  test('should load homepage successfully @smoke', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await expect(page).toHaveTitle(/STORE/i);
    await expect(page).toHaveURL('https://www.demoblaze.com/');
  });

  // ✅ TC-NAV-02: Category - Phones
  test('should navigate to Phones category @smoke', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.selectCategory('phones');

    const productNames = await homePage.getVisibleProductNames();
    expect(productNames.length).toBeGreaterThan(0);
  });

  // ✅ TC-NAV-03: Category - Laptops
  test('should navigate to Laptops category @regression', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.selectCategory('laptops');

    const productNames = await homePage.getVisibleProductNames();
    expect(productNames.length).toBeGreaterThan(0);
  });

  // ✅ TC-NAV-04: Category - Monitors
  test('should navigate to Monitors category @regression', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.selectCategory('monitors');

    const productNames = await homePage.getVisibleProductNames();
    expect(productNames.length).toBeGreaterThan(0);

  });

  // ✅ TC-NAV-05: Navbar links visible
  test('should display all navbar links on homepage @regression', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Cart', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Log in' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign up' })).toBeVisible();
  });

  // ✅ TC-NAV-06: Cart page accessible without login
  test('should allow accessing cart page without login @regression', async ({ page }) => {
    await page.goto('https://www.demoblaze.com/#/cart');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000); 

    const tbodyid = page.locator('#tbodyid');
    await expect(tbodyid).toBeAttached(); 
  });
});
