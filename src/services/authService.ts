import { supabase } from "@/integrations/supabase/client";

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  username?: string; // Add username as an optional field
}

// Sign up
export const signUp = async (email: string, password: string, name: string): Promise<User> => {
  // First, create the auth user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });

  if (error) {
    console.error('Error signing up:', error);
    throw error;
  }

  if (!data.user) {
    throw new Error('No user data returned');
  }

  try {
    // Create user profile in the users table with a dummy password (we don't store actual passwords here)
    // The actual password is stored in the auth schema by Supabase, not in our users table
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: data.user.id,
        email: data.user.email,
        name,
        password: 'PLACEHOLDER_VALUE_NOT_USED' // Add placeholder for password field
      });

    if (profileError) {
      console.error('Error creating user profile:', profileError);
      throw profileError;
    }
  } catch (insertError) {
    console.error('Error in profile creation:', insertError);
    // Continue anyway since the auth user was created
  }

  return {
    id: data.user.id,
    email: data.user.email!,
    name,
    avatar_url: null,
  };
};

// Sign in
export const signIn = async (email: string, password: string): Promise<User> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Error signing in:', error);
    throw error;
  }

  if (!data.user) {
    throw new Error('No user data returned');
  }

  // Get user profile from users table
  const { data: userData, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', data.user.id)
    .maybeSingle(); // Use maybeSingle instead of single to prevent errors

  if (profileError) {
    console.error('Error fetching user profile:', profileError);
    throw profileError;
  }

  // If user exists in auth but not in the users table, create a profile
  if (!userData) {
    try {
      const { data: createdUser, error: insertError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || email.split('@')[0],
          password: 'PLACEHOLDER_VALUE_NOT_USED' // Add placeholder for password field
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating user profile during sign in:', insertError);
        throw insertError;
      }

      return {
        id: data.user.id,
        email: data.user.email!,
        name: createdUser.name,
        avatar_url: createdUser.avatar_url,
      };
    } catch (e) {
      console.error('Failed to create user profile:', e);
    }
  }

  return {
    id: data.user.id,
    email: data.user.email!,
    name: userData?.name || null,
    avatar_url: userData?.avatar_url || null,
    username: userData?.name, // Use name as username for now
  };
};

// Sign out
export const signOut = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Reset password
export const resetPassword = async (email: string): Promise<void> => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

// Get current user
export const getCurrentUser = async (): Promise<User | null> => {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  // Get user profile from users table
  const { data: userData, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', data.user.id)
    .maybeSingle();

  if (profileError || !userData) {
    console.error('Error fetching user profile:', profileError);
    return null;
  }

  return {
    id: data.user.id,
    email: data.user.email!,
    name: userData.name,
    avatar_url: userData.avatar_url,
    username: userData.name, // Use name as username for now
  };
};

// Update user profile
export const updateUserProfile = async (userId: string, updates: Partial<User>): Promise<User> => {
  // Remove username if present and use name instead
  const { username, ...otherUpdates } = updates;
  const updatesForDB = username ? { ...otherUpdates, name: username } : otherUpdates;

  // Update user profile in users table
  const { data, error } = await supabase
    .from('users')
    .update(updatesForDB)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }

  return {
    ...data,
    username: data.name, // Map name to username for the frontend
  };
};

// Update user avatar
export const updateUserAvatar = async (userId: string, file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const filePath = `avatars/${userId}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    console.error('Error uploading avatar:', uploadError);
    throw uploadError;
  }

  const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
  
  // Update user profile with new avatar URL
  const { error: updateError } = await supabase
    .from('users')
    .update({ avatar_url: data.publicUrl })
    .eq('id', userId);

  if (updateError) {
    console.error('Error updating avatar URL:', updateError);
    throw updateError;
  }

  return data.publicUrl;
};

// Check and refresh session
export const checkSession = async (): Promise<void> => {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error('Error checking session:', error);
    throw error;
  }

  if (data.session) {
    // Session exists, refresh it
    await supabase.auth.refreshSession();
  }
};
