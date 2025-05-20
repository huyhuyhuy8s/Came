
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { LogOut, User } from 'lucide-react';
import OrderHistory from '@/components/OrderHistory';
import SupportTicketHistory from '@/components/SupportTicketHistory';
import ProfileForm from '@/components/account/ProfileForm';
import PasswordChangeForm from '@/components/account/PasswordChangeForm';

const Account = () => {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Navigate to sign in if not authenticated
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/signin');
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  if (isLoading) {
    return (
      <div className="py-16 came-container">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      </div>
    );
  }
  
  if (!user) return null;
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="py-12 came-container">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold mono">My Account</h1>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar_url || ''} />
              <AvatarFallback>
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-medium">{user.name || user.email}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="profile">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <ProfileForm />
          </TabsContent>
          
          <TabsContent value="password">
            <PasswordChangeForm />
          </TabsContent>
          
          <TabsContent value="orders">
            <OrderHistory />
          </TabsContent>
          
          <TabsContent value="support">
            <SupportTicketHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Account;
