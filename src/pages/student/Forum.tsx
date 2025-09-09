import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { MessageCircle, Plus, Reply, Clock, Users, Send, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Forum: React.FC = () => {
  const { currentUser, forum, addForumPost, addForumReply } = useAuth();
  const { toast } = useToast();
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTags, setNewPostTags] = useState('');
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({});
  const [showReplyForm, setShowReplyForm] = useState<{ [key: string]: boolean }>({});

  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both a title and content for your post.",
        variant: "destructive"
      });
      return;
    }

    const tags = newPostTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

    addForumPost({
      authorId: currentUser?.id,
      authorName: currentUser?.name || 'Anonymous',
      title: newPostTitle,
      content: newPostContent,
      tags: tags
    });

    // Reset form
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostTags('');
    setShowNewPost(false);

    toast({
      title: "Post Created",
      description: "Your post has been shared with the community.",
      variant: "default"
    });
  };

  const handleAddReply = (postId: string) => {
    const content = replyContent[postId];
    if (!content?.trim()) {
      toast({
        title: "Empty Reply",
        description: "Please write something before replying.",
        variant: "destructive"
      });
      return;
    }

    addForumReply(postId, {
      authorId: currentUser?.id,
      authorName: currentUser?.name || 'Anonymous',
      content: content
    });

    setReplyContent({ ...replyContent, [postId]: '' });
    setShowReplyForm({ ...showReplyForm, [postId]: false });

    toast({
      title: "Reply Added",
      description: "Your reply has been posted.",
      variant: "default"
    });
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMins > 0) return `${diffMins}m ago`;
    return 'Just now';
  };

  // Sort posts by timestamp (newest first)
  const sortedPosts = [...forum].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Peer Support Forum</h1>
          <p className="text-muted-foreground">
            Connect with fellow students, share experiences, and support each other
          </p>
        </div>
        <Button
          onClick={() => setShowNewPost(!showNewPost)}
          variant="glow"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      {/* Community Guidelines */}
      <Card className="shadow-card border-0 bg-gradient-calm">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Heart className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">Community Guidelines</p>
              <p className="text-xs text-muted-foreground">
                Be kind, respectful, and supportive. Share experiences while maintaining privacy.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* New Post Form */}
      {showNewPost && (
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle>Create New Post</CardTitle>
            <CardDescription>
              Share your thoughts, ask questions, or seek support from the community
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Title
              </label>
              <Input
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                placeholder="Give your post a clear, helpful title..."
                maxLength={100}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Content
              </label>
              <Textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Share your thoughts, experiences, or questions..."
                rows={4}
                maxLength={1000}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Tags (optional)
              </label>
              <Input
                value={newPostTags}
                onChange={(e) => setNewPostTags(e.target.value)}
                placeholder="studying, anxiety, stress, relationships (separate with commas)"
              />
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleCreatePost} variant="success">
                <Send className="h-4 w-4 mr-2" />
                Post to Forum
              </Button>
              <Button onClick={() => setShowNewPost(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Forum Posts */}
      <div className="space-y-6">
        {sortedPosts.length === 0 ? (
          <Card className="shadow-card border-0">
            <CardContent className="text-center py-12">
              <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No posts yet</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to start a conversation in the community!
              </p>
              <Button onClick={() => setShowNewPost(true)} variant="glow">
                Create First Post
              </Button>
            </CardContent>
          </Card>
        ) : (
          sortedPosts.map((post) => (
            <Card key={post.id} className="shadow-card border-0">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-xl">{post.title}</CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{post.authorName}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatTimestamp(post.timestamp)}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Reply className="h-3 w-3" />
                        <span>{post.replies?.length || 0} replies</span>
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-foreground leading-relaxed">{post.content}</p>
                
                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {post.tags.map((tag: string) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Replies */}
                {post.replies && post.replies.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-border">
                    <h4 className="text-sm font-semibold text-foreground">Replies</h4>
                    {post.replies.map((reply: any) => (
                      <div key={reply.id} className="bg-accent/30 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-medium text-foreground">{reply.authorName}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(reply.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-foreground">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Form */}
                {showReplyForm[post.id] ? (
                  <div className="space-y-3 pt-4 border-t border-border">
                    <Textarea
                      value={replyContent[post.id] || ''}
                      onChange={(e) => setReplyContent({ ...replyContent, [post.id]: e.target.value })}
                      placeholder="Write your reply..."
                      rows={3}
                    />
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => handleAddReply(post.id)} 
                        variant="success" 
                        size="sm"
                      >
                        <Send className="h-3 w-3 mr-1" />
                        Reply
                      </Button>
                      <Button 
                        onClick={() => setShowReplyForm({ ...showReplyForm, [post.id]: false })}
                        variant="outline" 
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={() => setShowReplyForm({ ...showReplyForm, [post.id]: true })}
                    variant="ghost"
                    size="sm"
                    className="w-full"
                  >
                    <Reply className="h-4 w-4 mr-2" />
                    Reply to this post
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Forum;