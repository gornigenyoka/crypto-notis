
interface HeroSectionProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const HeroSection = ({ searchTerm, onSearchChange }: HeroSectionProps) => {
  return (
    <section className="relative z-10 py-8 md:py-12 text-center">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
            Navigate the
            <span className="crypto-gradient-text">
              {" "}Crypto Ecosystem
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-6 leading-relaxed">
            Stay ahead with real-time crypto notifications, discover premium platforms, and never miss an opportunity. 
            Your crypto intelligence hub.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
