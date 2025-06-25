import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const AppHeader = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="relative z-10 glass border-b border-slate-500/20">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 crypto-gradient rounded-full flex items-center justify-center animate-glow-pulse">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <Link to="/" className="text-2xl font-bold text-white hover:text-cyan-300 transition-colors">
              Crypto-Notis
            </Link>
          </div>
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`transition-colors ${location.pathname === '/' ? 'text-cyan-400' : 'text-slate-300 hover:text-white'}`}
            >
              Platforms
            </Link>
            <a href="#" className="text-slate-300 hover:text-white transition-colors">Notifications</a>
            <Link 
              to="/analytics" 
              className={`transition-colors ${location.pathname === '/analytics' ? 'text-cyan-400' : 'text-slate-300 hover:text-white'}`}
            >
              Analytics
            </Link>
            <a href="#" className="text-slate-300 hover:text-white transition-colors">Education</a>
            <Button variant="outline" className="glass border-slate-400/30 text-white hover:bg-slate-500/20 hover-neon-glow">
              Connect Wallet
            </Button>
          </nav>
          {/* Mobile Hamburger */}
          <button className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="w-7 h-7 text-white" />
          </button>
        </div>
      </div>
      {/* Mobile Menu Overlay and Dropdown */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/90" onClick={() => setMobileMenuOpen(false)} />
          {/* Menu */}
          <div className="fixed left-0 top-0 h-full w-4/5 max-w-xs bg-[#10151f] border-r border-slate-500/20 shadow-lg p-6 flex flex-col space-y-4 z-50">
            <Link 
              to="/" 
              className={`w-full transition-colors ${location.pathname === '/' ? 'text-cyan-400' : 'text-slate-300 hover:text-white'} text-lg font-medium`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Platforms
            </Link>
            <a href="#" className="w-full text-slate-300 hover:text-white transition-colors text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Notifications</a>
            <Link 
              to="/analytics" 
              className={`w-full transition-colors ${location.pathname === '/analytics' ? 'text-cyan-400' : 'text-slate-300 hover:text-white'} text-lg font-medium`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Analytics
            </Link>
            <a href="#" className="w-full text-slate-300 hover:text-white transition-colors text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Education</a>
            <Button variant="outline" className="w-full glass border-slate-400/30 text-white hover:bg-slate-500/20 hover-neon-glow mt-2" onClick={() => setMobileMenuOpen(false)}>
              Connect Wallet
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default AppHeader;
