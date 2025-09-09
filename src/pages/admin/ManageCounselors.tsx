import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { users } from '@/data/users';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, User, Mail, Calendar, Award, Edit, Trash2, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ManageCounselors: React.FC = () => {
  const { appointments } = useAuth();
  const { toast } = useToast();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCounselor, setEditingCounselor] = useState<any>(null);
  const [newCounselor, setNewCounselor] = useState({
    name: '',
    email: '',
    specializations: '',
    experience: '',
    bio: '',
    availability: ''
  });

  // Get counselors and their appointment stats
  const counselors = users.filter(u => u.role === 'counselor').map(counselor => {
    const counselorAppointments = appointments.filter(apt => apt.counselorId === counselor.id);
    return {
      ...counselor,
      stats: {
        total: counselorAppointments.length,
        pending: counselorAppointments.filter(apt => apt.status === 'pending').length,
        confirmed: counselorAppointments.filter(apt => apt.status === 'confirmed').length,
        completed: counselorAppointments.filter(apt => apt.status === 'completed').length
      }
    };
  });

  const handleAddCounselor = () => {
    if (!newCounselor.name || !newCounselor.email) {
      toast({
        title: "Missing Information",
        description: "Please provide at least name and email.",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would make an API call
    toast({
      title: "Counselor Added",
      description: `${newCounselor.name} has been added to the platform.`,
      variant: "default"
    });

    setNewCounselor({
      name: '',
      email: '',
      specializations: '',
      experience: '',
      bio: '',
      availability: ''
    });
    setShowAddModal(false);
  };

  const handleEditCounselor = (counselor: any) => {
    setEditingCounselor(counselor);
    setNewCounselor({
      name: counselor.name,
      email: counselor.email,
      specializations: counselor.specializations?.join(', ') || '',
      experience: counselor.experience || '',
      bio: counselor.bio || '',
      availability: counselor.availability?.join(', ') || ''
    });
  };

  const handleSaveEdit = () => {
    toast({
      title: "Counselor Updated",
      description: `${newCounselor.name}'s profile has been updated.`,
      variant: "default"
    });

    setEditingCounselor(null);
    setNewCounselor({
      name: '',
      email: '',
      specializations: '',
      experience: '',
      bio: '',
      availability: ''
    });
  };

  const handleDeleteCounselor = (counselor: any) => {
    if (counselor.stats.total > 0) {
      toast({
        title: "Cannot Delete",
        description: "This counselor has existing appointments and cannot be removed.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Counselor Removed",
      description: `${counselor.name} has been removed from the platform.`,
      variant: "default"
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Manage Counselors</h1>
          <p className="text-muted-foreground">
            Add, edit, and manage counselor profiles and information
          </p>
        </div>
        <Dialog open={showAddModal || !!editingCounselor} onOpenChange={(open) => {
          if (!open) {
            setShowAddModal(false);
            setEditingCounselor(null);
            setNewCounselor({
              name: '',
              email: '',
              specializations: '',
              experience: '',
              bio: '',
              availability: ''
            });
          }
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => setShowAddModal(true)} variant="glow">
              <Plus className="h-4 w-4 mr-2" />
              Add Counselor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCounselor ? 'Edit Counselor' : 'Add New Counselor'}
              </DialogTitle>
              <DialogDescription>
                {editingCounselor ? 'Update counselor information' : 'Add a new counselor to the platform'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground">Name</label>
                  <Input
                    value={newCounselor.name}
                    onChange={(e) => setNewCounselor(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Dr. Jane Smith"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <Input
                    type="email"
                    value={newCounselor.email}
                    onChange={(e) => setNewCounselor(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="jane@university.edu"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground">Experience</label>
                  <Input
                    value={newCounselor.experience}
                    onChange={(e) => setNewCounselor(prev => ({ ...prev, experience: e.target.value }))}
                    placeholder="5 years"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Availability</label>
                  <Input
                    value={newCounselor.availability}
                    onChange={(e) => setNewCounselor(prev => ({ ...prev, availability: e.target.value }))}
                    placeholder="Mon, Tue, Wed"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Specializations</label>
                <Input
                  value={newCounselor.specializations}
                  onChange={(e) => setNewCounselor(prev => ({ ...prev, specializations: e.target.value }))}
                  placeholder="Anxiety, Depression, Stress"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Bio</label>
                <Textarea
                  value={newCounselor.bio}
                  onChange={(e) => setNewCounselor(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Brief professional background..."
                  rows={3}
                />
              </div>

              <div className="flex space-x-2">
                <Button 
                  onClick={editingCounselor ? handleSaveEdit : handleAddCounselor} 
                  variant="success"
                  className="flex-1"
                >
                  {editingCounselor ? 'Save Changes' : 'Add Counselor'}
                </Button>
                <Button 
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingCounselor(null);
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card border-0">
          <CardContent className="p-4 text-center">
            <UserCheck className="h-8 w-8 mx-auto mb-2 text-primary" />
            <h3 className="text-2xl font-bold text-foreground">{counselors.length}</h3>
            <p className="text-sm text-muted-foreground">Active Counselors</p>
          </CardContent>
        </Card>
        <Card className="shadow-card border-0">
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-success" />
            <h3 className="text-2xl font-bold text-foreground">
              {counselors.reduce((acc, c) => acc + c.stats.total, 0)}
            </h3>
            <p className="text-sm text-muted-foreground">Total Appointments</p>
          </CardContent>
        </Card>
        <Card className="shadow-card border-0">
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 mx-auto mb-2 text-warning" />
            <h3 className="text-2xl font-bold text-foreground">
              {Math.round(counselors.reduce((acc, c) => acc + c.stats.total, 0) / counselors.length) || 0}
            </h3>
            <p className="text-sm text-muted-foreground">Avg per Counselor</p>
          </CardContent>
        </Card>
        <Card className="shadow-card border-0">
          <CardContent className="p-4 text-center">
            <User className="h-8 w-8 mx-auto mb-2 text-primary" />
            <h3 className="text-2xl font-bold text-foreground">
              {new Set(appointments.map(apt => apt.studentId)).size}
            </h3>
            <p className="text-sm text-muted-foreground">Students Served</p>
          </CardContent>
        </Card>
      </div>

      {/* Counselors List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {counselors.map((counselor) => (
          <Card key={counselor.id} className="shadow-card border-0">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-success rounded-full flex items-center justify-center text-success-foreground font-bold">
                    {counselor.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{counselor.name}</CardTitle>
                    <CardDescription className="flex items-center space-x-1">
                      <Mail className="h-3 w-3" />
                      <span className="text-xs">{counselor.email}</span>
                    </CardDescription>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button
                    onClick={() => handleEditCounselor(counselor)}
                    variant="ghost"
                    size="sm"
                    className="p-2"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => handleDeleteCounselor(counselor)}
                    variant="ghost"
                    size="sm"
                    className="p-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Experience & Availability */}
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-2 bg-accent/30 rounded">
                  <p className="text-xs text-muted-foreground">Experience</p>
                  <p className="text-sm font-medium">{counselor.experience}</p>
                </div>
                <div className="text-center p-2 bg-accent/30 rounded">
                  <p className="text-xs text-muted-foreground">Appointments</p>
                  <p className="text-sm font-medium">{counselor.stats.total}</p>
                </div>
              </div>

              {/* Specializations */}
              <div>
                <p className="text-xs font-medium text-foreground mb-2">Specializations</p>
                <div className="flex flex-wrap gap-1">
                  {counselor.specializations?.slice(0, 3).map((spec: string) => (
                    <Badge key={spec} variant="secondary" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                  {counselor.specializations && counselor.specializations.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{counselor.specializations.length - 3}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Availability */}
              <div>
                <p className="text-xs font-medium text-foreground mb-2">Available Days</p>
                <p className="text-xs text-muted-foreground">
                  {counselor.availability?.join(', ') || 'Not specified'}
                </p>
              </div>

              {/* Bio */}
              {counselor.bio && (
                <div>
                  <p className="text-xs font-medium text-foreground mb-1">Bio</p>
                  <p className="text-xs text-muted-foreground line-clamp-3">
                    {counselor.bio}
                  </p>
                </div>
              )}

              {/* Appointment Stats */}
              <div className="pt-2 border-t border-border">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Pending:</span>
                  <span className="font-medium text-warning">{counselor.stats.pending}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Confirmed:</span>
                  <span className="font-medium text-success">{counselor.stats.confirmed}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Completed:</span>
                  <span className="font-medium text-primary">{counselor.stats.completed}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No counselors message */}
      {counselors.length === 0 && (
        <Card className="shadow-card border-0">
          <CardContent className="text-center py-12">
            <UserCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Counselors</h3>
            <p className="text-muted-foreground mb-4">
              Add your first counselor to start providing mental health services.
            </p>
            <Button onClick={() => setShowAddModal(true)} variant="glow">
              Add First Counselor
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ManageCounselors;