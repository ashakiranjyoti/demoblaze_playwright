const { BasePage } = require('./BasePage');

class CartPage extends BasePage {
  constructor(page) {
    super(page);
    this.cartNavLink = page.getByRole('link', { name: 'Cart', exact: true });
    this.placeOrderButton = page.getByRole('button', { name: 'Place Order' });
    this.cartItemRows = page.locator('#tbodyid tr');
    this.totalPrice = page.locator('#totalp');
  }

  async goto(expectItems = true, minCount = 1) {
    await this.cartNavLink.click();
    if (!expectItems) {
      await this.page.waitForTimeout(2000);
      return;
    }
    await this.cartItemRows.first().waitFor({ state: 'visible', timeout: 20000 });
    if (minCount > 1) {
      await this.page.waitForFunction(
        (expected) => document.querySelectorAll('#tbodyid tr').length >= expected,
        minCount, { timeout: 15000 }
      ).catch(() => {});
    }
  }

  async isProductInCart(productName) {
    const cell = this.page.getByRole('cell', { name: productName }).first();
    return await cell.isVisible().catch(() => false);
  }

  async getCartItemCount() {
    return await this.cartItemRows.count();
  }

  async getCartTotal() {
    await this.cartItemRows.first().waitFor({ state: 'visible', timeout: 20000 });
    const text = await this.totalPrice.textContent() ?? '0';
    return isNaN(parseInt(text.trim(), 10)) ? 0 : parseInt(text.trim(), 10);
  }

  async placeOrder() {
    await this.placeOrderButton.waitFor({ state: 'visible' });
    await this.placeOrderButton.click();
  }

  async clearCart() {
    await this.page.goto('/#/cart');
    await this.page.waitForTimeout(4000);

    const result = await this.page.evaluate(async () => {
      const deleteLinks = document.querySelectorAll('#tbodyid a[onclick*="deleteItem"]');
      
      if (deleteLinks.length === 0) return { deleted: 0, errors: [] };

      const errors = [];
      let deleted = 0;

      for (const link of deleteLinks) {
        const match = link.getAttribute('onclick')?.match(/deleteItem\('([^']+)'\)/);
        if (!match) continue;

        const itemId = match[1];
        try {
          const res = await fetch('https://api.demoblaze.com/deleteitem', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: itemId }),
          });
          if (res.ok) {
            deleted++;
          } else {
            errors.push(`${itemId}: HTTP ${res.status}`);
          }
        } catch (e) {
          errors.push(`${itemId}: ${e.message}`);
        }

        await new Promise(r => setTimeout(r, 300));
      }

      return { deleted, total: deleteLinks.length, errors };
    });

    console.log(`🗑️ clearCart: ${result.deleted}/${result.total} items deleted`, 
      result.errors?.length ? result.errors : '');

    await this.page.goto('/#/cart');
    await this.page.waitForTimeout(3000);

    const remaining = await this.cartItemRows.count();
    if (remaining > 0) {
      console.log(`⚠️ ${remaining} items remaining, running second pass...`);
      await this.page.waitForTimeout(2000);
      
      const result2 = await this.page.evaluate(async () => {
        const links = document.querySelectorAll('#tbodyid a[onclick*="deleteItem"]');
        let deleted = 0;
        for (const link of links) {
          const match = link.getAttribute('onclick')?.match(/deleteItem\('([^']+)'\)/);
          if (!match) continue;
          try {
            await fetch('https://api.demoblaze.com/deleteitem', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: match[1] }),
            });
            deleted++;
          } catch {}
          await new Promise(r => setTimeout(r, 300));
        }
        return deleted;
      });

      console.log(`🗑️ Second pass: ${result2} more items deleted`);
      await this.page.waitForTimeout(2000);
    }

    const finalCount = await this.cartItemRows.count();
    console.log(`✅ clearCart done — final count: ${finalCount}`);

    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
  }
}

module.exports = { CartPage };
