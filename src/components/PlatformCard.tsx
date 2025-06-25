import { Star, Users, Clock, Zap, Gift, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PlatformCardProps {
  platform: {
    id: number;
    name: string;
    category: string;
    description: string;
    rating: number;
    bonus: string;
    image: string;
    tags: string[];
    airdropPotential?: string;
    users: string;
    timeLeft?: string;
    // Real-time data fields
    lastUpdated?: string;
    referralBonuses?: string;
    signupOffers?: string;
    currentDeals?: string;
  };
  className?: string;
}

const PlatformCard = ({ platform, className = "" }: PlatformCardProps) => {
  // Check if we have real-time deals
  const hasRealTimeDeals = platform.referralBonuses || platform.signupOffers || platform.currentDeals;
  const isRecentlyUpdated = platform.lastUpdated && 
    (new Date().getTime() - new Date(platform.lastUpdated).getTime()) < 24 * 60 * 60 * 1000; // 24 hours

  return (
    <Card className={`glass-card border-slate-400/20 transition-all duration-300 ${className}`}>
      <CardHeader className="pb-3">
        <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
          <img 
            src={platform.image} 
            alt={platform.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-3 right-3">
            <Badge className="neon-gradient text-white shadow-lg">
              {platform.category}
            </Badge>
          </div>
          {platform.airdropPotential === "High" && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-green-500/80 text-white shadow-lg animate-pulse-neon">
                🚀 High Airdrop
              </Badge>
            </div>
          )}
          {/* Real-time deals indicator */}
          {hasRealTimeDeals && (
            <div className="absolute bottom-3 left-3">
              <Badge className="bg-orange-500/90 text-white shadow-lg flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Live Deals
              </Badge>
            </div>
          )}
          {/* Recently updated indicator */}
          {isRecentlyUpdated && (
            <div className="absolute bottom-3 right-3">
              <Badge className="bg-blue-500/90 text-white shadow-lg text-xs">
                Updated
              </Badge>
            </div>
          )}
        </div>
        
        <div className="flex items-start justify-between">
          <CardTitle className="text-white text-xl group-hover:text-pink-300 transition-colors">
            {platform.name}
          </CardTitle>
          <div className="flex items-center space-x-1 text-yellow-400">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium text-white">{platform.rating}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-slate-300 text-sm leading-relaxed">{platform.description}</p>
        
        {/* Real-time deals section */}
        {hasRealTimeDeals && (
          <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-orange-400" />
              <span className="text-orange-300 font-medium text-sm">Current Deals</span>
            </div>
            <div className="space-y-2">
              {platform.referralBonuses && platform.referralBonuses !== '0' && (
                <div className="flex items-center gap-2 text-sm">
                  <Gift className="w-3 h-3 text-green-400" />
                  <span className="text-green-300">{platform.referralBonuses} referral bonuses</span>
                </div>
              )}
              {platform.signupOffers && platform.signupOffers !== '0' && (
                <div className="flex items-center gap-2 text-sm">
                  <Gift className="w-3 h-3 text-blue-400" />
                  <span className="text-blue-300">{platform.signupOffers} signup offers</span>
                </div>
              )}
              {platform.currentDeals && (
                <div className="text-yellow-300 text-sm">
                  {platform.currentDeals}
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2">
          {platform.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-white/10 text-white/80 border-white/20 text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4 text-slate-400" />
              <span className="text-slate-300">{platform.users}</span>
            </div>
            {platform.timeLeft && (
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4 text-orange-400" />
                <span className="text-orange-300 font-medium">{platform.timeLeft}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="pt-2">
          <p className="text-green-400 text-sm font-medium">{platform.bonus}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlatformCard;
