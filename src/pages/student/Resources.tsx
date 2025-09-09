import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Filter, Clock, BookOpen, Headphones, Video, Podcast, ExternalLink } from 'lucide-react';

const Resources: React.FC = () => {
  const { resources } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  // Filter resources
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  // Get unique categories and types
  const categories = ['all', ...Array.from(new Set(resources.map(r => r.category)))];
  const types = ['all', ...Array.from(new Set(resources.map(r => r.type)))];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article':
        return <BookOpen className="h-4 w-4" />;
      case 'audio':
        return <Headphones className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'podcast':
        return <Podcast className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Resource Hub</h1>
        <p className="text-muted-foreground">
          Discover helpful articles, guided meditations, videos, and tools to support your mental wellbeing
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-card border-0">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resources, topics, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="min-w-[150px]">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div className="min-w-[120px]">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                {types.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || selectedCategory !== 'all' || selectedType !== 'all') && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {searchTerm && (
                <Badge variant="secondary" className="gap-1">
                  Search: {searchTerm}
                  <button onClick={() => setSearchTerm('')} className="ml-1 hover:bg-destructive/20 rounded">
                    ×
                  </button>
                </Badge>
              )}
              {selectedCategory !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory('all')} className="ml-1 hover:bg-destructive/20 rounded">
                    ×
                  </button>
                </Badge>
              )}
              {selectedType !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  Type: {selectedType}
                  <button onClick={() => setSelectedType('all')} className="ml-1 hover:bg-destructive/20 rounded">
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <Card key={resource.id} className="shadow-card border-0 hover:shadow-soft transition-smooth">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg leading-tight">{resource.title}</CardTitle>
                <Badge className={`${getTypeColor(resource.type)} flex items-center gap-1`}>
                  {getTypeIcon(resource.type)}
                  {resource.type}
                </Badge>
              </div>
              <CardDescription className="text-sm">
                {resource.category}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-foreground">{resource.description}</p>
              
              {/* Duration/Read Time */}
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                {resource.duration || resource.readTime}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {resource.tags.slice(0, 3).map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {resource.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{resource.tags.length - 3} more
                  </Badge>
                )}
              </div>

              {/* Access Button */}
              <Button className="w-full" variant="glow" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                Access Resource
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredResources.length === 0 && (
        <Card className="shadow-card border-0">
          <CardContent className="text-center py-12">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No resources found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedType('all');
              }}
            >
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Resources;