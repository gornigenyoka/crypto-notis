import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

const AppHeader = () => {
  const location = useLocation();

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
          <nav className="flex items-center space-x-6">
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
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
