import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { users } from '@/data/users';
import { Calendar, Clock, User, Star, MapPin, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BookAppointment: React.FC = () => {
  const { currentUser, addAppointment } = useAuth();
  const { toast } = useToast();
  const [selectedCounselor, setSelectedCounselor] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('individual');
  const [notes, setNotes] = useState('');

  // Get counselors
  const counselors = users.filter(u => u.role === 'counselor');

  // Sample time slots
  const timeSlots = [
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'
  ];

  // Get next 14 days for scheduling
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const availableDates = getAvailableDates();

  const handleBookAppointment = () => {
    if (!selectedCounselor || !selectedDate || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please select a counselor, date, and time for your appointment.",
        variant: "destructive"
      });
      return;
    }

    const newAppointment = {
      studentId: currentUser?.id,
      counselorId: selectedCounselor,
      date: selectedDate,
      time: selectedTime,
      status: 'pending',
      type: appointmentType,
      notes: notes || 'Initial consultation'
    };

    addAppointment(newAppointment);

    toast({
      title: "Appointment Requested",
      description: `Your appointment request has been sent to ${getCounselorName(selectedCounselor)}. They will confirm it shortly.`,
      variant: "default"
    });

    // Reset form
    setSelectedCounselor(null);
    setSelectedDate('');
    setSelectedTime('');
    setNotes('');
  };

  const getCounselorName = (counselorId: string) => {
    const counselor = users.find(u => u.id === counselorId);
    return counselor?.name || 'Unknown Counselor';
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
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Book an Appointment</h1>
        <p className="text-muted-foreground">
          Schedule a session with one of our professional counselors
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Counselor Selection */}
        <div className="lg:col-span-2">
          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-primary" />
                <span>Choose Your Counselor</span>
              </CardTitle>
              <CardDescription>
                Select a counselor based on their specializations and availability
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {counselors.map((counselor) => (
                <div
                  key={counselor.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-smooth ${
                    selectedCounselor === counselor.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 hover:bg-accent/50'
                  }`}
                  onClick={() => setSelectedCounselor(counselor.id)}
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                      {counselor.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{counselor.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{counselor.experience} experience</p>
                      <p className="text-sm text-foreground mb-3">{counselor.bio}</p>
                      
                      {/* Specializations */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        {counselor.specializations?.map((spec: string) => (
                          <Badge key={spec} variant="secondary" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                      
                      {/* Availability */}
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        Available: {counselor.availability?.join(', ')}
                      </div>
                    </div>
                    {selectedCounselor === counselor.id && (
                      <CheckCircle className="h-6 w-6 text-primary" />
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Booking Details */}
        <div className="space-y-6">
          {/* Date Selection */}
          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle className="text-lg">Select Date</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {availableDates.slice(0, 6).map((date) => (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`p-3 text-sm rounded-lg border-2 transition-smooth ${
                      selectedDate === date
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border hover:border-primary/50 hover:bg-accent'
                    }`}
                  >
                    {formatDate(date)}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Time Selection */}
          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle className="text-lg">Select Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`p-2 text-sm rounded-lg border-2 transition-smooth ${
                      selectedTime === time
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border hover:border-primary/50 hover:bg-accent'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Appointment Type */}
          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle className="text-lg">Session Type</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="type"
                  value="individual"
                  checked={appointmentType === 'individual'}
                  onChange={(e) => setAppointmentType(e.target.value)}
                  className="text-primary"
                />
                <span className="text-sm">Individual Counseling</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="type"
                  value="career-counseling"
                  checked={appointmentType === 'career-counseling'}
                  onChange={(e) => setAppointmentType(e.target.value)}
                  className="text-primary"
                />
                <span className="text-sm">Career Counseling</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="type"
                  value="crisis"
                  checked={appointmentType === 'crisis'}
                  onChange={(e) => setAppointmentType(e.target.value)}
                  className="text-primary"
                />
                <span className="text-sm">Crisis Support</span>
              </label>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle className="text-lg">Additional Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Briefly describe what you'd like to discuss (optional)"
                className="w-full p-3 text-sm border border-input rounded-lg bg-background resize-none"
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Book Button */}
          <Button
            onClick={handleBookAppointment}
            disabled={!selectedCounselor || !selectedDate || !selectedTime}
            variant="glow"
            className="w-full"
            size="lg"
          >
            <Calendar className="h-5 w-5 mr-2" />
            Request Appointment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;