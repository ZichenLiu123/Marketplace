import { supabase as configuredSupabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth';
import { v4 as uuidv4 } from 'uuid';
import { uploadImage, deleteImage, prepareImageUrl } from '@/utils/imageUtils';

// Use the configured Supabase client from the integration
export const supabase = configuredSupabase;

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  try {
    // Check if we have a Supabase client with valid configuration
    return !!supabase && !!supabase.auth;
  } catch (error) {
    console.error('Supabase configuration error:', error);
    return false;
  }
};

// Helper function to reset all auth sessions
export const resetAllSessions = async (): Promise<boolean> => {
  if (!isSupabaseConfigured()) {
    return false;
  }
  
  try {
    // Sign out with global scope to invalidate all sessions
    const { error } = await supabase.auth.signOut({ scope: 'global' });
    
    if (error) {
      console.error('Error resetting sessions:', error);
      return false;
    }
    
    // Clear any auth data from localStorage
    if (typeof window !== 'undefined') {
      try {
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('supabase.auth.') || key === 'supabase-auth') {
            localStorage.removeItem(key);
          }
        });
      } catch (e) {
        console.warn('Failed to clean localStorage:', e);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in resetAllSessions:', error);
    return false;
  }
};

// Retrieve current session from Supabase
export const getCurrentSession = async () => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error getting session:', error);
      return null;
    }
    return data.session;
  } catch (error) {
    console.error('Error in getCurrentSession:', error);
    return null;
  }
};

// Get current user with complete profile information
export const getCurrentUser = async (): Promise<User | null> => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  
  try {
    const session = await getCurrentSession();
    if (!session) {
      console.log('No active session found');
      return null;
    }
    
    // First try to get user from profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    if (!profileError && profileData) {
      return {
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
    }
    
    // Fallback to auth user data
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      console.error('Error fetching user data:', userError);
      return null;
    }
    
    const userMetadata = userData.user.user_metadata || {};
    
    return {
      id: userData.user.id,
      name: userMetadata.name || userData.user.email?.split('@')[0] || 'User',
      email: userData.user.email || '',
      isAuthenticated: true,
      hasCompletedSetup: !!userMetadata.hasCompletedSetup,
      program: userMetadata.program || '',
      year: userMetadata.year || '',
      bio: userMetadata.bio || '',
      phone: userMetadata.phone || ''
    };
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return null;
  }
};

// Add timeout function to help with debugging - with improved error handling
export const withTimeout = <T>(promise: Promise<T>, timeoutMs: number, errorMessage: string): Promise<T> => {
  let timeoutId: NodeJS.Timeout;
  
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`${errorMessage} (timeout after ${timeoutMs}ms)`));
    }, timeoutMs);
  });

  return Promise.race([
    promise.then(value => {
      clearTimeout(timeoutId);
      return value;
    }).catch(error => {
      // Propagate the original error if it fails
      clearTimeout(timeoutId);
      throw error;
    }),
    timeoutPromise,
  ]);
};

// Helper function to log supabase operations
export const logOperation = (operation: string, startTime: number) => {
  const duration = Date.now() - startTime;
  console.log(`Supabase operation: ${operation} completed in ${duration}ms`);
};

// Refresh the session if it's close to expiration
export const refreshSessionIfNeeded = async () => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  
  try {
    const session = await getCurrentSession();
    if (!session) return null;
    
    // Check if the session expires in less than 60 minutes (3600 seconds)
    const expiresAt = session.expires_at || 0;
    const expiresIn = expiresAt - Math.floor(Date.now() / 1000);
    
    if (expiresIn < 3600) {
      console.log('Session expiring soon, refreshing...');
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('Error refreshing session:', error);
        return null;
      }
      return data.session;
    }
    
    return session;
  } catch (error) {
    console.error('Error in refreshSessionIfNeeded:', error);
    return null;
  }
};

// Functions for listings

// Create a new listing
export const createListing = async (listingData: any) => {
  if (!isSupabaseConfigured()) {
    return { error: 'Supabase is not configured' };
  }
  
  try {
    const { data, error } = await supabase
      .from('listings')
      .insert(listingData)
      .select('id')
      .single();
    
    if (error) {
      console.error('Error creating listing:', error);
      return { error };
    }
    
    return { data };
  } catch (error) {
    console.error('Error in createListing:', error);
    return { error };
  }
};

// Get all active listings
export const getListings = async () => {
  if (!isSupabaseConfigured()) {
    return { data: [] };
  }
  
  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('deleted', false)
      .order('posted_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching listings:', error);
      return { error };
    }
    
    return { data: data || [] };
  } catch (error) {
    console.error('Error in getListings:', error);
    return { error };
  }
};

