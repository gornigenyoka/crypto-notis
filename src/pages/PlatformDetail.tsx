import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, ExternalLink, TrendingUp, Users, Book, Video, Check, Zap, Gift, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AnimatedBackground from "@/components/AnimatedBackground";
import AppHeader from "@/components/AppHeader";
import { loadPlatforms, Platform } from "@/data/platforms";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

const PlatformDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [relatedPlatforms, setRelatedPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper function to normalize platform names for favicon matching
  const getFaviconPath = (platformName: string) => {
    // Normalize the platform name to match favicon naming convention
    let normalizedName = platformName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_') // Replace non-alphanumeric chars with underscore
      .replace(/_+/g, '_') // Replace multiple underscores with single
      .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
    
    // Handle specific known cases
    const nameMappings: { [key: string]: string } = {
      'crypto_com': 'Crypto_com',
      'gate_io': 'Gate_io',
      'magic_eden': 'magic_eden',
      'opensea_pro': 'Opensea_pro',
      'sniper_xyz': 'Sniper_xyz',
      'god_unchained': 'God_unchained',
      'sol_incinerator': 'Sol_incinerator',
      'sol_trading': 'SOL_trading',
      'sns_bonfida': 'SNS_bonfida',
      'banana_gun_bot': 'banana_gun_bot',
      'magnum_trading_bot': 'magnum_trading_bot',
      'unibot_v2': 'Unibot_v2',
      'pepeboost': 'PepeBoost',
      'bc_game': 'bc_game',
      'cloudbet': 'cloudbet',
      'toshibet': 'toshibet',
      'shuffle': 'shuffle',
      'gamdom': 'gamdom',
      'rollbit': 'rollbit',
      'roobet': 'roobet',
      'solcasino': 'solcasino',
      'megadice': 'megadice',
      '7bit': '7bit',
      '500_casino': '500_casino',
      'coinbase_wallet': 'Coinbase_Wallet',
      'binance_wallet': 'Binance_Wallet',
      'bitgetwallet': 'bitgetwallet',
      'okx_wallet': 'okx_wallet',
      'ethereum_wallet': 'ethereum_wallet',
      'bravewallet': 'bravewallet',
      'jupmobile': 'jupmobile',
      'solflare': 'solflare',
      'magic_eden': 'magic_eden',
      'metamask': 'metamask',
      'trust': 'trust',
      'trezor': 'trezor',
      'ledger': 'ledger',
      'backpack': 'backpack',
      'xverse': 'xverse',
      'glow': 'glow',
      'exodus': 'exodus',
      'unisat': 'Unisat',
      'rainbow': 'rainbow',
      'seiglobal': 'seiglobal',
      'abstract': 'abstract',
      'ambient_finance': 'ambient_finance',
      'izumi_finance': 'izumi_finance',
      'butter': 'butter',
      'supswap': 'supswap',
      'demmex': 'demmex',
      'logx': 'Logx',
      'satori_finance': 'satori_finance',
      'lyra': 'lyra',
      'zeta': 'zeta',
      'aevo': 'aevo',
      'intentx': 'intentx',
      'dexscreener': 'Dexscreener',
      'pumpfun': 'Pumpfun',
      'odinfun': 'Odinfun',
      'blazestake': 'blazestake',
      'kamino': 'Kamino',
      'orca': 'Orca',
      'meteora': 'Meteora',
      'marginfi': 'Marginfi',
      'eigenlayer': 'Eigenlayer',
      'helio': 'Helio',
      'debank': 'Debank',
      'matcha': 'Matcha',
      'matchain': 'Matchain',
      'cetus': 'Cetus',
      'suilend': 'Suilend',
      'carv': 'carv',
      'aeitheir': 'aeitheir',
      'parcl': 'parcl',
      'assetdash': 'assetdash',
      'sharkyfi': 'sharkyfi',
      'opensea': 'Opensea',
      'blur': 'Blur',
      'magiceden': 'Magiceden',
      'tensor': 'Tensor',
      'whalesmarket': 'Whalesmarket',
      'rairable': 'Rairable',
      'launchmynft': 'Launchmynft',
      'tokentrove': 'TokenTrove',
      'polymarket': 'Polymarket',
      'zetamarkets': 'zetamarkets',
      'element': 'element',
      'scatterart': 'scatterart',
      'zkmarkets': 'zkmarkets',
      'photon': 'Photon',
      'bullx': 'Bullx',
      'bullx_neo': 'Bullx_Neo',
      'axiom': 'Axiom',
      'gmgn': 'GMGN',
      'unibot': 'Unibot',
      'trojan': 'Trojan',
      'maestro': 'Maestro',
      'bonkbot': 'Bonkbot',
      'fluxbot': 'fluxbot',
      'cielo': 'cielo',
      'pumppill': 'pumppill',
      'kekbot': 'KekBot',
      'pepeboost': 'PepeBoost',
      'jito': 'Jito',
      'pyth': 'Pyth',
      'owlito': 'Owlito',
      'debridge': 'Debridge',
      'wormhole': 'Wormhole',
      'portal': 'Portal',
      'jumper': 'Jumper',
      'all_bridge': 'All_bridge',
      'mayanswap': 'Mayanswap',
      'atomiq': 'Atomiq',
      'orbiter': 'orbiter',
      'bungee': 'bungee',
      'rango': 'rango',
      'stargate': 'stargate',
      'warpcast': 'Warpcast',
      'zora': 'Zora',
      'zealy': 'Zealy',
      'matrica': 'Matrica',
      'highrise': 'Highrise',
      'defillama': 'defillama',
      'rugcheck': 'rugcheck',
      'fluxbeam': 'fluxbeam',
      'smithii': 'Smithii',
      'dextools': 'Dextools',
      // Add missing platforms that don't have favicon files
      'jupiter': 'Jupiter',
      'hyperliquid': 'Hyperliquid',
      'drift': 'Drift',
      'raydium': 'Raydium',
      'uniswap': 'Uniswap',
      'pancakeswap': 'Pancakeswap',
      'birdeye': 'Birdeye',
      'sushi': 'Sushi',
      'pond0x': 'pond0x',
      'syncswap': 'syncswap',
      'butter': 'butter',
      'supswap': 'supswap',
      'demmex': 'demmex',
      'logx': 'Logx',
      'satori_finance': 'satori_finance',
      'derive': 'lyra', // Derive uses lyra favicon
      'zeta': 'zeta',
      'aevo': 'aevo',
      'intentx': 'intentx',
      'coinbase': 'Coinbase',
      'bitget': 'Bitget',
      'kucoin': 'Kucoin',
      'kraken': 'Kraken',
      'bybit': 'Bybit',
      'okx': 'OKX',
      'mexc': 'MEXC',
      'htx': 'HTX',
      'gemini': 'Gemini',
      'bitfinex': 'Bitfinex',
      'bitstamp': 'Bitstamp',
      'upbit': 'Upbit'
    };

    return `/favicons/fav_${nameMappings[normalizedName] || normalizedName}.png`;
  };

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

  // Check if we have current deals
  const hasCurrentDeals = !!(platform?.currentDeals || platform?.deals);

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
              {/* Main platform header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
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

                <div className="w-full sm:w-auto flex-shrink-0">
                  {visitUrl && (
                    <Button 
                      variant="ghost"
                      className="visit-gradient w-full sm:w-auto justify-center hover:opacity-90 text-white font-medium transition-all duration-300 px-6 py-3 shadow-lg hover-neon-glow"
                      onClick={() => window.open(visitUrl, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Site
                    </Button>
                  )}
                </div>
              </div>

              {/* Description */}
              {platform.Description && (
                <div className="prose prose-invert max-w-none mb-4">
                  <p className="text-lg text-muted-foreground">{platform.Description}</p>
                </div>
              )}

              {/* Current Deals - Integrated into header */}
              {hasCurrentDeals && (
                <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Gift className="w-5 h-5 text-orange-400 mr-3" />
                      <div>
                        <h4 className="text-orange-300 font-medium">Current Promotions</h4>
                        <p className="text-orange-200 text-sm">
                          {platform.currentDeals || platform.deals}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-orange-500/20 text-orange-300">
                      Active
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
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
                      const faviconPath = getFaviconPath(related['Platform Name']);
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
