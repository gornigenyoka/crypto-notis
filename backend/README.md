# Crypto Platforms Backend

This backend system automatically updates platform data through APIs and web scraping, then commits changes to trigger Netlify deployment.

## 🚀 Features

- **Automated Data Updates**: Daily scraping of platform referral deals and signup bonuses
- **API Integration**: Real-time data from platforms with public APIs
- **Web Scraping**: Custom scraping for platforms without APIs
- **GitHub Actions**: Automated daily updates and Git commits
- **Netlify Integration**: Automatic deployment on data changes

## 📁 Structure

```
backend/
├── server.js              # Express server with API endpoints
├── scripts/
│   ├── updateCSV.js       # Main data update script
│   └── scrapeData.js      # Platform-specific scraping
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## 🛠️ Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure GitHub Actions

The `.github/workflows/update-data.yml` file is already configured to:
- Run daily at 6 AM UTC
- Install dependencies
- Run the update script
- Commit and push changes

### 3. Test Locally

```bash
# Test the update script
npm run update-csv

# Test scraping
npm run scrape

# Start the server
npm start
```

## 🔧 Scripts

- `npm start` - Start the Express server
- `npm run dev` - Start with nodemon for development
- `npm run update-csv` - Run the main data update script
- `npm run scrape` - Run platform scraping only

## 🌐 API Endpoints

- `GET /api/platforms` - Get all platforms
- `GET /api/platforms/:category` - Get platforms by category
- `GET /api/platform/:name` - Get specific platform
- `POST /api/update` - Manually trigger data update
- `GET /api/health` - Health check

## 📊 Data Sources

### APIs (Real-time)
- **Coinbase**: Public API for currency data
- **Kraken**: Public API for asset information
- **Binance**: Referral program scraping

### Web Scraping
- **Bybit**: Promotions and referral pages
- **OKX**: Promotions and referral pages
- **Gate.io**: General platform data
- **MEXC**: Regional offers
- **HTX**: Platform status

## 🔄 Update Process

1. **Daily Trigger**: GitHub Actions runs at 6 AM UTC
2. **Data Fetching**: Scripts fetch from APIs and scrape websites
3. **CSV Update**: `ref_links.csv` is updated with new data
4. **Git Commit**: Changes are committed to repository
5. **Netlify Deploy**: Netlify automatically deploys the updated site

## ⚙️ Configuration

### Adding New Platforms

1. **For APIs**: Add to `PLATFORM_APIS` in `updateCSV.js`
2. **For Scraping**: Add to `SCRAPING_CONFIGS` in `scrapeData.js`
3. **For Simple Scraping**: Add to `SCRAPE_PLATFORMS` array

### Customizing Scraping

Each platform can have custom selectors and URLs:

```javascript
'PlatformName': {
  urls: ['https://platform.com/promotions'],
  selectors: {
    referralBonus: '.bonus-selector',
    signupOffer: '.offer-selector',
    referralLink: 'a[href*="referral"]'
  }
}
```

## 🚨 Rate Limiting

- 1-second delay between platform requests
- 2-second delay between different scraping sessions
- User-Agent rotation to avoid detection
- Timeout settings for all requests

## 📈 Monitoring

- Check GitHub Actions logs for update status
- Monitor Netlify deployment logs
- Use `/api/health` endpoint for server status
- Review CSV file changes in Git history

## 🔒 Security

- No sensitive data stored
- Public APIs only
- Rate limiting implemented
- Error handling for failed requests

## 🆘 Troubleshooting

### Common Issues

1. **Scraping Fails**: Platform may have changed their structure
2. **API Errors**: Check if API endpoints are still valid
3. **GitHub Actions Fail**: Check repository permissions
4. **Netlify Not Deploying**: Verify build settings

### Debug Mode

```bash
# Run with verbose logging
DEBUG=* npm run update-csv
```

## 📝 Notes

- All scraping is done responsibly with delays
- Data is cached in CSV format for reliability
- Failed updates don't break the entire process
- Manual updates can be triggered via API endpoint 