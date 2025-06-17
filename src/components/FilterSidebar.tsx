
import { useState } from "react";
import { ChevronDown, ChevronRight, Star, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

interface FilterSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { name: "All", count: 500 },
  { name: "DEX", count: 85 },
  { name: "Lending", count: 42 },
  { name: "NFT", count: 120 },
  { name: "Wallet", count: 35 },
  { name: "Layer 2", count: 18 },
  { name: "DEX Aggregator", count: 12 },
  { name: "Gaming", count: 67 },
  { name: "Social", count: 23 }
];

const FilterSidebar = ({ isOpen, onToggle, selectedCategory, onCategoryChange }: FilterSidebarProps) => {
  const [ratingFilter, setRatingFilter] = useState([0]);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    rating: true,
    airdrop: true,
    features: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:relative lg:translate-x-0 z-50 lg:z-auto
        w-80 h-full lg:h-auto bg-white/5 backdrop-blur-xl border-r border-white/10
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Filters</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="text-white/60 hover:text-white hover:bg-white/10 lg:hidden"
            >
              ✕
            </Button>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection('categories')}
              className="flex items-center justify-between w-full text-left text-white hover:text-white/80 transition-colors"
            >
              <span className="font-medium">Categories</span>
              {expandedSections.categories ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            
            {expandedSections.categories && (
              <div className="space-y-2 pl-2">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => onCategoryChange(category.name)}
                    className={`flex items-center justify-between w-full text-left p-2 rounded-lg transition-all duration-200 ${
                      selectedCategory === category.name
                        ? 'bg-slate-700/40 text-blue-300 border border-blue-500/30'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{category.name}</span>
                    <Badge 
                      variant="outline" 
                      className="text-xs border-white/20 text-white/60"
                    >
                      {category.count}
                    </Badge>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Rating Filter */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection('rating')}
              className="flex items-center justify-between w-full text-left text-white hover:text-white/80 transition-colors"
            >
              <span className="font-medium">Minimum Rating</span>
              {expandedSections.rating ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            
            {expandedSections.rating && (
              <div className="space-y-3 pl-2">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-white/70">{ratingFilter[0]}/5</span>
                </div>
                <Slider
                  value={ratingFilter}
                  onValueChange={setRatingFilter}
                  max={5}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* Airdrop Potential */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection('airdrop')}
              className="flex items-center justify-between w-full text-left text-white hover:text-white/80 transition-colors"
            >
              <span className="font-medium">Airdrop Potential</span>
              {expandedSections.airdrop ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            
            {expandedSections.airdrop && (
              <div className="space-y-2 pl-2">
                {['High', 'Medium', 'Low'].map((potential) => (
                  <button
                    key={potential}
                    className="flex items-center space-x-2 w-full text-left p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-all duration-200"
                  >
                    <TrendingUp className={`w-4 h-4 ${
                      potential === 'High' ? 'text-green-400' :
                      potential === 'Medium' ? 'text-yellow-400' : 'text-gray-400'
                    }`} />
                    <span>{potential}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Clear Filters */}
          <Button
            variant="outline"
            className="w-full border-white/20 text-white hover:bg-white/10"
            onClick={() => {
              onCategoryChange("All");
              setRatingFilter([0]);
            }}
          >
            Clear All Filters
          </Button>
        </div>
      </aside>
    </>
  );
};

export default FilterSidebar;

