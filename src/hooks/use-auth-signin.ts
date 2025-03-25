
import { useState, useCallback } from 'react';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth';
import { saveUserToLocalStorage } from '@/utils/authUtils';

interface SignupProfile {
  program?: string;
  year?: string;
  bio: string;
  phone: string;
  hasCompletedSetup?: boolean;
}

export function useAuthSignIn(setUser: React.Dispatch<React.SetStateAction<User | null>>) {
  const [error, setError] = useState<Error | null>(null);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    if (!email || !password) {
      console.error("Email and password are required");
      return false;
    }

    try {
      console.log("Attempting login with Supabase for:", email);
      
      // Clear any previous auth data before attempting login
      localStorage.removeItem('userProfile');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error("Error during sign in:", error.message);
        setError(error);
        return false;
      }
      
      if (!data.user || !data.session) {
        console.error("No user or session returned");
        return false;
      }

      console.log("Login successful for user:", data.user.email);
      // Auth successful, but we'll use the onAuthStateChange event to update user state
      return true;
    } catch (err) {
      const error = err as Error;
      console.error("Unexpected error during sign in:", error.message);
      setError(error);
      return false;
    }
  }, []);

  const signup = useCallback(async (
    name: string, 
    email: string, 
    password: string,
    profileData?: SignupProfile
  ): Promise<boolean> => {
    if (!email || !password || !name || !profileData?.bio || !profileData?.phone) {
      console.error("Name, email, password, bio, and phone are required");
      return false;
    }

    try {
      console.log("Attempting signup with Supabase for:", email);
      console.log("Profile data being sent:", JSON.stringify(profileData, null, 2));
      
      // Configure the redirect URL for email verification
      // Use absolute URL to ensure it works correctly
      const redirectUrl = `${window.location.origin}/auth?verified=true`;
      console.log("Email verification redirect URL:", redirectUrl);
      
      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            program: profileData?.program || '',
            year: profileData?.year || '',
            bio: profileData.bio,
            phone: profileData.phone,
            hasCompletedSetup: !!profileData?.hasCompletedSetup
          },
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        console.error("Error during sign up:", error.message);
        setError(error);
        return false;
      }

      if (!data.user) {
        console.error("No user returned from sign up");
        return false;
      }
      
      console.log("Signup response:", data);

      // Check if Supabase has confirmed email by default or requires verification
      if (data.session) {
        console.log("User automatically signed in (email verification not required)");
        // User is automatically signed in (email verification not required)
        const userData: User = {
          id: data.user.id,
          name: name,
          email: email,
          isAuthenticated: true,
          hasCompletedSetup: !!profileData?.hasCompletedSetup,
          program: profileData?.program,
          year: profileData?.year,
          bio: profileData.bio,
          phone: profileData.phone
        };
        
        setUser(userData);
        saveUserToLocalStorage(userData);
        
        // Ensure profile data is saved to the profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            name: name,
            email: email,
            program: profileData?.program || null,
            year: profileData?.year || null,
            bio: profileData.bio,
            phone: profileData.phone
          }, { onConflict: 'id' });
        
        if (profileError) {
          console.error("Error updating profile:", profileError);
          toast.warning("Profile Update Warning", {
            description: "Your account was created, but we couldn't save all your profile details."
          });
        } else {
          console.log("Profile successfully created and updated with all fields");
        }
        
        return true;
      } else {
        console.log("Email verification required - user should check email");
        // Even if email verification is required, we should still create the profile
        // This ensures the profile exists when the user verifies their email
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            name: name,
            email: email,
            program: profileData?.program || null,
            year: profileData?.year || null,
            bio: profileData.bio,
            phone: profileData.phone
          }, { onConflict: 'id' });
        
        if (profileError) {
          console.error("Error creating initial profile:", profileError);
        } else {
          console.log("Initial profile successfully created with all fields");
        }
        
        // Email verification required
        toast.info("Verification Required", {
          description: "Please check your email to complete registration."
        });
        return true;
      }
    } catch (err) {
      const error = err as Error;
      console.error("Unexpected error during sign up:", error.message);
      setError(error);
      return false;
    }
  }, [setUser]);

  return {
    login,
    signup,
    error
  };
}
