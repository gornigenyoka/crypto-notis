import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';
import axios from 'axios';
import sharp from 'sharp';
import { JSDOM } from 'jsdom';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, 'openai.env') });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

interface Platform {
  Category: string;
  'Platform Name': string;
  'Official Website': string;
  'Referral Link': string;
  Notes: string;
  Status: string;
  Logo?: string;
  Description?: string;
  Features?: string;
}

async function verifyWebsite(url: string): Promise<boolean> {
  try {
    const response = await axios.head(url, {
      timeout: 5000,
      validateStatus: (status) => status < 400
    });
    return true;
  } catch (error) {
    console.error(`Invalid website: ${url}`);
    return false;
  }
}

async function findLogo(website: string): Promise<string | null> {
  try {
    const response = await axios.get(website);
    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    // Common logo selectors
    const logoSelectors = [
      'link[rel="icon"]',
      'link[rel="shortcut icon"]',
      'link[rel="apple-touch-icon"]',
      'meta[property="og:image"]',
      'img[alt*="logo" i]',
      'img[class*="logo" i]',
      'img[id*="logo" i]'
    ];

    for (const selector of logoSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        let logoUrl = element.getAttribute('href') || element.getAttribute('content') || element.getAttribute('src');
        if (logoUrl) {
          // Convert relative URL to absolute
          if (logoUrl.startsWith('/')) {
            const url = new URL(website);
            logoUrl = `${url.origin}${logoUrl}`;
          }
          return logoUrl;
        }
      }
    }

    return null;
  } catch (error) {
    console.error(`Error finding logo for ${website}:`, error);
    return null;
  }
}

async function downloadAndResizeLogo(logoUrl: string, platformName: string): Promise<string | null> {
  try {
    const response = await axios.get(logoUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);

    // Create logos directory if it doesn't exist
    const logosDir = path.join(process.cwd(), 'public', 'logos');
    if (!fs.existsSync(logosDir)) {
      fs.mkdirSync(logosDir, { recursive: true });
    }

    // Generate filename from platform name
    const filename = `${platformName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`;
    const outputPath = path.join(logosDir, filename);

    // Resize and save image
    await sharp(buffer)
      .resize(600, 600, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(outputPath);

    return `/logos/${filename}`;
  } catch (error) {
    console.error(`Error processing logo for ${platformName}:`, error);
    return null;
  }
}

async function generateDescription(platform: Platform): Promise<{ description: string; features: string[] }> {
  try {
    const prompt = `Generate a concise one-sentence description and 3-5 key features for ${platform['Platform Name']}, a ${platform.Category} platform. 
    Format: 
    Description: [one sentence]
    Features:
    - [feature 1]
    - [feature 2]
    - [feature 3]`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 200
    });

    const response = completion.choices[0].message.content || '';
    const [description, ...features] = response.split('\n').filter(line => line.trim());
    
    return {
      description: description.replace('Description:', '').trim(),
      features: features
        .filter(line => line.startsWith('-'))
        .map(line => line.replace('-', '').trim())
    };
  } catch (error) {
    console.error(`Error generating description for ${platform['Platform Name']}:`, error);
    return {
      description: `Discover ${platform['Platform Name']}, a leading platform in the ${platform.Category} category.`,
      features: ['Trading', 'Security', 'User-friendly interface']
    };
  }
}

async function main() {
  try {
    // Read CSV file
    const csvPath = path.join(process.cwd(), 'public', 'ref_links.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const platforms: Platform[] = parse(csvContent, {
      columns: true,
      skip_empty_lines: true
    });

    // Process each platform
    for (const platform of platforms) {
      console.log(`Processing ${platform['Platform Name']}...`);

      // Verify website
      const isValidWebsite = await verifyWebsite(platform['Official Website']);
      if (!isValidWebsite) {
        console.log(`Skipping ${platform['Platform Name']} due to invalid website`);
        continue;
      }

      // Find and process logo
      const logoUrl = await findLogo(platform['Official Website']);
      if (logoUrl) {
        const logoPath = await downloadAndResizeLogo(logoUrl, platform['Platform Name']);
        if (logoPath) {
          platform.Logo = logoPath;
        }
      }

      // Generate description and features
      const { description, features } = await generateDescription(platform);
      platform.Description = description;
      platform.Features = features.join('|');
    }

    // Write enhanced data back to CSV
    const output = stringify(platforms, {
      header: true,
      columns: [
        'Category',
        'Platform Name',
        'Official Website',
        'Referral Link',
        'Notes',
        'Status',
        'Logo',
        'Description',
        'Features'
      ]
    });

    fs.writeFileSync(csvPath, output);
    console.log('Enhancement complete!');

  } catch (error) {
    console.error('Error:', error);
  }
}

main(); 