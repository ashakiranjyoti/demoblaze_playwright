const { BasePage } = require('./BasePage');

/**
 * LoginPage - Handles all login/logout related actions
 */
class LoginPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    this.loginNavLink = page.getByRole('link', { name: 'Log in' });
    this.usernameInput = page.locator('#loginusername');
    this.passwordInput = page.locator('#loginpassword');
    this.loginButton = page.getByRole('button', { name: 'Log in' });
    this.logoutLink = page.getByRole('link', { name: 'Log out' });
    this.welcomeMessage = page.locator('#nameofuser');
    this.loginModal = page.locator('#logInModal');
  }

  /**
   * Performs full login with retry logic.
   * @param {string} username
   * @param {string} password
   */
  async login(username, password) {
    await this.loginNavLink.click({ force: true });
    await this.usernameInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.page.waitForTimeout(400); // Bootstrap animation settle

    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click({ force: true });

    // Welcome message wait
    try {
      await this.welcomeMessage.waitFor({ state: 'visible', timeout: 10000 });
    } catch {
      console.log('⚠️ Login attempt 1 failed, retrying...');

      await this.page.evaluate(() => {
        document.querySelectorAll('.modal, .modal-backdrop').forEach(e => e.remove());
        document.body.classList.remove('modal-open');
      });

      await this.page.goto('/', { waitUntil: 'domcontentloaded' });
      await this.page.waitForTimeout(2000);

      // Second attempt
      await this.loginNavLink.click({ force: true });
      await this.usernameInput.waitFor({ state: 'visible', timeout: 10000 });
      await this.page.waitForTimeout(400);
      await this.usernameInput.fill(username);
      await this.passwordInput.fill(password);
      await this.loginButton.click({ force: true });

      await this.welcomeMessage.waitFor({ state: 'visible', timeout: 20000 });
      console.log('✅ Login succeeded on retry');
    }
  }

  /**
   * Verifies user is logged in
   * @returns {Promise<boolean>}
   */
  async isLoggedIn() {
    return await this.welcomeMessage.isVisible();
  }

  /**
   * Performs logout
   */
  async logout() {
    await this.page.evaluate(() => {
      document.querySelectorAll('.modal, .modal-backdrop').forEach(el => el.remove());
      document.body.classList.remove('modal-open');
    });
    await this.logoutLink.waitFor({ state: 'visible' });
    await this.logoutLink.click();
    await this.loginNavLink.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Returns the welcome message text (e.g. "Welcome akay")
   * @returns {Promise<string>}
   */
  async getWelcomeText() {
    return await this.welcomeMessage.textContent() ?? '';
  }
}

module.exports = { LoginPage };
