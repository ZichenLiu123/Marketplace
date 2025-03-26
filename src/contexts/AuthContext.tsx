
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { User as AppUser, AuthContextType } from '@/types/auth';
import { Loader2 } from "lucide-react";

// Create the context for the complete auth type
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [sessionExpiryTime, setSessionExpiryTime] = useState<Date | null>(null);

  useEffect(() => {
    console.log("AuthProvider: Setting up...");
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event);
        setSession(newSession);
        
        if (newSession) {
          try {
            console.log("Session found, fetching profile data");
            const { data: profileData, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', newSession.user.id)
              .single();
            
            if (error) {
              console.error("Error fetching profile:", error);
            }
            
            if (profileData) {
              const userData: AppUser = {
                id: profileData.id,
                name: profileData.name,
                email: profileData.email,
                isAuthenticated: true,
                hasCompletedSetup: !!(profileData.name && (profileData.program || profileData.year)),
                program: profileData.program || '',
                year: profileData.year || '',
                bio: profileData.bio || '',
                phone: profileData.phone || ''
              };
              setUser(userData);
              
              if (event === 'SIGNED_IN') {
                toast.success("Logged In", {
                  description: `Welcome, ${userData.name}!`
                });
              }
            } else {
              const metadata = newSession.user.user_metadata;
              const userData: AppUser = {
                id: newSession.user.id,
                name: metadata?.name || newSession.user.email?.split('@')[0] || 'User',
                email: newSession.user.email || '',
                isAuthenticated: true,
                hasCompletedSetup: !!metadata?.hasCompletedSetup,
                program: metadata?.program || '',
                year: metadata?.year || '',
                bio: metadata?.bio || '',
                phone: metadata?.phone || ''
              };
              setUser(userData);
              
              if (event === 'SIGNED_IN') {
                toast.success("Logged In", {
                  description: `Welcome, ${userData.name}!`
                });
              }
            }
            
            if (newSession.expires_at) {
              const expiryDate = new Date(newSession.expires_at * 1000);
              setSessionExpiryTime(expiryDate);
            }
          } catch (error) {
            console.error('Error getting user profile:', error);
            setUser(null);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          toast.success("Logged Out", {
            description: "You have been successfully logged out."
          });
        }
      }
    );

    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error getting session:", error);
          setIsLoading(false);
          return;
        }
        
        if (data.session) {
          console.log("Existing session found");
        } else {
          console.log("No existing session found");
          setUser(null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error in checkSession:", error);
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session || user) {
      setIsLoading(false);
    }
  }, [session, user]);
  
  const login = async (email: string, password: string): Promise<boolean> => {
    console.log("Login attempted with email:", email);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Login error:", error.message);
        return false;
      }
      
      console.log("Login successful, data:", data);
      if (!data.user || !data.session) {
        console.error("Login response missing user or session");
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Unexpected login error:", error);
      return false;
    }
  };
  
  const signup = async (
    name: string, 
    email: string, 
    password: string,
    profileData?: any
  ): Promise<boolean> => {
    try {
      const redirectUrl = `${window.location.origin}/auth?verified=true`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            program: profileData?.program || '',
            year: profileData?.year || '',
            bio: profileData?.bio || '',
            phone: profileData?.phone || '',
            hasCompletedSetup: !!profileData?.hasCompletedSetup
          },
          emailRedirectTo: redirectUrl
        }
      });
      
      if (error) {
        console.error("Signup error:", error.message);
        return false;
      }
      
      if (!data.user) {
        console.error("Signup response missing user");
        return false;
      }
      
      if (!data.session) {
        toast.info("Verification Required", {
          description: "Please check your email to complete registration."
        });
      } else {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            name: name,
            email: email,
            program: profileData?.program || null,
            year: profileData?.year || null,
            bio: profileData?.bio || null,
            phone: profileData?.phone || null,
            has_completed_setup: !!profileData?.hasCompletedSetup
          }, { onConflict: 'id' });
        
        if (profileError) {
          console.error("Error updating profile after signup:", profileError);
        }
      }
      
      return true;
    } catch (error) {
      console.error("Unexpected signup error:", error);
      return false;
    }
  };
  
  const logout = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
        throw error;
      }
    } catch (error) {
      console.error("Unexpected logout error:", error);
      toast.error("Logout Error", {
        description: "There was a problem logging you out."
      });
    }
  };
  
  const updateUserProfile = async (profile: any): Promise<boolean> => {
    if (!user) {
      toast.error("Profile Update Error", {
        description: "You must be logged in to update your profile."
      });
      return false;
    }
    
    try {
      setIsUpdatingProfile(true);
      
      if (!profile.name) {
        toast.error("Profile Update Error", {
          description: "Name is required"
        });
        setIsUpdatingProfile(false);
        return false;
      }
      
      const updatedUser = {
        ...user,
        name: profile.name,
        program: profile.program || '',
        year: profile.year || '',
        bio: profile.bio || '',
        phone: profile.phone || '',
        hasCompletedSetup: true
      };
      
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
        console.error("Error updating user metadata:", metadataError);
      }
      
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: profile.name,
          program: profile.program || null,
          year: profile.year || null,
          bio: profile.bio || null,
          phone: profile.phone || null
        })
        .eq('id', user.id);
      
      if (profileError) {
        console.error("Error updating profile in database:", profileError);
        toast.warning("Profile Update Warning", {
          description: "There was an issue saving your profile details to the database."
        });
      } else {
        toast.success("Profile Updated", {
          description: "Your profile information has been saved."
        });
      }
      
      setUser(updatedUser);
      
      setIsUpdatingProfile(false);
      return true;
    } catch (error) {
      console.error("Profile update error:", error);
      setIsUpdatingProfile(false);
      return false;
    }
  };
  
  const refreshSession = async (): Promise<void> => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error("Session refresh error:", error);
        return;
      }
      
      if (data.session) {
        setSession(data.session);
        if (data.session.expires_at) {
          const expiryDate = new Date(data.session.expires_at * 1000);
          setSessionExpiryTime(expiryDate);
        }
        
        toast.success("Session Refreshed", {
          description: "Your session has been successfully extended."
        });
      }
    } catch (error) {
      console.error("Unexpected session refresh error:", error);
    }
  };
  
  // This context will be used by children components via useAuth() hook
  const authContextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isUpdatingProfile,
    sessionExpiryTime,
    refreshSession,
    login,
    signup,
    logout,
    updateUserProfile
  };
  
  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Make sure we export the useAuth function so it's available
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
