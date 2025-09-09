import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { users } from '@/data/users';
import { Calendar, BookOpen, MessageCircle, Heart, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard: React.FC = () => {
  const { currentUser, appointments } = useAuth();

  // Get student's appointments
  const userAppointments = appointments.filter(apt => apt.studentId === currentUser?.id);
  const upcomingAppointments = userAppointments
    .filter(apt => new Date(apt.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Get counselor details for appointments
  const getCounselorName = (counselorId: string) => {
    const counselor = users.find(u => u.id === counselorId);
    return counselor?.name || 'Unknown Counselor';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-success';
      case 'pending':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {currentUser?.name}! 👋
        </h1>
        <p className="text-muted-foreground">
          How are you feeling today? Remember, taking care of your mental health is just as important as your physical health.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/student/chatbot">
          <Card className="hover:shadow-card transition-smooth cursor-pointer border-0 bg-gradient-primary text-primary-foreground">
            <CardContent className="p-4 text-center">
              <Heart className="h-8 w-8 mx-auto mb-2" />
              <h3 className="font-semibold">AI Support</h3>
              <p className="text-sm opacity-90">24/7 Chat Available</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/student/book">
          <Card className="hover:shadow-card transition-smooth cursor-pointer">
            <CardContent className="p-4 text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold">Book Session</h3>
              <p className="text-sm text-muted-foreground">Schedule with counselor</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/student/resources">
          <Card className="hover:shadow-card transition-smooth cursor-pointer">
            <CardContent className="p-4 text-center">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold">Resources</h3>
              <p className="text-sm text-muted-foreground">Helpful articles & tools</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/student/forum">
          <Card className="hover:shadow-card transition-smooth cursor-pointer">
            <CardContent className="p-4 text-center">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold">Peer Forum</h3>
              <p className="text-sm text-muted-foreground">Connect with others</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Upcoming Appointments */}
      <Card className="shadow-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span>Upcoming Appointments</span>
          </CardTitle>
          <CardDescription>
            Your scheduled counseling sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No upcoming appointments scheduled</p>
              <Link to="/student/book">
                <Button variant="glow">Book Your First Session</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.slice(0, 3).map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 bg-accent/30 rounded-lg border border-border/50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div>
                      <p className="font-medium text-foreground">
                        {getCounselorName(appointment.counselorId)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(appointment.date)} at {appointment.time}
                      </p>
                      {appointment.notes && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {appointment.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status === 'confirmed' ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Clock className="h-4 w-4" />
                      )}
                    </span>
                  </div>
                </div>
              ))}
              {upcomingAppointments.length > 3 && (
                <div className="text-center pt-2">
                  <Button variant="ghost" size="sm">
                    View All Appointments
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Daily Wellness Check */}
      <Card className="shadow-card border-0 bg-gradient-calm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-primary" />
            <span>Daily Wellness Check</span>
          </CardTitle>
          <CardDescription>
            Take a moment to check in with yourself
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground mb-4">
            How would you rate your overall mood and stress level today?
          </p>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" className="text-xs">😊 Great</Button>
            <Button size="sm" variant="outline" className="text-xs">🙂 Good</Button>
            <Button size="sm" variant="outline" className="text-xs">😐 Okay</Button>
            <Button size="sm" variant="outline" className="text-xs">😟 Struggling</Button>
            <Button size="sm" variant="outline" className="text-xs">😰 Crisis</Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            This information helps us provide better support
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;