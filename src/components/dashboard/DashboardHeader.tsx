import { Clock, Activity, Database, CheckCircle, FileText, Heart, User, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";

interface DashboardHeaderProps {
  lastUpdated?: Date;
  recordCount?: number;
  dataSource?: 'google_sheets' | 'mock_data';
  onRefresh?: () => void;
  onFilterClick?: () => void;
  loading?: boolean;
  businessHealth?: number;
  onNavigateHome?: () => void;
  user?: {
    Name: string;
    Role: string;
  };
  onNavigateUsers?: () => void;
  onLogout?: () => void;
}

// Enhanced Heart Animation Component
const HeartAnimation = ({ isHealthy, size = 40 }: { isHealthy: boolean; size?: number }) => {
  return (
    <div className="relative">
      {/* Multiple layered hearts for depth effect */}
      <div className="absolute inset-0">
        {/* Background glow */}
        <div 
          className={`absolute inset-0 rounded-full blur-md ${
            isHealthy ? 'bg-green-500/30' : 'bg-red-500/30'
          } animate-ping`}
          style={{ animationDuration: '2s' }}
        />
        
        {/* Outer pulse ring */}
        <div 
          className={`absolute inset-0 rounded-full border-2 ${
            isHealthy ? 'border-green-400' : 'border-red-400'
          } animate-ping`}
          style={{ animationDuration: '1.5s', animationDelay: '0.5s' }}
        />
        
        {/* Middle pulse ring */}
        <div 
          className={`absolute inset-1 rounded-full border ${
            isHealthy ? 'border-green-300' : 'border-red-300'
          } animate-ping`}
          style={{ animationDuration: '1.2s', animationDelay: '0.3s' }}
        />
      </div>
      
      {/* Main heart with multiple effects */}
      <div className="relative">
        {/* Heart shadow */}
        <Heart 
          className={`absolute inset-0 w-${size/10} h-${size/10} ${
            isHealthy ? 'text-green-600' : 'text-red-600'
          } blur-sm`}
          fill={isHealthy ? '#059669' : '#dc2626'}
          style={{ transform: 'translate(1px, 1px)' }}
        />
        
        {/* Main animated heart */}
        <Heart 
          className={`relative w-${size/10} h-${size/10} ${
            isHealthy ? 'text-green-500' : 'text-red-500'
          } animate-pulse drop-shadow-lg`}
          style={{ 
            animationDuration: '1.2s',
            filter: isHealthy ? 'drop-shadow(0 0 8px #10b981)' : 'drop-shadow(0 0 8px #ef4444)'
          }}
          fill={isHealthy ? '#10b981' : '#ef4444'}
        />
        
        {/* Inner glow effect */}
        <div 
          className={`absolute inset-2 rounded-full ${
            isHealthy ? 'bg-green-400/20' : 'bg-red-400/20'
          } animate-pulse`}
          style={{ animationDuration: '0.8s' }}
        />
        
        {/* Sparkle effects for healthy hearts */}
        {isHealthy && (
          <>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping" 
                 style={{ animationDuration: '1s', animationDelay: '0.2s' }} />
            <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping" 
                 style={{ animationDuration: '1.3s', animationDelay: '0.4s' }} />
            <div className="absolute top-1 -left-1 w-1 h-1 bg-purple-400 rounded-full animate-ping" 
                 style={{ animationDuration: '0.9s', animationDelay: '0.6s' }} />
          </>
        )}
      </div>
      

    </div>
  );
};

export function DashboardHeader({ 
  lastUpdated = new Date(), 
  recordCount, 
  dataSource, 
  onRefresh, 
  onFilterClick,
  loading = false,
  businessHealth = 58,
  onNavigateHome,
  user,
  onNavigateUsers,
  onLogout
}: DashboardHeaderProps) {
  const isHealthy = businessHealth >= 80;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  
  const handleMenuToggle = (event: React.MouseEvent) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + 8,
      right: window.innerWidth - rect.right
    });
    setIsMenuOpen(!isMenuOpen);
  };

  // Render dropdown using Portal
  const renderDropdown = () => {
    if (!isMenuOpen) return null;

    return createPortal(
      <>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 z-[99998] bg-black/20 animate-in fade-in duration-200" 
          onClick={() => setIsMenuOpen(false)}
        />
        {/* Dropdown */}
        <div 
          className="fixed z-[99999] bg-background/95 backdrop-blur-sm rounded-lg border border-glass-border shadow-2xl animate-in slide-in-from-top-2 duration-300"
          style={{
            top: menuPosition.top,
            right: menuPosition.right
          }}
        >
          <div className="py-2 min-w-[12rem]">
            <button
              onClick={() => {
                onNavigateUsers?.();
                setIsMenuOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-white hover:bg-primary/20 transition-all duration-200 flex items-center space-x-2"
            >
              <User className="w-4 h-4" />
              <span>Users</span>
            </button>
            <div className="border-t border-border/20 my-1"></div>
            <button
              onClick={() => {
                onLogout?.();
                setIsMenuOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-white hover:bg-red-500/20 transition-all duration-200 flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout ({user?.Name} - {user?.Role})</span>
            </button>
          </div>
        </div>
      </>,
      document.body
    );
  };
  
  return (
    <div className="sticky top-0 z-50 glass rounded-xl p-2 border border-glass-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          {/* Animated Logo */}
          <div className="flex items-center">
            <div className="relative w-10 h-10 mr-3">
              {/* Animated Book Icon */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/60 rounded-lg animate-pulse">
                <div className="absolute inset-1 bg-background/90 rounded-md flex items-center justify-center">
                  <svg 
                    className="w-6 h-6 text-primary animate-bounce" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M21,4H3A2,2 0 0,0 1,6V19A2,2 0 0,0 3,21H21A2,2 0 0,0 23,19V6A2,2 0 0,0 21,4M3,19V6H8V19H3M10,19V6H21V19H10Z" />
                  </svg>
                </div>
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 bg-primary/20 rounded-lg blur-sm animate-ping"></div>
            </div>
            
            {/* BookGX Plus Title */}
            <button
              onClick={onNavigateHome}
              className="text-xl font-bold text-white hover:text-primary/80 transition-colors duration-200 cursor-pointer"
            >
              BookGX Plus
            </button>
          </div>
          
          {/* Business Health Section */}
          <div className="flex items-center gap-3">
            <HeartAnimation 
              size={40} 
              isHealthy={isHealthy}
            />
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-wide">
                Business Health
              </span>
              <span className={`text-sm font-bold ${isHealthy ? 'text-green-500' : 'text-red-500'} drop-shadow-sm`}>
                {businessHealth}%
              </span>
              {/* Status indicator */}
              <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                isHealthy 
                  ? 'bg-green-500/20 text-green-400 border border-green-400/30' 
                  : 'bg-red-500/20 text-red-400 border border-red-400/30'
              }`}>
                {isHealthy ? 'Excellent' : 'Needs Attention'}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Data Source and Record Count */}
          <div className="hidden lg:flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-xs">
              <Database className="w-3 h-3 text-primary" />
              <span className="text-muted-foreground">
                {dataSource === 'google_sheets' ? 'Google Sheets' : 'Demo Data'}
              </span>
              {dataSource === 'google_sheets' && (
                <CheckCircle className="w-3 h-3 text-accent" />
              )}
            </div>
            
            {recordCount !== undefined && (
              <div className="flex items-center space-x-2 px-2 py-0.5 bg-primary/10 rounded-full">
                <span className="text-xs font-medium text-primary">
                  {recordCount.toLocaleString()} records
                </span>
              </div>
            )}
          </div>

          {/* Last Updated and Live Status */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                dataSource === 'google_sheets' ? 'bg-accent' : 'bg-warning'
              }`} />
              <span className={`text-xs font-medium ${
                dataSource === 'google_sheets' ? 'text-accent' : 'text-warning'
              }`}>
                {dataSource === 'google_sheets' ? 'Live Data' : 'Demo Mode'}
              </span>
              <Activity className={`w-3 h-3 ${
                dataSource === 'google_sheets' ? 'text-accent' : 'text-warning'
              }`} />
            </div>
          </div>

          {/* Burger Menu */}
          <div className="relative">
            <button
              onClick={handleMenuToggle}
              className="p-2 text-white hover:text-primary/80 transition-all duration-300 transform hover:scale-110"
            >
              <div className="relative">
                <Menu className={`w-5 h-5 transition-all duration-300 ${isMenuOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`} />
                <X className={`w-5 h-5 absolute top-0 left-0 transition-all duration-300 ${isMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} />
              </div>
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && renderDropdown()}
          </div>
        </div>
      </div>
    </div>
  );
}

// Keep the old ConnectionStatus for backward compatibility
export function ConnectionStatus(props: DashboardHeaderProps) {
  return <DashboardHeader {...props} />;
}