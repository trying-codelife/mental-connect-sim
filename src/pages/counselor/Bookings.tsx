import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { users } from '@/data/users';
import { Calendar, Clock, User, CheckCircle, AlertCircle, XCircle, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Bookings: React.FC = () => {
  const { currentUser, appointments, updateAppointment } = useAuth();
  const { toast } = useToast();
  const [filterStatus, setFilterStatus] = useState('all');

  // Get counselor's appointments
  const counselorAppointments = appointments.filter(apt => apt.counselorId === currentUser?.id);
  
  // Filter appointments
  const filteredAppointments = filterStatus === 'all' 
    ? counselorAppointments 
    : counselorAppointments.filter(apt => apt.status === filterStatus);

  // Sort appointments by date and time
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  // Get student details
  const getStudentDetails = (studentId: string) => {
    return users.find(u => u.id === studentId);
  };

  const handleUpdateAppointment = (appointmentId: string, status: string) => {
    updateAppointment(appointmentId, { status });
    
    const statusMessages = {
      confirmed: 'Appointment confirmed successfully!',
      declined: 'Appointment declined.',
      completed: 'Session marked as completed.',
      cancelled: 'Appointment cancelled.'
    };

    toast({
      title: "Status Updated",
      description: statusMessages[status as keyof typeof statusMessages] || 'Appointment status updated.',
      variant: status === 'declined' || status === 'cancelled' ? "destructive" : "default"
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeStr: string) => {
    return new Date(`2000-01-01 ${timeStr}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-success bg-success/10 border-success/20';
      case 'pending':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'declined':
      case 'cancelled':
        return 'text-destructive bg-destructive/10 border-destructive/20';
      case 'completed':
        return 'text-primary bg-primary/10 border-primary/20';
      default:
        return 'text-muted-foreground bg-muted/10 border-muted/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'declined':
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getAppointmentActions = (appointment: any) => {
    switch (appointment.status) {
      case 'pending':
        return (
          <div className="flex space-x-2">
            <Button
              onClick={() => handleUpdateAppointment(appointment.id, 'confirmed')}
              variant="success"
              size="sm"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Accept
            </Button>
            <Button
              onClick={() => handleUpdateAppointment(appointment.id, 'declined')}
              variant="destructive"
              size="sm"
            >
              Decline
            </Button>
          </div>
        );
      case 'confirmed':
        const appointmentDate = new Date(`${appointment.date} ${appointment.time}`);
        const now = new Date();
        const isToday = appointmentDate.toDateString() === now.toDateString();
        const isPast = appointmentDate < now;
        
        if (isPast) {
          return (
            <Button
              onClick={() => handleUpdateAppointment(appointment.id, 'completed')}
              variant="outline"
              size="sm"
            >
              Mark Complete
            </Button>
          );
        } else {
          return (
            <Button
              onClick={() => handleUpdateAppointment(appointment.id, 'cancelled')}
              variant="outline"
              size="sm"
            >
              Cancel
            </Button>
          );
        }
      default:
        return null;
    }
  };

  // Group appointments by status for tabs
  const appointmentsByStatus = {
    all: counselorAppointments,
    pending: counselorAppointments.filter(apt => apt.status === 'pending'),
    confirmed: counselorAppointments.filter(apt => apt.status === 'confirmed'),
    completed: counselorAppointments.filter(apt => apt.status === 'completed'),
    declined: counselorAppointments.filter(apt => apt.status === 'declined' || apt.status === 'cancelled')
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Manage Bookings</h1>
        <p className="text-muted-foreground">
          Review and manage all your appointment requests and sessions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-card border-0">
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold text-warning">{appointmentsByStatus.pending.length}</h3>
            <p className="text-sm text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card className="shadow-card border-0">
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold text-success">{appointmentsByStatus.confirmed.length}</h3>
            <p className="text-sm text-muted-foreground">Confirmed</p>
          </CardContent>
        </Card>
        <Card className="shadow-card border-0">
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold text-primary">{appointmentsByStatus.completed.length}</h3>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card className="shadow-card border-0">
          <CardContent className="p-4 text-center">
            <h3 className="text-2xl font-bold text-muted-foreground">{appointmentsByStatus.all.length}</h3>
            <p className="text-sm text-muted-foreground">Total</p>
          </CardContent>
        </Card>
      </div>

      {/* Appointments Table */}
      <Card className="shadow-card border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>Appointments</span>
            </CardTitle>
            <Tabs value={filterStatus} onValueChange={setFilterStatus}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {sortedAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No {filterStatus === 'all' ? '' : filterStatus} appointments
              </h3>
              <p className="text-muted-foreground">
                {filterStatus === 'pending' 
                  ? 'No pending appointment requests at the moment.'
                  : `No ${filterStatus} appointments found.`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedAppointments.map((appointment) => {
                const student = getStudentDetails(appointment.studentId);
                return (
                  <div
                    key={appointment.id}
                    className={`p-4 rounded-lg border-2 ${getStatusColor(appointment.status)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                          {student?.name.split(' ').map(n => n[0]).join('') || 'U'}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {student?.name || 'Unknown Student'}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {student?.major} • {student?.year}
                          </p>
                          <p className="text-sm text-foreground">
                            {formatDate(appointment.date)} at {formatTime(appointment.time)}
                          </p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {appointment.type} session
                          </p>
                          {appointment.notes && (
                            <p className="text-xs text-muted-foreground mt-1 italic">
                              "{appointment.notes}"
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <Badge className={`${getStatusColor(appointment.status)} flex items-center space-x-1`}>
                          {getStatusIcon(appointment.status)}
                          <span className="capitalize">{appointment.status}</span>
                        </Badge>
                        
                        {getAppointmentActions(appointment)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Bookings;