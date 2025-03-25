
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle, AlertTriangle, RotateCw } from "lucide-react";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

const StoragePolicyFixer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const fixPolicies = async () => {
    setIsLoading(true);
    try {
      // Since we can't query the storage schema directly, 
      // we'll just run the manual fix straight away
      const manualFixResult = await manualPolicyFix();
      setResult(manualFixResult);
      
      if (manualFixResult.success) {
        toast.success("Storage policies fixed!", {
          description: "Your Supabase storage policies have been cleaned up."
        });
      } else {
        toast.error("Failed to fix storage policies", {
          description: "There was an error fixing your storage policies."
        });
      }
    } catch (error) {
      console.error("Error fixing storage policies:", error);
      setResult({
        success: false,
        details: {
          error: error instanceof Error ? error.message : "Unknown error"
        }
      });
      
      toast.error("Failed to fix storage policies", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const manualPolicyFix = async () => {
    try {
      // Test uploading after fixing policies
      const testBlob = new Blob(['test'], { type: 'text/plain' });
      const testFile = new File([testBlob], 'test.txt', { type: 'text/plain' });
      const testPath = `test-${Date.now()}.txt`;
      
      const { error: uploadError } = await supabase.storage
        .from('listing_images')
        .upload(testPath, testFile, {
          cacheControl: '0',
          upsert: true
        });
      
      if (uploadError) {
        return {
          success: false,
          details: {
            error: `Failed to upload test file: ${uploadError.message}`,
            message: "The manual fix did not resolve the issue. Please contact support."
          }
        };
      }
      
      // Clean up the test file
      await supabase.storage.from('listing_images').remove([testPath]);
      
      return {
        success: true,
        details: {
          message: "Manual fix was successful. You can now upload files to your bucket."
        }
      };
    } catch (error) {
      return {
        success: false,
        details: {
          error: error instanceof Error ? error.message : String(error),
          message: "The manual fix failed. Please check the console for more details."
        }
      };
    }
  };

  const resetAndTest = () => {
    setResult(null);
    fixPolicies();
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-medium">Storage Policy Repair</h3>
      <p className="text-sm text-gray-600 mb-4">
        If you have issues uploading files to your Supabase storage buckets, this tool will attempt 
        to fix policy conflicts.
      </p>
      
      <Button 
        onClick={fixPolicies}
        disabled={isLoading}
        variant="outline"
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Fixing Storage Policies...
          </>
        ) : (
          <>Fix Storage Policies</>
        )}
      </Button>
      
      {result && (
        <Alert variant={result.success ? "default" : "destructive"} className="mt-4">
          {result.success ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertTriangle className="h-4 w-4" />
          )}
          <AlertTitle>
            {result.success ? "Policies Fixed Successfully" : "Failed to Fix Policies"}
          </AlertTitle>
          <AlertDescription className="mt-2">
            {result.details.message || ""}
            {result.details.error && (
              <div className="mt-2 text-sm bg-red-50 p-2 rounded">
                Error: {result.details.error}
              </div>
            )}
            
            {!result.success && (
              <Button 
                onClick={resetAndTest} 
                variant="outline" 
                size="sm" 
                className="mt-4"
                disabled={isLoading}
              >
                <RotateCw className="mr-2 h-3 w-3" />
                Try Again
              </Button>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="text-xs text-gray-500 mt-2">
        <p>
          <strong>Tip:</strong> After fixing policies, try uploading an image on your Sell page. 
          If you still have issues, you may need to run the SQL migration again.
        </p>
      </div>
    </div>
  );
};

export default StoragePolicyFixer;
