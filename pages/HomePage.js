const { BasePage } = require('./BasePage');

/**
 * HomePage - Handles category navigation and product listing
 */
class HomePage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    // Category locators
    this.phonesCategory = page.getByRole('link', { name: 'Phones' });
    this.laptopsCategory = page.getByRole('link', { name: 'Laptops' });
    this.monitorsCategory = page.getByRole('link', { name: 'Monitors' });

    // Product grid
    this.productLinks = page.locator('.hrefch');
  }

  /**
   * Navigate to homepage
   */
  async goto() {
    await super.goto('/');
    await this.phonesCategory.waitFor({ state: 'visible', timeout: 15000 });
  }

  /**
   * Click a category and wait for products to load.
   * @param {'phones' | 'laptops' | 'monitors'} category
   */
  async selectCategory(category) {
    const categoryMap = {
      phones: this.phonesCategory,
      laptops: this.laptopsCategory,
      monitors: this.monitorsCategory,
    };

    const locator = categoryMap[category];
    if (!locator) {
      throw new Error(`Unknown category: "${category}". Valid: phones, laptops, monitors`);
    }

    const isVisible = await locator.isVisible().catch(() => false);
    if (!isVisible) {
      await this.goto();
    }

    await locator.waitFor({ state: 'visible', timeout: 10000 });
    await locator.click();

    await this.page.waitForResponse(
      response => response.url().includes('bycat') && response.status() === 200,
      { timeout: 15000 }
    ).catch(async () => {
      await this.page.waitForTimeout(2000);
    });
  }

  /**
   * Returns all visible product names on the page
   * @returns {Promise<string[]>}
   */
  async getVisibleProductNames() {
    await this.productLinks.first().waitFor({ state: 'visible', timeout: 15000 });
    return await this.productLinks.allTextContents();
  }
}

module.exports = { HomePage };
