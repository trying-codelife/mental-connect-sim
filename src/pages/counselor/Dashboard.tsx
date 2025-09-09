import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { users } from '@/data/users';
import { Calendar, Clock, User, CheckCircle, AlertCircle, TrendingUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const CounselorDashboard: React.FC = () => {
  const { currentUser, appointments, updateAppointment } = useAuth();

  // Get counselor's appointments
  const counselorAppointments = appointments.filter(apt => apt.counselorId === currentUser?.id);
  const pendingAppointments = counselorAppointments.filter(apt => apt.status === 'pending');
  const confirmedAppointments = counselorAppointments.filter(apt => apt.status === 'confirmed');
  const todayAppointments = confirmedAppointments.filter(apt => {
    const today = new Date().toISOString().split('T')[0];
    return apt.date === today;
  });

  // Get student details for appointments
  const getStudentName = (studentId: string) => {
    const student = users.find(u => u.id === studentId);
    return student?.name || 'Unknown Student';
  };

  const handleAcceptAppointment = (appointmentId: string) => {
    updateAppointment(appointmentId, { status: 'confirmed' });
  };

  const handleDeclineAppointment = (appointmentId: string) => {
    updateAppointment(appointmentId, { status: 'declined' });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-success';
      case 'pending':
        return 'text-warning';
      case 'declined':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'declined':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome, {currentUser?.name} 👋
        </h1>
        <p className="text-muted-foreground">
          Manage your appointments and support students on their mental health journey.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-card border-0">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-warning" />
            <h3 className="text-2xl font-bold text-foreground">{pendingAppointments.length}</h3>
            <p className="text-sm text-muted-foreground">Pending Requests</p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-success" />
            <h3 className="text-2xl font-bold text-foreground">{confirmedAppointments.length}</h3>
            <p className="text-sm text-muted-foreground">Confirmed Sessions</p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
            <h3 className="text-2xl font-bold text-foreground">{todayAppointments.length}</h3>
            <p className="text-sm text-muted-foreground">Today's Sessions</p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
            <h3 className="text-2xl font-bold text-foreground">
              {new Set(counselorAppointments.map(apt => apt.studentId)).size}
            </h3>
            <p className="text-sm text-muted-foreground">Active Students</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Appointment Requests */}
      <Card className="shadow-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-warning" />
            <span>Pending Appointment Requests</span>
            {pendingAppointments.length > 0 && (
              <Badge variant="secondary">{pendingAppointments.length} new</Badge>
            )}
          </CardTitle>
          <CardDescription>
            Review and respond to student appointment requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingAppointments.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 mx-auto text-success mb-4" />
              <p className="text-muted-foreground mb-4">All caught up! No pending requests.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 bg-warning/5 border border-warning/20 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-warning rounded-full"></div>
                    <div>
                      <p className="font-medium text-foreground">
                        {getStudentName(appointment.studentId)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(appointment.date)} at {appointment.time} • {appointment.type}
                      </p>
                      {appointment.notes && (
                        <p className="text-xs text-muted-foreground mt-1">
                          "{appointment.notes}"
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => handleAcceptAppointment(appointment.id)}
                      variant="success"
                      size="sm"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Accept
                    </Button>
                    <Button
                      onClick={() => handleDeclineAppointment(appointment.id)}
                      variant="destructive"
                      size="sm"
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Today's Schedule */}
      <Card className="shadow-card border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>Today's Schedule</span>
              </CardTitle>
              <CardDescription>
                {todayAppointments.length} sessions scheduled for today
              </CardDescription>
            </div>
            <Link to="/counselor/bookings">
              <Button variant="outline" size="sm">
                View All Bookings
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {todayAppointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No sessions scheduled for today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayAppointments
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-3 bg-accent/30 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div>
                      <p className="font-medium text-foreground">
                        {getStudentName(appointment.studentId)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.time} • {appointment.type}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${getStatusColor(appointment.status)} flex items-center space-x-1`}>
                      {getStatusIcon(appointment.status)}
                      <span className="capitalize">{appointment.status}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Counselor Profile */}
      <Card className="shadow-card border-0 bg-gradient-calm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 text-primary" />
            <span>Your Profile</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">Experience</p>
              <p className="text-sm text-muted-foreground">{currentUser?.experience}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Availability</p>
              <p className="text-sm text-muted-foreground">
                {currentUser?.availability?.join(', ')}
              </p>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Specializations</p>
            <div className="flex flex-wrap gap-1">
              {currentUser?.specializations?.map((spec: string) => (
                <Badge key={spec} variant="secondary" className="text-xs">
                  {spec}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-foreground">Bio</p>
            <p className="text-sm text-muted-foreground">{currentUser?.bio}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CounselorDashboard;