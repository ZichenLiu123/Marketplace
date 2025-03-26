
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, CheckCircle, AlertTriangle, FileCode } from "lucide-react";
import { fixStoragePolicies, diagnoseBucketIssues } from '@/utils/supabaseStorageTest';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const StoragePolicyFixer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [sqlFix, setSqlFix] = useState<string | null>(null);
  
  const checkLoginStatus = async () => {
    const { data } = await supabase.auth.getSession();
    setIsLoggedIn(!!data.session);
    setUserId(data.session?.user?.id || null);
    return !!data.session;
  };
  
  const runDiagnostics = async () => {
    setIsLoading(true);
    
    try {
      // First check if user is logged in
      const loggedIn = await checkLoginStatus();
      
      if (!loggedIn) {
        setDiagnostics({
          success: false,
          suggestions: [
            "You must be logged in to upload images.", 
            "Please sign in first and try again."
          ]
        });
        toast.error("Authentication required", {
          description: "You must be logged in to test storage policies."
        });
        return;
      }
      
      const result = await diagnoseBucketIssues();
      setDiagnostics(result);
      
      if (result.suggestions && result.suggestions.length > 0) {
        toast("Diagnostics complete", {
          description: "Found potential issues with storage configuration."
        });
      } else {
        toast.success("Storage looks good", {
          description: "No obvious issues found with storage policies."
        });
      }
    } catch (error) {
      console.error("Error running diagnostics:", error);
      toast.error("Diagnostics failed", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const showSqlFix = async () => {
    setIsLoading(true);
    
    try {
      const result = await fixStoragePolicies();
      if (result.success) {
        setSqlFix(result.sql || '-- No SQL fixes needed');
        toast.success("SQL fix generated", {
          description: "View the SQL to fix storage policies"
        });
      } else {
        toast.error("Failed to generate SQL fix", {
          description: result.message
        });
      }
    } catch (error) {
      console.error("Error generating SQL fix:", error);
      toast.error("Error", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-medium">Supabase Storage Policy Diagnostics</h3>
      
      <div className="flex flex-col md:flex-row gap-2">
        <Button 
          onClick={runDiagnostics}
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running Diagnostics...
            </>
          ) : (
            <>Check Storage Policies</>
          )}
        </Button>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              onClick={showSqlFix}
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              <FileCode className="mr-2 h-4 w-4" />
              View SQL Fix
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>SQL to Fix Storage Policies</DialogTitle>
              <DialogDescription>
                Run these SQL statements in your Supabase dashboard to fix storage policies
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-96 w-full rounded-md border p-4">
              <pre className="text-xs font-mono whitespace-pre-wrap">{sqlFix || 'Loading...'}</pre>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
      
      {isLoggedIn !== null && (
        <Alert variant={isLoggedIn ? "default" : "destructive"}>
          {isLoggedIn ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertTriangle className="h-4 w-4" />
          )}
          <AlertTitle>
            {isLoggedIn ? "Authentication Status: Logged In" : "Authentication Status: Not Logged In"}
          </AlertTitle>
          <AlertDescription className="mt-2">
            {isLoggedIn ? (
              <div>
                <p>You are logged in with user ID: <code className="bg-gray-100 p-1 rounded text-xs">{userId?.substring(0, 8)}...</code></p>
                <p className="text-sm mt-1">This is important because Storage RLS policies require a valid user ID.</p>
              </div>
            ) : (
              <div>
                <p className="text-sm">You must be logged in to upload images due to Row Level Security policies.</p>
                <p className="text-sm mt-1">Please sign in before attempting to upload images.</p>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      {diagnostics && diagnostics.suggestions && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Storage Configuration Suggestions</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              {diagnostics.suggestions.map((suggestion: string, index: number) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="text-xs text-gray-500 mt-2">
        <p>Storage RLS policies require that:</p>
        <ol className="list-decimal pl-5 mt-1">
          <li>You must be authenticated to upload files</li>
          <li>The file path must start with your user ID</li>
          <li>You can only modify/delete your own files</li>
        </ol>
      </div>
    </div>
  );
};

export default StoragePolicyFixer;
