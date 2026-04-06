/**
 * Centralized Test Data - Industry Standard
 */

const testData = {
  // Auth credentials
  users: {
    validUser: {
      username: process.env.TEST_USERNAME || 'akay',
      password: process.env.TEST_PASSWORD || '123456',
    },
    invalidUser: {
      username: 'wronguser_xyz',
      password: 'wrongpass_xyz',
    },
  },

  // Products organized by category
  products: {
    monitors: {
      appleMonitor: 'Apple monitor 24',   // Site pe "Apple monitor 24" hai
    },
    phones: {
      samsungGalaxy: 'Samsung galaxy s6',
      nokiaLumia: 'Nokia lumia 1520',
    },
    laptops: {
      sonyVaio: 'Sony vaio i5',
    },
  },

  // Checkout form data
  checkout: {
    valid: {
      name: 'akay',
      country: 'India',
      city: 'Pune',
      card: '4111111111111111',
      month: '03',
      year: '2027',
    },
  },

  // URLs
  urls: {
    home: '/',
    cart: '/#/cart',
  },
};

module.exports = testData;
