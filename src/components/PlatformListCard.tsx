import { useState, useRef, useEffect } from "react";
import { Star, TrendingUp, Bookmark, ExternalLink, Users, Clock, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Platform {
  id: number;
  name: string;
  category: string;
  description: string;
  rating: number;
  bonus: string;
  image: string;
  tags: string[];
  airdropPotential: string;
  users?: string;
  timeLeft?: string;
  Logo?: string;
  Features?: string;
  features?: string[];
}

interface PlatformListCardProps {
  platform: Platform;
  isBookmarked: boolean;
  onBookmark: (e: React.MouseEvent) => void;
  bellLine: string;
  featureTags: string[];
}

const PlatformListCard = ({ platform, isBookmarked, onBookmark, bellLine, featureTags }: PlatformListCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isNotificationSubscribed, setIsNotificationSubscribed] = useState(false);
  const [isBannerHovered, setIsBannerHovered] = useState(false);

  const bigExchanges = [
    'Binance', 'Coinbase', 'Kucoin', 'Kraken', 'OKX', 'Bitget', 'Bybit', 'Crypto.com', 'Bitfinex', 'Gemini', 'Gate.io', 'MEXC', 'HTX', 'Upbit', 'Bitstamp'
  ];

  const handleBannerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsNotificationSubscribed(!isNotificationSubscribed);
  };

  const handleLogoError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.style.display = 'none';
    const parent = e.currentTarget.parentElement as HTMLElement | null;
    if (parent) {
      const fallback = parent.querySelector('.logo-fallback') as HTMLElement | null;
      if (fallback) fallback.style.display = 'flex';
    }
  };

  let airdropPotential = 'Medium';
  if (bigExchanges.includes(platform.name)) airdropPotential = 'High';
  if (platform.airdropPotential === 'Low') airdropPotential = 'Hot';

  const getPotentialColor = (potential: string) => {
    switch (potential) {
      case "High": return "text-emerald-300 bg-emerald-500/20 border-emerald-500/50 shadow-emerald-500/20";
      case "Medium": return "text-orange-300 bg-orange-500/20 border-orange-500/50 shadow-orange-500/20";
      case "Low": return "text-slate-400 bg-slate-500/20 border-slate-500/40 shadow-slate-500/10";
      default: return "text-slate-400 bg-slate-500/20 border-slate-500/40 shadow-slate-500/10";
    }
  };

  return (
    <div 
      className="group relative glass-card rounded-xl p-4 md:p-6 hover-glass hover-lift transition-all duration-500 border hover:border-emerald-400/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Neon glow effect on hover */}
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-blue-500/10 rounded-xl animate-pulse-neon pointer-events-none" />
      )}

      {/* Mobile/Tablet Layout */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 relative z-10">
        {/* Platform Info Section */}
        <div className="flex items-center gap-4 flex-1">
          {/* Logo */}
          <div className="relative flex-shrink-0">
            {platform.Logo ? (
              <img 
                src={`/logos/${platform.Logo}`}
                alt={`${platform.name} logo`}
                className="w-16 h-16 rounded-xl object-cover ring-2 ring-emerald-500/30 group-hover:ring-emerald-400/60 transition-all duration-300"
                style={{ objectFit: 'cover', width: '4rem', height: '4rem' }}
                onError={handleLogoError}
              />
            ) : null}
            <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center logo-fallback" style={{display: !platform.Logo ? 'flex' : 'none'}}>
              <span className="text-2xl">{platform.name.charAt(0)}</span>
            </div>
            <div className="absolute -top-1 -right-1">
              <Badge 
                className={`text-xs px-2 py-1 ${getPotentialColor(airdropPotential)} border backdrop-blur-sm font-medium shadow-lg`}
              >
                {airdropPotential}
              </Badge>
            </div>
          </div>

          {/* Platform Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg md:text-xl font-bold text-white truncate">{platform.name}</h3>
              <Badge variant="outline" className="border-emerald-400/40 text-emerald-200 bg-emerald-500/20 text-xs font-medium shadow-emerald-500/20">
                {platform.category}
              </Badge>
            </div>
            {/* Feature tags as capsules, not CEXs/New Platform */}
            <div className="flex flex-wrap gap-1 mb-2">
              {featureTags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="text-xs bg-white/10 text-slate-300 border-white/20 hover:bg-emerald-500/20 hover:text-emerald-200 transition-colors"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6">
          {/* Rating & Stats */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-yellow-400/80">
              <Star className="w-4 h-4 fill-current drop-shadow-lg" />
              <span className="text-white font-medium">{platform.rating}</span>
            </div>
            {platform.users && (
              <div className="hidden md:flex items-center gap-1 text-slate-300">
                <Users className="w-4 h-4" />
                <span>{platform.users}</span>
              </div>
            )}
            {platform.timeLeft && (
              <div className="flex items-center gap-1 text-orange-300">
                <Clock className="w-4 h-4" />
                <span className="text-xs">{platform.timeLeft}</span>
              </div>
            )}
          </div>
          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBookmark}
              className={`w-9 h-9 p-0 transition-all duration-300 ${
                isBookmarked 
                  ? 'bg-emerald-500/30 hover:bg-emerald-500/40 text-emerald-200 shadow-emerald-500/30' 
                  : 'bg-white/10 hover:bg-emerald-500/30 text-slate-300 hover:text-white'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </Button>
            <Button 
              size="sm"
              className="visit-gradient hover:opacity-90 text-white font-medium transition-all duration-300 px-4 h-9 shadow-lg hover-neon-glow"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Visit</span>
            </Button>
          </div>
        </div>
      </div>
      {/* Reward bell line - one per platform, not random on every render */}
      <div className="mt-4 p-3 rounded-lg reward-banner border border-emerald-500/20 relative z-10 cursor-pointer transition-all duration-300 hover:border-emerald-400/40 hover:shadow-lg hover:shadow-emerald-400/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bell 
                className={`w-4 h-4 transition-all duration-300 ${
                  isNotificationSubscribed 
                    ? 'text-emerald-200 fill-current' 
                    : 'text-emerald-300'
                } ${isBannerHovered ? 'animate-pulse' : ''}`} 
                style={{
                  filter: isBannerHovered 
                    ? 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.8)) drop-shadow(0 0 12px rgba(6, 182, 212, 0.6))' 
                    : 'none'
                }}
              />
            </div>
            <span className="text-slate-200 font-medium text-sm">{bellLine}</span>
          </div>
          <TrendingUp className="w-4 h-4 text-green-300" />
        </div>
      </div>
    </div>
  );
};

export default PlatformListCard;
