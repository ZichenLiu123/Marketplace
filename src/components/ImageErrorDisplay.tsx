
import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RefreshCw, Settings, Shield, Download, AlertCircle, FileType, HelpCircle } from 'lucide-react';

interface ImageErrorDisplayProps {
  imageUrl: string;
  isSupabaseUrl: boolean;
  showDiagnostics: boolean;
  diagnosticInfo: any;
  toggleDiagnostics: () => void;
  handleRetry: () => void;
  handleDownloadImage: () => void;
}

const ImageErrorDisplay: React.FC<ImageErrorDisplayProps> = ({
  imageUrl,
  isSupabaseUrl,
  showDiagnostics,
  diagnosticInfo,
  toggleDiagnostics,
  handleRetry,
  handleDownloadImage
}) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 p-4">
      <AlertCircle className="h-10 w-10 text-gray-400 mb-2" />
      <p className="text-gray-500 text-center mb-2">Unable to load image</p>
      <div className="flex space-x-2">
        <Button variant="outline" size="sm" onClick={handleRetry}>
          <RefreshCw className="h-4 w-4 mr-1" />
          Try Again
        </Button>
        <Button variant="ghost" size="sm" onClick={toggleDiagnostics}>
          <Settings className="h-4 w-4 mr-1" />
          {showDiagnostics ? 'Hide Details' : 'View Details'}
        </Button>
      </div>
      
      {showDiagnostics && (
        <div className="mt-4 bg-white p-3 rounded border border-gray-200 text-xs w-full max-w-md overflow-auto">
          <h4 className="font-bold mb-1">Image URL:</h4>
          <p className="break-all mb-2 text-gray-600">{imageUrl}</p>
          
          <h4 className="font-bold mb-1">Diagnostic Results:</h4>
          <ul className="space-y-1 text-gray-600">
            {diagnosticInfo?.success === false && (
              <li className="text-red-500">
                Error: {diagnosticInfo.error || 'Unknown error'}
              </li>
            )}
            {diagnosticInfo?.supabaseError && (
              <li className="text-red-500">
                Supabase Error: {diagnosticInfo.supabaseError}
              </li>
            )}
            {diagnosticInfo?.contentType && (
              <li>Content type: {diagnosticInfo.contentType}</li>
            )}
            {diagnosticInfo?.status && (
              <li>Status code: {diagnosticInfo.status}</li>
            )}
            {diagnosticInfo?.blobSize && (
              <li>Response size: {(diagnosticInfo.blobSize / 1024).toFixed(2)} KB</li>
            )}
            {isSupabaseUrl && (
              <li className="text-amber-600">
                Supabase storage URL detected. This requires the bucket to be public and the file to exist.
              </li>
            )}
          </ul>
          
          <div className="mt-2 pt-2 border-t border-gray-100">
            <h4 className="font-bold mb-1">Format Issues:</h4>
            <ul className="list-disc pl-4 space-y-1 text-gray-600">
              <li>Supabase may be transforming your image format during storage or retrieval</li>
              <li>Make sure upload functions don't include transform options</li>
              <li>Check if <code>quality</code> parameters are in the URL as they cause WebP conversions</li>
              <li>Try downloading directly with <code>?download=true</code> parameter</li>
              <li>Use the new <code>uploadImagePreservingFormat</code> function for future uploads</li>
            </ul>
          </div>
          
          <div className="mt-2 pt-2 border-t border-gray-100">
            <h4 className="font-bold mb-1">Preserving Image Formats:</h4>
            <ul className="list-disc pl-4 space-y-1 text-gray-600">
              <li>Always set correct <code>contentType</code> matching the file type</li>
              <li>Avoid using <code>resize</code> or <code>format</code> transform options</li>
              <li>Ensure CORS and storage bucket policies allow both SELECT and DOWNLOAD</li>
              <li>When fetching images, use <code>download=true</code> parameter</li>
              <li>For sensitive formats, consider using the browser's File API to preview before upload</li>
            </ul>
          </div>
          
          <div className="mt-2 pt-2 border-t border-gray-100">
            <h4 className="font-bold mb-1">Suggestions:</h4>
            <ul className="list-disc pl-4 space-y-1 text-gray-600">
              {isSupabaseUrl && (
                <>
                  <li>Verify the file exists in your Supabase storage bucket</li>
                  <li>Make sure the storage bucket has public access enabled</li>
                  <li>Check bucket RLS policies allow both SELECT and DOWNLOAD actions</li>
                  <li>Try adding <code>download=true</code> parameter to URL</li>
                  <li>If bucket is private, use <code>createSignedUrl()</code> with the SDK</li>
                </>
              )}
              <li>Check if the URL is accessible directly in your browser</li>
              <li>Try the direct download button below</li>
            </ul>
          </div>
          
          {isSupabaseUrl && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDownloadImage}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-1" />
                Download Image Directly
              </Button>
              <p className="text-xs text-gray-500 mt-1">
                This attempts to download the file directly using the Supabase SDK.
              </p>
            </div>
          )}
          
          <div className="mt-2 pt-2 border-t border-gray-100">
            <h4 className="font-bold mb-1 flex items-center">
              <FileType className="h-4 w-4 mr-1" />
              Standard Upload Code Example:
            </h4>
            <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto max-h-32">
{`// For preserving original format
const { data, error } = await supabase.storage
  .from('bucket_name')
  .upload('file_path', file, {
    contentType: file.type, // Set the correct MIME type
    upsert: true,
    // Don't use transform options here!
  });`}
            </pre>
          </div>
          
          {diagnosticInfo?.jsonResponse && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <h4 className="font-bold mb-1">JSON Response:</h4>
              <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto max-h-32">
                {JSON.stringify(diagnosticInfo.jsonResponse, null, 2)}
              </pre>
            </div>
          )}
          
          <Alert className="mt-3 bg-blue-50 border-blue-200">
            <Shield className="h-4 w-4 text-blue-500" />
            <AlertTitle className="text-xs font-medium">What to do next</AlertTitle>
            <AlertDescription className="text-xs">
              For Supabase storage, go to the Storage section in your Supabase dashboard and verify the file exists.
              Check that your storage bucket has appropriate public access or RLS policies that include both <code>SELECT</code> and <code>DOWNLOAD</code> permissions.
              Try using the new <code>uploadImagePreservingFormat</code> function for future uploads to preserve the original format.
            </AlertDescription>
          </Alert>
          
          <div className="mt-3 flex justify-center">
            <a 
              href="https://supabase.com/docs/guides/storage/uploads" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 flex items-center hover:underline text-xs"
            >
              <HelpCircle className="h-3 w-3 mr-1" />
              Supabase Storage Upload Documentation
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageErrorDisplay;
