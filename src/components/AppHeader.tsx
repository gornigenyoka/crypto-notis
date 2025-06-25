import { Bell, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { createPortal } from "react-dom";

const AppHeader = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mobile Menu Portal Component
  const MobileMenu = () => {
    if (!mobileMenuOpen) return null;

    return createPortal(
      <div className="fixed inset-0 z-[99999]">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/90"
          onClick={() => setMobileMenuOpen(false)}
        />
        
        {/* Menu Container */}
        <div className="absolute left-0 top-0 h-full w-80 max-w-[80vw] bg-[#0f1419] border-r border-slate-600/50 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-600/30">
            <h2 className="text-xl font-bold text-white">Menu</h2>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
          
          {/* Menu Items */}
          <nav className="p-6 space-y-4">
            <Link 
              to="/" 
              className={`block w-full p-4 rounded-lg transition-all ${
                location.pathname === '/' 
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="text-lg font-medium">Platforms</span>
            </Link>
            
            <a 
              href="#" 
              className="block w-full p-4 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="text-lg font-medium">Notifications</span>
            </a>
            
            <Link 
              to="/analytics" 
              className={`block w-full p-4 rounded-lg transition-all ${
                location.pathname === '/analytics' 
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="text-lg font-medium">Analytics</span>
            </Link>
            
            <a 
              href="#" 
              className="block w-full p-4 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="text-lg font-medium">Education</span>
            </a>
            
            <div className="pt-4">
              <Button 
                variant="outline" 
                className="w-full glass border-slate-400/30 text-white hover:bg-slate-500/20 hover-neon-glow"
                onClick={() => setMobileMenuOpen(false)}
              >
                Connect Wallet
              </Button>
            </div>
          </nav>
        </div>
      </div>,
      document.body
    );
  };

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
          <button 
            className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400" 
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-7 h-7 text-white" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Portal */}
      <MobileMenu />
    </header>
  );
};

export default AppHeader;
