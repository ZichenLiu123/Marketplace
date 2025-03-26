
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

// Constants
const BUCKET_NAME = 'listing-images';

/**
 * Test Supabase Storage functionality
 * @returns Object with test results
 */
export const testSupabaseStorage = async () => {
  try {
    console.log('Starting Supabase Storage test...');
    
    // Check if user is authenticated
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      console.error('No authenticated session found');
      return {
        success: false,
        details: {
          error: 'Authentication required. Please sign in first.'
        }
      };
    }
    
    const userId = sessionData.session.user.id;
    
    // Step 1: Check if bucket exists
    console.log(`Checking if bucket '${BUCKET_NAME}' exists...`);
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
      return {
        success: false,
        details: {
          error: `Error listing buckets: ${bucketsError.message}`
        }
      };
    }
    
    // Use case-insensitive comparison
    const bucketExists = buckets.some(b => b.name.toLowerCase() === BUCKET_NAME.toLowerCase());
    if (!bucketExists) {
      console.error(`Bucket '${BUCKET_NAME}' does not exist`);
      return {
        success: false,
        details: {
          bucketExists: false,
          error: `Bucket '${BUCKET_NAME}' does not exist`
        }
      };
    }
    
    // Get actual bucket name with correct case
    const actualBucketName = buckets.find(b => b.name.toLowerCase() === BUCKET_NAME.toLowerCase())?.name || BUCKET_NAME;
    console.log(`Found bucket with name: ${actualBucketName}`);
    
    // Step 2: Check bucket public status
    console.log(`Checking if bucket '${actualBucketName}' is public...`);
    const bucket = buckets.find(b => b.name.toLowerCase() === BUCKET_NAME.toLowerCase());
    const bucketIsPublic = bucket?.public || false;
    
    if (!bucketIsPublic) {
      console.warn(`Bucket '${actualBucketName}' is not public`);
    }
    
    // Step 3: Test listing files
    console.log(`Testing LIST permission on bucket '${actualBucketName}'...`);
    const { data: files, error: listError } = await supabase.storage
      .from(actualBucketName)
      .list(`${userId}`);
    
    const canList = !listError;
    if (!canList) {
      console.error('Error listing files:', listError);
    }
    
    // Step 4: Test uploading a file
    console.log(`Testing UPLOAD permission to bucket '${actualBucketName}'...`);
    const testContent = 'test-content';
    const testBlob = new Blob([testContent], { type: 'text/plain' });
    const testFile = new File([testBlob], 'test.txt', { type: 'text/plain' });
    
    const testFilePath = `${userId}/test-${uuidv4()}.txt`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(actualBucketName)
      .upload(testFilePath, testFile, {
        cacheControl: '3600',
        upsert: true
      });
    
    const canUpload = !uploadError;
    if (!canUpload) {
      console.error('Error uploading test file:', uploadError);
      return {
        success: false,
        details: {
          bucketExists,
          bucketIsPublic,
          canList,
          canUpload: false,
          error: `Error uploading test file: ${uploadError.message}`
        }
      };
    }
    
    // Get public URL for the test file
    const { data: urlData } = supabase.storage
      .from(actualBucketName)
      .getPublicUrl(testFilePath);
    
    // Clean up: Delete the test file
    if (canUpload && testFilePath) {
      await supabase.storage
        .from(actualBucketName)
        .remove([testFilePath]);
    }
    
    // Return success results
    return {
      success: true,
      details: {
        bucketExists: true,
        bucketIsPublic,
        canList,
        canUpload: true,
        path: testFilePath
      }
    };
  } catch (error) {
    console.error('Unexpected error during storage test:', error);
    return {
      success: false,
      details: {
        error: error instanceof Error ? error.message : 'Unknown error during storage test'
      }
    };
  }
};

/**
 * Diagnose bucket issues and provide suggestions
 */
export const diagnoseBucketIssues = async () => {
  try {
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      return {
        suggestions: [
          `Error listing buckets: ${bucketsError.message}. Check your Supabase configuration and permissions.`
        ]
      };
    }
    
    const suggestions = [];
    
    // Check if listing-images bucket exists (case-insensitive)
    const bucketExists = buckets.some(b => b.name.toLowerCase() === 'listing-images'.toLowerCase());
    if (!bucketExists) {
      suggestions.push(`The 'listing-images' bucket doesn't exist. Create it in the Supabase dashboard or run the necessary SQL.`);
    } else {
      // Get actual bucket name with correct case
      const actualBucketName = buckets.find(b => b.name.toLowerCase() === 'listing-images'.toLowerCase())?.name;
      
      // Check bucket public status
      const bucket = buckets.find(b => b.name.toLowerCase() === 'listing-images'.toLowerCase());
      const bucketIsPublic = bucket?.public || false;
      
      if (!bucketIsPublic) {
        suggestions.push(`The '${actualBucketName}' bucket is not public. Make it public in the Supabase dashboard or run the necessary SQL.`);
      }
      
      // Check storage policies by trying a test operation instead of querying the objects table directly
      try {
        // Test if we can list files (should work if policies are set correctly)
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session) {
          const userId = sessionData.session.user.id;
          const { error: listError } = await supabase.storage
            .from(actualBucketName)
            .list(userId);
          
          if (listError) {
            suggestions.push(`Error checking storage policies: ${listError.message}`);
          }
        }
      } catch (policyError) {
        suggestions.push('Unable to check storage policies. Ensure that proper policies are set up for the bucket.');
      }
    }
    
    // Check authentication status
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      suggestions.push('You are not authenticated. Sign in to upload files.');
    }
    
    // If no issues found
    if (suggestions.length === 0) {
      suggestions.push(`Storage appears to be properly configured. If you're still having issues, try clearing your browser cache or signing out and back in.`);
    }
    
    return { suggestions };
  } catch (error) {
    return {
      suggestions: [
        'An error occurred while diagnosing bucket issues.',
        error instanceof Error ? error.message : 'Unknown error'
      ]
    };
  }
};

/**
 * Generate SQL statements to fix storage policies
 * @returns Object with SQL statements and success status
 */
export const fixStoragePolicies = async () => {
  try {
    // Check if user is authenticated
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      return {
        success: false,
        message: 'Authentication required. Please sign in first.'
      };
    }
    
    // Get buckets to check if listing-images exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      return {
        success: false,
        message: `Error listing buckets: ${bucketsError.message}`
      };
    }
    
    const bucketExists = buckets.some(b => b.name.toLowerCase() === 'listing-images'.toLowerCase());
    if (!bucketExists) {
      return {
        success: false,
        message: "The 'listing-images' bucket doesn't exist. Create it first.",
        sql: `
-- Create the Listing Images bucket
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES ('listing-images', 'listing-images', true, false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO NOTHING;
        `
      };
    }
    
    // Return SQL statements to fix storage policies
    return {
      success: true,
      message: 'SQL statements generated to fix storage policies',
      sql: `
-- Allow all authenticated users to upload any file to listing-images bucket
CREATE POLICY "Allow authenticated users to upload" 
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'listing-images');

-- Allow authenticated users to update their own files
CREATE POLICY "Allow users to update their own files" 
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'listing-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow everyone to view images in the listing-images bucket
CREATE POLICY "Allow public to view images" 
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'listing-images');

-- Allow users to delete files where the first folder segment matches their user ID
CREATE POLICY "Allow users to delete their own images" 
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'listing-images' AND auth.uid()::text = (storage.foldername(name))[1]);
      `
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error generating SQL'
    };
  }
};

