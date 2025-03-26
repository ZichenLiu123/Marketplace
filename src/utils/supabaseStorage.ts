
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

/**
 * Uploads an image to Supabase storage
 * @param file The file to upload
 * @param bucketName The name of the bucket to upload to
 * @returns The URL of the uploaded file or null if there was an error
 */
export const uploadImage = async (
  file: File,
  bucketName: string = 'listing-images'
): Promise<string | null> => {
  try {
    // Check if user is authenticated
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;
    
    if (!userId) {
      console.error('User must be authenticated to upload files');
      return null;
    }
    
    // Create a unique file path with the user ID as the first segment (required for RLS)
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${uuidv4()}.${fileExt}`;
    
    console.log(`Uploading file to ${bucketName}/${fileName}`);
    
    // Get list of buckets to verify case-sensitivity
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    if (bucketError) {
      console.error('Error checking buckets:', bucketError);
      return null;
    }
    
    // Find the actual bucket name with correct case
    const actualBucketName = buckets.find(b => b.name.toLowerCase() === bucketName.toLowerCase())?.name;
    
    if (!actualBucketName) {
      console.error(`Bucket not found: ${bucketName}`);
      return null;
    }
    
    // Upload file to Supabase using the actual bucket name
    const { data, error } = await supabase.storage
      .from(actualBucketName)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      console.error('Error uploading file:', error);
      return null;
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from(actualBucketName)
      .getPublicUrl(data.path);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('Unexpected error during upload:', error);
    return null;
  }
};

/**
 * Deletes an image from Supabase storage
 * @param url The URL of the file to delete
 * @returns Whether the deletion was successful
 */
export const deleteImage = async (url: string): Promise<boolean> => {
  try {
    // Extract the path from the URL
    // URL format: https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>
    const pathRegex = /\/storage\/v1\/object\/public\/([^\/]+)\/(.+)/;
    const matches = url.match(pathRegex);
    
    if (!matches || matches.length < 3) {
      console.error('Invalid Supabase storage URL:', url);
      return false;
    }
    
    const bucket = matches[1];
    const path = matches[2];
    
    // Check if user is authenticated
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;
    
    if (!userId) {
      console.error('User must be authenticated to delete files');
      return false;
    }
    
    // Verify the file belongs to the current user (first path segment should be userId)
    const pathSegments = path.split('/');
    if (pathSegments[0] !== userId) {
      console.error('Cannot delete file not owned by current user');
      return false;
    }
    
    // Delete the file
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    
    if (error) {
      console.error('Error deleting file:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error during deletion:', error);
    return false;
  }
};

/**
 * Lists images in a specific folder
 * @param folder The folder to list images from
 * @param bucketName The name of the bucket
 * @returns Array of file objects or null if there was an error
 */
export const listImages = async (
  folder: string = '',
  bucketName: string = 'listing-images'
): Promise<any[] | null> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(folder);
    
    if (error) {
      console.error('Error listing files:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Unexpected error listing files:', error);
    return null;
  }
};

/**
 * Gets a public URL for a file
 * @param path The path of the file
 * @param bucketName The name of the bucket
 * @returns The public URL of the file
 */
export const getPublicUrl = (
  path: string,
  bucketName: string = 'listing-images'
): string => {
  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(path);
  
  return data.publicUrl;
};

/**
 * Creates a signed URL for a file (time-limited access)
 * @param path The path of the file
 * @param expiresIn Expiration time in seconds
 * @param bucketName The name of the bucket
 * @returns The signed URL or null if there was an error
 */
export const createSignedUrl = async (
  path: string,
  expiresIn: number = 60,
  bucketName: string = 'listing-images'
): Promise<string | null> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(path, expiresIn);
    
    if (error) {
      console.error('Error creating signed URL:', error);
      return null;
    }
    
    return data.signedUrl;
  } catch (error) {
    console.error('Unexpected error creating signed URL:', error);
    return null;
  }
};
