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
    <div className="min-h-screen bg-gradient-calm">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-md border-b border-border shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Heart className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold text-foreground">MindCare Platform</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome, <span className="font-medium text-foreground">{currentUser.name}</span>
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-card/50 backdrop-blur-sm border-r border-border min-h-[calc(100vh-4rem)]">
          <div className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.path} to={item.path}>
                  <div
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-smooth ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-soft'
                        : 'hover:bg-accent text-foreground'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;