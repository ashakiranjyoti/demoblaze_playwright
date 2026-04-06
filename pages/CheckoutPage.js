const { BasePage } = require('./BasePage');

/**
 * CheckoutPage - Handles the order placement modal and confirmation
 * 
 * Improvements:
 * - Extends BasePage
 * - fillForm accepts typed object
 * - Separate verify method for order confirmation details
 */
class CheckoutPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    // Order form inputs (inside modal)
    this.nameInput = page.locator('#name');
    this.countryInput = page.locator('#country');
    this.cityInput = page.locator('#city');
    this.cardInput = page.locator('#card');
    this.monthInput = page.locator('#month');
    this.yearInput = page.locator('#year');

    // Form buttons
    this.purchaseButton = page.getByRole('button', { name: 'Purchase' });

    // Success confirmation
    this.successHeading = page.getByRole('heading', {
      name: 'Thank you for your purchase!',
    });
    this.confirmationDetails = page.locator('.lead.text-muted');
    this.okButton = page.getByRole('button', { name: 'OK' });
  }

  /**
   * Fill the checkout form
   * @param {{ name: string, country: string, city: string, card: string, month: string, year: string }} data
   */
  async fillForm(data) {
    // Wait for modal to be fully open
    await this.nameInput.waitFor({ state: 'visible', timeout: 10000 });

    await this.nameInput.fill(data.name);
    await this.countryInput.fill(data.country);
    await this.cityInput.fill(data.city);
    await this.cardInput.fill(data.card);
    await this.monthInput.fill(data.month);
    await this.yearInput.fill(data.year);
  }

  /**
   * Click Purchase button to submit the order
   */
  async completePurchase() {
    await this.purchaseButton.click();
    await this.successHeading.waitFor({ state: 'visible', timeout: 15000 });
  }

  /**
   * Returns the success heading locator for assertion
   */
  getSuccessHeading() {
    return this.successHeading;
  }

  /**
   * Returns the full confirmation text (includes order ID, amount)
   * @returns {Promise<string>}
   */
  async getConfirmationText() {
    return await this.confirmationDetails.textContent() ?? '';
  }

  /**
   * Click OK to close the confirmation modal
   */
  async clickOk() {
    await this.okButton.waitFor({ state: 'visible' });
    await this.okButton.click();
    await this.page.waitForTimeout(1500);
  }
}

module.exports = { CheckoutPage };
