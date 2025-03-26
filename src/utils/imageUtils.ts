
/**
 * Core image utility functions for uploading and displaying images
 */

import { supabase } from '@/integrations/supabase/client';

/**
 * Uploads an image to Supabase Storage with format preservation
 */
export const uploadImagePreservingFormat = async (
  bucket: string,
  userId: string,
  file: File
): Promise<string | null> => {
  try {
    if (!userId) {
      console.error('ERROR: User ID is required for image upload due to RLS policy');
      return null;
    }

    console.log('Starting image upload with format preservation', {
      bucket, 
      userId,
      fileType: file.type,
      fileName: file.name,
      fileSize: file.size
    });
    
    // Generate timestamp for unique file names
    const timestamp = Date.now();
    
    // Get file extension from file type or fall back to name
    let fileExt = '';
    if (file.type) {
      fileExt = file.type.split('/')[1] || '';
    }
    
    // If we couldn't get it from type, try from file name
    if (!fileExt && file.name) {
      const nameParts = file.name.split('.');
      if (nameParts.length > 1) {
        fileExt = nameParts[nameParts.length - 1];
      }
    }
    
    // Fall back to 'jpg' if we still don't have an extension
    if (!fileExt) {
      fileExt = 'jpg';
      console.warn('Could not determine file extension, defaulting to jpg');
    }
    
    // Create final file path with original file extension to preserve format
    // IMPORTANT: Include userId as the FIRST segment in the path to satisfy RLS policy
    const fileName = `${userId}/${timestamp}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
    console.log('Uploading to storage path:', fileName, 'with content type:', file.type);
    
    // Check if the bucket exists first - use exact case-sensitive bucket name
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    if (bucketError) {
      console.error('Error checking buckets:', bucketError);
      return null;
    }
    
    // Use case-insensitive comparison to find the bucket regardless of case
    const bucketExists = buckets.some(b => b.name.toLowerCase() === bucket.toLowerCase());
    if (!bucketExists) {
      console.error(`Error: Bucket does not exist: ${bucket}`);
      return null;
    }
    
    // Use the actual bucket name from the buckets list to ensure correct case
    const actualBucketName = buckets.find(b => b.name.toLowerCase() === bucket.toLowerCase())?.name || bucket;
    
    // Create a proper binary blob from the file with correct content type
    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: file.type || `image/${fileExt}` });
    
    // Get current session to verify we're authenticated
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      console.error('ERROR: No authenticated session found');
      return null;
    }
    
    // Upload with minimal processing - explicitly preserve binary format
    const { data, error } = await supabase.storage
      .from(actualBucketName)
      .upload(fileName, blob, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type || `image/${fileExt}` // Ensure correct content type is set
      });
    
    if (error) {
      console.error('Error uploading image:', error);
      console.error('Error details:', JSON.stringify(error));
      return null;
    }
    
    if (!data?.path) {
      console.error('Upload succeeded but no path returned');
      return null;
    }
    
    console.log('Upload successful, getting public URL');
    
    // Get the public URL with download=true parameter to ensure proper format
    const { data: publicUrlData } = supabase.storage
      .from(actualBucketName)
      .getPublicUrl(data.path, { 
        download: true  // Force download parameter for proper content type handling
      });
    
    if (!publicUrlData?.publicUrl) {
      console.error('Failed to get public URL');
      return null;
    }
    
    console.log('Generated public URL:', publicUrlData.publicUrl);
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Unexpected error during image upload:', error);
    return null;
  }
};

/**
 * Tests if an image URL is valid and loadable
 */
export const testImageUrl = async (url: string): Promise<boolean> => {
  try {
    // For empty URLs, return false immediately
    if (!url || url === 'null' || url === 'undefined') {
      return false;
    }
    
    // Add download parameter for Supabase URLs if missing
    let testUrl = url;
    if (url.includes('supabase.co/storage') && !url.includes('download=')) {
      testUrl = url.includes('?') 
        ? `${url}&download=true` 
        : `${url}?download=true`;
    }
    
    // Use fetch API to test URL
    const response = await fetch(testUrl, {
      method: 'HEAD',
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    // Check if response is ok and content type is an image
    const contentType = response.headers.get('content-type');
    const isImage = contentType && contentType.startsWith('image/');
    
    return response.ok && isImage;
  } catch (error) {
    console.error('Error testing image URL:', error);
    return false;
  }
};

/**
 * Creates an object URL from an image URL, useful for displaying images directly
 */
export const createObjectUrlFromImageUrl = async (
  url: string
): Promise<{ objectUrl: string | null, error: Error | null }> => {
  try {
    // Skip for empty URLs
    if (!url || url === 'null' || url === 'undefined') {
      return { objectUrl: null, error: new Error('Invalid URL') };
    }
    
    // Add download parameter for Supabase URLs if missing
    let fetchUrl = url;
    if (url.includes('supabase.co/storage') && !url.includes('download=')) {
      fetchUrl = url.includes('?') 
        ? `${url}&download=true` 
        : `${url}?download=true`;
    }
    
    // Fetch the image with proper headers
    const response = await fetch(fetchUrl, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Accept': 'image/*'
      }
    });
    
    if (!response.ok) {
      console.error('Image fetch failed with status:', response.status);
      return { objectUrl: null, error: new Error(`Failed to fetch image: ${response.status}`) };
    }
    
    // Get the image data as a blob
    const blob = await response.blob();
    if (blob.size === 0) {
      console.error('Empty blob received');
      return { objectUrl: null, error: new Error('Received empty image data') };
    }
    
    // Create and return an object URL
    const objectUrl = URL.createObjectURL(blob);
    return { objectUrl, error: null };
  } catch (error) {
    console.error('Error creating object URL:', error);
    return { 
      objectUrl: null, 
      error: error instanceof Error ? error : new Error('Unknown error creating object URL') 
    };
  }
};

/**
 * Uploads an image to Supabase Storage with minimal processing
 */
export const uploadImage = async (
  bucket: string,
  userId: string,
  file: File
): Promise<string | null> => {
  try {
    // Always use "listing-images" regardless of passed bucket parameter
    // This ensures backward compatibility
    return await uploadImagePreservingFormat('listing-images', userId, file);
  } catch (error) {
    console.error('Error in uploadImage:', error);
    return null;
  }
};

/**
 * Attempts to delete an image from Supabase Storage
 */
export const deleteImage = async (imageUrl: string): Promise<boolean> => {
  try {
    // Extract bucket and path from the URL
    const storageMatch = imageUrl.match(/\/storage\/v1\/object\/(public|sign)\/([^\/]+)\/(.+?)(\?|$)/);
    if (!storageMatch || storageMatch.length < 4) {
      console.error('Could not parse storage URL:', imageUrl);
      return false;
    }
    
    const bucket = 'Listing Images'; // Use the correct bucket name regardless of what's in the URL
    const path = storageMatch[3].split('?')[0]; // Remove query params
    
    console.log('Deleting image from storage:', { bucket, path });
    
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    
    if (error) {
      console.error('Error deleting image:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error in deleteImage:', error);
    return false;
  }
};

/**
 * Prepares an image URL for display with appropriate parameters
 */
export const prepareImageUrl = (url: string | null | undefined): string => {
  if (!url) return '/placeholder.svg';
  
  // If it's a Supabase storage URL
  if (url.includes('supabase.co/storage')) {
    // Add download parameter if not present
    if (!url.includes('download=')) {
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}download=true`;
    }
  }
  
  // Add cache-busting parameter
  const timestamp = new Date().getTime();
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${timestamp}`;
};

/**
 * Interface for fetch test results
 */
interface FetchTestResult {
  success: boolean;
  status?: number;
  contentType?: string;
  blobSize?: number;
  error?: string;
}

/**
 * Interface for image object test results
 */
interface ImageObjectTestResult {
  success: boolean;
  width?: number;
  height?: number;
  originalFormat?: string;
  error?: string;
}

/**
 * Interface for object URL test results
 */
interface ObjectUrlTestResult {
  objectUrl: string | null;
  error?: string;
}

/**
 * Interface for comprehensive image test results
 */
interface ComprehensiveImageTestResult {
  fetchTest: FetchTestResult;
  imageObjectTest: ImageObjectTestResult;
  objectUrlTest: ObjectUrlTestResult;
}

/**
 * Runs comprehensive tests on an image URL to diagnose issues
 */
export const runComprehensiveImageTest = async (url: string): Promise<ComprehensiveImageTestResult> => {
  const result: ComprehensiveImageTestResult = {
    fetchTest: {
      success: false
    },
    imageObjectTest: {
      success: false
    },
    objectUrlTest: {
      objectUrl: null
    }
  };
  
  try {
    // Test 1: Direct fetch test
    console.log('Running fetch test for URL:', url);
    const fetchResponse = await fetch(url, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Accept': 'image/*'
      }
    });
    
    const contentType = fetchResponse.headers.get('content-type');
    
    if (!fetchResponse.ok) {
      result.fetchTest.status = fetchResponse.status;
      result.fetchTest.error = `HTTP error: ${fetchResponse.status}`;
      console.error('Fetch test failed with status:', fetchResponse.status);
      return result;
    }
    
    // Get the blob content
    const blob = await fetchResponse.blob();
    
    // Update fetch test results
    result.fetchTest.success = true;
    result.fetchTest.contentType = contentType || undefined;
    result.fetchTest.blobSize = blob.size;
    result.fetchTest.status = fetchResponse.status;
    
    // Test 2: Test creating an image object
    console.log('Running image object test');
    const imageLoadPromise = new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        result.imageObjectTest.success = true;
        result.imageObjectTest.width = img.width;
        result.imageObjectTest.height = img.height;
        
        // Try to determine original format from content type
        if (contentType) {
          const formatMatch = contentType.match(/image\/(\w+)/);
          result.imageObjectTest.originalFormat = formatMatch ? formatMatch[1].toUpperCase() : undefined;
        }
        
        resolve();
      };
      img.onerror = () => {
        result.imageObjectTest.error = "Failed to load image object";
        reject(new Error("Failed to load image object"));
      };
      img.src = URL.createObjectURL(blob);
    });
    
    try {
      await imageLoadPromise;
    } catch (error) {
      console.error('Image object test failed:', error);
    }
    
    // Test 3: Object URL creation test
    console.log('Running object URL creation test');
    const objectUrlResult = await createObjectUrlFromImageUrl(url);
    result.objectUrlTest.objectUrl = objectUrlResult.objectUrl;
    if (!objectUrlResult.objectUrl && objectUrlResult.error) {
      result.objectUrlTest.error = objectUrlResult.error.message || "Failed to create object URL";
    }
    
    console.log('Comprehensive test complete, results:', result);
    return result;
  } catch (error) {
    console.error('Error in comprehensive image test:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    if (!result.fetchTest.success) {
      result.fetchTest.error = errorMessage;
    }
    
    if (!result.imageObjectTest.success) {
      result.imageObjectTest.error = errorMessage;
    }
    
    if (!result.objectUrlTest.objectUrl) {
      result.objectUrlTest.error = errorMessage;
    }
    
    return result;
  }
};

// Export main function with alias for backward compatibility
export { uploadImagePreservingFormat as uploadImageToSupabase };
