import { useState } from "react";
import { Link } from "react-router-dom";
import { Platform } from "@/data/platforms";
import PlatformListCard from "./PlatformListCard";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PlatformGridProps {
  platforms: Platform[];
  searchTerm: string;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onSearchTermChange: (searchTerm: string) => void;
}

const PlatformGrid = ({ 
  platforms, 
  searchTerm, 
  selectedCategory, 
  onCategoryChange,
  onSearchTermChange 
}: PlatformGridProps) => {
  const [bookmarkedPlatforms, setBookmarkedPlatforms] = useState<number[]>([]);
  const categories = ["All", "CEX", "DEX", "DeFi", "Trading Bots", "Socials", "Gaming", "Casino", "Marketplace", "Tools"];

  const filteredPlatforms = platforms.filter(platform => {
    const matchesSearch = platform.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         platform.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         platform.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "All" || platform.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const toggleBookmark = (platformId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarkedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  // Bell lines (removed 'Referral bonuses for new users')
  const bellLines = [
    'Sign up to unlock perks',
    'Earn rewards for trading',
    'Bonuses for new users',
    'Check for special events',
    'Loyalty rewards for regulars',
    'Discover trading incentives',
    'Explore bonus features for new users',
    'Discover exclusive bonuses',
    'Get started to earn rewards',
    'Special events for active users',
    'Exclusive rewards for new members',
    'Unlock trading benefits',
    'Join for unique opportunities',
    'Rewards for high-volume traders',
    'Sign-up rewards available',
    'Welcome offers for new signups',
    'Check platform for current offers',
    'Explore available rewards',
    'Loyalty rewards for active users',
    'Check for limited-time rewards',
    'Explore trading rewards',
    'Complete simple tasks and earn',
    'Register for special offers',
  ];

  function assignNoRepeatIn5(items, count) {
    const result = [];
    let used = [];
    for (let i = 0; i < count; i++) {
      let available = items.filter(item => !used.slice(-5).includes(item));
      if (available.length === 0) available = items; // fallback
      const pick = available[Math.floor(Math.random() * available.length)];
      result.push(pick);
      used.push(pick);
    }
    return result;
  }

  function getBellLineAssignments(platformCount) {
    const now = Date.now();
    const lastSet = localStorage.getItem('bellLineLastSet');
    const lastAssignments = localStorage.getItem('bellLineAssignments');
    if (lastSet && lastAssignments && now - parseInt(lastSet) < 1000 * 60 * 60 * 48) {
      return JSON.parse(lastAssignments);
    }
    const assignments = assignNoRepeatIn5(bellLines, platformCount);
    localStorage.setItem('bellLineLastSet', now.toString());
    localStorage.setItem('bellLineAssignments', JSON.stringify(assignments));
    return assignments;
  }

  function getFeatureTagsForPlatforms(platforms) {
    return platforms.map(platform => {
      // Use capsules from CSV if present and non-empty
      if (platform.capsules && typeof platform.capsules === 'string' && platform.capsules.trim().length > 0) {
        // Split by comma, trim, and filter out empty, up to 3
        let csvCapsules = platform.capsules.split(',').map(t => t.trim()).filter(Boolean).slice(0, 3);
        return csvCapsules;
      }
      // Fallback to previous logic if no capsules in CSV
      let allTags = [];
      if (platform.Features) {
        allTags = platform.Features.split(',').map(f => f.replace(/^[\s"']+|[\s"']+$/g, '')).filter(Boolean);
      } else if (platform.features && Array.isArray(platform.features)) {
        allTags = platform.features.map(f => f.replace(/^[\s"']+|[\s"']+$/g, '')).filter(Boolean);
      }
      let shortTags = allTags.filter(tag => tag.split(' ').length <= 2);
      let threeWordTags = allTags.filter(tag => tag.split(' ').length === 3);
      let filtered = [...shortTags, ...threeWordTags];
      const selected = filtered.slice(0, 3);
      return selected;
    });
  }

  const platformCount = filteredPlatforms.length;
  const bellLineAssignments = getBellLineAssignments(platformCount);
  const featureTagsAssignments = getFeatureTagsForPlatforms(filteredPlatforms);

  return (
    <section className="relative z-10 py-4">
      <div className="container mx-auto px-6">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-4 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'visit-gradient hover:opacity-90 text-white font-medium shadow-lg hover-neon-glow backdrop-blur-sm border border-cyan-500/40'
                  : 'glass border-2 border-emerald-500/40 text-slate-300 hover:text-white hover:border-green-500/50 hover-glass hover:shadow-emerald-400/20 hover:shadow-lg backdrop-blur-sm crypto-neon-outline'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search platforms, protocols, or categories..."
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              className="pl-12 py-4 text-lg glass-strong border-slate-400/30 text-white placeholder:text-slate-400 focus:bg-slate-500/10 focus:border-slate-400/50 transition-all duration-300"
            />
          </div>
        </div>

        {/* Results count */}
        <div className="text-center mb-4">
          <p className="text-slate-400 text-sm">
            Showing {filteredPlatforms.length} of {platforms.length} platforms
          </p>
        </div>

        {/* Platform List */}
        <div className="space-y-4">
          {filteredPlatforms.map((platform, idx) => (
            <Link 
              key={platform.id} 
              to={`/platform/${platform.id}`}
              className="block transition-transform duration-300 hover:scale-[1.01]"
            >
              <PlatformListCard 
                platform={platform} 
                isBookmarked={bookmarkedPlatforms.includes(platform.id)}
                onBookmark={(e: React.MouseEvent) => toggleBookmark(platform.id, e)}
                bellLine={bellLineAssignments[idx]}
                featureTags={featureTagsAssignments[idx]}
              />
            </Link>
          ))}
        </div>

        {filteredPlatforms.length === 0 && (
          <div className="text-center py-12">
            <div className="glass-card rounded-xl p-8 max-w-md mx-auto">
              <p className="text-slate-400 text-lg mb-2">No platforms found</p>
              <p className="text-slate-500 text-sm">Try adjusting your search or category filter</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PlatformGrid;
