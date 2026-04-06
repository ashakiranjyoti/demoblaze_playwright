const { BasePage } = require('./BasePage');

/**
 * ProductPage - Handles product detail page and add-to-cart
 */
class ProductPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    this.addToCartButton = page.getByRole('link', { name: 'Add to cart' });
    this.productTitle = page.locator('.name');
    this.productPrice = page.locator('.price-container');
  }

  /**
   * Click on a product from the listing page
   * @param {string} productName
   */
  async selectProduct(productName) {
    const productLink = this.page.getByRole('link', { name: productName }).first();
    await productLink.waitFor({ state: 'visible', timeout: 15000 });
    await productLink.click();
    await this.addToCartButton.waitFor({ state: 'visible', timeout: 15000 });
  }

  async addToCart() {
    const networkPromise = this.page.waitForResponse(
      res => res.url().includes('addtocart') && res.status() === 200,
      { timeout: 10000 }
    ).catch(() => null); 

    const dialogPromise = this.page.waitForEvent('dialog', { timeout: 10000 });

    await this.addToCartButton.click();

    try {
      const dialog = await dialogPromise;
      await dialog.accept();
    } catch {
    }

    await networkPromise;

    await this.page.waitForTimeout(500);
  }

  /**
   * Gets the product name from the product detail page
   * @returns {Promise<string>}
   */
  async getProductName() {
    return await this.productTitle.textContent() ?? '';
  }

  /**
   * Gets the product price text
   * @returns {Promise<string>}
   */
  async getProductPrice() {
    return await this.productPrice.textContent() ?? '';
  }
}

module.exports = { ProductPage };
