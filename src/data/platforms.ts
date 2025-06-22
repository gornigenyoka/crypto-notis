import Papa from 'papaparse';

export interface Platform {
  id: number;
  name: string;
  category: string;
  description: string;
  rating: number;
  bonus: string;
  image: string;
  tags: string[];
  airdropPotential: string;
  users: string;
  timeLeft?: string;
  referralLink?: string;
  detailedDescription?: string;
  features?: string[];
  officialWebsite?: string;
  tutorials?: Array<{
    title: string;
    type: string;
    duration?: string;
    readTime?: string;
  }>;
  Category: string;
  'Platform Name': string;
  'Official Website': string;
  'Referral Link': string;
  Notes: string;
  Status: string;
  Logo?: string;
  Description?: string;
  Features?: string;
  capsules: string;
  // New fields from automated updates
  lastUpdated?: string;
  referralBonuses?: string;
  signupOffers?: string;
  currentDeals?: string;
  platformStatus?: string;
}

// Default values for fields not in CSV
const DEFAULT_VALUES = {
  rating: 4.0,
  bonus: "Check platform for current offers",
  image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=240&fit=crop",
  tags: ["New Platform"],
  airdropPotential: "Medium",
  users: "10K+",
  features: ["Trading", "Security", "User-friendly interface"]
};

export const categories = [
  "All",
  "CEX",
  "DEX", 
  "DeFi",
  "Trading Bot",
  "TG Trading Bot",
  "Marketplace",
  "Tools",
  "Staking",
  "Bridging",
  "Social",
  "Gaming",
  "Casino",
  "Wallets"
];

// Function to get real-time deals for a platform
async function getRealTimeDeals(platformName: string): Promise<any> {
  try {
    // Try to fetch from our backend API first
    const response = await fetch(`http://localhost:3001/api/platform/${encodeURIComponent(platformName)}`);
    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    console.log(`No real-time data for ${platformName}, using CSV data`);
  }
  return null;
}

// Function to format deals for display
function formatDeals(platform: any): string {
  // Priority: real-time deals > CSV deals > default
  if (platform.referralBonuses && platform.referralBonuses !== '0') {
    return `🔥 ${platform.referralBonuses} referral bonus available`;
  }
  
  if (platform.signupOffers && platform.signupOffers !== '0') {
    return `🎁 ${platform.signupOffers} signup offers`;
  }
  
  if (platform.currentDeals) {
    return platform.currentDeals;
  }
  
  if (platform.referralLink) {
    return "💰 Referral link available";
  }
  
  return "Check platform for current offers";
}

// Function to get platform status
function getPlatformStatus(platform: any): string {
  if (platform.platformStatus === 'Active') {
    return "🟢 Active";
  }
  if (platform.platformStatus === 'Error') {
    return "🔴 Check Status";
  }
  if (platform.Status) {
    return platform.Status;
  }
  return "🟡 Unknown";
}

// Function to load and parse CSV data
export async function loadPlatforms(): Promise<Platform[]> {
  try {
    const response = await fetch('/ref_links.csv');
    const csvText = await response.text();
    
    // Use PapaParse to parse CSV with headers
    const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
    
    const platforms = await Promise.all(parsed.data.map(async (row: any, index: number) => {
      // Try to get real-time data
      const realTimeData = await getRealTimeDeals(row['Platform Name']);
      
      const platform: Platform = {
        id: index + 1,
        name: row['Platform Name'] || '',
        category: (row['Category'] || '').replace('s', ''),
        description: row['Description'] || row['Notes'] || `Discover ${row['Platform Name']}, a leading platform in the ${row['Category']} category.`,
        rating: DEFAULT_VALUES.rating,
        bonus: formatDeals({ ...row, ...realTimeData }), // Use real-time deals
        image: row['Logo'] ? `/logos/${row['Logo']}` : DEFAULT_VALUES.image,
        tags: [row['Category'] || '', ...DEFAULT_VALUES.tags],
        airdropPotential: DEFAULT_VALUES.airdropPotential,
        users: DEFAULT_VALUES.users,
        referralLink: row['Referral Link'] || undefined,
        officialWebsite: row['Official Website'] || undefined,
        detailedDescription: row['Description'] || row['Notes'] || `Discover ${row['Platform Name']}, a leading platform in the ${row['Category']} category.`,
        features: row['Features'] ? row['Features'].split(',').map((f: string) => f.trim()) : DEFAULT_VALUES.features,
        Category: row['Category'] || '',
        'Platform Name': row['Platform Name'] || '',
        'Official Website': row['Official Website'] || '',
        'Referral Link': row['Referral Link'] || '',
        Notes: row['Notes'] || '',
        Status: getPlatformStatus({ ...row, ...realTimeData }), // Use real-time status
        Logo: row['Logo'] || '',
        Description: row['Description'] || '',
        Features: row['Features'] || '',
        capsules: row['capsules'] || '',
        // Real-time data fields
        lastUpdated: realTimeData?.lastUpdated || row['lastUpdated'],
        referralBonuses: realTimeData?.referralBonuses || row['referralBonuses'],
        signupOffers: realTimeData?.signupOffers || row['signupOffers'],
        currentDeals: realTimeData?.currentDeals || row['currentDeals'],
        platformStatus: realTimeData?.status || row['status']
      };
      return platform;
    }));
    
    return platforms;
  } catch (error) {
    console.error('Error loading platforms:', error);
    return [];
  }
}

// Function to get deals for a specific platform
export async function getPlatformDeals(platformName: string): Promise<any> {
  try {
    const response = await fetch(`http://localhost:3001/api/platform/${encodeURIComponent(platformName)}`);
    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
  } catch (error) {
    console.error('Error fetching platform deals:', error);
  }
  return null;
}
