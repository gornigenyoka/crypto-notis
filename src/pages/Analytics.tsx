import React, { useEffect, useState } from 'react';
import AnimatedBackground from '@/components/AnimatedBackground';
import AppHeader from '@/components/AppHeader';
import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router-dom';
import { ChartContainer } from '@/components/ui/chart';
import * as Recharts from 'recharts';
import btcLogo from '/public/logos/logo_Bitcoin.png';
import ethLogo from '/public/logos/logo_Ethereum.png';
import solLogo from '/public/logos/logo_Solana.png';

const CATEGORIES = [
  { label: 'Top 30', value: 'all' },
  { label: 'Layer 1', value: 'layer1' },
  { label: 'Layer 2', value: 'layer2' },
  { label: 'Gaming', value: 'gaming' },
  { label: 'Meme', value: 'meme' },
  { label: 'Liquid Staking', value: 'liquid-staking' },
  { label: 'AI', value: 'ai' },
  { label: 'DEX', value: 'dex' },
  { label: 'Exchange-based', value: 'exchange-based' },
  { label: 'Infrastructure', value: 'infrastructure' },
  { label: 'NFT', value: 'nft' },
  { label: 'Yield Farming', value: 'yield-farming' },
  { label: 'Lending', value: 'lending' },
  { label: 'Metaverse', value: 'metaverse' },
  { label: 'RWA', value: 'rwa' },
];

const COINGECKO_CATEGORY_MAP = {
  'layer1': 'layer-1',
  'layer2': 'layer-2',
  'gaming': 'gaming',
  'meme': 'meme-token',
  'liquid-staking': 'liquid-staking-tokens',
  'ai': 'ai-big-data',
  'dex': 'decentralized-exchange',
  'exchange-based': 'centralized-exchange-token',
  'infrastructure': 'infrastructure',
  'nft': 'nft',
  'yield-farming': 'yield-farming',
  'lending': 'lending-borrowing',
  'metaverse': 'metaverse',
  'rwa': 'real-world-assets',
};

