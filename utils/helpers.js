/**
 * Reusable Helper Utilities
 */

/**
 * Waits for network to be stable before proceeding.
 * @param {import('@playwright/test').Page} page
 */
async function waitForNetworkIdle(page) {
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {
  });
}

/**
 * Dismisses any open Bootstrap modal by removing DOM nodes.
 * @param {import('@playwright/test').Page} page
 */
async function dismissModal(page) {
  await page.evaluate(() => {
    document.querySelectorAll('.modal, .modal-backdrop').forEach(el => el.remove());
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  });
}

/**
 * Retries a flaky action up to maxRetries times.
 * @param {() => Promise<void>} action
 * @param {number} maxRetries
 */
async function retryAction(action, maxRetries = 3) {
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await action();
      return;
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }
  throw lastError;
}

module.exports = { waitForNetworkIdle, dismissModal, retryAction };
