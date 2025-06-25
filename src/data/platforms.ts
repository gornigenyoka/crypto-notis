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
  currentDeals?: string;
  status?: string;
  API?: string;
  deals?: string;
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

// Function to format deals for display
function formatDeals(platform: any): string {
  // Check if platform has a working API
  const hasApi = platform.API === 'yes';
  
  // Use the 'currentDeals' field directly from the CSV for platforms with APIs
  if (hasApi && platform.currentDeals) {
    return platform.currentDeals;
  }
  
  // For platforms without APIs, use the old logic with random descriptive text
  if (platform['Referral Link'] && platform['Referral Link'].trim() !== '') {
    return "Referral link available";
  }
  
  // For platforms with no API and no referral link, return empty string
  return "";
}

// Function to get platform status
function getPlatformStatus(platform: any): string {
  if (platform.status === 'Active') {
    return "🟢 Active";
  }
  if (platform.status === 'Error') {
    return "🔴 Check Status";
  }
  if (platform.Status) { // Fallback to original Status column if new one is empty
    return `Status: ${platform.Status}`;
  }
  return "🟡 Unknown";
}

// Function to load and parse CSV data
export async function loadPlatforms(): Promise<Platform[]> {
  try {
    console.log('loadPlatforms: Starting to fetch CSV...');
    // Add cache-busting query parameter to prevent loading old data
    const response = await fetch(`/ref_links.csv?t=${new Date().getTime()}`);
    console.log('loadPlatforms: CSV response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`);
    }
    
    const csvText = await response.text();
    console.log('loadPlatforms: CSV text length:', csvText.length);
    
    // Use PapaParse to parse CSV with headers
    const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
    console.log('loadPlatforms: Parsed CSV rows:', parsed.data.length);
    
    const platforms = parsed.data.map((row: any, index: number) => {
      const platformData = row as Platform;

      const platform: Platform = {
        id: index + 1,
        name: platformData['Platform Name'] || '',
        category: (platformData['Category'] || '').replace('s', ''),
        description: platformData['Description'] || platformData['Notes'] || `Discover ${platformData['Platform Name']}`,
        rating: DEFAULT_VALUES.rating,
        bonus: formatDeals(platformData),
        image: platformData['Logo'] ? `/logos/${platformData['Logo']}` : DEFAULT_VALUES.image,
        tags: [platformData['Category'] || '', ...DEFAULT_VALUES.tags],
        airdropPotential: DEFAULT_VALUES.airdropPotential,
        users: DEFAULT_VALUES.users,
        referralLink: platformData['Referral Link'] || undefined,
        officialWebsite: platformData['Official Website'] || undefined,
        detailedDescription: platformData['Description'] || platformData['Notes'] || `Discover ${platformData['Platform Name']}`,
        features: platformData['Features'] ? platformData['Features'].split(',').map((f: string) => f.trim()) : DEFAULT_VALUES.features,
        Category: platformData['Category'] || '',
        'Platform Name': platformData['Platform Name'] || '',
        'Official Website': platformData['Official Website'] || '',
        'Referral Link': platformData['Referral Link'] || '',
        Notes: platformData['Notes'] || '',
        Status: getPlatformStatus(platformData),
        Logo: platformData['Logo'] || '',
        Description: platformData['Description'] || '',
        Features: platformData['Features'] || '',
        capsules: platformData['capsules'] || '',
        lastUpdated: platformData.lastUpdated,
        currentDeals: platformData.currentDeals,
        status: platformData.status,
        API: platformData.API || 'no',
        deals: row['Deals'] || '',
      };
      return platform;
    });
    
    const filteredPlatforms = platforms.filter(p => p.name); // Filter out any empty rows
    console.log('loadPlatforms: Final platforms count:', filteredPlatforms.length);
    return filteredPlatforms;
  } catch (error) {
    console.error('Error loading platforms:', error);
    throw error; // Re-throw the error so the component can handle it
  }
}