const Analytics = () => {
  const [coins, setCoins] = useState([]);
  const [trending, setTrending] = useState([]);
  const [gainers, setGainers] = useState([]);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState({ key: 'market_cap', order: 'desc' });
  const [page, setPage] = useState(1);
  const [bellActive, setBellActive] = useState({});
  const [bellActiveTrending, setBellActiveTrending] = useState({});
  const [bellActiveGainers, setBellActiveGainers] = useState({});
  const [btcData, setBtcData] = useState([]);
  const [ethData, setEthData] = useState([]);
  const [solData, setSolData] = useState([]);
  const [globalData, setGlobalData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    // Fetch top 100 coins for default/all
    let url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false';
    if (category !== 'all') {
      const cgCat = COINGECKO_CATEGORY_MAP[category];
      if (cgCat) {
        url += `&category=${cgCat}`;
      }
    }
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setCoins(data);
        setLoading(false);
      });
    // Fetch trending
    fetch('https://api.coingecko.com/api/v3/search/trending')
      .then(res => res.json())
      .then(data => setTrending(data.coins.map(c => c.item)));
    // Fetch top gainers (sort by 24h change)
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false')
      .then(res => res.json())
      .then(data => {
        const sorted = [...data].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
        setGainers(sorted.slice(0, 7));
      });
    // Fetch 1 day chart data for BTC, ETH, and SOL
    fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1')
      .then(res => res.json())
      .then(data => setBtcData(data.prices || []));
    fetch('https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=1')
      .then(res => res.json())
      .then(data => setEthData(data.prices || []));
    fetch('https://api.coingecko.com/api/v3/coins/solana/market_chart?vs_currency=usd&days=1')
      .then(res => res.json())
      .then(data => setSolData(data.prices || []));
    // Fetch global data
    fetch('https://api.coingecko.com/api/v3/global')
      .then(res => res.json())
      .then(data => setGlobalData(data.data));
  }, [category]);

  const filteredCoins = coins.filter(coin => coin.name.toLowerCase().includes(search.toLowerCase()));

  const handleSort = (key) => {
    setSort(prev => ({
      key,
      order: prev.key === key && prev.order === 'desc' ? 'asc' : 'desc',
    }));
  };

  const handlePage = (newPage) => {
    setPage(newPage);
  };

  const handleCoinClick = (coin) => {
    navigate(`/analytics/chart/${coin.id}`, { state: { coin } });
  };

  const handleBellClick = (coinId) => {
    setBellActive(prev => ({ ...prev, [coinId]: !prev[coinId] }));
  };

  const handleBellClickTrending = (coinId) => {
    setBellActiveTrending(prev => ({ ...prev, [coinId]: !prev[coinId] }));
  };

  const handleBellClickGainers = (coinId) => {
    setBellActiveGainers(prev => ({ ...prev, [coinId]: !prev[coinId] }));
  };

  // Sort and slice coins for main list
  const sortedCoins = [...filteredCoins].sort((a, b) => {
    const { key, order } = sort;
    let valA, valB;
    if (key === 'market_cap') {
      valA = a.market_cap;
      valB = b.market_cap;
    } else if (key === 'price') {
      valA = a.current_price;
      valB = b.current_price;
    } else if (key === 'percent') {
      valA = a.price_change_percentage_24h;
      valB = b.price_change_percentage_24h;
    }
    if (order === 'desc') return valB - valA;
    return valA - valB;
  });
  const pagedCoins = sortedCoins.slice(0, 30);

  // Map chart data for recharts
  const btcChartData = btcData.map(([t, p]) => ({ t, price: p }));
  const ethChartData = ethData.map(([t, p]) => ({ t, price: p }));
  const solChartData = solData.map(([t, p]) => ({ t, price: p }));
  const fallbackData = [
    { t: 1, price: 1 },
    { t: 2, price: 2 },
    { t: 3, price: 1.5 },
    { t: 4, price: 2.5 },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <AppHeader />
      <main className="relative z-10 py-8">
        <div className="container mx-auto px-6">
          {/* Top Data Line */}
          {globalData && (
            <div className="flex flex-wrap items-center gap-4 mb-6 text-slate-400 text-base font-medium">
              <span>Market Cap: <span className="text-white font-bold">${Number(globalData.total_market_cap.usd).toLocaleString(undefined, {maximumFractionDigits: 3, notation: 'compact'})}</span> <span className={globalData.market_cap_change_percentage_24h_usd < 0 ? 'text-red-500' : 'text-green-500'}>{globalData.market_cap_change_percentage_24h_usd < 0 ? '▼' : '▲'} {Math.abs(globalData.market_cap_change_percentage_24h_usd).toFixed(1)}%</span></span>
              <span>24h Vol: <span className="text-white font-bold">${Number(globalData.total_volume.usd).toLocaleString(undefined, {maximumFractionDigits: 3, notation: 'compact'})}</span></span>
              <span>Dominance: <span className="text-white font-bold">BTC {globalData.market_cap_percentage.btc.toFixed(1)}%</span> <span className="text-white font-bold">ETH {globalData.market_cap_percentage.eth.toFixed(2)}%</span></span>
              <span>⟠ Gas: <span className="text-white font-bold">{globalData.eth_gas_price?.toFixed(3) ?? '-'} GWEI</span></span>
            </div>
          )}
          <div className="glass-card rounded-xl p-8 mb-8">
            <h1 className="text-3xl font-bold mb-6 text-white">Analytics</h1>
            {/* Mini Charts Row - Responsive */}
            <div className="flex flex-col md:flex-row gap-6 w-full mb-12">
              {/* BTC Card */}
              <div className="flex-1 bg-slate-900/60 rounded-xl p-4 shadow-lg border border-cyan-500/20 flex flex-col justify-between mb-4 md:mb-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-slate-100 font-bold text-lg">BTC</span>
                  <span className="text-cyan-300 font-semibold text-base">${btcData.length ? btcData[btcData.length-1][1].toLocaleString(undefined, {maximumFractionDigits:2}) : '-'}</span>
                </div>
                <div className="w-full flex items-center" style={{height: '90px'}}>
                  <Recharts.ResponsiveContainer width="100%" height="100%">
                    <Recharts.LineChart data={btcChartData.length ? btcChartData : fallbackData} margin={{ left: 0, right: 32, top: 8, bottom: 8 }}>
                      <Recharts.XAxis dataKey="t" hide />
                      <Recharts.YAxis dataKey="price" width={40} tick={{ fill: '#f7931a', fontSize: 10 }} orientation="right" tickLine={false} axisLine={false} domain={['dataMin', 'dataMax']} tickFormatter={v => v.toFixed(2)} />
                      <Recharts.Line type="monotone" dataKey="price" stroke="#f7931a" dot={false} strokeWidth={2} />
                    </Recharts.LineChart>
                  </Recharts.ResponsiveContainer>
                </div>
              </div>
              {/* ETH Card */}
              <div className="flex-1 bg-slate-900/60 rounded-xl p-4 shadow-lg border border-cyan-500/20 flex flex-col justify-between mb-4 md:mb-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-slate-100 font-bold text-lg">ETH</span>
                  <span className="text-purple-300 font-semibold text-base">${ethData.length ? ethData[ethData.length-1][1].toLocaleString(undefined, {maximumFractionDigits:2}) : '-'}</span>
                </div>
                <div className="w-full flex items-center" style={{height: '90px'}}>
                  <Recharts.ResponsiveContainer width="100%" height="100%">
                    <Recharts.LineChart data={ethChartData.length ? ethChartData : fallbackData} margin={{ left: 0, right: 32, top: 8, bottom: 8 }}>
                      <Recharts.XAxis dataKey="t" hide />
                      <Recharts.YAxis dataKey="price" width={40} tick={{ fill: '#8a2be2', fontSize: 10 }} orientation="right" tickLine={false} axisLine={false} domain={['dataMin', 'dataMax']} tickFormatter={v => v.toFixed(2)} />
                      <Recharts.Line type="monotone" dataKey="price" stroke="#8a2be2" dot={false} strokeWidth={2} />
                    </Recharts.LineChart>
                  </Recharts.ResponsiveContainer>
                </div>
              </div>
              {/* SOL Card */}
              <div className="flex-1 bg-slate-900/60 rounded-xl p-4 shadow-lg border border-cyan-500/20 flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-slate-100 font-bold text-lg">SOL</span>
                  <span className="text-green-300 font-semibold text-base">${solData.length ? solData[solData.length-1][1].toLocaleString(undefined, {maximumFractionDigits:2}) : '-'}</span>
                </div>
                <div className="w-full flex items-center" style={{height: '90px'}}>
                  <Recharts.ResponsiveContainer width="100%" height="100%">
                    <Recharts.LineChart data={solChartData.length ? solChartData : fallbackData} margin={{ left: 0, right: 32, top: 8, bottom: 8 }}>
                      <Recharts.XAxis dataKey="t" hide />
                      <Recharts.YAxis dataKey="price" width={40} tick={{ fill: '#00ff00', fontSize: 10 }} orientation="right" tickLine={false} axisLine={false} domain={['dataMin', 'dataMax']} tickFormatter={v => v.toFixed(2)} />
                      <Recharts.Line type="monotone" dataKey="price" stroke="#00ff00" dot={false} strokeWidth={2} />
                    </Recharts.LineChart>
                  </Recharts.ResponsiveContainer>
                </div>
              </div>
            </div>
            {/* Trending and Top Gainers Row - Responsive */}
            <div className="flex flex-col md:flex-row gap-6 w-full mb-12">
              <div className="flex-1 bg-slate-900/60 rounded-xl p-4 shadow-lg border border-cyan-500/20 mb-4 md:mb-0">
                <h2 className="text-lg font-semibold text-cyan-300 mb-2">🔥 Trending</h2>
                <ul className="space-y-2">
                  {trending.slice(0, 5).map((coin, idx) => (
                    <li key={coin.id} className="flex items-center gap-3 p-2 rounded-lg glass border border-cyan-400/20 justify-between cursor-pointer" onClick={() => handleCoinClick({ id: coin.id, name: coin.name, image: coin.small })}>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400 font-bold">{idx + 1}</span>
                        <img src={coin.small} alt={coin.name} className="w-6 h-6 rounded-full" />
                        <span className="text-white text-base font-medium">{coin.name}</span>
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); handleBellClickTrending(coin.id); }}
                        className="ml-2 focus:outline-none"
                        aria-label="Set notification"
                      >
                        <Bell className={`w-5 h-5 ${bellActiveTrending[coin.id] ? 'fill-cyan-400 text-cyan-400' : 'text-cyan-400'}`} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 bg-slate-900/60 rounded-xl p-4 shadow-lg border border-green-500/20">
                <h2 className="text-lg font-semibold text-green-300 mb-2">🚀 Top Gainers (24h)</h2>
                <ul className="space-y-2">
                  {gainers.slice(0, 5).map((coin, idx) => (
                    <li key={coin.id} className="flex items-center gap-3 p-2 rounded-lg glass border border-green-400/20 justify-between cursor-pointer" onClick={() => handleCoinClick(coin)}>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400 font-bold">{idx + 1}</span>
                        <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" />
                        <span className="text-white text-base font-medium">{coin.name}</span>
                        <span className="text-green-400 text-xs font-bold">{coin.price_change_percentage_24h?.toFixed(2)}%</span>
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); handleBellClickGainers(coin.id); }}
                        className="ml-2 focus:outline-none"
                        aria-label="Set notification"
                      >
                        <Bell className={`w-5 h-5 ${bellActiveGainers[coin.id] ? 'fill-green-400 text-green-400' : 'text-green-400'}`} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* Category Buttons */}
            <div className="flex flex-wrap gap-3 mb-4 justify-center">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                    category === cat.value
                      ? 'visit-gradient hover:opacity-90 text-white font-medium shadow-lg hover-neon-glow backdrop-blur-sm border border-cyan-500/40'
                      : 'glass border-2 border-emerald-500/40 text-slate-300 hover:text-white hover:border-green-500/50 hover-glass hover:shadow-emerald-400/20 hover:shadow-lg backdrop-blur-sm crypto-neon-outline'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <Input
                type="text"
                placeholder="Search coins..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-slate-900/60 border-slate-700 text-white placeholder-slate-400 focus:border-cyan-500"
              />
            </div>
            {/* Main Token List */}
            <div className="glass-card rounded-xl p-8">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-slate-400 text-sm">
                      <th className="text-left p-2">#</th>
                      <th className="text-left p-2">Name</th>
                      <th className="text-right p-2 cursor-pointer" onClick={() => handleSort('price')}>
                        Price {sort.key === 'price' && (sort.order === 'desc' ? '↓' : '↑')}
                      </th>
                      <th className="text-right p-2 cursor-pointer" onClick={() => handleSort('percent')}>
                        24h % {sort.key === 'percent' && (sort.order === 'desc' ? '↓' : '↑')}
                      </th>
                      <th className="text-right p-2 cursor-pointer" onClick={() => handleSort('market_cap')}>
                        Market Cap {sort.key === 'market_cap' && (sort.order === 'desc' ? '↓' : '↑')}
                      </th>
                      <th className="text-right p-2">Notify</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedCoins.map((coin, idx) => (
                      <tr key={coin.id} className="border-t border-slate-800 hover:bg-slate-800/50 cursor-pointer" onClick={() => handleCoinClick(coin)}>
                        <td className="p-2 text-slate-400">{idx + 1}</td>
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" />
                            <span className="text-white font-medium">{coin.name}</span>
                          </div>
                        </td>
                        <td className="p-2 text-right text-white">${coin.current_price?.toLocaleString()}</td>
                        <td className={`p-2 text-right ${coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {coin.price_change_percentage_24h?.toFixed(2)}%
                        </td>
                        <td className="p-2 text-right text-slate-400">${coin.market_cap?.toLocaleString()}</td>
                        <td className="p-2 text-right">
                          <button
                            onClick={e => { e.stopPropagation(); handleBellClick(coin.id); }}
                            className="focus:outline-none"
                            aria-label="Set notification"
                          >
                            <Bell className={`w-5 h-5 ${bellActive[coin.id] ? 'fill-cyan-400 text-cyan-400' : 'text-cyan-400'}`} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;