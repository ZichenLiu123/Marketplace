
-- Create the listing_images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES 
  ('listing_images', 'listing_images', true, false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Add bucket RLS policies to allow authenticated users to upload
CREATE POLICY "Allow authenticated users to upload" 
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'listing_images');

-- Allow anonymous users to download (view) images
CREATE POLICY "Allow public to view images" 
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'listing_images');

-- Allow users to delete their own images
CREATE POLICY "Allow users to delete their own images" 
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'listing_images' AND (storage.foldername(name))[1] = auth.uid()::text);
