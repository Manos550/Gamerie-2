import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../lib/store';
import { Bell, Search, Users, Calendar, LogOut, Gamepad2 } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuthStore();

  return (
    <header className="bg-gaming-card border-b border-gaming-neon/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <Gamepad2 className="w-8 h-8 text-gaming-neon group-hover:animate-glow" />
              <span className="font-display font-bold text-xl text-white group-hover:text-gaming-neon transition-colors">
                GAMERIE
              </span>
            </Link>
          </div>

          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <input
                type="text"
                placeholder="Search players, teams, or games..."
                className="w-full pl-10 pr-4 py-2 rounded-full bg-gaming-dark/50 text-white placeholder-white/50 border border-gaming-neon/20 focus:border-gaming-neon focus:outline-none focus:ring-1 focus:ring-gaming-neon transition-all"
              />
            </div>
          </div>

          <nav className="flex items-center space-x-6">
            <Link 
              to="/teams" 
              className="hover:text-gaming-neon transition-colors"
              title="Teams"
            >
              <Users className="w-6 h-6" />
            </Link>
            <Link 
              to="/calendar" 
              className="hover:text-gaming-neon transition-colors"
              title="Calendar"
            >
              <Calendar className="w-6 h-6" />
            </Link>
            <Link 
              to="/notifications" 
              className="hover:text-gaming-neon transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-gaming-accent text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </Link>
            {user && (
              <>
                <Link 
                  to="/profile" 
                  className="hover:ring-2 hover:ring-gaming-neon transition-all"
                  title="Profile"
                >
                  <img
                    src={user.profileImage || 'https://via.placeholder.com/32'}
                    alt="Profile"
                    className="w-8 h-8 rounded-full border-2 border-gaming-neon/50"
                  />
                </Link>
                <button 
                  onClick={logout} 
                  className="hover:text-gaming-neon transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-6 h-6" />
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}