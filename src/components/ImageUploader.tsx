
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Upload, X } from 'lucide-react';
import { uploadImage } from '@/utils/supabaseStorage';
import { useCoreAuth } from '@/contexts/CoreAuthContext';

interface ImageUploaderProps {
  onImageUploaded: (url: string) => void;
  className?: string;
  maxSizeMB?: number;
  acceptedFileTypes?: string;
  buttonText?: string;
}

const ImageUploader = ({
  onImageUploaded,
  className = '',
  maxSizeMB = 10,
  acceptedFileTypes = 'image/*',
  buttonText = 'Upload Image'
}: ImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isAuthenticated } = useCoreAuth();
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast.error(`File too large`, {
        description: `Maximum file size is ${maxSizeMB}MB`
      });
      return;
    }
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.error('Authentication required', {
        description: 'You must be logged in to upload images'
      });
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // Upload to Supabase
    setIsUploading(true);
    try {
      const url = await uploadImage(file);
      if (url) {
        onImageUploaded(url);
        toast.success('Image uploaded successfully');
      } else {
        toast.error('Upload failed', {
          description: 'There was a problem uploading your image'
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Upload failed', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  const clearPreview = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className={`space-y-4 ${className}`}>
      {preview ? (
        <div className="relative">
          <img 
            src={preview} 
            alt="Preview" 
            className="max-h-64 rounded-md object-contain" 
          />
          <button
            type="button"
            onClick={clearPreview}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
            disabled={isUploading}
          >
            <X size={16} />
          </button>
        </div>
      ) : null}
      
      <Button
        type="button"
        onClick={handleButtonClick}
        disabled={isUploading}
        variant="outline"
        className="w-full"
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            {buttonText}
          </>
        )}
      </Button>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={acceptedFileTypes}
        className="hidden"
        disabled={isUploading}
      />
      
      {!isAuthenticated && (
        <p className="text-xs text-yellow-600">
          You must be logged in to upload images
        </p>
      )}
    </div>
  );
};

export default ImageUploader;
