
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export function useSessionExpiry() {
  const [isNearExpiry, setIsNearExpiry] = useState(false);
  const [expiryTime, setExpiryTime] = useState<Date | null>(null);
  
  // Check if session is close to expiry (less than 10 minutes)
  const checkSessionExpiry = useCallback(async () => {
    try {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return;
      
      const expiresAt = data.session.expires_at;
      if (!expiresAt) return;
      
      const expiryDate = new Date(expiresAt * 1000);
      setExpiryTime(expiryDate);
      
      const now = new Date();
      const timeUntilExpiry = expiryDate.getTime() - now.getTime();
      const tenMinutesInMs = 10 * 60 * 1000;
      
      // Set near expiry if less than 10 minutes left
      setIsNearExpiry(timeUntilExpiry < tenMinutesInMs && timeUntilExpiry > 0);
      
      // Show notification when session is about to expire
      if (timeUntilExpiry < tenMinutesInMs && timeUntilExpiry > 0 && !isNearExpiry) {
        const minutes = Math.floor(timeUntilExpiry / 60000);
        toast.warning("Session Expiring Soon", {
          description: `Your session will expire in ${minutes} minute${minutes !== 1 ? 's' : ''}`,
          action: {
            label: "Refresh",
            onClick: () => refreshSession()
          },
          duration: 10000, // Show for 10 seconds
        });
      }
    } catch (error) {
      console.error('Error checking session expiry:', error);
    }
  }, [isNearExpiry]);
  
  // Refresh session
  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('Error refreshing session:', error);
        return;
      }
      
      if (data && data.session) {
        setIsNearExpiry(false);
        const newExpiryDate = new Date(data.session.expires_at! * 1000);
        setExpiryTime(newExpiryDate);
        toast.success("Session Refreshed", {
          description: "Your session has been successfully extended."
        });
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
    }
  };
  
  useEffect(() => {
    // Check session expiry on mount and then every minute
    checkSessionExpiry();
    const interval = setInterval(() => {
      checkSessionExpiry();
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [checkSessionExpiry]);
  
  return {
    isNearExpiry,
    expiryTime,
    refreshSession
  };
}