// Get a specific listing by ID
export const getListingById = async (listingId: string) => {
  if (!isSupabaseConfigured()) {
    return { error: 'Supabase is not configured' };
  }
  
  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('id', listingId)
      .eq('deleted', false)
      .single();
    
    if (error) {
      console.error('Error fetching listing:', error);
      return { error };
    }
    
    return { data };
  } catch (error) {
    console.error('Error in getListingById:', error);
    return { error };
  }
};

/**
 * Uploads a listing image to Supabase storage
 */
export const uploadListingImage = async (userId: string, file: File): Promise<string | null> => {
  return uploadImage('listing_images', userId, file);
};

/**
 * Uploads a profile image to Supabase storage
 */
export const uploadProfileImage = async (userId: string, file: File): Promise<string | null> => {
  return uploadImage('profile_images', userId, file);
};

/**
 * Creates a valid image URL with appropriate parameters
 */
export const createValidImageUrl = (url: string | null | undefined): string => {
  return prepareImageUrl(url);
};

/**
 * Deletes a listing and its associated image
 */
export const deleteListingAndImage = async (listingId: string, imageUrl?: string | null): Promise<{ success: boolean, error?: any }> => {
  try {
    // First try to delete the image if there is one
    if (imageUrl) {
      await deleteImage(imageUrl);
      console.log(`Deleted image for listing: ${listingId}`);
    }
    
    // Then delete the listing
    const { error } = await supabase
      .from('listings')
      .update({ deleted: true })
      .eq('id', listingId);
    
    return { success: !error, error };
  } catch (error) {
    console.error('Error in deleteListingAndImage:', error);
    return { success: false, error };
  }
};

// Get messages for a user
export const getUserMessages = async (userId: string): Promise<any[]> => {
  if (!userId || !isSupabaseConfigured()) return [];
  
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching user messages:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getUserMessages:', error);
    return [];
  }
};

// Send a message
export const sendMessage = async (
  senderId: string, 
  receiverId: string, 
  message: string, 
  listingId?: string, 
  listingTitle?: string
): Promise<boolean> => {
  if (!senderId || !receiverId || !isSupabaseConfigured()) return false;
  
  try {
    const { error } = await supabase
      .from('messages')
      .insert({
        sender_id: senderId,
        receiver_id: receiverId,
        message,
        listing_id: listingId,
        listing_title: listingTitle,
        read: false
      });
    
    if (error) {
      console.error('Error sending message:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in sendMessage:', error);
    return false;
  }
};

// Mark message as read
export const markMessageAsRead = async (messageId: string): Promise<boolean> => {
  if (!messageId || !isSupabaseConfigured()) return false;
  
  try {
    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('id', messageId);
    
    if (error) {
      console.error('Error marking message as read:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in markMessageAsRead:', error);
    return false;
  }
};

// Flag a listing
export const flagListing = async (
  flaggerId: string,
  listingId: string,
  reason: string
): Promise<boolean> => {
  if (!flaggerId || !listingId || !isSupabaseConfigured()) return false;
  
  try {
    const { error } = await supabase
      .from('flagged_listings')
      .insert({
        flagger_id: flaggerId,
        listing_id: listingId,
        reason
      });
    
    if (error) {
      console.error('Error flagging listing:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in flagListing:', error);
    return false;
  }
};

// Helper function to debug image loading issues - consolidated version
export const debugImageUrl = (url: string | null | undefined): void => {
  if (!url || url === 'null' || url === 'undefined' || url === '') {
    console.log('Image URL is empty, null, or undefined');
    return;
  }

  console.log('Original image URL:', url);
  console.log('URL length:', url.length);
  console.log('URL contains supabase storage path:', url.includes('supabase.co/storage'));
  
  // Check if the URL already has download parameter
  console.log('URL already has download parameter:', url.includes('download=true'));
  
  // Log the processed URL that will be used
  const processedUrl = createValidImageUrl(url);
  console.log('Processed image URL:', processedUrl);
};

// Helper function to get image from Supabase storage with proper headers
export const fetchSupabaseImage = async (url: string): Promise<Response> => {
  try {
    // Make sure the URL has the download=true parameter if it's a Supabase URL
    let fetchUrl = url;
    if (url.includes('supabase.co/storage/v1/object/public') && !url.includes('download=true')) {
      fetchUrl = url.includes('?') 
        ? `${url}&download=true` 
        : `${url}?download=true`;
    }
    
    // Add full headers to ensure proper fetch
    return await fetch(fetchUrl, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Accept': 'image/*'
      },
      cache: 'no-store',
      mode: 'cors',
      credentials: 'omit'
    });
  } catch (error) {
    console.error('Error fetching image from Supabase:', error);
    throw error;
  }
};
