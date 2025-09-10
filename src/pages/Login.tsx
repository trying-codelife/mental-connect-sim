import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { users } from '@/data/users';
import { Heart, Users, UserCheck, Shield } from 'lucide-react';

const Login: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    if (selectedUserId) {
      login(selectedUserId);
      const user = users.find(u => u.id === selectedUserId);
      if (user) {
        switch (user.role) {
          case 'student':
            navigate('/student');
            break;
          case 'counselor':
            navigate('/counselor');
            break;
          case 'admin':
            navigate('/admin');
            break;
          default:
            navigate('/');
        }
      }
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'student':
        return <Users className="h-4 w-4" />;
      case 'counselor':
        return <UserCheck className="h-4 w-4" />;
      case 'admin':
        return <Shield className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student':
        return 'text-primary';
      case 'counselor':
        return 'text-success';
      case 'admin':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-calm flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Heart className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Mind Mantra</h1>
          <p className="text-muted-foreground">
            Supporting student mental health and wellbeing
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-card border-0 bg-card/80 backdrop-blur-md">
          <CardHeader className="text-center">
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>
              Select a user profile to simulate login for this demo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Choose User Profile
              </label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Select a user to login as..." />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border">
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      <div className="flex items-center space-x-2">
                        <span className={getRoleColor(user.role)}>
                          {getRoleIcon(user.role)}
                        </span>
                        <span>{user.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({user.role})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleLogin} 
              disabled={!selectedUserId}
              className="w-full bg-gradient-primary border-0 shadow-soft hover:shadow-glow transition-smooth"
              size="lg"
            >
              Login to Platform
            </Button>

            {/* Demo Info */}
            <div className="mt-6 p-4 bg-accent/50 rounded-lg">
              <p className="text-sm text-accent-foreground font-medium mb-2">
                Demo Accounts Available:
              </p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Users className="h-3 w-3 text-primary" />
                  <span>Students: Alex, Sarah, Marcus</span>
                </div>
                <div className="flex items-center space-x-2">
                  <UserCheck className="h-3 w-3 text-success" />
                  <span>Counselors: Dr. Carter, Dr. Rodriguez, Dr. Thompson</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-3 w-3 text-warning" />
                  <span>Admin: Admin User</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;