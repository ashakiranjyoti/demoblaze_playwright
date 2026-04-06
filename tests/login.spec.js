const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const testData = require('../utils/testData');

test.describe('Login Tests', () => {
  /** @type {LoginPage} */
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  // ✅ TC-LOGIN-01: Valid login
  test('should login successfully with valid credentials @smoke', async ({ page }) => {
    const { username, password } = testData.users.validUser;
    await loginPage.login(username, password);

    await expect(page.locator('#nameofuser')).toBeVisible();
    const welcomeText = await loginPage.getWelcomeText();
    expect(welcomeText).toContain(username);
  });

  // ✅ TC-LOGIN-02: Logout after login
  test('should logout successfully after login @smoke', async ({ page }) => {
    const { username, password } = testData.users.validUser;
    await loginPage.login(username, password);
    expect(await loginPage.isLoggedIn()).toBe(true);

    await loginPage.logout();
    await expect(page.getByRole('link', { name: 'Log in' })).toBeVisible();
    await expect(page.locator('#nameofuser')).not.toBeVisible();
  });

  // ✅ TC-LOGIN-03: Invalid credentials
  test('should show alert for invalid credentials @regression', async ({ page }) => {
    await loginPage.loginNavLink.click({ force: true });
    await loginPage.usernameInput.waitFor({ state: 'visible' });
    await page.waitForTimeout(400);

    const dialogPromise = page.waitForEvent('dialog', { timeout: 15000 });

    await loginPage.usernameInput.fill(testData.users.invalidUser.username);
    await loginPage.passwordInput.fill(testData.users.invalidUser.password);
    await loginPage.loginButton.click({ force: true }); // force:true here too

    const dialog = await dialogPromise;
    expect(dialog.type()).toBe('alert');
    await dialog.accept();

    await expect(page.locator('#nameofuser')).not.toBeVisible();
  });

  // ✅ TC-LOGIN-04: Empty credentials
  test('should not login with empty credentials @regression', async ({ page }) => {
    await loginPage.loginNavLink.click({ force: true });
    await loginPage.usernameInput.waitFor({ state: 'visible' });
    await page.waitForTimeout(600);

    let dialogAppeared = false;
    page.once('dialog', async dialog => {
      dialogAppeared = true;
      await dialog.accept();
    });

    await loginPage.loginButton.click({ force: true });
    await page.waitForTimeout(3000);

    const modalVisible = await page.locator('#logInModal').isVisible().catch(() => false);
    if (modalVisible) {
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
    }

    await expect(page.locator('#nameofuser')).not.toBeVisible({ timeout: 5000 });
  });

  // ✅ TC-LOGIN-05: Login modal elements visible
  test('should display login modal with correct elements @regression', async () => {
    await loginPage.loginNavLink.click({ force: true });
    await loginPage.usernameInput.waitFor({ state: 'visible' });

    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });
});
