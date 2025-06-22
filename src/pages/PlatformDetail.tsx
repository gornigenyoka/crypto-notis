import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, ExternalLink, TrendingUp, Users, Book, Video, Check, Zap, Gift, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AnimatedBackground from "@/components/AnimatedBackground";
import AppHeader from "@/components/AppHeader";
import { loadPlatforms, Platform, getPlatformDeals } from "@/data/platforms";

const PlatformDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [relatedPlatforms, setRelatedPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [realTimeDeals, setRealTimeDeals] = useState<any>(null);

  useEffect(() => {
    const fetchPlatform = async () => {
      try {
        const platforms = await loadPlatforms();
        const currentPlatform = platforms.find(p => p.id === Number(id));
        
        if (!currentPlatform) {
          navigate('/');
          return;
        }

        setPlatform(currentPlatform);
        
        // Fetch real-time deals
        if (currentPlatform['Platform Name']) {
          const deals = await getPlatformDeals(currentPlatform['Platform Name']);
          setRealTimeDeals(deals);
        }
        
        // Get 3 from same category (excluding current)
        const sameCat = platforms.filter(p => p.category === currentPlatform.category && p.id !== currentPlatform.id);
        // Get 2 from random other categories (excluding current and sameCat)
        const otherCats = platforms.filter(p => p.category !== currentPlatform.category && p.id !== currentPlatform.id && !sameCat.includes(p));
        const shuffled = otherCats.sort(() => 0.5 - Math.random());
        const related = [...sameCat.slice(0, 3), ...shuffled.slice(0, 2)];
        setRelatedPlatforms(related);
      } catch (error) {
        console.error('Error loading platform:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchPlatform();
  }, [id, navigate]);

  const handleLogoError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.style.display = 'none';
    const parent = e.currentTarget.parentElement as HTMLElement | null;
    if (parent) {
      const fallback = parent.querySelector('.logo-fallback') as HTMLElement | null;
      if (fallback) fallback.style.display = 'flex';
    }
  };

  // Check if we have real-time deals
  const hasRealTimeDeals = realTimeDeals && (
    realTimeDeals.referralBonuses || 
    realTimeDeals.signupOffers || 
    realTimeDeals.currentDeals ||
    platform?.referralBonuses ||
    platform?.signupOffers ||
    platform?.currentDeals
  );

  if (loading || !platform) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <AnimatedBackground />
        <AppHeader />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="glass-card rounded-xl p-8 text-center">
            <p className="text-slate-300 text-lg">Loading platform details...</p>
          </div>
        </div>
      </div>
    );
  }

  const visitUrl = platform['Referral Link'] || platform['Official Website'];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <AppHeader />
      
      <main className="relative z-10 py-8">
        <div className="container mx-auto px-6">
          {/* Platform Header */}
          <div className="glass-card rounded-xl p-8 mb-8">
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                {platform.Logo ? (
                  <div style={{ width: '6rem', height: '6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#10151c', borderRadius: '1rem', border: '2px solid #10b98130' }}>
                    <img 
                      src={`/logos/${platform.Logo}`}
                      alt={`${platform['Platform Name']} logo`}
                      style={{ objectFit: 'cover', width: '100%', height: '100%', borderRadius: '1rem', background: '#10151c' }}
                      onError={handleLogoError}
                    />
                  </div>
                ) : null}
                <div className="w-24 h-24 rounded-xl bg-muted flex items-center justify-center logo-fallback" style={{display: !platform.Logo ? 'flex' : 'none'}}>
                  <span className="text-4xl">{platform['Platform Name'].charAt(0)}</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{platform['Platform Name']}</h1>
                  <Badge variant="outline" className="mt-2 bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                    {platform.Category}
                  </Badge>
                </div>
              </div>

              {/* Description at the top, yellow arrow location */}
              {platform.Description && (
                <div className="prose prose-invert max-w-none mb-4">
                  <p className="text-lg text-muted-foreground">{platform.Description}</p>
                </div>
              )}

              {visitUrl && (
                <div className="mb-2">
                  <Button 
                    variant="ghost"
                    className="visit-gradient hover:opacity-90 text-white font-medium transition-all duration-300 px-4 h-9 shadow-lg hover-neon-glow"
                    onClick={() => window.open(visitUrl, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit Site
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Real-time Deals Section */}
              {hasRealTimeDeals && (
                <Card className="glass-card border-orange-500/30 bg-gradient-to-r from-orange-500/5 to-red-500/5">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-orange-400" />
                      Current Deals & Offers
                      {platform.lastUpdated && (
                        <Badge className="ml-2 bg-blue-500/20 text-blue-300 text-xs">
                          Updated {new Date(platform.lastUpdated).toLocaleDateString()}
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Referral Bonuses */}
                      {(realTimeDeals?.referralBonuses || platform.referralBonuses) && (
                        <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                          <div className="flex items-center">
                            <Gift className="w-5 h-5 text-green-400 mr-3" />
                            <div>
                              <h4 className="text-green-300 font-medium">Referral Bonuses</h4>
                              <p className="text-green-200 text-sm">
                                {realTimeDeals?.referralBonuses || platform.referralBonuses} active referral programs
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-green-500/20 text-green-300">
                            Active
                          </Badge>
                        </div>
                      )}

                      {/* Signup Offers */}
                      {(realTimeDeals?.signupOffers || platform.signupOffers) && (
                        <div className="flex items-center justify-between p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                          <div className="flex items-center">
                            <Gift className="w-5 h-5 text-blue-400 mr-3" />
                            <div>
                              <h4 className="text-blue-300 font-medium">Signup Offers</h4>
                              <p className="text-blue-200 text-sm">
                                {realTimeDeals?.signupOffers || platform.signupOffers} new user bonuses available
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-blue-500/20 text-blue-300">
                            New Users
                          </Badge>
                        </div>
                      )}

                      {/* Current Deals */}
                      {(realTimeDeals?.currentDeals || platform.currentDeals) && (
                        <div className="flex items-center justify-between p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                          <div className="flex items-center">
                            <TrendingUp className="w-5 h-5 text-yellow-400 mr-3" />
                            <div>
                              <h4 className="text-yellow-300 font-medium">Current Promotions</h4>
                              <p className="text-yellow-200 text-sm">
                                {realTimeDeals?.currentDeals || platform.currentDeals}
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-yellow-500/20 text-yellow-300">
                            Limited Time
                          </Badge>
                        </div>
                      )}

                      {/* Referral Link */}
                      {platform['Referral Link'] && (
                        <div className="flex items-center justify-between p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                          <div className="flex items-center">
                            <ExternalLink className="w-5 h-5 text-purple-400 mr-3" />
                            <div>
                              <h4 className="text-purple-300 font-medium">Referral Link</h4>
                              <p className="text-purple-200 text-sm">
                                Use our referral link for exclusive bonuses
                              </p>
                            </div>
                          </div>
                          <Button 
                            size="sm"
                            className="bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30"
                            onClick={() => window.open(platform['Referral Link'], '_blank')}
                          >
                            Use Link
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Features */}
              <Card className="glass-card border-slate-400/20">
                <CardHeader>
                  <CardTitle className="text-white">Key Features</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Features as bullet points, green arrow location */}
                  {platform.Features && (
                    <ul className="space-y-3">
                      {platform.Features.split(',').map((feature, index) => {
                        const clean = feature.replace(/^[\s"']+|[\s"']+$/g, '');
                        if (!clean) return null;
                        return (
                          <li key={index} className="flex items-center text-slate-300">
                            <div className="w-2 h-2 moon-gradient rounded-full mr-3"></div>
                            {clean}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </CardContent>
              </Card>

              {/* Educational Content */}
              <Card className="glass-card border-slate-400/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Book className="w-5 h-5 mr-2" />
                    Learn How to Use {platform['Platform Name']}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {platform.tutorials?.map((tutorial, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center">
                          {tutorial.type === 'video' ? (
                            <Video className="w-5 h-5 text-blue-400 mr-3" />
                          ) : (
                            <Book className="w-5 h-5 text-green-400 mr-3" />
                          )}
                          <div>
                            <h4 className="text-white font-medium">{tutorial.title}</h4>
                            <p className="text-slate-400 text-sm">
                              {tutorial.duration || tutorial.readTime}
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="glass border-slate-400/30 text-white">
                          {tutorial.type === 'video' ? 'Watch' : 'Read'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Stats */}
              <Card className="glass-card border-slate-400/20">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Users</span>
                      <span className="text-white font-medium">{platform.users}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Airdrop Potential</span>
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                        {platform.airdropPotential}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Status</span>
                      <Badge className={`${
                        platform.platformStatus === 'Active' 
                          ? 'bg-green-500/20 text-green-300 border-green-500/30'
                          : 'bg-red-500/20 text-red-300 border-red-500/30'
                      }`}>
                        {platform.platformStatus || 'Unknown'}
                      </Badge>
                    </div>
                    {platform.lastUpdated && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">Last Updated</span>
                        <div className="flex items-center text-slate-400 text-sm">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(platform.lastUpdated).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Related Platforms */}
              <Card className="glass-card border-slate-400/20">
                <CardHeader>
                  <CardTitle className="text-white">Related Platforms</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {relatedPlatforms.map((related) => {
                      const faviconPath = `/favicons/fav_${related['Platform Name']}.png`;
                      return (
                        <div
                          key={related.id}
                          className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition group"
                          onClick={() => navigate(`/platform/${related.id}`)}
                        >
                          <div className="flex items-center gap-3">
                            {/* Favicon square - finer outline, fits image, aura on card hover */}
                            <div
                              className="relative bg-[#181f2a] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.6),0_0_35px_rgba(16,185,129,0.4),0_0_50px_rgba(99,102,241,0.3)] transition-all duration-200"
                              style={{
                                width: 56,
                                height: 56,
                                borderRadius: 12,
                                border: '1.5px solid #10b981',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                marginRight: 10,
                              }}
                            >
                              <img
                                src={faviconPath}
                                alt="favicon"
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'contain',
                                  borderRadius: 12,
                                  position: 'absolute',
                                  left: 0,
                                  top: 0,
                                  zIndex: 2,
                                }}
                                onError={e => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                              {/* Fallback: first letter, always visible but under favicon */}
                              <span
                                style={{
                                  fontSize: 24,
                                  color: '#888',
                                  fontWeight: 600,
                                  zIndex: 1,
                                  position: 'absolute',
                                  left: 0,
                                  right: 0,
                                  top: 0,
                                  bottom: 0,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                {related['Platform Name'].charAt(0)}
                              </span>
                            </div>
                            <div>
                              <h4 className="text-white font-medium">{related['Platform Name']}</h4>
                              <p className="text-slate-400 text-sm">{related.category}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1 text-yellow-400">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm text-white">{related.rating}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlatformDetail;
