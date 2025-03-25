
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { prepareImageUrl, getDirectDownloadUrl, tryObjectUrlFallback } from '@/utils/supabaseImageUtils';
import ImageErrorDisplay from './ImageErrorDisplay';

interface ImageDisplayProps {
  imageUrl: string | null | undefined;
  alt: string;
  className?: string;
  onError?: () => void;
}

const ImageDisplay = ({ 
  imageUrl, 
  alt, 
  className = '',
  onError
}: ImageDisplayProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [imageSrc, setImageSrc] = useState<string>('/placeholder.svg');
  const [useFallbackUrl, setUseFallbackUrl] = useState(false);
  const [useObjectUrl, setUseObjectUrl] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [diagnosticInfo, setDiagnosticInfo] = useState<any>(null);
  
  // Process the image URL whenever it changes or when retry is clicked
  useEffect(() => {
    if (!imageUrl) {
      setImageSrc('/placeholder.svg');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(false);
    
    const isSupabaseUrl = imageUrl.includes('supabase.co/storage');
    
    // Check for incomplete download parameter
    let urlToUse = imageUrl;
    if (isSupabaseUrl && urlToUse.endsWith('download=')) {
      urlToUse = urlToUse + 'true';
    }
    
    // If we're using object URL approach
    if (useObjectUrl && isSupabaseUrl) {
      const getObjectUrl = async () => {
        const { success, objectUrl } = await tryObjectUrlFallback(urlToUse);
        if (success && objectUrl) {
          console.log('Using object URL approach:', objectUrl);
          setImageSrc(objectUrl);
        } else {
          // Fall back to direct URL approach
          setUseObjectUrl(false);
          setUseFallbackUrl(true);
        }
      };
      
      getObjectUrl();
      return;
    }
    
    // If we've already tried the normal URL and it failed, try to get a direct download URL
    if (useFallbackUrl && isSupabaseUrl) {
      const getDirectUrl = async () => {
        try {
          const directUrl = await getDirectDownloadUrl(urlToUse, true);
          if (directUrl) {
            console.log('Using direct download URL:', directUrl);
            setImageSrc(directUrl);
          } else {
            // If we can't get a direct URL, try object URL approach
            setUseObjectUrl(true);
          }
        } catch (err) {
          console.error('Error getting direct URL:', err);
          // Try object URL approach as last resort
          setUseObjectUrl(true);
        }
      };
      
      getDirectUrl();
    } else {
      // First attempt with regular URL processing
      const processed = prepareImageUrl(urlToUse, isSupabaseUrl);
      console.log('Using processed URL:', processed);
      setImageSrc(processed);
    }
  }, [imageUrl, retryCount, useFallbackUrl, useObjectUrl]);

  const handleImageLoad = () => {
    setIsLoading(false);
    setError(false);
  };

  const handleImageError = async () => {
    console.error("Failed to load image:", imageSrc);
    setIsLoading(false);
    
    // If this is the first error and it's a Supabase URL, try the direct URL approach
    if (!useFallbackUrl && !useObjectUrl && imageSrc.includes('supabase.co/storage')) {
      console.log('Normal URL failed, trying with direct download URL...');
      setUseFallbackUrl(true);
      return;
    }
    
    // If direct URL approach failed, try object URL approach
    if (useFallbackUrl && !useObjectUrl && imageSrc.includes('supabase.co/storage')) {
      console.log('Direct URL failed, trying with object URL approach...');
      setUseObjectUrl(true);
      return;
    }
    
    setError(true);
    
    // Try to get diagnostic information
    try {
      const response = await fetch(imageSrc, {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Accept': 'image/*',
          'Cache-Control': 'no-cache'
        }
      });
      
      const contentType = response.headers.get('content-type');
      let jsonResponse = null;
      let textResponse = null;
      
      if (contentType && contentType.includes('application/json')) {
        try {
          jsonResponse = await response.json();
        } catch (e) {
          console.error('Failed to parse JSON response:', e);
        }
      } else {
        try {
          // Try to get the first 100 characters of text to see what's coming back
          const text = await response.text();
          textResponse = text.substring(0, 100) + (text.length > 100 ? '...' : '');
        } catch (e) {
          console.error('Failed to get response text:', e);
        }
      }
      
      setDiagnosticInfo({
        status: response.status,
        contentType,
        jsonResponse,
        textResponse,
        url: imageSrc
      });
    } catch (e) {
      console.error('Error getting diagnostic info:', e);
      setDiagnosticInfo({
        error: e instanceof Error ? e.message : String(e),
        url: imageSrc
      });
    }
    
    if (onError) {
      onError();
    }
  };

  const handleRetry = () => {
    setUseObjectUrl(false);
    setUseFallbackUrl(false);
    setRetryCount(prev => prev + 1);
  };
  
  const handleDownloadImage = async () => {
    if (!imageUrl?.includes('supabase.co/storage')) return;
    
    try {
      const directUrl = await getDirectDownloadUrl(imageUrl, true);
      if (directUrl) {
        window.open(directUrl, '_blank');
      } else {
        console.error("Could not generate direct download URL");
      }
    } catch (err) {
      console.error('Error handling direct download:', err);
    }
  };

  const toggleDiagnostics = () => {
    setShowDiagnostics(prev => !prev);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      )}
      
      {/* Error state */}
      {error ? (
        <ImageErrorDisplay 
          imageUrl={imageUrl || ''}
          isSupabaseUrl={!!imageUrl?.includes('supabase.co/storage')}
          showDiagnostics={showDiagnostics}
          diagnosticInfo={diagnosticInfo}
          toggleDiagnostics={toggleDiagnostics}
          handleRetry={handleRetry}
          handleDownloadImage={handleDownloadImage}
        />
      ) : (
        <img
          src={imageSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          crossOrigin="anonymous"
        />
      )}
    </div>
  );
};

export default ImageDisplay;
