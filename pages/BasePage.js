/**
 * BasePage - Parent class for all Page Objects
 */

class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to a URL with reliable load strategy
   * @param {string} path - Relative path from baseURL
   */
  async goto(path = '/') {
    await this.page.goto(path, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
  }

  /**
   * Wait for page to be interactive
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Take a named screenshot for debugging
   * @param {string} name
   */
  async takeScreenshot(name) {
    await this.page.screenshot({
      path: `test-results/screenshots/${name}-${Date.now()}.png`,
      fullPage: true,
    });
  }
}

module.exports = { BasePage };
