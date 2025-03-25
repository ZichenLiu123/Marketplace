
import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured, refreshSessionIfNeeded } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { User as AppUser } from '@/types/auth';
import { saveUserToLocalStorage, loadUserFromLocalStorage, syncUserWithSupabase, getUserProfile } from '@/utils/authUtils';
import { clearAllLocalStorage } from '@/utils/storageUtils';
import { logAuthError } from '@/components/auth/ServerValidatedRoute';

export function useAuthCore() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  // Initialize auth state
  useEffect(() => {
    let initTimeoutId: NodeJS.Timeout;
    
    initTimeoutId = setTimeout(() => {
      console.log('Auth initialization timeout reached, forcing completion');
      setIsInitializing(false);
    }, 3000);
    
    if (!isSupabaseConfigured()) {
      console.warn('Supabase client not properly configured, skipping auth setup');
      setIsInitializing(false);
      clearTimeout(initTimeoutId);
      return;
    }
    
    console.log('Setting up auth state listener');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('Auth state changed:', event, newSession?.user?.email);
      
      setSession(newSession);
      
      if (newSession?.access_token) {
        const newSessionId = newSession.access_token.slice(-8);
        setSessionId(newSessionId);
        console.log('Session identified as:', newSessionId);
      } else {
        setSessionId(null);
      }
      
      if (event === 'SIGNED_IN' && newSession) {
        handleSignIn(newSession);
      } else if (event === 'SIGNED_OUT') {
        handleSignOut();
        setIsInitializing(false);
        clearTimeout(initTimeoutId);
      } else if (event === 'TOKEN_REFRESHED') {
        handleTokenRefresh(newSession);
      } else if (event === 'USER_UPDATED') {
        if (newSession) {
          handleUserUpdate(newSession);
        }
        setIsInitializing(false);
        clearTimeout(initTimeoutId);
      } else {
        setIsInitializing(false);
        clearTimeout(initTimeoutId);
      }
    });

    const checkSession = async () => {
      try {
        console.log('Checking for existing session');
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          console.log('Found existing session, refreshing if needed');
          if (data.session.access_token) {
            const existingSessionId = data.session.access_token.slice(-8);
            setSessionId(existingSessionId);
            console.log('Existing session identified as:', existingSessionId);
          }
          
          await refreshSessionIfNeeded();
          
          const currentUser = await syncUserWithSupabase();
          if (currentUser) {
            setUser(currentUser);
          } else {
            setUser(null);
            setSessionId(null);
            localStorage.removeItem('userProfile');
          }
        } else {
          console.log('No active session, clearing state');
          setUser(null);
          setSessionId(null);
          localStorage.removeItem('userProfile');
        }
      } catch (error) {
        console.error('Session check error:', error);
        setUser(null);
        setSessionId(null);
        localStorage.removeItem('userProfile');
      } finally {
        setIsInitializing(false);
        clearTimeout(initTimeoutId);
      }
    };
    
    checkSession();

    const sessionRefreshInterval = setInterval(async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          await refreshSessionIfNeeded();
        } else {
          setUser(null);
          setSessionId(null);
          localStorage.removeItem('userProfile');
        }
      } catch (error) {
        console.error('Session refresh error:', error);
        logAuthError('session_refresh_error', error instanceof Error ? error.message : String(error));
      }
    }, 15 * 60 * 1000);

    return () => {
      subscription.unsubscribe();
      clearInterval(sessionRefreshInterval);
      clearTimeout(initTimeoutId);
    };
  }, []);

  // Event handlers extracted from the auth state change event
  const handleSignIn = async (newSession: Session) => {
    try {
      const userProfile = await getUserProfile(newSession.user.id);
      
      if (userProfile) {
        setUser(userProfile);
        saveUserToLocalStorage(userProfile);
        
        toast.success("Logged In", {
          description: `Welcome, ${userProfile.name}!`
        });
      } else {
        const { data: userData } = await supabase.auth.getUser();
        
        if (userData?.user) {
          const userMetadata = userData.user?.user_metadata || {};
          
          const fallbackProfile = {
            id: newSession.user.id,
            name: userMetadata.name || newSession.user.email?.split('@')[0] || 'User',
            email: newSession.user.email || '',
            isAuthenticated: true,
            hasCompletedSetup: userMetadata.hasCompletedSetup || false,
            program: userMetadata.program || '',
            year: userMetadata.year || '',
            bio: userMetadata.bio || '',
            phone: userMetadata.phone || ''
          };
          
          setUser(fallbackProfile);
          saveUserToLocalStorage(fallbackProfile);
          
          toast.success("Logged In", {
            description: `Welcome, ${fallbackProfile.name}!`
          });
        }
      }
    } catch (error) {
      console.error('Error processing sign in event:', error);
      setUser(null);
      logAuthError('sign_in_error', error instanceof Error ? error.message : String(error));
    }
  };

  const handleSignOut = () => {
    console.log('User signed out, clearing state');
    setUser(null);
    setSessionId(null);
    
    // Clear all auth-related data
    clearAllLocalStorage();
    
    toast.success("Logged Out", {
      description: "You have been successfully logged out."
    });
  };

  const handleTokenRefresh = (newSession: Session | null) => {
    console.log('Session token refreshed');
    if (newSession?.access_token) {
      const refreshedSessionId = newSession.access_token.slice(-8);
      setSessionId(refreshedSessionId);
      console.log('Session refreshed, new identifier:', refreshedSessionId);
    }
  };

  const handleUserUpdate = async (newSession: Session) => {
    try {
      const updatedProfile = await getUserProfile(newSession.user.id);
      
      if (updatedProfile) {
        setUser(updatedProfile);
        saveUserToLocalStorage(updatedProfile);
      }
    } catch (error) {
      console.error('Error processing user update event:', error);
      logAuthError('user_update_error', error instanceof Error ? error.message : String(error));
    }
  };

  const logout = useCallback(async (): Promise<void> => {
    try {
      // Clear all localStorage
      clearAllLocalStorage();
      
      // Clear state
      setUser(null);
      setSession(null);
      setSessionId(null);
      
      // First, force signout in Supabase with session invalidation
      if (isSupabaseConfigured()) {
        console.log('Signing out from Supabase with global scope');
        const { error } = await supabase.auth.signOut({ 
          scope: 'global',  // Invalidate all sessions
        });
        
        if (error) {
          console.error('Error during logout:', error);
          logAuthError('logout_error', error instanceof Error ? error.message : String(error));
          toast.error("Logout Error", {
            description: "There was a problem logging you out."
          });
          return;
        }
      }
      
      // Force localStorage cleanup again to be safe
      localStorage.removeItem('userProfile');
      localStorage.removeItem('userMessages');
      localStorage.removeItem('supabase-auth');
      localStorage.removeItem('savedItems');
      localStorage.removeItem('authRedirectToast');
      
      // Force reset the Supabase client auth storage
      try {
        // Attempt to force reset the auth state in localStorage
        if (window.localStorage) {
          for (const key of Object.keys(localStorage)) {
            if (key.startsWith('supabase.auth.') || key === 'supabase-auth') {
              localStorage.removeItem(key);
            }
          }
        }
      } catch (e) {
        console.error('Error clearing auth storage:', e);
      }
      
      toast.success("Logged Out", {
        description: "You have been successfully logged out."
      });
    } catch (error) {
      console.error("Error during logout:", error);
      logAuthError('logout_error', error instanceof Error ? error.message : String(error));
      toast.error("Logout Error", {
        description: "There was a problem logging you out."
      });
    }
  }, []);

  return {
    user,
    session,
    isAuthenticated: !!user,
    isInitializing,
    isUpdatingProfile,
    sessionId,
    setUser,
    setIsUpdatingProfile,
    logout
  };
}
