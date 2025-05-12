
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Save, User } from 'lucide-react';
import OrderHistory from '@/components/OrderHistory';
import SupportTicketHistory from '@/components/SupportTicketHistory';

const Account = () => {
  const { user, logout, updateProfile, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Use name instead of username
  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
  
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
  
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProfileSubmitting(true);
    
    try {
      // Pass name instead of username in the update
      await updateProfile({ name, avatar_url: avatarUrl });
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProfileSubmitting(false);
    }
  };
  
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword) {
      toast({
        title: "Error",
        description: "Current password is required",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "New password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    setIsPasswordSubmitting(true);
    
    try {
      // This would call a real API in a production app
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated.",
      });
      
      // Reset form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPasswordSubmitting(false);
    }
  };
  
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
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="avatar-url">Avatar URL</Label>
                <Input
                  id="avatar-url"
                  placeholder="https://example.com/avatar.jpg"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                />
                {avatarUrl && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-2">Preview:</p>
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={avatarUrl} />
                      <AvatarFallback>
                        <User className="h-8 w-8" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="bg-black hover:bg-gray-800 flex items-center gap-2"
                disabled={isProfileSubmitting}
              >
                <Save className="h-4 w-4" />
                {isProfileSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="password">
            <form onSubmit={handlePasswordUpdate} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  placeholder="Your current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Create a new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              
              <Button 
                type="submit" 
                className="bg-black hover:bg-gray-800 flex items-center gap-2"
                disabled={isPasswordSubmitting}
              >
                <Save className="h-4 w-4" />
                {isPasswordSubmitting ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
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
