
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Save, User } from 'lucide-react';

const ProfileForm = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  
  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!user) return null;
  
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
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
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleProfileUpdate} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isSubmitting}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="avatar-url">Avatar URL</Label>
        <Input
          id="avatar-url"
          placeholder="https://example.com/avatar.jpg"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          disabled={isSubmitting}
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
        disabled={isSubmitting}
      >
        <Save className="h-4 w-4" />
        {isSubmitting ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
};

export default ProfileForm;
