import { useState } from "react";
import { Coins, Zap, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AnimatedBackground from "@/components/AnimatedBackground";
import AppHeader from "@/components/AppHeader";

const MoonmapGrid = () => {
  const [ownedLand, setOwnedLand] = useState<number[]>([]);
  const [selectedSquares, setSelectedSquares] = useState<number[]>([]);
  const [basePrice] = useState(0.001);
  
  const gridSize = 40; // Reduced for better square visibility
  const totalSquares = gridSize * gridSize;
  
  const handleSquareClick = (squareId: number) => {
    if (ownedLand.includes(squareId)) return;
    
    setSelectedSquares(prev => 
      prev.includes(squareId) 
        ? prev.filter(id => id !== squareId)
        : [...prev, squareId]
    );
  };

  const calculatePrice = () => {
    const baseTotal = selectedSquares.length * basePrice;
    if (selectedSquares.length >= 50) return baseTotal * 0.8;
    if (selectedSquares.length >= 10) return baseTotal * 0.9;
    return baseTotal;
  };

  const handlePurchase = () => {
    console.log(`Purchasing ${selectedSquares.length} squares for ${calculatePrice()} SOL`);
    setOwnedLand(prev => [...prev, ...selectedSquares]);
    setSelectedSquares([]);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <AppHeader />
      
      <main className="relative z-10 py-8">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Own Your Piece of the <span className="crypto-gradient-text">Moon</span>
            </h1>
            <p className="text-slate-300 text-lg">
              Purchase land on our digital moonmap and earn rewards!
            </p>
          </div>

          {/* Main Moon Grid */}
          <Card className="glass-card border-purple-500/20 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Zap className="w-5 h-5 mr-2 text-purple-400" />
                Digital Moonmap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-full aspect-square max-w-2xl mx-auto rounded-lg overflow-hidden bg-black/70">
                {/* Moon background - using actual moon image */}
                <div className="absolute inset-0">
                  <img 
                    src="https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&fit=crop&crop=center"
                    alt="Moon surface"
                    className="w-full h-full object-cover opacity-60 grayscale"
                  />
                </div>
                
                {/* Grid overlay - now perfectly square */}
                <div className="absolute inset-0 opacity-70">
                  <div 
                    className="grid w-full h-full"
                    style={{ 
                      gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                      gridTemplateRows: `repeat(${gridSize}, 1fr)`
                    }}
                  >
                    {Array.from({ length: totalSquares }, (_, i) => {
                      const isOwned = ownedLand.includes(i);
                      const isSelected = selectedSquares.includes(i);
                      
                      return (
                        <div
                          key={i}
                          className={`border border-white/10 cursor-pointer transition-all duration-200 hover:border-white/30 aspect-square ${
                            isOwned 
                              ? 'bg-pink-400/60 border-pink-400/80 shadow-pink-400/30' 
                              : isSelected 
                                ? 'bg-cyan-400/60 border-cyan-400/80 shadow-cyan-400/30' 
                                : 'hover:bg-white/10'
                          }`}
                          onClick={() => handleSquareClick(i)}
                          title={`Square ${i} ${isOwned ? '(Owned)' : isSelected ? '(Selected)' : '(Available)'}`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
              
              {/* Legend */}
              <div className="flex items-center gap-6 mt-4 text-sm justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border border-white/40 rounded bg-black/20"></div>
                  <span className="text-slate-300">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-cyan-400/60 border border-cyan-400/80 rounded"></div>
                  <span className="text-slate-300">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-pink-400/60 border border-pink-400/80 rounded"></div>
                  <span className="text-slate-300">Owned</span>
                </div>
              </div>
              
              {/* Buy Land Button - Added below the map */}
              <div className="flex justify-center mt-6">
                <Button 
                  onClick={() => selectedSquares.length > 0 ? handlePurchase() : null}
                  disabled={selectedSquares.length === 0}
                  className="visit-gradient hover:opacity-90 text-white font-medium transition-all duration-300 px-6 py-3 text-lg shadow-lg hover-neon-glow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Coins className="w-5 h-5 mr-2" />
                  Buy Land ({selectedSquares.length} selected)
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <Card className="glass-card border-purple-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm">Total Land</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{totalSquares.toLocaleString()}</div>
                <p className="text-slate-400 text-xs">squares available</p>
              </CardContent>
            </Card>

            <Card className="glass-card border-purple-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm">Selected</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-cyan-400">{selectedSquares.length}</div>
                <p className="text-slate-400 text-xs">squares selected</p>
              </CardContent>
            </Card>

            <Card className="glass-card border-purple-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm">Owned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-pink-400">{ownedLand.length}</div>
                <p className="text-slate-400 text-xs">squares owned</p>
              </CardContent>
            </Card>

            <Card className="glass-card border-purple-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm">Price</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">
                  {calculatePrice().toFixed(4)} SOL
                </div>
                <p className="text-slate-400 text-xs">
                  {selectedSquares.length >= 10 && (
                    <span className="text-green-400">
                      {selectedSquares.length >= 50 ? '20% bulk discount!' : '10% bulk discount!'}
                    </span>
                  )}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Purchase Controls */}
          {selectedSquares.length > 0 && (
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold mb-2">Ready to Purchase</h3>
                  <p className="text-slate-300 text-sm">
                    {selectedSquares.length} squares selected • {calculatePrice().toFixed(4)} SOL total
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedSquares([])}
                    className="glass border-emerald-400/30 text-white hover:bg-emerald-500/20"
                  >
                    Clear Selection
                  </Button>
                  <Button 
                    onClick={handlePurchase}
                    className="visit-gradient hover:opacity-90 text-white font-medium hover-neon-glow"
                  >
                    <Coins className="w-4 h-4 mr-2" />
                    Buy Land
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MoonmapGrid;
