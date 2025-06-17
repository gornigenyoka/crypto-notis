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

  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        const data = await loadPlatforms();
        setPlatforms(data);
      } catch (error) {
        console.error('Error loading platforms:', error);
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
