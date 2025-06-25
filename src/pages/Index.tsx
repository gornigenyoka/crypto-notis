import { useState, useEffect } from "react";
import AnimatedBackground from "@/components/AnimatedBackground";
import AppHeader from "@/components/AppHeader";
import HeroSection from "@/components/HeroSection";
import QuickStats from "@/components/QuickStats";
import PlatformGrid from "@/components/PlatformGrid";
import { loadPlatforms, Platform } from "@/data/platforms";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        console.log('Starting to load platforms...');
        const data = await loadPlatforms();
        console.log('Platforms loaded:', data.length, 'platforms');
        setPlatforms(data);
      } catch (error) {
        console.error('Error loading platforms:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchPlatforms();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <AnimatedBackground />
        <AppHeader />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="glass-card rounded-xl p-8 text-center">
            <p className="text-slate-300 text-lg">Loading platforms...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <AnimatedBackground />
        <AppHeader />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="glass-card rounded-xl p-8 text-center">
            <p className="text-red-300 text-lg">Error loading platforms: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <AppHeader />
      <HeroSection 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      <QuickStats />
      <PlatformGrid 
        platforms={platforms}
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onSearchTermChange={setSearchTerm}
      />
    </div>
  );
};

export default Index;
