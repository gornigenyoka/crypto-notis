import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChartContainer } from '@/components/ui/chart';
import AnimatedBackground from '@/components/AnimatedBackground';
import AppHeader from '@/components/AppHeader';
import * as Recharts from 'recharts';

const formatDate = (timestamp) => {
  const d = new Date(timestamp);
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:00`;
};

const TIMEFRAMES = [
  { label: '7d', value: '7', api: '7', ohlc: true },
  { label: '1d', value: '1', api: '1', ohlc: true },
  { label: '1h', value: '0.0417', api: '0.0417', ohlc: false }, // 1 hour = 1/24 days
];

const ChartPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coin, setCoin] = useState(null);
  const [prices, setPrices] = useState([]);
  const [ohlc, setOhlc] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('line'); // 'line' or 'candle'
  const [timeframe, setTimeframe] = useState('7');

  const selectedTimeframe = TIMEFRAMES.find(tf => tf.api === timeframe) || TIMEFRAMES[0];
  const candlestickAvailable = selectedTimeframe.ohlc;

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`https://api.coingecko.com/api/v3/coins/${id}`)
      .then(res => res.json())
      .then(data => setCoin(data));
    fetch(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${timeframe}`)
      .then(res => res.json())
      .then(data => {
        setPrices(data.prices || []);
        setLoading(false);
      });
    // Fetch OHLC data for candlestick if supported
    if (candlestickAvailable && timeframe !== '0.0417') {
      fetch(`https://api.coingecko.com/api/v3/coins/${id}/ohlc?vs_currency=usd&days=${timeframe}`)
        .then(res => res.json())
        .then(data => setOhlc(data || []));
    } else {
      setOhlc([]);
    }
  }, [id, timeframe, candlestickAvailable]);

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
  if (!coin) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Coin not found.</div>;

  const chartData = prices.map(([t, p]) => ({ t, price: p }));
  const ohlcData = ohlc.map(([t, o, h, l, c]) => ({ t, open: o, high: h, low: l, close: c }));

  // Glowing/rounded button style
  const buttonClass = (active, disabled = false) => `px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
    active
      ? 'visit-gradient hover:opacity-90 text-white font-medium shadow-lg hover-neon-glow backdrop-blur-sm border border-cyan-500/40'
      : 'glass border-2 border-emerald-500/40 text-slate-300 hover:text-white hover:border-green-500/50 hover-glass hover:shadow-emerald-400/20 hover:shadow-lg backdrop-blur-sm crypto-neon-outline'
  } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <AppHeader />
      <main className="relative z-10 py-8">
        <div className="container mx-auto px-6">
          <button onClick={() => navigate(-1)} className="mb-4 text-cyan-400 hover:underline">← Back</button>
          <div className="glass-card rounded-xl p-8 mb-8 flex items-center gap-6 justify-between">
            <div className="flex items-center gap-6">
              <img src={coin.image.large} alt={coin.name} className="w-16 h-16 rounded-full" />
              <div>
                <h1 className="text-3xl font-bold text-white">{coin.name}</h1>
                <p className="text-slate-400 text-lg">{coin.symbol.toUpperCase()}</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-cyan-400">${coin.market_data?.current_price?.usd?.toLocaleString() ?? '-'}</div>
          </div>
          <div className="glass-card rounded-xl p-8">
            <div className="flex gap-4 mb-4">
              <button onClick={() => setView('line')} className={buttonClass(true)}>Line</button>
              <div className="ml-auto flex gap-2">
                {TIMEFRAMES.map(tf => (
                  <button
                    key={tf.value}
                    onClick={() => setTimeframe(tf.api)}
                    className={buttonClass(timeframe === tf.api)}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-4 text-white">{selectedTimeframe.label} Price Chart (USD)</h2>
            {chartData.length === 0 ? (
              <div className="text-slate-400">No price data available.</div>
            ) : (
              <ChartContainer config={{ price: { color: '#06b6d4' } }}>
                <Recharts.LineChart data={chartData} margin={{ left: 24, right: 24, top: 24, bottom: 24 }}>
                  <Recharts.XAxis dataKey="t" tickFormatter={formatDate} minTickGap={40} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Recharts.YAxis dataKey="price" tickFormatter={p => `$${p.toLocaleString()}`} width={80} tick={{ fill: '#94a3b8', fontSize: 12 }} domain={['auto', 'auto']} orientation="right" />
                  <Recharts.Tooltip formatter={p => `$${p.toLocaleString()}`} labelFormatter={formatDate} contentStyle={{ background: '#0f172a', border: '1px solid #06b6d4', color: '#fff' }} />
                  <Recharts.Line type="monotone" dataKey="price" stroke="#06b6d4" dot={false} strokeWidth={2} />
                </Recharts.LineChart>
              </ChartContainer>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChartPage; 