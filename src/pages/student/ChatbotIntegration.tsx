import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Clock, Shield, Zap } from 'lucide-react';

const ChatbotIntegration: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">AI Support Assistant</h1>
        <p className="text-muted-foreground">
          Get immediate support and guidance from our AI-powered mental health assistant
        </p>
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="border-0 bg-gradient-primary text-primary-foreground">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2" />
            <h3 className="font-semibold">24/7 Available</h3>
            <p className="text-sm opacity-90">Always here when you need support</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-success text-success-foreground">
          <CardContent className="p-4 text-center">
            <Shield className="h-8 w-8 mx-auto mb-2" />
            <h3 className="font-semibold">Private & Secure</h3>
            <p className="text-sm opacity-90">Your conversations are confidential</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-calm text-foreground">
          <CardContent className="p-4 text-center">
            <Zap className="h-8 w-8 mx-auto mb-2" />
            <h3 className="font-semibold">Instant Response</h3>
            <p className="text-sm opacity-70">Get immediate guidance and support</p>
          </CardContent>
        </Card>
      </div>

      {/* Chatbot Integration Container */}
      <Card className="shadow-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-primary" />
            <span>AI Wellness Assistant</span>
          </CardTitle>
          <CardDescription>
            Start a conversation with our AI assistant for personalized mental health support
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[500px] flex flex-col items-center justify-center space-y-6">
          {/* Integration Placeholder */}
          <div className="w-full max-w-4xl mx-auto p-8 border-2 border-dashed border-border rounded-lg bg-accent/20">
            <div className="text-center space-y-4">
              <MessageCircle className="h-16 w-16 mx-auto text-primary" />
              <h3 className="text-xl font-semibold text-foreground">
                Chatbot Integration Area
              </h3>
              <div className="bg-muted/50 p-4 rounded-lg text-left">
                <p className="text-sm font-mono text-muted-foreground mb-2">
                  // PASTE YOUR EXISTING CHATBOT INTEGRATION SCRIPT/CODE HERE
                </p>
                <p className="text-sm text-foreground">
                  This is where you would integrate your existing chatbot solution. 
                  Popular options include:
                </p>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                  <li>• Dialogflow or Google Assistant integration</li>
                  <li>• Microsoft Bot Framework</li>
                  <li>• Custom React chat components</li>
                  <li>• Third-party chat widgets (Intercom, Zendesk, etc.)</li>
                  <li>• AI-powered solutions (OpenAI, Claude, etc.)</li>
                </ul>
              </div>
              <p className="text-sm text-muted-foreground">
                Replace this placeholder with your actual chatbot implementation
              </p>
            </div>
          </div>

          {/* Temporary Demo Button */}
          <div className="flex flex-col items-center space-y-4">
            <Button variant="glow" size="lg" disabled>
              <MessageCircle className="h-5 w-5 mr-2" />
              Start Chat Session (Demo Mode)
            </Button>
            <p className="text-xs text-muted-foreground text-center max-w-md">
              In the full implementation, this would launch your integrated chatbot interface
              with features like crisis detection, resource recommendations, and mood tracking.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="text-lg">Common Topics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" size="sm">
              "I'm feeling anxious about exams"
            </Button>
            <Button variant="ghost" className="w-full justify-start" size="sm">
              "Help me with study stress"
            </Button>
            <Button variant="ghost" className="w-full justify-start" size="sm">
              "I'm having trouble sleeping"
            </Button>
            <Button variant="ghost" className="w-full justify-start" size="sm">
              "Feeling overwhelmed lately"
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="text-lg">Emergency Resources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm font-semibold text-destructive">Crisis Support</p>
              <p className="text-xs text-muted-foreground">If you're in crisis, call 988 (Suicide & Crisis Lifeline)</p>
            </div>
            <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <p className="text-sm font-semibold text-warning">Campus Emergency</p>
              <p className="text-xs text-muted-foreground">24/7 Campus Safety: (555) 123-4567</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatbotIntegration;