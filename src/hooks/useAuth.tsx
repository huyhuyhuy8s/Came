import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '@/services/authService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { User } from '@/services/authService';
import { useNavigate } from 'react-router-dom';

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          // When we have a session, fetch the user profile
          if (session.user) {
            // Use setTimeout to avoid potential deadlocks
            setTimeout(async () => {
              try {
                const userProfile = await authService.getCurrentUser();
                setUser(userProfile);
              } catch (error) {
                console.error('Error fetching user profile:', error);
              }
            }, 0);
          }
        } else {
          // No session means user is signed out
          setUser(null);
        }
      }
    );
    
    // Check for existing session
    const checkAuth = async () => {
      try {
        const userProfile = await authService.getCurrentUser();
        setUser(userProfile);
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const user = await authService.signIn(email, password);
      setUser(user);
      toast({
        title: 'Login successful',
        description: `Welcome back, ${user.name || user.email}!`,
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.message || 'Invalid credentials',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const register = async (email: string, password: string, username: string) => {
    setIsLoading(true);
    try {
      const user = await authService.signUp(email, password, username);
      setUser(user);
      toast({
        title: 'Registration successful',
        description: `Welcome to Came, ${username || email}!`,
      });
      navigate('/');
    } catch (error: any) {
      const errorMessage = error.message || 'Could not create account';
      toast({
        title: 'Registration failed',
        description: errorMessage,
        variant: 'destructive',
      });
      console.error('Registration error details:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.signOut();
      setUser(null);
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Could not log out properly.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      await authService.resetPassword(email);
      toast({
        title: 'Password reset email sent',
        description: 'Check your inbox for instructions to reset your password.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Could not send password reset email.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateProfile = async (data: Partial<User>) => {
    setIsLoading(true);
    try {
      if (!user) throw new Error('No user logged in');
      
      const updatedUser = await authService.updateUserProfile(user.id, data);
      setUser(updatedUser);
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Could not update your profile.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        resetPassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
