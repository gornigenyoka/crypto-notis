const puppeteer = require('puppeteer');
const axios = require('axios');
const cheerio = require('cheerio');

// Platform-specific scraping configurations
const SCRAPING_CONFIGS = {
  'Binance': {
    urls: [
      'https://www.binance.com/en/activity/referral/claim',
      'https://www.binance.com/en/support/announcement'
    ],
    selectors: {
      referralBonus: '.referral-bonus, .bonus-amount, [data-testid*="bonus"]',
      signupOffer: '.signup-offer, .welcome-bonus',
      referralLink: 'a[href*="referral"], a[href*="ref="]'
    }
  },
  'Bybit': {
    urls: [
      'https://www.bybit.com/en/promotions',
      'https://www.bybit.com/referral'
    ],
    selectors: {
      referralBonus: '.promotion-bonus, .referral-reward',
      signupOffer: '.welcome-bonus, .new-user-bonus',
      referralLink: 'a[href*="referral"], a[href*="ref="]'
    }
  },
  'OKX': {
    urls: [
      'https://www.okx.com/promotions',
      'https://www.okx.com/referral'
    ],
    selectors: {
      referralBonus: '.referral-bonus, .bonus-amount',
      signupOffer: '.welcome-bonus, .new-user-offer',
      referralLink: 'a[href*="referral"], a[href*="ref="]'
    }
  }
};

async function scrapePlatform(platformName, config) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  try {
    const results = {
      platform: platformName,
      referralBonuses: [],
      signupOffers: [],
      referralLinks: [],
      lastUpdated: new Date().toISOString()
    };

    for (const url of config.urls) {
      try {
        const page = await browser.newPage();
        
        // Set user agent to avoid detection
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        
        // Navigate to page
        await page.goto(url, { 
          waitUntil: 'networkidle2', 
          timeout: 30000 
        });

        // Wait for content to load
        await page.waitForTimeout(3000);

        // Extract referral bonuses
        const bonuses = await page.evaluate((selectors) => {
          const elements = document.querySelectorAll(selectors.referralBonus);
          return Array.from(elements).map(el => ({
            text: el.textContent.trim(),
            href: el.href || null
          }));
        }, config.selectors);

        // Extract signup offers
        const offers = await page.evaluate((selectors) => {
          const elements = document.querySelectorAll(selectors.signupOffer);
          return Array.from(elements).map(el => ({
            text: el.textContent.trim(),
            href: el.href || null
          }));
        }, config.selectors);

        // Extract referral links
        const links = await page.evaluate((selectors) => {
          const elements = document.querySelectorAll(selectors.referralLink);
          return Array.from(elements).map(el => ({
            text: el.textContent.trim(),
            href: el.href || null
          }));
        }, config.selectors);

        results.referralBonuses.push(...bonuses);
        results.signupOffers.push(...offers);
        results.referralLinks.push(...links);

        await page.close();

      } catch (error) {
        console.error(`Error scraping ${url}:`, error.message);
      }
    }

    return results;

  } finally {
    await browser.close();
  }
}

async function scrapeAllPlatforms() {
  const results = [];

  for (const [platformName, config] of Object.entries(SCRAPING_CONFIGS)) {
    console.log(`Scraping ${platformName}...`);
    
    try {
      const data = await scrapePlatform(platformName, config);
      results.push(data);
      
      // Add delay between platforms to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`Error scraping ${platformName}:`, error);
      results.push({
        platform: platformName,
        error: error.message,
        lastUpdated: new Date().toISOString()
      });
    }
  }

  return results;
}

// Simple HTTP scraping for platforms that don't need JavaScript
async function scrapeSimplePlatform(url, platformName) {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    
    // Look for referral-related content
    const referralText = $('*:contains("referral"), *:contains("bonus"), *:contains("reward")').text();
    
    return {
      platform: platformName,
      referralContent: referralText.substring(0, 500), // Limit text length
      lastUpdated: new Date().toISOString()
    };

  } catch (error) {
    console.error(`Error scraping ${platformName}:`, error.message);
    return {
      platform: platformName,
      error: error.message,
      lastUpdated: new Date().toISOString()
    };
  }
}

// Export functions for use in other scripts
module.exports = {
  scrapePlatform,
  scrapeAllPlatforms,
  scrapeSimplePlatform
};

// Run if called directly
if (require.main === module) {
  scrapeAllPlatforms()
    .then(results => {
      console.log('Scraping completed!');
      console.log(JSON.stringify(results, null, 2));
      process.exit(0);
    })
    .catch(error => {
      console.error('Scraping failed:', error);
      process.exit(1);
    });
} 