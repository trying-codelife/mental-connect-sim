import React, { createContext, useContext, useState, useEffect } from 'react';
import { users } from '@/data/users';
import { resources as initialResources } from '@/data/resources';
import { appointments as initialAppointments } from '@/data/appointments';
import { forum as initialForum } from '@/data/forum';

interface User {
  id: string;
  name: string;
  role: string;
  email: string;
  [key: string]: any;
}

interface AuthContextType {
  currentUser: User | null;
  login: (userId: string) => void;
  logout: () => void;
  // Data management
  resources: any[];
  appointments: any[];
  forum: any[];
  // Data operations
  addResource: (resource: any) => void;
  deleteResource: (resourceId: string) => void;
  addAppointment: (appointment: any) => void;
  updateAppointment: (appointmentId: string, updates: any) => void;
  addForumPost: (post: any) => void;
  addForumReply: (postId: string, reply: any) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [resources, setResources] = useState(initialResources);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [forum, setForum] = useState(initialForum);

  const login = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUserId', userId);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUserId');
  };

  // Data operations
  const addResource = (resource: any) => {
    const newResource = {
      ...resource,
      id: `r${resources.length + 1}_${Date.now()}`
    };
    setResources(prev => [...prev, newResource]);
  };

  const deleteResource = (resourceId: string) => {
    setResources(prev => prev.filter(r => r.id !== resourceId));
  };

  const addAppointment = (appointment: any) => {
    const newAppointment = {
      ...appointment,
      id: `apt${appointments.length + 1}_${Date.now()}`
    };
    setAppointments(prev => [...prev, newAppointment]);
  };

  const updateAppointment = (appointmentId: string, updates: any) => {
    setAppointments(prev => 
      prev.map(apt => apt.id === appointmentId ? { ...apt, ...updates } : apt)
    );
  };

  const addForumPost = (post: any) => {
    const newPost = {
      ...post,
      id: `f${forum.length + 1}_${Date.now()}`,
      timestamp: new Date().toISOString(),
      replies: []
    };
    setForum(prev => [...prev, newPost]);
  };

  const addForumReply = (postId: string, reply: any) => {
    setForum(prev =>
      prev.map(post =>
        post.id === postId
          ? {
              ...post,
              replies: [
                ...post.replies,
                {
                  ...reply,
                  id: `r${Date.now()}`,
                  timestamp: new Date().toISOString()
                }
              ]
            }
          : post
      )
    );
  };

  // Check for existing session on mount
  useEffect(() => {
    const savedUserId = localStorage.getItem('currentUserId');
    if (savedUserId) {
      login(savedUserId);
    }
  }, []);

  const value = {
    currentUser,
    login,
    logout,
    resources,
    appointments,
    forum,
    addResource,
    deleteResource,
    addAppointment,
    updateAppointment,
    addForumPost,
    addForumReply
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};