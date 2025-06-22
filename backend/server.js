const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const { updateCSV } = require('./scripts/updateCSV');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use('/public', express.static(path.join(__dirname, '../public')));

// API Routes
app.get('/api/platforms', async (req, res) => {
  try {
    const csvPath = path.join(__dirname, '../public/ref_links.csv');
    const platforms = [];
    
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => platforms.push(row))
      .on('end', () => {
        res.json({
          success: true,
          data: platforms,
          lastUpdated: new Date().toISOString()
        });
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/platforms/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const csvPath = path.join(__dirname, '../public/ref_links.csv');
    const platforms = [];
    
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => {
        if (row.Category && row.Category.toLowerCase() === category.toLowerCase()) {
          platforms.push(row);
        }
      })
      .on('end', () => {
        res.json({
          success: true,
          data: platforms,
          category,
          lastUpdated: new Date().toISOString()
        });
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/platform/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const csvPath = path.join(__dirname, '../public/ref_links.csv');
    let platform = null;
    
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => {
        if (row['Platform Name'] && row['Platform Name'].toLowerCase() === name.toLowerCase()) {
          platform = row;
        }
      })
      .on('end', () => {
        if (platform) {
          res.json({
            success: true,
            data: platform,
            lastUpdated: new Date().toISOString()
          });
        } else {
          res.status(404).json({
            success: false,
            error: 'Platform not found'
          });
        }
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Manual update endpoint
app.post('/api/update', async (req, res) => {
  try {
    console.log('Manual update triggered...');
    await updateCSV();
    res.json({
      success: true,
      message: 'Data updated successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});

module.exports = app; 