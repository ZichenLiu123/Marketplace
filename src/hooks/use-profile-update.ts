
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { toast } from 'sonner';
import { User, UserProfile } from '@/types/auth';
import { saveUserToLocalStorage } from '@/utils/authUtils';

export function useProfileUpdate(
  user: User | null,
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setIsUpdatingProfile: React.Dispatch<React.SetStateAction<boolean>>
) {
  const updateUserProfile = async (profile: UserProfile): Promise<boolean> => {
    if (!user) {
      console.error("Cannot update profile when not logged in");
      toast.error("You must be logged in to update your profile");
      setIsUpdatingProfile(false);
      return false;
    }
    
    if (!profile.name) {
      console.error("Missing required name field");
      toast.error("Name is required");
      setIsUpdatingProfile(false);
      return false;
    }
    
    setIsUpdatingProfile(true);
    console.log("Starting profile update at:", new Date().toISOString());
    console.log("Profile update data:", JSON.stringify(profile, null, 2));
    console.log("Current user:", JSON.stringify(user, null, 2));
    
    try {
      // First update the local state immediately to improve UI responsiveness
      const updatedUser = {
        ...user,
        name: profile.name,
        program: profile.program || null,
        year: profile.year || null,
        bio: profile.bio || null,
        phone: profile.phone || null,
        hasCompletedSetup: true
      };
      
      // Update the profiles table first (this is the most critical part)
      if (isSupabaseConfigured()) {
        console.log("Updating profiles table for user ID:", user.id);
        const { error: profilesError } = await supabase
          .from('profiles')
          .update({
            name: profile.name,
            program: profile.program || null,
            year: profile.year || null,
            bio: profile.bio || null,
            phone: profile.phone || null
          })
          .eq('id', user.id);
        
        if (profilesError) {
          console.error("Error updating profiles table:", profilesError);
          toast.error("Failed to update your profile information. Please try again.");
          setIsUpdatingProfile(false);
          return false;
        }
        
        // After successfully updating the profile, update the auth metadata
        console.log("Updating user metadata");
        const { error: metadataError } = await supabase.auth.updateUser({
          data: { 
            name: profile.name,
            program: profile.program || '',
            year: profile.year || '',
            bio: profile.bio || '',
            phone: profile.phone || '',
            hasCompletedSetup: true
          }
        });
        
        if (metadataError) {
          // If metadata update fails but profiles succeeded, we can still proceed
          console.warn("Warning: User metadata update failed but profile was updated:", metadataError);
          toast.success("Your profile information has been updated (with some limitations)");
        } else {
          console.log("User metadata updated successfully");
          toast.success("Your profile has been successfully updated");
        }
      } else {
        // For local development without Supabase connection
        console.log("Supabase not configured, saving profile locally only");
        toast.success("Your profile information has been saved locally");
      }
      
      // Update local state and storage regardless of backend success
      setUser(updatedUser);
      saveUserToLocalStorage(updatedUser);
      
      console.log("Profile update completed at:", new Date().toISOString());
      setIsUpdatingProfile(false);
      return true;
    } catch (error) {
      console.error("Profile update error:", error);
      console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace');
      toast.error("An unexpected error occurred while updating your profile");
      setIsUpdatingProfile(false);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      console.log("Logging out user");
      
      // First clear all authentication-related localStorage items
      localStorage.removeItem('userProfile');
      localStorage.removeItem('userMessages');
      localStorage.removeItem('supabase-auth');
      localStorage.removeItem('savedItems');
      localStorage.removeItem('authRedirectToast');
      
      // Clear local state
      setUser(null);
      
      // Then sign out from Supabase if configured
      if (isSupabaseConfigured()) {
        await supabase.auth.signOut({ scope: 'global' }); // Use global scope to sign out from all devices
      }
      
      toast.success("You have been successfully logged out");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("There was an issue during logout. Please try again");
    }
  };

  return {
    updateUserProfile,
    logout
  };
}
