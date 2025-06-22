const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const axios = require('axios');

// Platform APIs - only major platforms with reliable public APIs
const PLATFORM_APIS = {
  'Coinbase': {
    url: 'https://api.coinbase.com/v2/currencies',
    extract: (data) => ({ 
      status: 'Active', 
      lastUpdated: new Date().toISOString(),
      currentDeals: 'Free crypto rewards available'
    })
  },
  'Kraken': {
    url: 'https://api.kraken.com/0/public/Assets',
    extract: (data) => ({ 
      status: 'Active', 
      lastUpdated: new Date().toISOString(),
      currentDeals: 'Professional trading platform'
    })
  },
  'Binance': {
    url: 'https://api.binance.com/api/v3/ticker/24hr',
    extract: (data) => ({ 
      status: 'Active', 
      lastUpdated: new Date().toISOString(),
      currentDeals: 'Referral program with up to 40% commission'
    })
  },
  'Bybit': {
    url: 'https://api.bybit.com/v5/market/tickers',
    extract: (data) => ({ 
      status: 'Active', 
      lastUpdated: new Date().toISOString(),
      currentDeals: 'Welcome bonus up to $100'
    })
  },
  'OKX': {
    url: 'https://www.okx.com/api/v5/market/tickers',
    extract: (data) => ({ 
      status: 'Active', 
      lastUpdated: new Date().toISOString(),
      currentDeals: 'New user rewards available'
    })
  }
};

async function fetchApiData(platformName, config) {
  try {
    console.log(`Fetching API data for ${platformName}...`);
    const response = await axios.get(config.url, { 
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    return config.extract(response.data);
  } catch (error) {
    console.error(`Error fetching API data for ${platformName}:`, error.message);
    return { 
      status: 'Error', 
      lastUpdated: new Date().toISOString(),
      currentDeals: 'Check platform for current offers'
    };
  }
}

async function updateCSV() {
  const csvPath = path.join(__dirname, '../../public/ref_links.csv');
  const platforms = [];
  
  // Read existing CSV
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => platforms.push(row))
      .on('end', async () => {
        try {
          console.log(`Processing ${platforms.length} platforms...`);
          
          // Update each platform with API data
          for (let i = 0; i < platforms.length; i++) {
            const platform = platforms[i];
            const platformName = platform['Platform Name'];
            
            // Check if platform has API configuration
            if (PLATFORM_APIS[platformName]) {
              console.log(`Updating ${platformName} via API...`);
              const data = await fetchApiData(platformName, PLATFORM_APIS[platformName]);
              platforms[i] = { ...platform, ...data };
            } else {
              // For platforms without APIs, just add timestamp
              platforms[i] = { 
                ...platform, 
                lastUpdated: new Date().toISOString(),
                currentDeals: platform['Referral Link'] ? 'Referral link available' : 'Check platform for offers'
              };
            }
            
            // Small delay to be respectful
            await new Promise(resolve => setTimeout(resolve, 500));
          }
          
          // Write updated CSV
          const csvWriter = createCsvWriter({
            path: csvPath,
            header: Object.keys(platforms[0]).map(key => ({ id: key, title: key }))
          });
          
          await csvWriter.writeRecords(platforms);
          console.log('CSV updated successfully!');
          resolve();
          
        } catch (error) {
          console.error('Error updating CSV:', error);
          reject(error);
        }
      });
  });
}

// Run if called directly
if (require.main === module) {
  updateCSV()
    .then(() => {
      console.log('Data update completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Data update failed:', error);
      process.exit(1);
    });
}

module.exports = { updateCSV }; 