
import { supabase } from '@/integrations/supabase/client';

/**
 * Test function to validate Supabase storage configuration
 */
export const testSupabaseStorage = async (bucket: string = 'listing_images'): Promise<{
  success: boolean;
  details: {
    bucketExists: boolean;
    bucketIsPublic?: boolean;
    canUpload?: boolean;
    canDownload?: boolean;
    canList?: boolean;
    error?: string;
  }
}> => {
  const result = {
    success: false,
    details: {
      bucketExists: false,
      bucketIsPublic: undefined,
      canUpload: undefined,
      canList: undefined,
      error: undefined
    }
  };
  
  try {
    // Test 1: Check if bucket exists
    console.log('Testing if bucket exists:', bucket);
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      result.details.error = `Error listing buckets: ${bucketError.message}`;
      return result;
    }
    
    const foundBucket = buckets.find(b => b.name === bucket);
    result.details.bucketExists = !!foundBucket;
    
    if (!foundBucket) {
      result.details.error = `Bucket '${bucket}' not found`;
      return result;
    }
    
    result.details.bucketIsPublic = foundBucket.public;
    
    // Test 2: Try to list files (test read permissions)
    try {
      const { data: files, error: listError } = await supabase.storage
        .from(bucket)
        .list();
      
      result.details.canList = !listError;
      
      if (listError) {
        result.details.error = `Cannot list files: ${listError.message}`;
      }
    } catch (e) {
      result.details.canList = false;
      result.details.error = `Exception when listing files: ${e instanceof Error ? e.message : String(e)}`;
    }
    
    // Test 3: Try to upload a test file (test write permissions)
    const testBlob = new Blob(['test'], { type: 'text/plain' });
    const testFile = new File([testBlob], 'test.txt', { type: 'text/plain' });
    const testPath = `test-${Date.now()}.txt`;
    
    try {
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(testPath, testFile, {
          cacheControl: '0',
          upsert: true
        });
      
      result.details.canUpload = !uploadError;
      
      if (uploadError) {
        result.details.error = `Cannot upload: ${uploadError.message}`;
      } else {
        // If upload succeeded, try to clean up
        await supabase.storage.from(bucket).remove([testPath]);
      }
    } catch (e) {
      result.details.canUpload = false;
      result.details.error = `Exception when uploading: ${e instanceof Error ? e.message : String(e)}`;
    }
    
    // Overall success is when all tests pass
    result.success = result.details.bucketExists && 
                    result.details.bucketIsPublic === true &&
                    result.details.canList === true &&
                    result.details.canUpload === true;
    
    return result;
  } catch (error) {
    console.error('Error testing Supabase storage:', error);
    result.details.error = `Unexpected error: ${error instanceof Error ? error.message : String(error)}`;
    return result;
  }
};

/**
 * Runs the test and returns a user-friendly message
 */
export const diagnoseBucketIssues = async (bucket: string = 'listing_images'): Promise<string> => {
  try {
    const result = await testSupabaseStorage(bucket);
    
    if (result.success) {
      return `✅ Supabase storage is working correctly! Bucket '${bucket}' exists and is properly configured.`;
    }
    
    // Build helpful diagnostic message
    let message = `⚠️ There are issues with your Supabase storage configuration:\n\n`;
    
    if (!result.details.bucketExists) {
      message += `• Bucket '${bucket}' doesn't exist. Please check your SQL migration or create it manually.\n`;
    } else {
      if (result.details.bucketIsPublic === false) {
        message += `• Bucket '${bucket}' exists but is not public. Set 'public' to true in the buckets table.\n`;
      }
      
      if (result.details.canList === false) {
        message += `• Cannot list files in the bucket. Check your RLS policies for SELECT permissions.\n`;
      }
      
      if (result.details.canUpload === false) {
        message += `• Cannot upload files to the bucket. Check your RLS policies for INSERT permissions.\n`;
      }
    }
    
    if (result.details.error) {
      message += `\nError details: ${result.details.error}`;
    }
    
    return message;
  } catch (error) {
    return `Error running diagnosis: ${error instanceof Error ? error.message : String(error)}`;
  }
};
