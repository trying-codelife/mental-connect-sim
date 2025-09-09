import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { users } from '@/data/users';
import { BarChart3, Users, BookOpen, Calendar, TrendingUp, Activity, AlertCircle, CheckCircle } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { currentUser, resources, appointments, forum } = useAuth();

  // Calculate statistics
  const stats = {
    totalStudents: users.filter(u => u.role === 'student').length,
    totalCounselors: users.filter(u => u.role === 'counselor').length,
    totalResources: resources.length,
    totalAppointments: appointments.length,
    pendingAppointments: appointments.filter(apt => apt.status === 'pending').length,
    confirmedAppointments: appointments.filter(apt => apt.status === 'confirmed').length,
    completedAppointments: appointments.filter(apt => apt.status === 'completed').length,
    totalForumPosts: forum.length,
    totalForumReplies: forum.reduce((acc, post) => acc + (post.replies?.length || 0), 0)
  };

  // Recent activity
  const recentAppointments = [...appointments]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const recentForumActivity = [...forum]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 3);

  const getStudentName = (studentId: string) => {
    const student = users.find(u => u.id === studentId);
    return student?.name || 'Unknown Student';
  };

  const getCounselorName = (counselorId: string) => {
    const counselor = users.find(u => u.id === counselorId);
    return counselor?.name || 'Unknown Counselor';
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Overview of platform usage and mental health support services
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-floating border-0 bg-gradient-primary text-primary-foreground hover-lift animate-float">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Users className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm opacity-90">Total Students</p>
                <p className="text-3xl font-bold animate-glow">{stats.totalStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-floating border-0 bg-gradient-success text-success-foreground hover-lift animate-float" style={{ animationDelay: '0.2s' }}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Users className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm opacity-90">Active Counselors</p>
                <p className="text-3xl font-bold animate-glow">{stats.totalCounselors}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect shadow-elevated hover-lift hover-glow animate-float" style={{ animationDelay: '0.4s' }}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-primary rounded-xl">
                <Calendar className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Appointments</p>
                <p className="text-3xl font-bold text-foreground">{stats.totalAppointments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect shadow-elevated hover-lift hover-glow animate-float" style={{ animationDelay: '0.6s' }}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-primary rounded-xl">
                <BookOpen className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Resources</p>
                <p className="text-3xl font-bold text-foreground">{stats.totalResources}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointment Status Breakdown */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span>Appointment Analytics</span>
            </CardTitle>
            <CardDescription>
              Current status of all appointments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-warning/10 rounded-lg border border-warning/20">
                <AlertCircle className="h-6 w-6 mx-auto mb-2 text-warning" />
                <p className="text-2xl font-bold text-warning">{stats.pendingAppointments}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
              <div className="text-center p-4 bg-success/10 rounded-lg border border-success/20">
                <CheckCircle className="h-6 w-6 mx-auto mb-2 text-success" />
                <p className="text-2xl font-bold text-success">{stats.confirmedAppointments}</p>
                <p className="text-sm text-muted-foreground">Confirmed</p>
              </div>
            </div>
            <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
              <Activity className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold text-primary">{stats.completedAppointments}</p>
              <p className="text-sm text-muted-foreground">Completed Sessions</p>
            </div>
          </CardContent>
        </Card>

        {/* Community Engagement */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Community Engagement</span>
            </CardTitle>
            <CardDescription>
              Peer support forum activity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-accent/50 rounded-lg">
                <p className="text-2xl font-bold text-foreground">{stats.totalForumPosts}</p>
                <p className="text-sm text-muted-foreground">Forum Posts</p>
              </div>
              <div className="text-center p-4 bg-accent/50 rounded-lg">
                <p className="text-2xl font-bold text-foreground">{stats.totalForumReplies}</p>
                <p className="text-sm text-muted-foreground">Total Replies</p>
              </div>
            </div>
            <div className="text-center p-4 bg-gradient-calm rounded-lg">
              <p className="text-lg font-semibold text-foreground">
                {((stats.totalForumReplies / Math.max(stats.totalForumPosts, 1)) * 100).toFixed(0)}%
              </p>
              <p className="text-sm text-muted-foreground">Engagement Rate</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Appointments */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>Recent Appointments</span>
            </CardTitle>
            <CardDescription>
              Latest appointment activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentAppointments.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No recent appointments</p>
            ) : (
              <div className="space-y-3">
                {recentAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {getStudentName(appointment.studentId)} → {getCounselorName(appointment.counselorId)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(appointment.date)} • {appointment.type}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      appointment.status === 'confirmed' ? 'bg-success/20 text-success' :
                      appointment.status === 'pending' ? 'bg-warning/20 text-warning' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Forum Activity */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-primary" />
              <span>Recent Forum Activity</span>
            </CardTitle>
            <CardDescription>
              Latest community discussions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentForumActivity.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No recent forum activity</p>
            ) : (
              <div className="space-y-3">
                {recentForumActivity.map((post) => (
                  <div key={post.id} className="p-3 bg-accent/30 rounded-lg">
                    <p className="text-sm font-medium text-foreground line-clamp-2">
                      {post.title}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-muted-foreground">
                        by {post.authorName}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>{post.replies?.length || 0} replies</span>
                        <span>•</span>
                        <span>{formatTimestamp(post.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card className="shadow-card border-0 bg-gradient-calm">
        <CardHeader>
          <CardTitle>Platform Health Status</CardTitle>
          <CardDescription>
            Overview of system performance and user engagement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-2 h-2 bg-success rounded-full mx-auto mb-1"></div>
              <p className="text-sm font-medium text-foreground">System Status</p>
              <p className="text-xs text-muted-foreground">All systems operational</p>
            </div>
            <div className="text-center">
              <div className="w-2 h-2 bg-success rounded-full mx-auto mb-1"></div>
              <p className="text-sm font-medium text-foreground">Response Time</p>
              <p className="text-xs text-muted-foreground">&lt; 2 minutes avg</p>
            </div>
            <div className="text-center">
              <div className="w-2 h-2 bg-primary rounded-full mx-auto mb-1"></div>
              <p className="text-sm font-medium text-foreground">User Satisfaction</p>
              <p className="text-xs text-muted-foreground">4.8/5 rating</p>
            </div>
            <div className="text-center">
              <div className="w-2 h-2 bg-success rounded-full mx-auto mb-1"></div>
              <p className="text-sm font-medium text-foreground">Uptime</p>
              <p className="text-xs text-muted-foreground">99.9% this month</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;