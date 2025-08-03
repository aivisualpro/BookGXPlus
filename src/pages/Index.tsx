import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StickyHeader } from "@/components/dashboard/StickyHeader";
import { UsersPage } from "@/components/dashboard/UsersPage";
import { LoginModal } from "@/components/dashboard/LoginModal";
import { fetchUsersData, User } from "@/utils/usersData";

const Index = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'users'>('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Load users data and check authentication on mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const usersData = await fetchUsersData();
        setUsers(usersData);
        
        // Check for existing dashboard authentication
        const authCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('dashboard_auth='));
        
        if (authCookie) {
          const authData = authCookie.split('=')[1];
          try {
            const userData = JSON.parse(decodeURIComponent(authData));
            const foundUser = usersData.find(u => 
              u.Name === userData.Name && 
              u.Role === userData.Role
            );
            
            if (foundUser) {
              setUser(foundUser);
              setIsAuthenticated(true);
            }
          } catch (error) {
            console.error('Error parsing auth cookie:', error);
          }
        }
      } catch (error) {
        console.error('Error loading users data:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  const handleNavigate = (page: 'home' | 'users') => {
    if (!isAuthenticated && page === 'home') {
      setShowLoginModal(true);
      return;
    }
    setCurrentPage(page);
  };

  const handleLoginSuccess = (loggedInUser: User) => {
    // Set cookie for 24 hours
    const expires = new Date();
    expires.setTime(expires.getTime() + (24 * 60 * 60 * 1000)); // 24 hours
    const userData = encodeURIComponent(JSON.stringify({
      Name: loggedInUser.Name,
      Role: loggedInUser.Role
    }));
    document.cookie = `dashboard_auth=${userData}; expires=${expires.toUTCString()}; path=/`;
    
    setUser(loggedInUser);
    setIsAuthenticated(true);
    setShowLoginModal(false);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setCurrentPage('home');
  };

  const handleLoginClose = () => {
    setShowLoginModal(false);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="glass rounded-xl p-8 text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login modal if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-dark relative overflow-hidden">
        <div className="relative z-10 p-6">
          <div className="glass rounded-xl p-8 text-center">
            <div className="flex flex-col items-center space-y-6">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">BX</span>
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-foreground">BookGX Plus</h1>
                <p className="text-muted-foreground max-w-md">
                  Welcome to the dashboard. Please login to continue.
                </p>
              </div>
              <button
                onClick={() => setShowLoginModal(true)}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Login to Dashboard
              </button>
            </div>
          </div>
        </div>

        <LoginModal
          isOpen={showLoginModal}
          onClose={handleLoginClose}
          onSuccess={handleLoginSuccess}
          users={users}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      <StickyHeader 
        currentPage={currentPage} 
        onNavigate={handleNavigate} 
        user={user}
        onLogout={handleLogout}
      />
      
      {currentPage === 'home' ? (
        <DashboardLayout user={user} />
      ) : (
        <UsersPage />
      )}

      <LoginModal
        isOpen={showLoginModal}
        onClose={handleLoginClose}
        onSuccess={handleLoginSuccess}
        users={users}
      />
    </div>
  );
};

export default Index;
