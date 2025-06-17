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

// Function to load and parse CSV data
export async function loadPlatforms(): Promise<Platform[]> {
  try {
    const response = await fetch('/ref_links.csv');
    const csvText = await response.text();
    
    // Use PapaParse to parse CSV with headers
    const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
    const platforms = parsed.data.map((row: any, index: number) => {
      const platform: Platform = {
        id: index + 1,
        name: row['Platform Name'] || '',
        category: (row['Category'] || '').replace('s', ''),
        description: row['Description'] || row['Notes'] || `Discover ${row['Platform Name']}, a leading platform in the ${row['Category']} category.`,
        rating: DEFAULT_VALUES.rating,
        bonus: DEFAULT_VALUES.bonus,
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
        Status: row['Status'] || '',
        Logo: row['Logo'] || '',
        Description: row['Description'] || '',
        Features: row['Features'] || '',
        capsules: row['capsules'] || ''
      };
      return platform;
    });
    return platforms;
  } catch (error) {
    console.error('Error loading platforms:', error);
    return [];
  }
}
