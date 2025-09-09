import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, LogOut, Home, Calendar, BookOpen, MessageCircle, Users, Settings, BarChart3 } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!currentUser) {
    return <>{children}</>;
  }

  const getNavigationItems = () => {
    switch (currentUser.role) {
      case 'student':
        return [
          { path: '/student', icon: Home, label: 'Dashboard' },
          { path: '/student/resources', icon: BookOpen, label: 'Resources' },
          { path: '/student/book', icon: Calendar, label: 'Book Appointment' },
          { path: '/student/forum', icon: MessageCircle, label: 'Peer Forum' },
          { path: '/student/chatbot', icon: Heart, label: 'AI Support' }
        ];
      case 'counselor':
        return [
          { path: '/counselor', icon: Home, label: 'Dashboard' },
          { path: '/counselor/bookings', icon: Calendar, label: 'Manage Bookings' }
        ];
      case 'admin':
        return [
          { path: '/admin', icon: BarChart3, label: 'Dashboard' },
          { path: '/admin/counselors', icon: Users, label: 'Counselors' },
          { path: '/admin/resources', icon: BookOpen, label: 'Resources' }
        ];
      default:
        return [];
    }
  };

  const navItems = getNavigationItems();

  return (
    <div className="min-h-screen bg-gradient-calm relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-glow opacity-30 animate-float"></div>
      
      {/* Header */}
      <header className="relative z-10 glass-effect border-b border-white/10 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Heart className="h-8 w-8 text-primary animate-glow" />
                <div className="absolute inset-0 h-8 w-8 text-primary opacity-20 animate-ping"></div>
              </div>
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                MindCare Platform
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome, <span className="font-medium text-foreground">{currentUser.name}</span>
              </span>
              <Button variant="glass" size="sm" onClick={handleLogout} className="hover-lift">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex max-w-7xl mx-auto relative z-10">
        {/* Sidebar Navigation */}
        <nav className="w-64 glass-effect border-r border-white/10 min-h-[calc(100vh-4rem)] backdrop-blur-md">
          <div className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.path} to={item.path}>
                  <div
                    className={`group flex items-center space-x-3 px-3 py-3 rounded-xl transition-smooth hover-lift ${
                      isActive
                        ? 'bg-gradient-primary text-primary-foreground shadow-glow'
                        : 'hover:bg-white/10 text-foreground hover:shadow-soft'
                    }`}
                  >
                    <Icon className={`h-5 w-5 transition-smooth ${isActive ? 'animate-glow' : 'group-hover:scale-110'}`} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6 relative">
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;