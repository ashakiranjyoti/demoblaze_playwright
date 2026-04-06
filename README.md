# DemoBlaze Playwright Test Suite

Industry-standard E2E test framework for [DemoBlaze](https://www.demoblaze.com) using Playwright + JavaScript.

## 📁 Project Structure

```
demoblaze-playwright/
├── pages/                    # Page Object Model (POM)
│   ├── BasePage.js           # Parent class - common methods
│   ├── LoginPage.js          # Login/Logout actions
│   ├── HomePage.js           # Category navigation
│   ├── ProductPage.js        # Product selection & add-to-cart
│   ├── CartPage.js           # Cart operations
│   └── CheckoutPage.js       # Checkout form & confirmation
├── tests/                    # Test specs
│   ├── navigation.spec.js    # Navigation tests (no login needed)
│   ├── login.spec.js         # Login/Logout tests
│   ├── cart.spec.js          # Cart tests
│   ├── checkout.spec.js      # Checkout tests
│   └── e2e.spec.js           # Full end-to-end flows
├── utils/
│   ├── testData.js           # Centralized test data
│   └── helpers.js            # Reusable utility functions
├── playwright.config.js      # Playwright configuration
└── .github/workflows/
    └── playwright.yml        # CI/CD pipeline
```

## 🚀 Getting Started

```bash
# Install dependencies
npm ci

# Install Playwright browsers
npx playwright install chromium

# Run all tests
npm test

# Run smoke tests only (fast)
npm run test:smoke

# Run with UI (visual debugging)
npm run test:ui

# Run headed (see browser)
npm run test:headed

# View HTML report
npm run test:report
```

## 🏷️ Test Tags

Tests are tagged for selective execution:

| Tag | Description | Command |
|-----|-------------|---------|
| `@smoke` | Critical path, fast | `npm run test:smoke` |
| `@regression` | Full test suite | `npm run test:regression` |

## 📊 Test Coverage

| Suite | Tests | Tags |
|-------|-------|------|
| Navigation | 6 | smoke + regression |
| Login | 5 | smoke + regression |
| Cart | 5 | smoke + regression |
| Checkout | 3 | smoke + regression |
| E2E | 2 | smoke + regression |
| **Total** | **21** | |

## 🔑 Environment Variables

For CI/CD, set these as GitHub Secrets:

```
TEST_USERNAME=your_username
TEST_PASSWORD=your_password
```

## 🏗️ Design Patterns Used

- **Page Object Model (POM)** - UI logic test logic se alag
- **Base Page Inheritance** - Common methods ek jagah
- **Centralized Test Data** - `utils/testData.js`
- **Serial Mode** - Stateful tests ke liye (Cart suite)
- **Smoke + Regression Tags** - Selective test execution
