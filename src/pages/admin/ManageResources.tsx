import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, BookOpen, Headphones, Video, Podcast, Edit, Trash2, Clock, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ManageResources: React.FC = () => {
  const { resources, addResource, deleteResource } = useAuth();
  const { toast } = useToast();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingResource, setEditingResource] = useState<any>(null);
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    type: '',
    category: '',
    duration: '',
    url: '',
    tags: ''
  });

  const resourceTypes = [
    { value: 'article', label: 'Article', icon: BookOpen },
    { value: 'audio', label: 'Audio', icon: Headphones },
    { value: 'video', label: 'Video', icon: Video },
    { value: 'podcast', label: 'Podcast', icon: Podcast }
  ];

  const categories = [
    'Academic Support',
    'Stress Management',
    'Sleep & Relaxation',
    'Mindfulness',
    'Life Transitions',
    'Crisis Support',
    'Self-Care',
    'Relationships'
  ];

  const getTypeIcon = (type: string) => {
    const typeConfig = resourceTypes.find(t => t.value === type);
    const Icon = typeConfig?.icon || BookOpen;
    return <Icon className="h-4 w-4" />;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'article':
        return 'bg-primary/10 text-primary';
      case 'audio':
        return 'bg-success/10 text-success';
      case 'video':
        return 'bg-warning/10 text-warning';
      case 'podcast':
        return 'bg-accent text-accent-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleAddResource = () => {
    if (!newResource.title || !newResource.type || !newResource.category) {
      toast({
        title: "Missing Information",
        description: "Please provide at least title, type, and category.",
        variant: "destructive"
      });
      return;
    }

    const tags = newResource.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

    addResource({
      title: newResource.title,
      description: newResource.description,
      type: newResource.type,
      category: newResource.category,
      duration: newResource.duration || newResource.type === 'article' ? `${Math.floor(Math.random() * 15) + 3} minutes` : '10 minutes',
      readTime: newResource.type === 'article' ? newResource.duration || `${Math.floor(Math.random() * 15) + 3} minutes` : undefined,
      url: newResource.url || '#',
      tags: tags.length > 0 ? tags : ['wellness', 'support']
    });

    toast({
      title: "Resource Added",
      description: `${newResource.title} has been added to the resource library.`,
      variant: "default"
    });

    setNewResource({
      title: '',
      description: '',
      type: '',
      category: '',
      duration: '',
      url: '',
      tags: ''
    });
    setShowAddModal(false);
  };

  const handleEditResource = (resource: any) => {
    setEditingResource(resource);
    setNewResource({
      title: resource.title,
      description: resource.description,
      type: resource.type,
      category: resource.category,
      duration: resource.duration || resource.readTime || '',
      url: resource.url,
      tags: resource.tags?.join(', ') || ''
    });
  };

  const handleSaveEdit = () => {
    toast({
      title: "Resource Updated",
      description: `${newResource.title} has been updated successfully.`,
      variant: "default"
    });

    setEditingResource(null);
    setNewResource({
      title: '',
      description: '',
      type: '',
      category: '',
      duration: '',
      url: '',
      tags: ''
    });
  };

  const handleDeleteResource = (resourceId: string, resourceTitle: string) => {
    deleteResource(resourceId);
    toast({
      title: "Resource Deleted",
      description: `${resourceTitle} has been removed from the library.`,
      variant: "default"
    });
  };

  // Group resources by category
  const resourcesByCategory = resources.reduce((acc, resource) => {
    const category = resource.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(resource);
    return acc;
  }, {} as Record<string, any[]>);

  // Get statistics
  const stats = {
    total: resources.length,
    byType: resourceTypes.map(type => ({
      ...type,
      count: resources.filter(r => r.type === type.value).length
    })),
    byCategory: Object.keys(resourcesByCategory).map(category => ({
      category,
      count: resourcesByCategory[category].length
    }))
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Manage Resources</h1>
          <p className="text-muted-foreground">
            Add, edit, and organize mental health resources for students
          </p>
        </div>
        <Dialog open={showAddModal || !!editingResource} onOpenChange={(open) => {
          if (!open) {
            setShowAddModal(false);
            setEditingResource(null);
            setNewResource({
              title: '',
              description: '',
              type: '',
              category: '',
              duration: '',
              url: '',
              tags: ''
            });
          }
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => setShowAddModal(true)} variant="glow">
              <Plus className="h-4 w-4 mr-2" />
              Add Resource
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingResource ? 'Edit Resource' : 'Add New Resource'}
              </DialogTitle>
              <DialogDescription>
                {editingResource ? 'Update resource information' : 'Add a new resource to the library'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Title</label>
                <Input
                  value={newResource.title}
                  onChange={(e) => setNewResource(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Resource title..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground">Type</label>
                  <Select value={newResource.type} onValueChange={(value) => setNewResource(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {resourceTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center space-x-2">
                            <type.icon className="h-4 w-4" />
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Category</label>
                  <Select value={newResource.category} onValueChange={(value) => setNewResource(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Description</label>
                <Textarea
                  value={newResource.description}
                  onChange={(e) => setNewResource(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the resource..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground">
                    {newResource.type === 'article' ? 'Read Time' : 'Duration'}
                  </label>
                  <Input
                    value={newResource.duration}
                    onChange={(e) => setNewResource(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="e.g., 10 minutes"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">URL</label>
                  <Input
                    value={newResource.url}
                    onChange={(e) => setNewResource(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Tags</label>
                <Input
                  value={newResource.tags}
                  onChange={(e) => setNewResource(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="stress, anxiety, meditation (comma separated)"
                />
              </div>

              <div className="flex space-x-2">
                <Button 
                  onClick={editingResource ? handleSaveEdit : handleAddResource} 
                  variant="success"
                  className="flex-1"
                >
                  {editingResource ? 'Save Changes' : 'Add Resource'}
                </Button>
                <Button 
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingResource(null);
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

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="shadow-card border-0 bg-gradient-primary text-primary-foreground">
          <CardContent className="p-4 text-center">
            <BookOpen className="h-6 w-6 mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-sm opacity-90">Total Resources</p>
          </CardContent>
        </Card>
        {stats.byType.map(type => (
          <Card key={type.value} className="shadow-card border-0">
            <CardContent className="p-4 text-center">
              <type.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold text-foreground">{type.count}</p>
              <p className="text-sm text-muted-foreground">{type.label}s</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Resources by Category */}
      <div className="space-y-6">
        {Object.keys(resourcesByCategory).map(category => (
          <Card key={category} className="shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{category}</span>
                <Badge variant="secondary">
                  {resourcesByCategory[category].length} resources
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {resourcesByCategory[category].map((resource) => (
                  <div
                    key={resource.id}
                    className="p-4 border border-border rounded-lg bg-accent/20 hover:bg-accent/30 transition-smooth"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-foreground line-clamp-2">
                        {resource.title}
                      </h4>
                      <div className="flex space-x-1 ml-2">
                        <Button
                          onClick={() => handleEditResource(resource)}
                          variant="ghost"
                          size="sm"
                          className="p-1 h-6 w-6"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteResource(resource.id, resource.title)}
                          variant="ghost"
                          size="sm"
                          className="p-1 h-6 w-6 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={`${getTypeColor(resource.type)} flex items-center space-x-1 text-xs`}>
                        {getTypeIcon(resource.type)}
                        <span>{resource.type}</span>
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {resource.duration || resource.readTime}
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {resource.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {resource.tags?.slice(0, 3).map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {resource.tags && resource.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{resource.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    <Button variant="outline" size="sm" className="w-full text-xs">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View Resource
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No resources message */}
      {resources.length === 0 && (
        <Card className="shadow-card border-0">
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Resources</h3>
            <p className="text-muted-foreground mb-4">
              Add your first resource to start building your mental health library.
            </p>
            <Button onClick={() => setShowAddModal(true)} variant="glow">
              Add First Resource
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ManageResources;