
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { testSupabaseStorage, diagnoseBucketIssues } from '@/utils/supabaseStorageTest';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const SupabaseStorageTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  const runTest = async () => {
    setIsLoading(true);
    try {
      const testResult = await testSupabaseStorage();
      setResult(testResult);
      
      if (testResult.success) {
        toast.success("Storage test successful!", {
          description: "Your Supabase storage is configured correctly."
        });
      } else {
        toast.error("Storage test failed", {
          description: "There are issues with your Supabase storage configuration."
        });
      }
    } catch (error) {
      console.error("Error running storage test:", error);
      toast.error("Test failed", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-medium">Supabase Storage Diagnostics</h3>
      
      <Button 
        onClick={runTest}
        disabled={isLoading}
        variant="outline"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Running Test...
          </>
        ) : (
          <>Test Storage Connection</>
        )}
      </Button>
      
      {result && (
        <Alert variant={result.success ? "default" : "destructive"}>
          {result.success ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertTriangle className="h-4 w-4" />
          )}
          <AlertTitle>
            {result.success ? "Storage is working correctly" : "Storage configuration issues"}
          </AlertTitle>
          <AlertDescription className="mt-2">
            {result.success ? (
              "Your Supabase storage is properly configured and ready for use."
            ) : (
              <div className="space-y-2">
                <p>The following issues were detected:</p>
                <ul className="list-disc pl-5 space-y-1">
                  {!result.details.bucketExists && (
                    <li>The bucket 'listing_images' doesn't exist</li>
                  )}
                  {result.details.bucketExists && !result.details.bucketIsPublic && (
                    <li>The bucket exists but is not public</li>
                  )}
                  {result.details.bucketExists && result.details.canList === false && (
                    <li>Cannot list files (check SELECT permissions)</li>
                  )}
                  {result.details.bucketExists && result.details.canUpload === false && (
                    <li>Cannot upload files (check INSERT permissions)</li>
                  )}
                  {result.details.error && (
                    <li className="text-red-500">{result.details.error}</li>
                  )}
                </ul>
                <p className="text-sm mt-2">
                  Try running the SQL migration again or check your Supabase configuration.
                </p>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default SupabaseStorageTest;
